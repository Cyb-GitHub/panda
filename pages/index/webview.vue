<template>
	<view clas='chat-container'>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isSetCookie: false
			};
		},
		onLoad() {
			this.createWebview();
		},
		methods: {
			createWebview() {
				var that = this;
				// #ifdef APP-PLUS
				var wv = plus.webview.create("","custom-webview",{
					plusrequire:"none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
					'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
					top:uni.getSystemInfoSync().statusBarHeight+44 ,//放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
					bottom: 40,
				});
				wv.loadURL("https://chat.ss-chat.com/service/fmjmjy")
				var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
				currentWebview.append(wv);//一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
				setTimeout(function() {
					console.log('stacal');
					wv.setStyle({scalable:true});
				}, 1000);//如果是首页的onload调用时需要延时一下，二级页面无需延时，可直接获取
				// #endif
			},

		}
	}
</script>

<style lang="scss">
	.chat-container {
		display: flex;
		height: 200px;
	}
</style>
