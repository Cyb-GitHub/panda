<template>
	<view class="forget-password-container">
		<headLangSelector></headLangSelector>
		<view class="login-logo">
			<logo></logo>
		</view>
		<u-form v-model="resetPasswdForm" class="reset-form">
		  <u-form-item prop="email">
			<div class="icon email"></div>
		    <u-input
				class="register-input"
				type="email"
				v-model="resetPasswdForm.email"
				:placeholder="$t('register.emailPlaceholder')"
			></u-input>
			<view class="register-email-right">
				<u-button
					:disabled="disableButton"
					class="email-validator-btn"
					@click="getEmailValidatorCode"
				>
				{{countdown > 0 ? `${countdown}s` : $t('register.getEmailValidatorCode')}}
				</u-button>
			</view>
		  </u-form-item>
		  <u-form-item>
			  <div class="icon"></div>
		    <u-input
				class="register-input"
				type="number"
				v-model="resetPasswdForm.emailValidatorCode"
				prop="emailValidatorCode"
				:placeholder="$t('register.emailValidatorCode')"
			></u-input>
		  </u-form-item>
		  <u-form-item prop="password">
			<div class="icon password"></div>
		    <u-input
				class="register-input"
				type="password"
				v-model="resetPasswdForm.password"
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
				v-model="resetPasswdForm.validatePass"
				:placeholder="$t('register.passwordAgain')"
			></u-input>
		  </u-form-item>
		</u-form>
		<view class="bottom">
			<button class="bottom-btn" type="primary" @click="resetPassword">
				{{$t('common.confirm')}}</button>
		</view>
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
			resetPasswdForm: {
				email: '',
			},
			countdown: 0,
			disableButton: false,
		}
	},
	onLoad(e) {
		console.log(e)
		if (e.email) {
			this.resetPasswdForm.email = e.email	
		}
	},
	methods: {
		resetPassword() {
			if (this.resetPasswdForm.password !== this.resetPasswdForm.validatePass) {
				this.$util.showToast(this.$t('register.confirmPasswordError'));
				return;
			}
			if (!this.$util.checkPassword(this.resetPasswdForm.password)) {
				this.$util.showToast(this.$t('register.passwordValidation'));
				return;
			}
			this.$u.api.resetPassword(this.resetPasswdForm).then((res) => {
				console.log(res);
				this.$util.showToastSuc(this.$t('register.resetPasswordSuc'))
				this.$u.route({
					  url: "/pages/login/login",
					  params: {
						  email: this.resetPasswdForm.email
					  },
				})
			})
		},
		async getEmailValidatorCode() {
			if (!this.resetPasswdForm.email) {
				this.$util.showToast(this.$t('register.emailAddressError'));
				return;
			}
			const exist = await this.$u.api.checkEmailExist(this.resetPasswdForm.email);
			if (exist.code !== 0 || (exist.code === 0 && !exist.exist)) {
				this.$util.showToast(this.$t('register.emailNotExistError'));
				return;
			}
			this.countdown = 60;
			this.$u.api.getRegisterValidateCode(this.resetPasswdForm.email).then((res) =>{
				this.$util.showToastSuc(this.$t('register.validationCodeSendSuc'));
				const intervalId = setInterval(() => {
					this.countdown--;
					if (this.countdown === 0) {
					  clearInterval(intervalId);
					  this.disableButton = false;
					}
				}, 1000);
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "@/pages/utils/normal.scss";
.reset-form {
	padding: 0px 10px;
	/deep/ .u-form-item{
		padding: 6px 0px;
	}
}
.email-register-title {
  width: 20vw;
  display: flex;
  padding: 30px 0px 10px 0px;
  margin: 0 auto;
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
	color: white;
	padding: 0px 10px;
	border-radius: 10px;
	background: url("@/static/images/1x/button.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>