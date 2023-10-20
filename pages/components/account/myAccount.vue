<template>
	<view class="my-account">
		<u-row class="my-account-basic"  gutter="3" customStyle="margin-bottom: 10px">
			<u-col span="2">
				<image
					src="@/static/images/1x/chatAva.png"
					mode="heightFix"
					class="my-account-basic-icon"
				></image>
			</u-col>
			<u-col span="3">
				<view class="my-account-basic-name-txt">
					<view>
						<u-input
							v-model="accountInfo.nickname"
							:placeholder="$t('account.nicknamePlaceholder')"
							:disabled="!nicknameEnable"
							@blur="saveNickname"
						/>
					</view>
					{{accountInfo.UID}}
				</view>
			</u-col>
			<u-col span="1">
			</u-col>
			<u-col span="3">
				<button class="button" @click="copyId">
				{{$t('account.copyId')}}</button>
			</u-col>
			<u-col span="3" style="padding-left: 5px;">
				<button class="button " @click="handleLogOut">
				{{$t('account.logOut')}}</button>
			</u-col>
		</u-row>
		<u-row class="my-account-share" gutter="3">
			<u-col span="4">{{`${$t('account.createdPrefix')}${accountInfo.created} Lucky Panda`}}</u-col>
			<u-col span="4"><button class="button " @click="getShareQrCode">
			{{$t('account.shareQrCode')}}</button></u-col>
			<u-col span="4"><button class="button" @click="getShareQrCodeURL">
			{{$t('account.shareQrCodeURL')}}</button></u-col>
		</u-row>
		<view class="my-account-info">
			<accountInfo :accountInfo="accountInfo" :showText="true" size="large"></accountInfo>
		</view>
		<u-row class="my-account-opt" gutter="3">
			<u-col span="3"><button class="button " @click="handleTransaction('recharge')">
			{{$t('account.recharge')}}</button></u-col>
			<u-col span="3"><button class="button" @click="handleTransaction('withdrawal')">
			{{$t('account.withdrawal')}}</button></u-col>
			<u-col span="3"><button class="button" @click="handleTransaction('transformation')">
			{{$t('account.transformation')}}</button></u-col>
			<u-col span="3"><button class="button" @click="handleTransaction('transfer')">
			{{$t('account.transfer')}}</button></u-col>
		</u-row>
		<share :show="qrCodeShow" @close="qrCodeShow=false">
		</share>
		<view>
			<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog
			   type="success"
			   :cancelText="$t('cancel')"
			   :confirmText="$t('confirm')"
			   :title="$t('account.logOutTitle')"
			   :content="$t('account.logOutContent')"
			   :mask-click="false"
			   @confirm="dialogConfirm"
			   @close="dialogClose">
			</uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import accountInfo from '@/pages/components/basic/accountInfo.vue'
import share from '@/pages/components/basic/share.vue'
export default {
	data() {
		return {
			accountId: 0,
			nicknameEnable: true,
			accountInfo: {
			},
			qrCodeShow: false,
		}
	},
	name: 'myAccount',
	components: {
		accountInfo,
		share,
	},
	mounted() {
		this.accountId = this.vuex_userInfo.id;
		this.initAccountInfo();
	},
	watch: {
		vuex_signal_1(newVal) {
			this.handleSignal(newVal)
		}
	},
	methods: {
		dialogConfirm() {
			this.$u.vuex("vuex_token", "");
			this.$util.cache('token', '');
			uni.reLaunch({
			  url: "/pages/login/login",
			})
		},
		dialogClose() {},
		handleSignal(val) {
			console.log(val)
			if (val === 17) {
				this.initAccountInfo()
			}
			this.$u.vuex("vuex_signal_1", -1)
		},
		initAccountInfo() {
			this.$u.api.accountMessageApis.amountInfo(this.accountId).then((res)=>{
				if (res.code === 0) {
					this.accountInfo = res.data;
					this.accountInfo['UID'] = this.vuex_userInfo.uid;
					this.accountInfo['created'] = this.vuex_userInfo.createTime.substring(0, 10)
					this.accountInfo['nickname'] = this.vuex_userInfo.name;
					if (this.vuex_userInfo.name) {
						this.nicknameEnable = false
					}
				}
			})
		},
		saveNickname() {
			console.log(this.accountInfo.nickname)
			if (this.accountInfo.nickname) {
				this.$u.api.accountMessageApis.updateNickname(this.accountInfo.nickname).then(res =>{
					if (res.code === 0) {
						uni.reLaunch({url: "/pages/index/index"})
					}
				})
			}
		},
		copyId() {
			uni.setClipboardData({
				data: this.accountInfo.UID, //要被复制的内容
				success: () => { //复制成功的回调函数
					uni.showToast({ //提示
						title: this.$t('account.copyIdSuc')
					})
				}
			});
		},
		handleTransaction(actionType) {
			this.$u.route({
			  url: 'pages/transaction/transaction',
			  params: {
			    'actionType': actionType,
			  }
			})
		},
		getShareQrCode(){
			this.qrCodeShow = true;
		},
		handleLogOut() {
			this.$refs.alertDialog.open();
		},
		getShareQrCodeURL(){
			this.$u.api.accountMessageApis.getShareQrCode().then((res) => {
				if (res.code === 0) {
					console.log(res)
					uni.setClipboardData({
						data: res.data, //要被复制的内容
						success: () => { //复制成功的回调函数
							uni.showToast({ //提示
								title: this.$t('account.copySuc')
							})
						}
					});
				}
			}).catch((e) => {
				console.log(e);
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "@/pages/utils/normal.scss";
.my-account {
	height: 400px;
}
.my-account-basic {
	width: 100%;
	height: 20%;
	min-height: 50px;
	padding: 10px 10px 10px 10px;
	display: inline-flex;
	align-items: center;
	border-bottom: 1px black solid;
}
.my-account-basic-icon {
	width: 50px;
	height: 50px;
}

.button {
	max-width: 120px;
	width: 100%;
	height: 35px;
	border-radius: 5px;
	background: url("@/static/images/1x/button-mid.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	color: white;
	float: right;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
}
.my-account-share {
	padding: 10px 10px 10px 10px;
	height: 15%;
	border-bottom: 1px black solid;
}
.my-account-basic-name-txt {
	font-size: 16px;
	color: white;
}
.my-account-info {
	padding: 10px 10px 10px 10px;
	border-bottom: 1px black solid;
	height: 50%;
	width: 100%;
	justify-content: center;
	align-items: center;
	display: flex;
}
.my-account-opt {
	padding: 5px 10px 5px 10px;
	border-bottom: 1px black solid;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 15%;
}
</style>