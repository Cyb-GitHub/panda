import Vue from 'vue';

const login = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: (res) => {
				Vue.prototype.$u.api.wxLogin(res.code).then(res => {
					Vue.prototype.$u.vuex('vuex_openid', res.openid);
					resolve(true)
				}).catch(err => {
					resolve(false)
				})
			}
		})
	})
}

/**
 * 获取登录凭证
 * @return {boolean} true:已过期、false:未过期
 */
const wxLogin = () => {
	return new Promise((resolve, reject) => {
		uni.checkSession({
			success: res => {
				//session_key 未过期，并且在本生命周期一直有效
				let openid = Vue.prototype.$store.state.vuex_openid;
				if (!openid) {
					login().then(() => {
						resolve(true)
					})
				} else {
					resolve(false)
				}
			},
			fail: err => {
				// session_key 已经失效，需要重新执行登录流程
				login().then(() => {
					resolve(true)
				})
			}
		})
	})
}

/**
 * 退出登录
 */
const logout = () => {
	return new Promise((resolve, reject) => {
		Vue.prototype.$u.vuex('vuex_token', '');
		Vue.prototype.$u.vuex('vuex_userInfo', '');
		Vue.prototype.$u.vuex('vuex_phone', '');
		resolve(true);
	})
}

/**
 * 获取用户基础信息（昵称、头像等）
 * @return {object} { true: '允许授权｜已授权过了 可以继续往下执行其他业务逻辑', false: '拒绝授权｜异常' }
 */
const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		let vuex_userInfo = Vue.prototype.$store.state.vuex_userInfo,
			openid = Vue.prototype.$store.state.vuex_openid;

		if (!openid) {
			Vue.prototype.$u.toast('openid为空！请先调用login接口');
			resolve(false);
		} else {
			if (!vuex_userInfo) {
				uni.getUserProfile({
					// 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					desc: '用于完善会员资料',
					success: (res) => {
						// 允许授权
						Vue.prototype.$u.api.wxGetUserInfo({
							encryptedData: res.encryptedData,
							iv: res.iv,
							openid
						}).then(userInfo => {
							Vue.prototype.$u.vuex('vuex_userInfo', userInfo);
							resolve(true);
						}).catch(err => {
							Vue.prototype.$u.toast(err.errMsg);
							resolve(false);
						});
					},
					fail: (err) => {
						// 拒绝授权｜其他异常
						if (err.errMsg != "getUserProfile:fail auth deny") {
							Vue.prototype.$u.toast(err.errMsg);
						}
						resolve(false);
					}
				})
			} else {
				// 已经授权过了
				resolve(true)
			}
		}
	})
}

/**
 * 微信手机号快捷登录
 * @param {object} e 回调函数的整个参数
 * @return {object} { true: '允许授权｜已授权过了 可以继续往下执行其他业务逻辑', false: '拒绝授权' }
 */
const getPhoneNumber = (e) => {
	return new Promise((resolve, reject) => {
		let detail = e.detail;
		if (detail.errMsg == "getPhoneNumber:ok") {
			let openid = Vue.prototype.$store.state.vuex_openid;
			if (!openid) {
				Vue.prototype.$u.toast('openid为空！请先调用login接口');
				resolve(false);
			} else {
				wxLogin().then(() => {
					Vue.prototype.$u.api.wxGetPhoneNumber({
						encryptedData: detail.encryptedData,
						iv: detail.iv,
						openid
					}).then(data => {
						Vue.prototype.$u.vuex('vuex_phone', data.phones);
						Vue.prototype.$u.vuex('vuex_token', data.token);
						Vue.prototype.$u.vuex('vuex_userInfo', data.userInfo);
						resolve(true);
					})
				})
			}
		} else {
			// 拒绝授权
			if (detail.errMsg == 'getPhoneNumber:fail user deny' || detail.errMsg == 'getPhoneNumber:fail:user deny') {
				Vue.prototype.$u.toast('授权登录后才能体验完整的功能哦', 2500);
			} else if (detail.errMsg == 'getPhoneNumber:fail no permission') {
				Vue.prototype.$u.toast('该小程序暂无权限获取用户的手机号！', 2500);
			}
			resolve(false);
		}
	})
}

export default {
	wxLogin,
	logout,
	getUserProfile,
	getPhoneNumber
}
