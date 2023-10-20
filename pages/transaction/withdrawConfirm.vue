<template>
	<view class="withdraw-confirm-container">
		<view class="withdraw-confirm-users">
			<view class="withdraw-confirm-users-item from">
				<span class="withdraw-confirm-users-label">
					FROM:
				</span>
				<view class="withdraw-confirm-users-view from">
					<u-row>
					<u-col span="4">
						<image
							src="@/static/images/1x/chatAva.png"
							mode="heightFix"
							class="my-account-basic-icon"
						></image>
					</u-col>
					<u-col span="8">
						<view class="my-account-basic-name-txt">
							{{accountInfo.nickeName}}
						</view>
						<view class="my-account-basic-name-txt row-2">
							{{this.getBalanceStr}}
						</view>
					</u-col>
					</u-row>
				</view>
			</view>
			<view class="withdraw-confirm-users-item to">
				<span class="withdraw-confirm-users-label">
					TO:
				</span>
				<view class="withdraw-confirm-users-view to">
					<u-input v-model="toDotAddr"
					class="withdraw-confirm-users-to-addr"
					:placeholder="$t('statement.withdrawalAccountTips')"></u-input>
				</view>
			</view>
		</view>
		<!--<view class="withdraw-confirm-trans">
			<span class="withdraw-confirm-trans-txt">
				{{$t('statement.withdrawalTips')}}
			</span>
		</view>-->
		<view class="withdraw-confirm-opt">
			<button :disabled="disabled" class="button " @click="handleWithdraw()">
			{{$t('account.withdrawal')}}</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		 return {
			accountInfo: {
				nickeName: 'test',
				UID: 'UID123456',
				created: '20230410',
				bamboo: 85,
				usdt: 28,
				ticket: 10,
				panda: 68,
			},
			toDotAddr: '',
			disabled: false,
		 }
	},
	props: {
		withdrawalValue: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		type: {
			type: Number,
			default: 1,
		},
		typeStr: {
			type: String,
			default: 'LPG',
		},
		ammountInfo: {
			type: Object,
			default: ()=> {},
		},
		amountLabelKey: {
			type: Object,
			default: ()=> {},
		},
		currentDotOptinos: {
			type: Array,
			default: ()=> [],
		},
		labelMap :{
			type: Object,
			default: ()=> {},
		}
	},
	computed: {
		getBalanceStr () {
			return `${this.$t('account.balance')}： ${this.balance} ${this.typeStr}`
		},
	},
	methods: {
		handleWithdraw() {
			this.disabled = true
			this.$u.api.accountMessageApis.startWithdrawal({
				accountId: this.vuex_userInfo.id,
				amountType: this.type,
				amount: parseFloat(this.withdrawalValue),
				outerAmountAddress: this.toDotAddr
				}).then(res => {
					if (res.code === 0) {
						this.$util.showToastSuc(this.$t('account.withdrawalSucInfo'),()=>{
						this.disabled = false
						  uni.reLaunch({
							url: "/pages/index/index"
						  })
						})
					} else {
						this.disabled = false
					}
				}).catch(e => {
					this.disabled = false
				})
		},
	}
}
</script>

<style lang="scss" scoped>
	.withdraw-confirm-container {
		padding: 0px 20px;
		width: 100%;
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
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
	}
	.withdraw-confirm-users {
		padding: 30px 0px 10px 0px;
		width: 100%;
		border-bottom: 1px #b8b9b9 solid;
	}
	.withdraw-confirm-users-item {
		height: 80px;
		margin-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.withdraw-confirm-users-label {
		width: 20%;
	}
	.withdraw-confirm-users-view {
		height: 65px;
		width: 70%;
		border-radius: 5px;
		border: 1px #b8b9b9 solid;
		margin-left: 10px;
		padding: 5px 5px;
		&.to {
			border: 1px #8fe201 solid;
		}
	}
	.my-account-basic-icon {
		width: 50px;
		height: 50px;
	}
	.my-account-basic-name-txt {
		font-size: 20px;
		color: black;
		padding: 0px 5px;
		&.row-2 {
			font-size: 14px;
			color: #989898;
		}
	}
	.withdraw-confirm-users-to-addr {
		width: 100%;
		height: 100%;
		/deep/ .u-input__input {
			height: 100%;
			color: #8fe201 !important;
			font-size: 16px;
		}
	}
	.withdraw-confirm-trans {
		padding: 10px 10px;
		display: flex;
		align-items: center;
		color: #b8b9b9;
		border-bottom: 1px #b8b9b9 solid;
	}
	.withdraw-confirm-opt {
		padding: 30px 0px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>