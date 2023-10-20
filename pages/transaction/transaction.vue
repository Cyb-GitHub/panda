<template>
	<view class="transaction-container">
		<u-navbar
			class="transaction-container-navbar"
			:back-text="curComp.left"
			secTitle="Lucky Panda Gold Wallet"
			titleWidth="320"
			:title="curComp.title"
			v-show="!showRecentContact"
		></u-navbar>
		<view class="transaction-container-content" v-show="!showRecentContact">
			<!-- 正文内容 -->
			<component v-if="curComp && curComp.componentName && !loading"
				:is="curComp.componentName"
				:key="curComp.componentName"
				v-bind="getProps"
				@next="next($event)"
				@openRecentContact="handleOpenRecentContact"
				></component>
		</view>
		<view class="transaction-container-contact" v-show="showRecentContact">
			<recent-contact
			    @choseContact="handleChoseContact"
				@closeContact="handleCloseContact"
			/>
		</view>
	</view>
</template>

<script>

import withdrawal from '@/pages/transaction/withdrawal.vue'
import withdrawConfirm from '@/pages/transaction/withdrawConfirm.vue'
import transformation from '@/pages/transaction/transformation.vue'
import transfer from '@/pages/transaction/transfer.vue'
import transferConfirm from '@/pages/transaction/transferConfirm.vue'
import recentContact from '@/pages/transaction/recentContact.vue'
import recharge from '@/pages/transaction/recharge.vue'

export default {
	data() {
		 return {
			actionType: undefined,
			compInfo: {
				recharge: {
					title: this.$t('account.recharge'),
					left: this.$t('back'),
					componentName: 'recharge'
				},
				transformation: {
					title: this.$t('account.transformation'),
					left: this.$t('back'),
					componentName: 'transformation'
				},
				transfer: {
					title: this.$t('account.transfer'),
					left: this.$t('back'),
					componentName: 'transfer'
				},
				transferConfirm: {
					title: this.$t('account.transfer'),
					left: this.$t('back'),
					componentName: 'transferConfirm'
				},
				withdrawal: {
					title: this.$t('account.withdrawal'),
					left: this.$t('back'),
					componentName: 'withdrawal'
				},
				withdrawConfirm: {
					title: this.$t('account.withdrawal'),
					left: this.$t('back'),
					componentName: 'withdrawConfirm'
				},
			},
			amountLabelKey: {
				1 : 'usdtAmount',
				2 : 'bambooAmount',
				3 : 'raffleTicketAmount',
				4 : 'lpgAmount',
				5: 'airdropTicketAmount'
				
			},
			currentDotOptinos: [
				{
					label: this.$t('transType.usdt'),
					value: 1,
				},
				{
					label: this.$t('transType.lpg'),
					value: 4,
				},
				{
					label: this.$t('transType.bamboo'),
					value: 2,
				},
				{
					label: this.$t('transType.raffle'),
					value: 3,
				},
				{
					label: this.$t('transType.airDrop'),
					value: 5,
				},
			],
			labelMap: {
				1: 'USDT',
				2: '竹子',
				3: '抽奖券',
				4: 'LPG',
				5: '空投券',
			},
			ammountInfo: {
				bambooAmount: 0,
				usdtAmount: 0,
				raffleTicketAmount: 0,
				lpgAmount: 0,
				airdropTicketAmount: 0,
			},
			loading: false,
			curComp: {},
			
			// 常用联系人
			showRecentContact: false,
			recentContact: null,
		 }
	},
	components: {
		withdrawal,
		withdrawConfirm,
		transformation,
		transfer,
		transferConfirm,
		recentContact,
		recharge,
	},
	props: {
	},
	computed: {
		getProps() {
			return {
				... this.curComp.props,
				ammountInfo: this.ammountInfo,
				amountLabelKey: this.amountLabelKey,
				currentDotOptinos: this.currentDotOptinos,
				labelMap: this.labelMap,
				recentContact: this.recentContact,
			}
		}
	},
	onLoad(e) {
		console.log(e);
		if (this.compInfo[e.actionType]) {
			this.actionType = e.actionType;
			this.curComp = this.compInfo[e.actionType];
		}
	},
	created() {
		this.loading = true;
		this.initAccountInfo();
	},
	methods: {
		initAccountInfo() {
			this.$u.api.accountMessageApis.amountInfo(this.vuex_userInfo.id).then((res)=>{
				console.log(res);
				if (res.code === 0) {
					this.loading = false;
					this.ammountInfo = res.data;
				}
			})
		},
		next(val) {
			if (val.componentName && this.compInfo[val.componentName]) {
				console.log(val);
				this.curComp = this.compInfo[val.componentName];
				this.curComp.props = val.props
			}
		},
		handleOpenRecentContact() {
			this.showRecentContact = true;
		},
		handleChoseContact(val) {
			this.recentContact = val;
			this.showRecentContact = false;
		},
		handleCloseContact() {
			this.recentContact = null;
			this.showRecentContact = false;
		}
	}
}
</script>

<style lang="scss" scoped>
	.transaction-container {
		width: 100%;
		height: 100%;
		background: linear-gradient(#eaebeb, #cccdcd);
	}
	.transaction-container-contact {
		width: 100%;
		height: 100%;
		background: linear-gradient(#eaebeb, #eaebeb);
	}
	.transaction-container-navbar {
		height: 65px !important;
		/deep/ .u-navbar{
			background: #eaebeb !important;
		}
		/deep/ .u-navbar-inner {
			height: 65px !important;
		}
		/deep/ .u-navbar-content-title {
			display: inline-table;
		}
		/deep/.u-line-2 {
			line-height: 20px;
			font-size: 10px;
			flex: 1;
			width: 100%;
			color: #9e9f9f
		}
	}
	.transaction-container-content {
		height: 100%;
		width: 96%;
		padding: 15px 0px 0px 0px;
		margin-left: 2%;
		background: url("@/static/images/1x/tran-background.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
		display: flex;
	}
</style>