import Vue from 'vue'
import App from './App'
import config from '@/config.js'
import store from '@/store'
import i18n from './lang/i18n'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$ossDomain = config.OSS_DOMAIN;

let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

// 引入uView
import uView from 'uview-ui'
Vue.use(uView);

import util from '@/utils/utils.js';
Vue.prototype.$util = util;

// #ifdef H5
import wechat from '@/utils/wxH5/jssdk.js';
if (wechat.isWechat()) {
	Vue.prototype.$wechat = wechat;
}
// #endif

// #ifndef H5
// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);
// #endif

Vue.prototype._i18n = i18n;
const app = new Vue({
	store,
	i18n,
	...App
})

// http拦截器
import httpInterceptor from '@/utils/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API集中管理
import httpApi from '@/utils/http.api.js'
Vue.use(httpApi, app)

app.$mount()
