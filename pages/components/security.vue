<template>
	<view class="security-container">
		<u-form v-model="resetPasswdForm" class="reset-form">
			<u-form-item prop="oldPassword">
				<div class="icon password"></div>
				<u-input class="register-input" type="password" v-model="resetPasswdForm.oldPassword"
					:placeholder="$t('register.oldPasswordDigitsPlaceholder')">
				</u-input>
			</u-form-item>
			<u-form-item prop="password">
				<div class="icon"></div>
				<u-input class="register-input" type="password" v-model="resetPasswdForm.password"
					:placeholder="$t('register.passwordDigitsPlaceholder')">
				</u-input>
			</u-form-item>
			<u-form-item prop="validatePass">
				<div class="icon"></div>
				<u-input class="register-input" type="password" v-model="resetPasswdForm.validatePass"
					:placeholder="$t('register.passwordAgain')"></u-input>
			</u-form-item>
		</u-form>
		<view class="bottom">
			<button class="bottom-btn" type="primary" @click="resetPassword">
				{{$t('common.confirm')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resetPasswdForm: {}
			}
		},
		methods: {
			resetPassword() {
				if (!this.check()) {
					return;
				}
				this.$u.api.setNewPasswdByOriginPasswd(this.resetPasswdForm).then(res => {
					this.$util.showToastSuc(this.$t('register.resetPasswordSuc'))
					this.$u.vuex("vuex_token", "");
					this.$util.cache('token', '');
					this.$u.route({
						  url: "/pages/login/login",
						  params: {
							  email: this.resetPasswdForm.email
						  },
					})
				})
			},
			check() {
				if (!this.resetPasswdForm.oldPassword) {
					console.log('resetPasswdForm.oldPassword')
					this.$u.toast(this.$t('security.oldPassEmtpy'));
					return false;
				}
				if (!this.resetPasswdForm.password) {
					this.$u.toast(this.$t('security.passwordEmpty'));
					return false;
				}
				if (!this.resetPasswdForm.validatePass) {
					this.$u.toast(this.$t('security.validatePassEmtpy'));
					return false;
				}
				if (this.resetPasswdForm.password !== this.resetPasswdForm.validatePass) {
					this.$u.toast(this.$t('security.eqError'));
					return false;
				}
				if (!this.$util.checkPassword(this.resetPasswdForm.password)) {
					this.$u.toast(this.$t('register.passwordValidation'));
					return false;
				} 
				return true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/pages/utils/normal.scss";
</style>
