<template>
	<view>
		<view class="share-reward-basic">
			<u-row class="share-reward" gutter="3" customStyle="margin-bottom: 10px">
				<u-col span="4">
					<image src="@/static/images/1x/chatAva.png" mode="heightFix"
						class="share-reward-icon"></image>
				</u-col>
				<u-col class="share-reward-name-col" span="8">
					<view class="share-reward-name-txt">
						{{vuex_userInfo.name}}
					</view>
					<view class="share-reward-name-txt">
						{{vuex_userInfo.uid}}
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="share-rewards-filter">
			<dateSelector :defaultDate="date" @dateChanged="dateChanged($event)"></dateSelector>
		</view>
		<view class="share-rewards-list">
			<share-reward-item
			 v-for="(sr, index) in shareRewards"
			 :key="index"
			 :shareReward="sr"
			/>
		</view>
	</view>
</template>

<script>
	import dateSelector from '@/pages/components/account/dateSelector.vue'
	import shareRewardItem from '@/pages/components/share/shareRewardItem.vue'
	import ACCOUNT_STATEMENT from '@/pages/constant/accountStatementEnum.js';
	import AMOUNT from '@/pages/constant/amountEnum.js';
	
	export default {
		data() {
			return {
				date: {
					year: 2023,
					month: 1,
					day: 1
				},
				shareRewards: [],
			};
		},
		name: 'shareRewards',
		components: {
			dateSelector,
			shareRewardItem,
		},
		mounted() {
			this.initData();
		},
		methods: {
			dateChanged(date) {
				this.date = date;
				this.initData();
			},
			async initData() {
				const params = {
					startTimestamp: this.getTimestamp(),
					endTimestamp: new Date().getTime(),
					amountType: AMOUNT.AMOUNT_TYPE_TYPES.LPG,
					statementType: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_TYPES.LPG_SHARE_REWARD,
				};
				const d = await this.$u.api.accountMessageApis.statementList(params);
				if (d.code === 0) {
					this.shareRewards = d.data;
				} else {
					this.shareRewards = [];
				}
			},
			getTimestamp() {
				const dateInfo = new Date(this.date.year, this.date.month - 1, this.date.day);
				return dateInfo.getTime();
			},
		},
	}
</script>


<style lang="scss" scoped>
	@import "@/pages/utils/normal.scss";
	@import url("@/pages/components/share/shareReward.scss");
</style>
