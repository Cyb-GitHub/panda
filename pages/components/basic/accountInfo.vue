
<template>
	<view class="account-info-content">
		<view
			class="account-info-content-item"
			:class="{large: size==='large'}"
			v-for="(accountItem, index) in accountItems"
			:key="index"
		>

			<view
				class="account-info-content-item-title"
				v-if="showText"> 
			{{accountItem.label}} </view>
			<uni-tooltip class="account-info-content-item-tooltip" :content="getTooltipTxt(accountItem)">
			<view class="account-info-content-item-detail"
				:class="{titleShow : showText}">
				<view class="account-info-content-item-detail-inner"
					:class="{[accountItem.color] : true}"
					:style="{ width: getInnerWidth(accountItem.valueKey) }">
					
				</view>
				<span class="account-info-content-item-detail-inner-text">
					<span v-if="accountItem.valueKey == 'usdtAmount'">{{accountInfo[accountItem.valueKey]}}</span>
					<span v-if="accountItem.valueKey == 'bambooAmount'">{{Math.trunc(accountInfo[accountItem.valueKey])}}</span>
					<span v-if="accountItem.valueKey == 'raffleTicketAmount'">{{Math.trunc(accountInfo[accountItem.valueKey])}}</span>
					<span v-if="accountItem.valueKey == 'lpgAmount'">{{accountInfo[accountItem.valueKey]}}</span>
				</span>
			</view>
			<view
				class="account-info-content-item-icon"
				:class="{[accountItem.class] : true}">
			</view>
			</uni-tooltip>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			accountItems: [{
				class: 'usdt',
				color: 'blue',
				valueKey: 'usdtAmount',
				label: this.$t('index.usdtTxt'),
			},{
				class: 'bamboo',
				color: 'orange',
				valueKey: 'bambooAmount',
				label: this.$t('index.bambooTxt'),
			},{
				class: 'ticket',
				color: 'green',
				valueKey: 'raffleTicketAmount',
				label: this.$t('index.ticketTxt'),
			},{
				class: 'panda',
				color: 'royalblue',
				valueKey: 'lpgAmount',
				label: this.$t('index.lpgTxt'),
			}],
			// accountInfo: {
			// 	bamboo: 85,
			// 	usdt: 28,
			// 	ticket: 10,
			// 	panda: 68,
			// }
		}
	},
	props: {
		showText: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'normal'
		},
		accountInfo: {
			type: Object,
			default: () =>{
				return {
					bambooAmount: 0,
					usdtAmount: 0,
					raffleTicketAmount: 0,
					lpgAmount: 0,
				}
			}
		}
	},
	methods: {
		getTooltipTxt(item) {
			return `${item.label} : ${this.accountInfo[item.valueKey]}`
		},
		getInnerWidth(index) {
			if (this.accountInfo[index]) {
				const fix2 = this.accountInfo[index].toString().slice(0, 2)
				var percentage = parseInt(fix2) / 100;
				if (percentage > 0) {
					percentage = percentage > 1 ? 1: percentage;
					percentage = percentage < 0.3 ? (0.2 + 0.3 * percentage): percentage
				} else {
					percentage = 0;
				}
				console.log(index, percentage)
				return `${percentage * 100}%`;
			} else  {
				return '0%'
			}
			
		},
	}
}
</script>

<style lang="scss" scoped>
.account-info-content {
	width: 95%;
	height: 100%;
	// margin-right: 10px;
	float: right;
	padding: 0px 10px 0px 0px;
	.account-info-content-item {
		padding: 2px 3px 2px 3px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		&.large {
			padding: 5px 3px 5px 3px;
			.account-info-content-item-detail {
				height: 20px !important;
				border-radius: 10px;
			}
			.account-info-content-item-detail-inner {
				height: 18px !important;
				border-radius: 9px!important;
			}
			.account-info-content-item-icon {
				margin-left: -9px!important;
				width: 25px!important;
				height: 25px!important;
			}
		}
		.account-info-content-item-detail {
			width: 85%;
			border: 1px solid black;
			height: 18px;
			border-radius: 9px;
			&.titleShow {
				width: 60%;
			}
			.account-info-content-item-detail-inner {
				border: 1px black solid;
				height: 16px;
				border-radius: 8px !important;
				background-color: #b21200;
				float: right;
				display: inline-flex;
				align-items: center;
				&.blue {
					background-color: #00ffe6;
					border: 1px #00ffe6 solid;
				}
				&.orange {
					background-color: #ffb600;
					border: 1px #ffb600 solid;
				}
				&.green {
					background-color: #a8ff00;
					border: 1px #a8ff00 solid;
				}
				&.royalblue {
					background-color: #aaffff;
					border: 1px #aaffff solid;
				}
			}
		}
		.account-info-content-item-icon {
			margin-left: -6px;
			width: 20px;
			height: 20px;
			background-position: center !important;
			background-repeat: no-repeat !important;
			background-size: cover !important;
			&.usdt {
				background: url("@/static/images/1x/usdt-icon.png");
			}
			&.bamboo {
				background: url("@/static/images/1x/bamboo-icon.png");
			}
			&.ticket {
				background: url("@/static/images/1x/ticket-icon.png");
			}
			&.panda {
				background: url("@/static/images/1x/panda-icon.png");
			}
		}
	}
}
.account-info-content-item-detail-inner-text {
	color: black;
	font-size: 4px;
	margin-left: 3px;
	z-index: 3;
	//position: absolute;
}
.account-info-content-item-title {
	padding: 2px 5px 2px 5px;
	width: 25%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	color: white;
}
.account-info-content-item-tooltip {
	width: 100%;
	display: contents;
	/deep/ .uni-tooltip-popup {
		left: auto !important;
		background-color: rgba(0, 0, 0, 0.9);
	}
}
</style>