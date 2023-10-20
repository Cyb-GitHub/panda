<template>
	<view class="transfer-suc-container">
		<view class="transfer-suc-container-head">
			<view class="transfer-suc-item">
				<u-icon name="checkmark-circle-fill" color="#41cc13" size="72"></u-icon>
			</view>
			<view class="transfer-suc-item">
			<span>{{$t('transfer.transferSuc')}}</span>
			</view>
		</view>
		<view v-if="transferInfo" class="transfer-suc-form">
			<u-form :model="transferInfo" :label-width="200" ref="uForm">
				<u-form-item :label="$t('transfer.fromUid')"><u-input :value="vuex_userInfo.uid" disabled /></u-form-item>
				<u-form-item :label="$t('transfer.fromName')"><u-input :value="vuex_userInfo.name" disabled/></u-form-item>
				<u-form-item :label="$t('transfer.toUid')"><u-input v-model="transferInfo.transToAccountUid" disabled/></u-form-item>
				<u-form-item :label="$t('transfer.toName')"><u-input v-model="transferInfo.transToAccountName" disabled/></u-form-item>
				<u-form-item :label="$t('transfer.amount')"><u-input v-model="transferInfo.transAmount" disabled/></u-form-item>
				<u-form-item :label="$t('transfer.balance')"><u-input v-model="transferInfo.balance" disabled/></u-form-item>
			</u-form>
			<view class="transfer-suc-form-contact-but" @click="show=true">
				<u-icon name="plus-circle-fill" color="#2979ff" size="28"></u-icon>
				<span>{{$t('transfer.addComtacts')}}</span>
			</view>
		</view>
		<view class="transfer-suc-opt">
			<button class="button" type="primary" @click="confirm">
				{{$t('confirm')}}</button>
		</view>
		<u-popup v-model="show" mode="bottom" length="60%">
			<view class="transfer-suc-form">
				<u-form :model="transferInfo" :label-width="200" ref="uForm">
					<u-form-item :label="$t('transfer.toUid')"><u-input v-model="transferInfo.transToAccountUid" disabled/></u-form-item>
					<u-form-item :label="$t('transfer.toName')"><u-input v-model="transferInfo.transToAccountName" disabled/></u-form-item>
					<u-form-item :label="$t('transfer.alias')"><u-input v-model="alias"/></u-form-item>
				</u-form>
			</view>
			<view class="transfer-suc-opt">
				<button class="button" type="primary" @click="addContact">
					{{$t('confirm')}}</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		 return {
			 transferInfo: undefined,
			 show: false,
			 alias: '',
		 }
	},
	watch: {
		getBalance(newValue, oldValue) {
			this.transferInfo.balance = getBalance
		}
	},
	computed: {
		getBalance() {
			return this.transferInfo.balance - this.transferInfo.transAmount
		}
	},
	onLoad(e) {
		console.log(e)
		this.transferInfo = { ...e }
	},
	methods: {
		addContact() {
			this.$u.api.accountMessageApis.addContact({
				alias: this.alias,
				contactUid: this.transferInfo.transToAccountUid,
				contactName: this.transferInfo.transToAccountName,
				accountId: this.vuex_userInfo.id,
			}).then(res => {
				if (res.code === 0) {
					this.show = false;
					this.$util.showToastSuc(this.$t('recentContact.addSuc'));
				}
			})
		},
		confirm() {
			uni.reLaunch({
				url: "/pages/index/index"
			})
		},
	}
}
</script>

<style lang="scss" scoped>
	.transfer-suc-item {
		justify-content: center;
		align-content: center;
		display: inline-grid;
	}
	.transfer-suc-container-head {
		height: 150px;
		width: 100%;
		padding: 10px 10px;
		justify-content: center;
		align-content: center;
		display: inline-grid;
		font-size: 28px;
	}
	.transfer-suc-opt {
		justify-content: center;
		align-content: center;
		display: grid;
		margin-top: 10px;
		width: 100vw;
	}
	.button {
		width: 120px;
		height: 35px;
		border-radius: 5px;
		background: url("@/static/images/1x/button-mid.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: white;
		margin-left: 10px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
	}
	.transfer-suc-form {
		padding: 5px 20px;
	}
	.transfer-suc-form-contact-but {
		float: right;
		height: 20px;
	}
</style>