<template>
	<view>
	<view class="share-reward-item" @click="handleShowDetail">
		<u-row class="share-reard-item-detail-rol" gutter="3">
			<u-col class="share-reard-item-detail" span="6">
				{{`${$t('detail.source')}: ${$t(ACCOUNT_STATEMENT_TYPE_TEXT[shareReward.statementTypeValue])}`}}
			</u-col>
			<u-col class="share-reard-item-detail" span="6">
				<view>{{`${$t('share.remainAmount')}:`}}</view>
				<view :class="{highLight: getType(shareReward.amount)}">{{formatAmount(shareReward.amount)}}</view>
			</u-col>
		</u-row>
		<u-row class="share-reard-item-detail-rol" gutter="3">
			<u-col class="share-reard-item-detail" span="6">
				{{`${$t('share.rewardTime')}: ${shareReward.createTime}`}}
			</u-col>
			<u-col class="share-reard-item-detail" span="6">
				<span>{{`${$t('detail.status')}: ${$t(ACCOUNT_STATEMENT_STATUS_TEXT[shareReward.statusVal])}`}}</span>
				<span>{{`${$t('share.remainAmount')}: ${formatAmount(shareReward.remainAmount)}`}}</span>
			</u-col>
		</u-row>
	</view>
	<detail-popup
	  :visiable="detailVisiable"
	  @close="handleDetailClose"
	  >
	  <template slot="title">
		  {{`${$t('index.shareReward')}${$t('detail.detail')}`}}
	  </template>
	  <template slot='content'>
		  <share-reward-item-detail :detail="record"></share-reward-item-detail>
	  </template>
	</detail-popup>
	</view>
</template>

<script>
	import detailPopup from '@/pages/components/popup/detailPopup.vue';
	import shareRewardItemDetail from '@/pages/components/share/shareRewardItemDetail.vue'
	import ACCOUNT_STATEMENT from '@/pages/constant/accountStatementEnum.js';
	import Decimal from 'decimal.js'
	
	export default {
		components: {
			detailPopup,
			shareRewardItemDetail,
		},
		name: 'shareRewardItem',
		data() {
			return {
				detailVisiable: false,
				record: {},
				ACCOUNT_STATEMENT_TYPE_TEXT: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_TYPE_TEXT,
				ACCOUNT_STATEMENT_STATUS_TEXT: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_STATUS_TEXT,
			};
		},
		props: {
			shareReward: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},
		methods: {
			getType(amount) {
				return parseFloat(amount) > 0;
			},
			handleDetailClose() {
				this.detailVisiable = false;
			},
			async handleShowDetail() {
				await this.getByid();
				this.detailVisiable = true;
			},
			async getByid() {
				const params = {
					id: this.shareReward.id,
				};
				const d = await this.$u.api.accountMessageApis.rewardDetail(params);
				if (d.code === 0) {
					this.record = d.data;
				} else {
					this.record = {
						lpgShareRewardSourceAccountUid: "",
						lpgShareRewardSourceAccountName: "",
						lpgShareRewardSourceType: '-',
						lpgShareRewardSourceAmount: '-',
						amount: "-",
						createTime: "-"
					};
				}
			},
			formatAmount(am) {
				return new Decimal(am).toFixed();
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import url("@/pages/components/share/shareReward.scss");
</style>
