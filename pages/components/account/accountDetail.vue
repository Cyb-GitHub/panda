<template>
	<view>
		<uni-row class='account-detail-row'>
			{{`${$t('detail.source')}: ${$t(ACCOUNT_STATEMENT_TYPE_TEXT[detail.statementTypeValue])}`}}
		</uni-row>
		<uni-row class='account-detail-row'>
			{{`${$t('detail.status')}: ${$t(ACCOUNT_STATEMENT_STATUS_TEXT[detail.statusVal])}`}}
		</uni-row>
		<uni-row class='account-detail-row'>
			{{`${$t('detail.num')}: ${detail.amount}`}}
		</uni-row>
		<uni-row class='account-detail-row'>
			{{`${$t('detail.remainAmount')}: ${detail.remainAmount}`}}
		</uni-row>
		<uni-row class='account-detail-row'>
			{{`${$t('detail.time')}: ${detail.createTime}`}}
		</uni-row>
	</view>
</template>

<script>
	import ACCOUNT_STATEMENT from '@/pages/constant/accountStatementEnum.js';
	
	export default {
		props: {
			detail: {
				default: Object,
				default: {}
			},
		},
		data() {
			return {
				ACCOUNT_STATEMENT_TYPE_TEXT: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_TYPE_TEXT,
				ACCOUNT_STATEMENT_STATUS_TEXT: ACCOUNT_STATEMENT.ACCOUNT_STATEMENT_STATUS_TEXT,
			};
		},
		watch: {
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import url("account.scss");
</style>