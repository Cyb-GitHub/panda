<template>
	<view class="transformation-container">
		<view class="transformation-dot-selector">
			<uni-data-select
			      v-model="currentDotType"
			      :localdata="dotOptions"
			      @change="selectDotTypeChange"
				  :clear='false'
				  class="checkout-dot-select"
			>
			</uni-data-select>
		</view>
		<view class="transformation-input-area">
			<u-input class="transformation-input"
				v-model="transferlValue"
				placeholder=""
				:maxValue="getBalance"
				@input="debouncedChange"
				type="number" />
		</view>
		<view class="transformation-balance-area">
			<span class="transformation-balance-span">
				{{getBalanceStr}}
			</span>
			
		</view>
		<view v-if="transferlValue !== null && transferlValue > getBalance" class="transformation-balance-error-area">
			<view class="transformation-balance-span error">
				{{getValueErrorStr()}}
			</view>
		</view>
		<view class="transformation-dot-selector">
			<uni-data-select
			      v-model="transDotType"
			      :localdata="transOptions"
				  :clear='false'
				  class="checkout-dot-select"
			>
			</uni-data-select>
		</view>
		<view v-if="transferlValue" class="transformation-info-area">
			<span class="transformation-info-span">
				{{getTranceInfoStr}}
			</span>
		</view>
		<view class="transformation-opt-area">
			<button class="button " :disabled="disabled" @click="handleTransformation()">
			{{$t('account.transformation')}}</button>
		</view>
	</view>
</template>

<script>
import _ from 'lodash'
import Decimal from 'decimal.js'

export default {
	data() {
		 return {
			currentDotType: 2,
			transformFromDotTypes: [1,2],
			transform2DotTypes: {
				1: [2],
				2: [1, 4],
			},
			transferlValue: null,
			transDotType: 0,
			balance: '1000',
			transInfo: {
				premiumInfo: {
					premium: 0,
					premiumPercent: 0,
				},
				exchangeRate: 0.025,
			},
			radioInfoMap: {
				1: {
					2 : 40,
				},
				2: {
					1: 0.025,
					4: 0.1
				}
			},
			disabled: false,
			debouncedChange: _.debounce(this.getRadioInfo, 400),
			transOptions: [],
			dotOptions: [],
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
	mounted() {
		this.transDotType = this.transform2DotTypes[this.currentDotType][0];
		this.balance = this.ammountInfo[this.amountLabelKey[this.currentDotType]];
		this.getRadioInfo();
		this.getOptions();
	},
	computed:{
		getBalanceStr () {
			return `${this.$t('account.balance')}： ${this.balance} ${this.labelMap[this.currentDotType]}`
		},
		getTranceInfoStr() {
			return `${this.$t('transfer.exchangeRate')}：${this.labelMap[this.currentDotType]}: ${this.labelMap[this.transDotType]} = 
					1 : ${this.transInfo.exchangeRate},
					${this.$t('transfer.actualReceipt')} ${this.getActualValue()}${this.labelMap[this.transDotType]},
					${this.$t('transfer.passion')}： ${this.transInfo.premiumInfo.premium} ${this.labelMap[this.currentDotType]}`
		},
		getBalance() {
			if (this.balance) {
				return parseFloat(this.balance);
			} else {
				return 0;
			}
		}
	},
	watch:{
		transformFromDotTypes() {
			this.transDotType = this.transform2DotTypes[this.currentDotType][0]
			this.transferlValue = null
			this.getRadioInfo();
		},
		currentDotType() {
			this.transferlValue = null
			this.getRadioInfo();
			this.getOptions();
		},
		transferlValue() {
			//this.getRadioInfo();
		}
	},
	methods: {
		getValueErrorStr() {
			return `${this.$t('transfer.transferValueError')}`
		},
		getOptions() {
			this.dotOptions = this.currentDotOptinos
			    .filter(o => this.transformFromDotTypes.includes(o.value))
				.map(o => {
					return {
						value: o.value,
						text: o.label,
					};
				});
			this.transOptions = this.currentDotOptinos
			    .filter(o => this.transform2DotTypes[this.currentDotType].includes(o.value))
				.map(o => {
					return {
						value: o.value,
						text: o.label,
					};
				});
		},
		getRadioInfo() {
			if (!this.transferlValue) {
				return;
			}
			if (this.transferlValue > this.getBalance) {
				return;
			}
			this.$u.api.accountMessageApis.previewExchange({
				accountId: this.vuex_userInfo.id,
				exchangeFrom: this.currentDotType,
				exchangeTo: this.transDotType,
				exchangeAmount: parseFloat(this.transferlValue),
			}).then((res) =>{
				if (res.code === 0) {
					this.transInfo = res.data
				}
			})
		},
		getActualValue() {
			const t = new Decimal(this.transferlValue);
			const t1 = new Decimal(this.transInfo.exchangeRate);
			return t.mul(t1).toFixed();
		},
		selectDotTypeChange() {
			this.transDotType = this.transform2DotTypes[this.currentDotType][0]
			this.balance = this.ammountInfo[this.amountLabelKey[this.currentDotType]]
		},
		handleTransformation() {
			this.disabled = true
			if (!this.transferlValue) {
				this.$u.toast(this.$t('transformation.emptyInfo'));
				this.disabled = false;
				return;
			}
			this.$u.api.accountMessageApis.exchangeAmount({
				accountId: this.vuex_userInfo.id,
				exchangeFrom: this.currentDotType,
				exchangeTo: this.transDotType,
				exchangeAmount: parseFloat(this.transferlValue)
			}).then(res =>{
				if (res.code === 0) {
					this.$util.showToastSuc(this.$t('transformation.suc'),()=>{
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
	.transformation-container {
		width: 100%;
		height: 100%;
	}
	.transformation-dot-selector {
		margin-top: 30px;
		height: 30px;
		width: 90%;
		margin-left: 5%;
		display: flex
	}
	.checkout-dot-select {
		width: 40%;
		margin-left: 30%;
		margin-right: 30%;
		background: white;
	}
	.checkout-dot-select /deep/ .uni-stat-box .uni-select {
		border: 0px;
	}
	.transformation-dot-selector-txt {
		padding: 0px 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.transformation-input-area {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
	}
	.transformation-input {
		width: 200px;
		flex: none;
		border-bottom: 1px #fff solid!important;
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
	.transformation-balance-error-area {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.transformation-balance-area {
		padding: 10px 0px;
		border-bottom: 1px #848484 solid;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
		width: 90%;
		margin-left: 5%;
	}
	.transformation-balance-span {
		color: #a6a6a6;
		&.error {
			color: red;
		}
	}
	.transformation-info-area {
		padding: 10px 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		margin-left: 5%;
	}
	.transformation-info-span {
		color: #a6a6a6;
	}
	.transformation-opt-area {
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