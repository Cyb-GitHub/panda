<template>
	<view class="share-recorder-container">
		<uni-table class="share-recorder-table" ref="table" :loading="loading" border stripe :emptyText="$t('noMoreData')">
			<uni-tr>
				<uni-th width="90px" align="center">{{$t('userinfo.nickname')}}</uni-th>
				<uni-th width="120px" align="center">{{$t('userinfo.registerTime')}}</uni-th>
				<uni-th align="center">{{$t('share.qualification')}}</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in contacts" :key="index">
				<uni-td align="center">{{ item.name }}</uni-td>
				<uni-td align="center">
					{{ item.registerTime }}
				</uni-td>
				<uni-td align="center">{{$t(item.hasQualification ? 'common.yes' : 'common.no')}}</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				contacts: [],
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			initData() {
				this.$u.api.accountMessageApis.querySharedAccountCooperateProgressPaged({
					'accountId': this.vuex_userInfo.id,
					'page': 1,
					'pageSize': 100,
				}).then(res => {
					this.contacts = res.data.list
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.share-recorder-container {
	overflow-x: scroll;
	overflow-y: scroll;
	height: 400px;
	width: 100%;
	padding: 10px 5px;
}
</style>
