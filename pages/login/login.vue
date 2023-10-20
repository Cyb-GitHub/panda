<!-- 账号密码登录页 -->
<template>
	<view class="uni-content">
		<headLangSelector></headLangSelector>
		<view class="login-logo">
			<logo></logo>
		</view>
		<!-- 顶部文字 -->
		<text class="title title-box"></text>
		<u-form class="logo-form" :model="form" ref='uForm' label-position="top" :border-bottom="false">
			<u-form-item prop="email" :border-bottom="false">
				<view style="display: flex;flex-direction: column;width: 100%;">
					<u-input
						class="login-ipt"
						v-model="form.email"
						type="email"
						:height="90"
						@blur="handleEmailInputBlur"
						:placeholder="$t('pwdLogin.emailPlaceholder')" />
				</view>
			</u-form-item>
			<u-form-item prop="googleKey" v-if="googleKey" :border-bottom="false">
				<view style="display: flex;flex-direction: column;width: 100%;">
					<u-input
						class="login-ipt"
						v-model="form.googleSecurityKey"
						:height="90"
						:placeholder="$t('pwdLogin.googleKeyPlaceholder')" />
				</view>
			</u-form-item>
			<u-form-item prop="password" :border-bottom="false">
				<view style="display: flex;flex-direction: column;width: 100%;">
					<u-input type="password"
						class="login-ipt"
						v-model="form.password"
						:height="90"
						:placeholder="$t('pwdLogin.passwordPlaceholder')" />
				</view>
			</u-form-item>
		</u-form>
		<!-- <uni-captcha v-if="needCaptcha" focus ref="captcha" scene="login-by-pwd" v-model="captcha" /> -->
		<!-- 带选择框的隐私政策协议组件 -->
		<!-- <uni-id-pages-agreements scope="login" ref="agreements"></uni-id-pages-agreements> -->
		<view class="forget">
			<text class="forget-link" @click="toRetrievePwd">{{$t('pwdLogin.forgetPassword')}}</text>
		</view>
		<!-- 忘记密码 -->
		<view v-if="isOriginHei" class="bottom">
			<button class="bottom-btn" type="primary" @click="pwdLogin">
				{{$t('pwdLogin.login')}}
			</button>
			<view class="bottom-txt">
				<text>{{$t('pwdLogin.registerTip')}}</text>
				<text class="link" @click="toRegister">{{$t('pwdLogin.register')}}</text>
			</view>
		</view>
		<button v-if="showDownApp" class="download-btn" type="primary" @click="download">
			{{$t('downloadApp')}}
		</button>
	</view>
</template>

<script>
	import headLangSelector from '@/pages/utils/head/head.vue'
	import logo from '@/pages/utils/logo/logo.vue'
	export default {
		components: {
			headLangSelector,
			logo
		},
		data() {
			return {
				form: {
					password: '',
					email: '',
					googleSecurityKey: '',
				},
				showDownApp: false,
				googleKey: '',
				isOriginHei:true,
				screenHeight: document.documentElement.clientHeight ||document.body.clientHeight,
				originHeight: document.documentElement.clientHeight ||document.body.clientHeight, 
				needCaptcha: false,
				logo: '/static/logo.png',
				rules: {
					email: [
						{
							required: true,
							message: this.$t('login.enterEmail'),
							trigger: 'blur,change'
						}
					],
					password: [
						{
							required: true,
							message: this.$t('login.enterPassword'),
							trigger: 'blur,change'
						}
					]
				}
			}
		},
		onLoad(e) {
			if (e.email) {
				this.form.email = e.email	
			}
			uni.closeSocket({success(res) {
					console.log("websocket断开成功");
					// that.isSuccess = true
				},
				fail(err) {
					console.log("报错", err);
				}});
			this.$u.vuex("vuex_token", "");
			this.$util.cache('token', '');
			this.getApp();
			window.onresize = () => {
			    return (() => {
					this.screenHeight = document.documentElement.clientHeight ||document.body.clientHeigh
			    })()
			}
		},
		onShow() {
			// #ifdef H5
			document.onkeydown = event => {
				var e = event || window.event;
				if (e && e.keyCode == 13) { //回车键的键值为13
					this.pwdLogin()
				}
			};
			this.showDownApp = true
			// #endif
		},
		methods: {
			handleEmailInputBlur() {
				if (!this.form.email) {
					return;
				}
				this.$u.api.checkGoogleKey(this.form.email).then((res) => {
					console.log(res)
					this.googleKey = res.googleKey
				})
			},
			// 页面跳转，找回密码
			toRetrievePwd() {
				this.$u.route({
				  url: "pages/user/forgetPasswd",
				  params: {
					  email: this.form.email
				  },
				})
			},
			/**
			 * 密码登录
			 */
			pwdLogin() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$u.api.login(this.form).then(res=>{
							this.$u.vuex("vuex_token", res.token);
							this.$u.api.userInfo().then((resU) => {
								this.$u.vuex("vuex_userInfo", resU.user)
							})
							this.$util.cache('token', res.token)
							this.$util.showToastSuc(this.$t('login.suc'), ()=>{
							  uni.reLaunch({
								url: "/pages/index/index"
							  })
							})
						})
					}
				});
			},
			/* 前往注册 */
			toRegister() {
				uni.reLaunch({
					url: "/pages/user/register"
				})
			},
			async getApp() {
				const res = await this.$u.api.getVersion();
				if (res.code === 0) {
					this.appLink = res.data.appLink;
				}
			},
			download() {
				 window.open(this.appLink);
			}
		},
		watch: {
			screenHeight(val) {
			    if (this.originHeight !== val) {
					this.isOriginHei = false
			    } else {
					this.isOriginHei = true
			    }
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";
	@import "@/pages/utils/normal.scss";

	@media screen and (min-width: 690px) {
		.uni-content {
			height: 600px;
		}
	}

	.forget {
		font-size: 12px;
		color: red;
		padding: 20px 10px 10px 10px;
		.forget-link {
			float: right;
			font-weight: bold;
		}
	}

	.link-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		margin-top: 20px;
	}
	.login-logo {
		display: flex;
		justify-content: center;
		margin-top: 20px;
		width: 100%;
	}

	.link {
		font-size: 12px;
		color: red;
		font-weight: bold;
	}
	.login-ipt {
		border: none;
		border-bottom: 2px solid black;
		border-color: black !important;
		/deep/ .uni-input-placeholder {
			color: black !important;
		}
	}
	.logo-form {
		padding: 50px 0px 0px 0px;
	}
	.download-btn{
		position: fixed;
		right: 10px;
		bottom: 110px;
		width: 54px;
		height: 54px;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 16px;
		font-size: 12px;
		background: url("@/static/images/1x/button.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
