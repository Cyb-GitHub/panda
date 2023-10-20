<template>
  <view class="register">
	  <headLangSelector></headLangSelector>
	  <view class="login-logo">
	  	<logo></logo>
	  </view>
	  <!-- <view>
	  	 <image
			class="email-register-title"
			mode="widthFix"
			src="@/static/images/1x/emailRegister.png">
		  </image>
	  </view> -->
    <u-form v-model="registerInfo" ref="registerForm" class="register-form">
      <u-form-item>
		<u-icon class="icon" name="map"/>
		<uni-data-select
		      v-model="registerInfo.region"
		      :localdata="regionOptions"
			  :clear='false'
			  class="uni-lang-sel-com"
		>
		</uni-data-select>
      </u-form-item>
      <u-form-item prop="email">
		<div class="icon email"></div>
        <!--<u-input
			class="register-input"
			type="email"
			@blur="blurOnMail"
			v-model="registerInfo.email"
			:placeholder="$t('register.emailPlaceholder')"
		></u-input>-->
		<u-input
			class="register-input"
			type="email"
			v-model="registerInfo.email"
			:placeholder="$t('register.emailPlaceholder')"
		></u-input>
		<view class="register-email-right">
			<u-button
				:disabled="disableButton"
				class="email-validator-btn"
				@click="getEmailValidatorCode"
			> {{
				countdown > 0 ? `${countdown}s` : $t('register.getEmailValidatorCode')}} </u-button>
		</view>
      </u-form-item>
      <u-form-item>
		  <div class="icon"></div>
        <u-input
			class="register-input"
			type="number"
			v-model="registerInfo.emailValidatorCode"
			prop="emailValidatorCode"
			:placeholder="$t('register.emailValidatorCode')"
		></u-input>
      </u-form-item>
	  <u-form-item prop="nickName">
	  		<div class="icon"></div>
	    <u-input
	  			class="register-input"
	  			v-model="registerInfo.nickName"
	  			:placeholder="$t('register.nicknamePlaceholder')"
	  		>
	  		</u-input>
	  </u-form-item>
      <u-form-item prop="password">
		<div class="icon password"></div>
        <u-input
			class="register-input"
			type="password"
			v-model="registerInfo.password"
			:placeholder="$t('register.passwordDigitsPlaceholder')"
		>
		</u-input>
      </u-form-item>
      <u-form-item
		  prop="validatePass"
	  >
		<div class="icon password"></div>
        <u-input
			class="register-input"
			type="password"
			v-model="registerInfo.validatePass"
			:placeholder="$t('register.passwordAgain')"
		></u-input>
      </u-form-item>
      <u-form-item v-show ="registerInfo.useRecUid">
		<div class="icon contact"></div>
        <u-input
			class="register-input"
			:disabled="recInfoDisabled"
			v-model="registerInfo.recUid"
			:placeholder="$t('register.recUid')"
		></u-input>
      </u-form-item>
      <u-form-item v-show="!recInfoDisabled" prop="useRecUid">
		<div class="radio-icon"
			@click="handleRadioEvent"
			:class="{checked: !registerInfo.useRecUid}"
		></div>
		<view>{{$t('register.nonRecUid')}}</view>
      </u-form-item>
    </u-form>
	<view class="bottom">
		<button class="bottom-btn" type="primary" @click="registor">
			{{$t('register.navigationBarTitle')}}</button>
		<view class="bottom-txt">
			<text></text>
			<text class="link" @click="toLogin">{{$t('register.login')}}</text>
		</view>
	</view>
  </view>
</template>

<script>
import headLangSelector from '@/pages/utils/head/head.vue'
import logo from '@/pages/utils/logo/logo.vue'
import {countryList} from '@/utils/countries-list.js'

