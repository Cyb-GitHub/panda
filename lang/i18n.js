import langEn from './en'
import zhHans from './zh-Hans'
import zhHant from './zh-Hant'
import uniStarterConfig from '../uni-starter.config.js'
const {i18n:{enable:i18nEnable} }= uniStarterConfig
const messages = {
	'en': langEn,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant
}
let currentLang
if(i18nEnable){
	currentLang = uni.getStorageSync('CURRENT_LANG');
}else{
	currentLang = "zh-Hant"
}
// console.log(uni.getStorageSync('CURRENT_LANG'),currentLang);
if (!currentLang) {
	if (uni.getLocale) {
		console.log('获取应用语言:', uni.getLocale());
		let language = 'en'
		if (uni.getLocale() != 'en') {
			language = 'zh-Hant'
		}
		uni.setStorageSync('CURRENT_LANG', language)
		currentLang = language
	} else {
		uni.getSystemInfo({
			success: function(res) {
				console.log('获取设备信息:', res);
				let language = 'zh-Hant'
				if (res.language == 'en') {
					language = 'en'
				}
				uni.setStorageSync('CURRENT_LANG', language)
				currentLang = language
			},
			fail: (err) => {
				console.error(err)
			}
		})
	}
}
let i18nConfig = {
	locale: currentLang, // set locale
	messages // set locale messages
}

// #ifdef VUE2
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
// #endif

// #ifdef VUE3
import {
	createI18n
} from 'vue-i18n'
const i18n = createI18n(i18nConfig)
// #endif

export default i18n


if(i18nEnable){
	let initLanguageAfter = () => {
		function $i18n(e){
			// #ifdef VUE3
			return i18n.global.messages[i18n.global.locale][e]
			// #endif
			return i18n.messages[i18n.locale][e]
		}
		setTimeout(function(){
			//底部tabbar更新
			$i18n('tabbar').split(',').forEach((text, index) => {
				// console.log(text);
				uni.setTabBarItem({
					index,
					text,
					complete: e => {
						// console.log("e: " + JSON.stringify(e));
					}
				})
			})
		},1)
	}
	initLanguageAfter()
	uni.$on('changeLanguage', e => {
		console.log('changeLanguage', e);
		initLanguageAfter(e)
	})
}