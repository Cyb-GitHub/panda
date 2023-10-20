module.exports = {
	//政策协议
	"agreements": {
		"serviceUrl": "http://127.0.0.1:9090/renren-fast/app/notToken", //用户服务协议链接
		"privacyUrl": "http://127.0.0.1:9090/renren-fast/app/notToken", //隐私政策条款链接
		// 哪些场景下显示，1.注册（包括登录并注册，如：微信登录、苹果登录、短信验证码登录）、2.登录（如：用户名密码登录）
		"scope": [
			'register', 'login'
		]
	},
}