export default {
	components: {
		headLangSelector,
		logo
	},
	data() {
	    return {
	      regions: [
	      ],
		  regionOptions: [
		  ],
		  registerInfo: {
			  region: "65",
			  email: '',
			  emailValidatorCode: '',
			  password: '',
			  validatePass: '',
			  nickName: '',
			  recUid: '',
			  useRecUid: false,
		  },
		  isOriginHei:true,
		  screenHeight: document.documentElement.clientHeight ||document.body.clientHeight,
		  originHeight: document.documentElement.clientHeight ||document.body.clientHeight, 
		  recInfoDisabled: false,
		  disableButton: false,
		  countdown: 0,
	    }
	},
	onLoad(e) {
		if (e.token) {
			this.$u.api.accountMessageApis.parseShareQrCode(e.token).then((res) =>{
				if (res.code === 0) {
					this.registerInfo.useRecUid = true;
					this.registerInfo.recUid = res.data;
					this.recInfoDisabled = true;
				}
			}).catch((e) => {
				console.log(e);
			})
		}
		this.regions = countryList.map(country => {
		  return {
		    label: country.name,
		    value: country.areaCode
		  }
		})
		this.regionOptions = countryList.map(c => {
			return {
				text: c.name,
				value: c.areaCode,
			}
		})
		window.onresize = () => {
		    return (() => {
				this.screenHeight = document.documentElement.clientHeight ||document.body.clientHeigh
		    })()
		}
	},
	methods: {
		handleRadioEvent() {
			if (this.recInfoDisabled) {
				return;
			}
			this.registerInfo.useRecUid = !this.registerInfo.useRecUid;
		},
		async getEmailValidatorCode() {
			if (!this.registerInfo.email) {
				this.$util.showToast(this.$t('register.emailAddressError'));
				return;
			}
			const check = await this.blurOnMail();
			if (!check) {
				return;
			}
			this.$u.api.getRegisterValidateCode(this.registerInfo.email).then((res) =>{
				this.$util.showToast(this.$t('register.validationCodeSendSuc'));
				this.disableButton = true;
				this.countdown = 60;
				const intervalId = setInterval(() => {
					this.countdown--;
					if (this.countdown === 0) {
					  clearInterval(intervalId);
					  this.disableButton = false;
					}
				}, 1000);
			})
		},
		toLogin() {
			this.$u.route({
			  url: "/pages/login/login",
			  params: {
				  email: this.registerInfo.email
			  },
			})
		},
		async blurOnMail() {
			const res = await this.$u.api.checkEmailExist(this.registerInfo.email);
			if (res.exist) {
				this.$util.showToast(this.$t('register.emailExistError'));
				return false;
			}
			return true;
		},
		async registorCheck() {
			const emailCheck = await this.blurOnMail();
			if (!emailCheck) {
				return false;
			}
			const nickNamePattern = /[\u4e00-\u9fa5a-zA-Z0-9]{2,7}/;
			if (!nickNamePattern.test(this.registerInfo.nickName)) {
				this.$util.showToast(this.$t('register.nickNameFormatError', { nickName: this.registerInfo.nickName }));
				return false;
			}
			if (!this.passwordCheck(this.registerInfo.password)) {
				this.$util.showToast(this.$t('register.passwordValidation'));
				return false;
			}
			return true;
		},
		passwordCheck(password) {
			return this.$util.checkPassword(password);
		},
		async registor() {
			try {
				const valid = await this.$refs.registerForm.validate();
				if (this.registerInfo.password !== this.registerInfo.validatePass) {
					this.$util.showToast(this.$t('register.confirmPasswordError'));
					return;
				}
				if (valid) {
					const check = await this.registorCheck();
					if (!check) {
						return;
					}
					this.$u.api.register(this.registerInfo).then((res) => {
						this.$util.showToastSuc(this.$t('register.registSuc'));
						// #ifdef H5
						this.$u.route({
						  url: "/pages/user/download",
						  params: {
						  },
						})
						// #endif
						// APP-PLUS
						// #ifndef H5
						this.$u.route({
						  url: "/pages/login/login",
						  params: {
							  email: this.registerInfo.email
						  },
						})
						// #endif
					})
				} else {
				}
			} catch(e) {
				console.error(e);
			}
		},
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
@import "@/pages/utils/normal.scss";
.register-form {
	padding: 0px 10px;
	margin-top: 20px;
	/deep/ .u-form-item{
		padding: 6px 0px;
	}
	/deep/ .uni-combox {
		background-color: white !important;
		padding: 0px 10px;
		border: 1px solid;
		border-color: black !important;
		border-radius: 4px;
		border-top-width: 2px;
		margin-left: 5px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	/deep/ .u-icon__icon {
		font-size: 20px !important;
	}
}
.email-register-title {
  width: 20vw;
  display: flex;
  margin: 20px auto;
  justify-content: center;
  flex-wrap: wrap;
}
.register-input {
	border: 1px solid;
	border-color: black !important;
	border-radius: 4px;
	border-top-width: 2px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-bottom: 0px;
	padding: 1px 10px 1px 10px !important;
	background-color: white;
	margin-left: 5px;
	/deep/ .uni-input-placeholder {
		color: black !important;
	}
}
.register-email-right {
	padding: 0px 10px;
}
.email-validator-btn {
	width: 100px;
	color: white !important;
	padding: 0px 10px;
	border-radius: 10px;
	background: url("@/static/images/1x/button.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
.uni-lang-sel-com {
	margin-right: 120px;
	background-color: #fff;
	margin-left: 5px;
	border-style: solid;
	border-width: 1.5px;
	border-radius: 4px;
}
.radio-icon {
	display: inline-block;
	width: 20px;
	height: 20px;
	margin-right: 10px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 10px 10px;
	-webkit-appearance: none;
	appearance: none;
	margin-right: 5px;
	outline: 0;
	border: 1px solid #d1d1d1;
	background-color: #fff;
	border-radius: 50%;
	position: relative;
	&.checked {
		width: 8px;
		height: 8px;
		background-size: 8px 8px;
		background-color: #000;
		border: 7px solid #fff;
	}
}
</style>