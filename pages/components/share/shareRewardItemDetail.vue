<template>
	<view>
		<uni-row class='share-reward-detail-row'>
			{{`${$t('share.name')}: ${detail.lpgShareRewardSourceAccountName}`}}
		</uni-row>
		<uni-row class='share-reward-detail-row'>
			{{`${$t('share.uid')}: ${detail.lpgShareRewardSourceAccountUid}`}}
		</uni-row>
		<uni-row class='share-reward-detail-row'>
			{{`${$t('share.holdType')}: ${$t(SHARE_REWARD_SOURCE_TEXT[detail.lpgShareRewardSourceType])}`}}
		</uni-row>
		<uni-row class='share-reward-detail-row'>
			{{`${$t('share.holdAmount')}: ${detail.amount.toFixed(3)}`}}
		</uni-row>
		<uni-row class='share-reward-detail-row'>
			{{`${$t('share.rewardAmount')}: ${detail.lpgShareRewardSourceAmount.toFixed(3)}`}}
		</uni-row>
		<uni-row class='share-reward-detail-row'>
			{{`${$t('share.rewardTime')}: ${detail.createTime}`}}
		</uni-row>
	</view>
</template>

<script>
	import ACCOUNT_STATEMENT from '@/pages/constant/accountStatementEnum.js';
	import LPG from '@/pages/constant/lpgEnum.js';
	
	export default {
		props: {
			detail: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				ACCOUNT_STATEMENT_TYPE_TEXT: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_TYPE_TEXT,
				ACCOUNT_STATEMENT_STATUS_TEXT: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_STATUS_TEXT,
				SHARE_REWARD_SOURCE_TEXT: LPG.SHARE_REWARD_SOURCE_TEXT,
				SHARE_REWARD_SOURCE_ITMES: LPG.SHARE_REWARD_SOURCE_ITMES,
			};
		},
		watch: {
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import url("shareReward.scss");
</style>
