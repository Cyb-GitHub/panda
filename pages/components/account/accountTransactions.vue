<template>
	<view class="account-transactions">
		<view class="account-transactions-basic">
			<u-row class="account-transactions" gutter="3" customStyle="margin-bottom: 10px">
				<u-col span="4">
					<image src="@/static/images/1x/chatAva.png" mode="heightFix"
						class="account-transactions-icon"></image>
				</u-col>
				<u-col class="account-transactions-name-col" span="8">
					<view class="account-transactions-name-txt">
						{{vuex_userInfo.name}}
					</view>
					<view class="account-transactions-name-txt">
						{{vuex_userInfo.uid}}
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="account-transactions-filter">
			<dateSelector :defaultDate="date" @dateChanged="dateChanged($event)"></dateSelector>
		</view>
		<view class="account-transactions-details">
			<view v-for="(item, index) in accountRecords" :key="index" class="account-transactions-details-item"
			 @click="handleShowDetail(item)">
				<u-row class="account-transactions-rol" gutter="3">
					<u-col class="account-transactions-col" span="6">
						{{`${$t('account.source')} :${getStatemenStr(item.statementTypeValue)}`}}
					</u-col>
					<u-col class="account-transactions-col" span="6">
						<view>{{`${$t('account.num')}:`}}</view>
						<view :class="{highLight: getType(item.amount)}">{{`${item.amount}`}}</view>
					</u-col>
				</u-row>
				<u-row class="account-transactions-rol" gutter="3">
					<u-col class="account-transactions-col" span="6">
						{{`${$t('account.time')} :${item.createTime}`}}
					</u-col>
					<u-col class="account-transactions-col" span="6">
						<span>{{`${$t('account.status')} :${getStatusStr(item.statusVal)}`}}</span>
						<span>{{`${$t('account.balance')} :${item.remainAmount}`}}</span>
					</u-col>
				</u-row>
			</view>
			<u-empty v-if="!accountRecords.length" :text="$t('noMoreData')"></u-empty>
		</view>
		<detail-popup
		  :visiable="detailVisiable"
		  @close="handleDetailClose"
		  >
		  <template slot="title">
			  {{`${$t(AMOUNT_TYPE_TEXT.AMOUNT_TYPE_TEXT[type])}${$t('detail.detail')}`}}
		  </template>
		  <template slot="content">
			  <account-detail :detail="detail"></account-detail>
		  </template>
		</detail-popup>
	</view>
</template>

<script>
	import dateSelector from '@/pages/components/account/dateSelector.vue';
	import detailPopup from '@/pages/components/popup/detailPopup.vue';
	import accountDetail from '@/pages/components/account/accountDetail.vue';
	import AMOUNT_TYPE_TEXT from '@/pages/constant/amountEnum.js';
	import {ACCOUNT_STATEMENT_TYPE_MAP, STATUS_MAP} from '@/pages/constant/transactionConstant.js';
	
	export default {
		data() {
			return {
				accountRecords: [],
				accountId: 0,
				date: {
					year: 2023,
					month: 1,
					day: 1
				},
				loading: false,
				detailVisiable: false,
				detail: {},
				AMOUNT_TYPE_TEXT,
			}
		},
		name: 'accountTransactions',
		components: {
			dateSelector,
			detailPopup,
			accountDetail
		},
		watch: {
			type: {
				handler: function(val) {
					console.log(val)
				},
				immediate: true
			}
		},
		mounted() {
			this.accountId = this.vuex_userInfo.id;
			this.initdata();
		},
		methods: {
			getType(amount) {
				return parseFloat(amount) > 0;
			},
			dateChanged(date) {
				this.date = date;
				this.initdata();
			},
			initdata() {
				this.loading = true;
				this.$u.api.accountMessageApis.statementList({
					accountId: this.accountId,
					amountType: this.type,
					startTimestamp: this.getTimestamp(),
					endTimestamp: new Date().getTime()
				}).then((res)=>{
					this.loading = false
					this.accountRecords = res.data
				})
			},
			getTimestamp() {
				console.log(this.date)
				const dateInfo = new Date(this.date.year, this.date.month - 1, this.date.day);
				return dateInfo.getTime();
			},
			handleShowDetail(row) {
				console.log('row = ', row);
				this.detail = row;
				this.detailVisiable = true;
			},
			handleDetailClose() {
				this.detailVisiable = false;
			},
			getStatemenStr(t) {
				console.log(ACCOUNT_STATEMENT_TYPE_MAP);
				return this.$t(ACCOUNT_STATEMENT_TYPE_MAP[t]);
			},
			getStatusStr(t) {
				return this.$t(STATUS_MAP[t]);
			}
		},
		props: {
			type: {
				type: Number,
				default: 0
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "@/pages/utils/normal.scss";

	.account-transactions-basic {
		width: 100%;
		height: 20%;
		min-height: 50px;
		padding: 10px 10px 10px 10px;
		display: inline-flex;
		align-items: center;
		border-bottom: 1px black solid;
		color: #d8d8d8;
	}

	.account-transactions-details {
		width: 100%;
		display: block;
		align-items: center;
		font-size: 12px !important;
		color: #d8d8d8;
	}

	.account-transactions-details-item {
		padding: 10px 10px 10px 10px;
		border-bottom: 1px black solid;
	}

	.account-transactions-filter {
		width: 100%;
		height: 20%;
		min-height: 50px;
		padding: 10px 0px 10px 0px;
		align-items: center;
		border-bottom: 1px black solid;
	}

	.account-transactions-icon {
		width: 50px;
		height: 50px;
	}

	.account-transactions-name-col {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 2px 0px 2px 0px;
		color: white;
	}

	.account-transactions-name-txt {
		padding: 0px 5px 0px 5px;
	}

	.account-transactions-col {
		display: inline-flex;
	
	>span {
			padding: 0px 5px 0px 0px;
		}
	}

	.highLight {
		color: green;
	}
</style>
