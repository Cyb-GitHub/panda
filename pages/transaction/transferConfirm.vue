<template>
	<view class="transfer-confirm-container">
		<view class="transfer-confirm-dot-selector">
			<!--<uni-combox
				:border="true"
				labelKey="label"
				valueKey="value"
				v-model="currentDotType"
				:candidates="currentDotOptinos.filter(option => transDotTypes.includes(option.value))"
				class="checkout-dot-select">
			</uni-combox>-->
			<uni-data-select
			      v-model="currentDotType"
			      :localdata="options"
				  :clear='false'
				  class="checkout-dot-select"
			>
			</uni-data-select>
			<span class="transfer-confirm-dot-selector-txt" @click='useMaxNum'>{{$t('account.useMaxNum')}}</span>
		</view>
		<view class="transfer-confirm-input-area">
			<u-input class="transfer-confirm-input"
				v-model="transferlValue"
				placeholder=""
				:maxValue="getBalance"
				type="number"/>
		</view>
		<view class="transfer-confirm-balance-area">
			<span class="transfer-confirm-balance-span">
				{{getBalanceStr}}
			</span>
		</view>
		<view class="transfer-confirm-info-area">
			<span class="transfer-confirm-info-span">
				{{getTranceInfoStr}}
			</span>
		</view>
		<view v-if="transferlValue !== null && transferlValue > getBalance" class="transfer-confirm-info-area">
			<span class="transfer-confirm-info-span error">
				{{getValueErrorStr}}
			</span>
		</view>
		<view class="transfer-confirm-opt-area">
			<button :disabled="disabled" class="button " @click="handleTransfer()">
			{{$t('account.transfer')}}</button>
		</view>
	</view>
</template>

<script>
import _ from 'lodash'
import Decimal from 'decimal.js'

export default {
	data() {
		 return {
			currentDotType: undefined,
			commission: 0,
			transferlValue: null,
			transDotTypes: [2],
			disabled: false,
			options: [],
		 }
	},
	watch: {
	},
	computed: {
		getBalanceStr () {
			return `${this.$t('account.balance')}： ${this.balance} ${this.typeStr}`
		},
		getValueErrorStr() {
			return `${this.$t('transfer.transferValueError')}`
		},
		getTranceInfoStr() {
			return `${this.$t('transfer.transferFee')}：${this.commission}%,
					${this.$t('transfer.actualReceipt')} ${this.getActualBalance()}${this.typeStr}`
		},
		getBalance() {
			if (this.balance) {
				return parseInt(this.balance);
			} else {
				return 0;
			}
		}
	},
	mounted() {
		this.currentDotType = this.type;
		this.currentDotType = this.transDotTypes[0]
		this.getOptions();
	},
	props: {
		type: {
			type: Number,
			default: 1,
		},
		typeStr: {
			type: String,
			default: 'LPG',
		},
		toUserId: {
			type: String,
			default: 'LPG',
		},
		toUserNickname: {
			type: String,
			default: 'LPG',
		},
		balance: {
			type: Number,
			default: 0,
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
	methods: {
		getOptions() {
			this.options = this.currentDotOptinos
			    .filter(o => this.transDotTypes.includes(o.value))
				.map(o => {
					return {
						value: o.value,
						text: o.label,
					};
				});
		},
		getActualBalance() {
			if (!this.transferlValue) {
				return 0;
			}
			const t = new Decimal(this.commission);
			const t1 = new Decimal(this.transferlValue);
			const t2 = new Decimal('100');
			const t3 = new Decimal('100');
			return t1.mul(t2.sub(t).div(t3)).toFixed();
		},
		useMaxNum() {
			this.transferlValue = this.balance
		},
		handleTransfer() {
			const t = parseInt(this.transferlValue);
			if (!t) {
				return;
			}
			if (t < 0) {
				this.$util.showToast(this.$t('transfer.positive'));
				return;
			}
			if (t > this.getBalance) {
				return;
			}
			if (this.currentDotType === 2 && !_.isInteger(parseFloat(this.transferlValue))) {
				this.$util.showToast(this.$t('transfer.transferIntErr'));
				return;
			}
			this.disabled = true
			const transferInfo = {
				transFromAccountId: this.vuex_userInfo.id,
				transToAccountUid: this.toUserId,
				transToAccountName: this.toUserNickname,
				transAmount: parseInt(this.transferlValue),
				amountType: this.currentDotType,
			}
			console.log(transferInfo);
			this.$u.api.accountMessageApis.transferAmount(transferInfo).then(res => {
				if (res.code === 0) {
					this.$util.showToastSuc(this.$t('transfer.transferSuc'), ()=>{
					this.disabled = false
					  this.$u.route({
						url: "/pages/transaction/transferSuc",
						params: { ...transferInfo, balance: this.getBalance - transferInfo.transAmount },
					  })
					})
				} else {
					this.disabled = false
				}
			}).catch(e => {
				this.disabled = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.transfer-confirm-container {
		width: 100%;
		height: 100%;
	}
	.transfer-confirm-dot-selector {
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
	.transfer-confirm-dot-selector-txt {
		padding: 0px 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.transfer-confirm-input-area {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
	}
	.transfer-confirm-input {
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
	
	.transfer-confirm-balance-area {
		padding: 10px 0px;
		border-bottom: 1px #848484 solid;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
		width: 90%;
		margin-left: 5%;
	}
	.transfer-confirm-balance-span {
		color: #a6a6a6;
	}
	.transfer-confirm-info-area {
		padding: 10px 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		margin-left: 5%;
	}
	.transfer-confirm-info-span {
		color: #a6a6a6;
		&.error {
			color: orangered;
		}
	}
	.transfer-confirm-opt-area {
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