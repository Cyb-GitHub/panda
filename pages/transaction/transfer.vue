<template>
	<view class="transaction-transfer-container">
		<view class="transaction-transfer-users">
			<view class="transaction-transfer-users-item from">
				<span class="transaction-transfer-users-label">
					FROM:
				</span>
				<view class="transaction-transfer-users-view from">
					<u-row>
						<u-col span="4">
							<image src="@/static/images/1x/chatAva.png" mode="heightFix" class="my-account-basic-icon">
							</image>
						</u-col>
						<u-col span="8">
							<view class="my-account-basic-name-txt">
								{{vuex_userInfo.name}}
							</view>
							<view class="my-account-basic-name-txt row-2">
								{{this.getBalanceStr}}
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
			<view class="transaction-transfer-users-item to">
				<span class="transaction-transfer-users-label">
					TO:
				</span>
				<view class="transaction-transfer-users-group">
					<view class="transaction-transfer-users-view to">
						<u-input v-model="toUserId" class="transaction-transfer-users-to-addr" :placeholder="$t('transfer.uidPLaceHolder')">
						</u-input>
					</view>
					<view class="transaction-transfer-users-view to">
						<u-input v-model="toUserNickname" class="transaction-transfer-users-to-addr"
							:placeholder="$t('transfer.namePlaceHolder')"></u-input>
					</view>
					<view class="transaction-recent-contact-view">
						<u-button class="button contact-button" type="text" @click="handleRecentContact()">
							{{$t('account.recentContactButton')}}</u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="transaction-transfer-trans">
			<span class="transaction-transfer-trans-txt">
				{{$t('transfer.tips')}}
			</span>
		</view>
		<view class="transaction-transfer-opt">
			<button class="button " @click="handleTransfer()">
				{{$t('deactivate.nextStep')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				toUserId: '',
				toUserNickname: '',
				balance: 0,
				transferType: 2,
			}
		},
		props: {
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
			labelMap: {
				type: Object,
				default: ()=> {},
			},
			recentContact: {
				type: Object,
				default: () => null,
			}
		},
		created() {
			console.log(this.ammountInfo[this.amountLabelKey[this.transferType]])
			this.balance = this.ammountInfo[this.amountLabelKey[this.transferType]]
		},
		computed: {
			getBalanceStr() {
				return `${this.$t('account.balance')}： ${this.balance} ${this.labelMap[this.transferType]}`
			},
		},
		watch: {
			recentContact(newValue, oldValue) {
				if (newValue.uid) {
					this.toUserId = newValue.uid;
					this.toUserNickname = newValue.name;
				}
			}
		},
		methods: {
			async handleTransfer() {
				try {
					const ret = await this.$u.api.accountMessageApis.transferCheck({
						transToAccountUid: this.toUserId,
						transToAccountName: this.toUserNickname,
					});
					this.$emit('next', this.$emit('next', {
						props: {
							type: this.transferType,
							typeStr: this.labelMap[this.transferType],
							toUserId: this.toUserId,
							toUserNickname: this.toUserNickname,
							balance: this.balance,
						},
						componentName: 'transferConfirm',
					}));
				} catch(e) {
				}
			},
			handleRecentContact() {
				this.$emit("openRecentContact")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.transaction-transfer-container {
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
	
	.contact-button {
		background: transparent;
		color: #b8b9b9;
		border-radius: 0px;
		:after{
			boder: none;
		}
	}
	
	.transaction-recent-contact-view {
		padding: 5px 0px;
	}

	.transaction-transfer-users {
		padding: 30px 0px 10px 0px;
		width: 100%;
		border-bottom: 1px #b8b9b9 solid;
	}

	.transaction-transfer-users-item {
		height: 80px;
		margin-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;

		&.to {
			height: 190px;
		}
	}

	.transaction-transfer-users-label {
		width: 20%;
	}

	.transaction-transfer-users-group {
		display: block;
		margin-left: 10px;
		width: 70%;
		height: 190px;
	}

	.transaction-transfer-users-view {
		height: 65px;
		width: 70%;
		border-radius: 5px;
		border: 1px #b8b9b9 solid;
		margin-left: 10px;
		padding: 5px 5px;

		&.to {
			margin-top: 10px;
			width: 100%;
			margin-left: 0px;
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

	.transaction-transfer-users-to-addr {
		width: 100%;
		height: 100%;

		/deep/ .u-input__input {
			height: 100%;
			color: #989898;
			font-size: 16px;
		}
	}

	.transaction-transfer-trans {
		padding: 10px 10px;
		display: flex;
		align-items: center;
		color: #b8b9b9;
		border-bottom: 1px #b8b9b9 solid;
	}

	.transaction-transfer-opt {
		padding: 30px 0px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
