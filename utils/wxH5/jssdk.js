import Vue from 'vue';
import jweixin from './jweixin-1.6.0.js';

export default {
	/**
	 * 判断当前运行环境是否在【微信客户端】中
	 * @return  true|false
	 */
	isWechat() {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 初始化jssdk配置
	 * 所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用（同一个url仅需调用一次）
	 * @param url 页面完整地址（但不包括'#'hash后面的部分）
	 */
	initJssdkConfig(url) {
		return new Promise((resolve, reject) => {
			Vue.prototype.$u.get('/H5Common/getSignPackage', {
				url: encodeURIComponent(url)
			}).then(res => {
				jweixin.config({
					debug: false, // 开启调试模式
					appId: res.data.appId, // 必填，公众号的唯一标识
					timestamp: res.data.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
					signature: res.data.signature, // 必填，签名
					jsApiList: [ // 必填，需要使用的JS接口列表
						'hideMenuItems',
						'updateTimelineShareData',
						'updateAppMessageShareData',
						'chooseWXPay'
					]
				});
				resolve();
			})
		})
	},

	/**
	 * 在需要自定义分享的页面中调用
	 * @param {Object} data {"title":"分享标题","desc":"分享描述","imgUrl":"分享图标"}
	 */
	share(data) {
		if (!this.isWechat()) return;

		let url = window.location.href.split('#')[0];

		// 每次都需要重新初始化配置，才可以进行分享  
		this.initJssdkConfig(url).then(() => {
			jweixin.ready(() => {
				// jweixin.hideMenuItems({
				// 	menuList: [ // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				// 		'menuItem:copyUrl' // 复制链接
				// 	]
				// });

				if (url.indexOf('?') != -1) {
					url += '&uid=' + uni.getStorageSync('uid');
				} else {
					url += '?uid=' + uni.getStorageSync('uid');
				}

				// 分享给朋友
				jweixin.updateAppMessageShareData({
					title: data.title, // 分享标题
					desc: data.desc, // 分享描述
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: data.imgUrl, // 分享图标
				});

				// 分享到朋友圈
				jweixin.updateTimelineShareData({
					title: data.title, // 分享标题
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: data.imgUrl, // 分享图标
				});
			});

			jweixin.error(err => {
				console.error('Jssdk失败验证==', err)
				Vue.prototype.$u.toast('Jssdk失败验证=='.err);
			});
		});
	},

	/**
	 * 微信支付
	 * @param {Object} data 支付所需的参数
	 */
	wxPay(data) {
		return new Promise((resolve, reject) => {
			let url = window.location.href.split('#')[0];
			this.initJssdkConfig(url).then(() => {
				jweixin.ready(() => {
					jweixin.chooseWXPay({
						timestamp: data.timeStamp, // 支付签名时间戳
						nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
						package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: data.paySign, // 支付签名
						success(res) {
							resolve(res);
						},
						fail(err) {
							reject(err);
						}
					});
				});

				jweixin.error(err => {
					console.error('支付失败验证==', err)
					Vue.prototype.$u.toast('支付失败验证=='.err);
				});
			})
		});
	}
}
