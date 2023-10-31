<template>
	<view class="wallet-withdrawal-container">
		<view class="wallet-withdrawal-dot-selector">
			<uni-data-select
			      v-model="currentDotType"
			      :localdata="options"
			      @change="selectDotTypeChange"
				  :clear='false'
				  class="checkout-dot-select"
			>
			</uni-data-select>
			<span class="wallet-withdrawal-dot-selector-txt" @click="useMaxNum">{{$t('account.useMaxNum')}}</span>
		</view>
		<view class="wallet-withdrawal-input-area">
			<u-input class="wallet-withdrawal-input"
				v-model="withdrawalValue"
				placeholder=""
				:maxValue="getBalance"
				@input="debouncedChange"
				type="number" />
		</view>
		<view class="wallet-withdrawal-balance-area">
			<span class="wallet-withdrawal-balance-span">
				{{getBalanceStr}}
			</span>
		</view>
		<view v-if="withdrawalValue !== null && withdrawalValue > getBalance"
			class="wallet-withdrawal-balance-error-area">
			<view class="wallet-withdrawal-balance-span error">
				{{getValueErrorStr}}
			</view>
		</view>
		<view v-if="withdrawalValue !== null && withdrawalValue < commission"
			class="wallet-withdrawal-balance-error-area">
			<view class="wallet-withdrawal-balance-span error">
				{{getValueErrorStr1}}
			</view>
		</view>
		<view class="wallet-withdrawal-info-area">
			<span v-if="withdrawalValue" class="wallet-withdrawal-info-span">
				{{getTranceInfoStr}}
			</span>
		</view>
		<view class="wallet-withdrawal-opt-area">
			<button class="button " @click="handleSend()">
			{{$t('account.withdrawal')}}</button>
		</view>
	</view>
</template>

<script>
import Decimal from 'decimal.js'
import _ from 'lodash'

export default {
	data() {
		 return {
			currentDotType: 1,
			withdrawalValue: null,
			balance: 0,
			commission: 0,
			withdrawDotTypes: [1,4],
			transInfo: {
				balance: '1000',
				commission: 1,
				type: 'LPG',
			},
			withdrawLpgUsdtPremium: null,
			debouncedChange: _.debounce(this.change, 400),
			options: [],
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
		labelMap :{
			type: Object,
			default: ()=> {},
		}
	},
	computed: {
		getBalanceStr () {
			return `${this.$t('account.balance')}： ${this.balance} ${this.labelMap[this.currentDotType]}`
		},
		getValueErrorStr() {
			return `${this.$t('transfer.transferValueError')}`
		},
		getValueErrorStr1() {
			return `${this.$t('transfer.transferValueError1')}`
		},
		getTranceInfoStr() {
			return `${this.$t('statement.handlingFee')}：${this.commission}${this.labelMap[this.currentDotType]} ${this.withdrawLpgUsdtPremium ? this.withdrawLpgUsdtPremium + "U" : ''},
					${this.$t('statement.actualReceipt')}: ${this.getActualWithdrawBalance()}${this.labelMap[this.currentDotType]}`
		},
		getBalance() {
			if (this.balance) {
				return parseFloat(this.balance);
			} else {
				return 0;
			}
		}
	},
	watch: {
		currentDotType() {
			this.getRadioInfo()
		},
	},
	mounted() {
		this.balance = this.ammountInfo[this.amountLabelKey[this.currentDotType]]
		this.getRadioInfo()
		this.getOptions()
	},
	methods: {
		getOptions() {
			this.options = this.currentDotOptinos
			    .filter(o => this.withdrawDotTypes.includes(o.value))
				.map(o => {
					return {
						value: o.value,
						text: o.label,
					};
				});
		},
		change(e) {
			this.getRadioInfo();
		},
		getRadioInfo() {
			if (!this.withdrawalValue) {
				return;
			}
			this.$u.api.accountMessageApis.previewWithdrawal({
				accountId: this.vuex_userInfo.id,
				amountType: this.currentDotType,
				amount: parseFloat(this.withdrawalValue),
			}).then((res) =>{
				if (res.code === 0) {
					this.commission = res.data.premium
					this.withdrawLpgUsdtPremium = res.data.withdrawLpgUsdtPremium;
				}
			})
		},
		selectDotTypeChange() {
			this.balance = this.ammountInfo[this.amountLabelKey[this.currentDotType]]
		},
		getActualWithdrawBalance() {
			const t = new Decimal(this.withdrawalValue);
			const t1 = new Decimal(this.commission);
			return t.sub(t1).toFixed();
		},
		useMaxNum() {
			this.withdrawalValue = this.balance
		},
		handleSend() {
			if (this.withdrawalValue !== null && this.withdrawalValue > this.getBalance) {
				return;
			}
			if (!this.withdrawalValue) {
				this.$u.toast(this.$t('transformation.emptyInfo'));
				return;
			}
			this.$emit('next', {
				props: {
					withdrawalValue: parseFloat(this.withdrawalValue),
					type: this.currentDotType,
					typeStr: this.labelMap[this.currentDotType],
					balance: this.getBalance,
				},
				componentName: 'withdrawConfirm',
			})
		},
		
	}
}
</script>

<style lang="scss" scoped>
	.wallet-withdrawal-container {
		width: 100%;
		height: 100%;
	}
	.wallet-withdrawal-dot-selector {
		margin-top: 30px;
		height: 30px;
		width: 90%;
		margin-left: 5%;
		display: flex
	}
	.checkout-dot-select {
		width: 40%;
		margin-left: 30%;
		background: white;
	}
	.wallet-withdrawal-dot-selector-txt {
		padding: 0px 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.wallet-withdrawal-input-area {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
	}
	.wallet-withdrawal-input {
		width: 200px;
		flex: none;
		border-bottom: 2px #fff solid;
		/deep/ .uni-input-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		/deep/ .uni-input-input {
			font-size: 30px;
			color: #a6a6a6;
			caret-color: #9ae022;
			text-align: center !important;
		}
	}
	.wallet-withdrawal-balance-error-area {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.wallet-withdrawal-balance-area {
		padding: 10px 0px;
		border-bottom: 1px #848484 solid;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
		width: 90%;
		margin-left: 5%;
	}
	.wallet-withdrawal-balance-span {
		color: #a6a6a6;
		&.error {
			color: red;
		}
	}
	.wallet-withdrawal-info-area {
		padding: 10px 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		margin-left: 5%;
	}
	.wallet-withdrawal-info-span {
		color: #a6a6a6;
	}
	.wallet-withdrawal-opt-area {
		margin-top: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
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
</style>