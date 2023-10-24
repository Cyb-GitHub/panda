const install = (Vue, vm) => {

	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://154.38.116.245:8001/renren-fast',
		// baseUrl: 'https://api.lpgcom.net/renren-fast',
		showLoading: true,
		loadingText: 'Loading...',
		loadingTime: 800,
		loadingMask: false,
		header: {
			'accept': 'application/json;charset=UTF-8'
		},
	});

	// 请求拦截部分，如配置，每次请求前都会执行，见上方说明
	Vue.prototype.$u.http.interceptor.request = (config) => {
		const {deviceBrand, deviceModel, deviceId, osName, osVersion} = uni.getSystemInfoSync()
		config.header.deviceBrand = deviceBrand;
		config.header.osName = osName;
		config.header.osVersion = osVersion;
		config.header.token = vm.vuex_token;
		config.header.apiVersion = '1.0.0';
		return config;
	}
	
	// 响应拦截，如配置，每次请求结束都会执行本方法
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if(res.code == 0) {
			return res;
		} else if(res.code == 401){
			// 未登录
			const time = 3000;
			vm.$u.toast(vm.$t("pwdLogin.limitLoginInfo"), time);
			setTimeout(()=>{
				uni.reLaunch({
				  url: "/pages/login/login",
				})
			},time)
			return false;
		} else {
			vm.$u.toast(vm.$t(res.msg));
			return false;
		}
	}
}

export default {
	install
}