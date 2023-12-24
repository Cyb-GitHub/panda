<template>
	<view class="leftDataBot">
		<view v-if="tableData.length > 0" class="tableTh">
			<view class="th" style="width: 170rpx;"><text>{{$t('ticketDataCenter.text38')}}</text></view>
			<view class="th" style="width: 170rpx;"><text>{{$t('ticketDataCenter.text39')}}</text></view>
			<view class="th" style="width: 200rpx;"><text>{{$t('ticketDataCenter.text40')}}</text></view>
			<view class="th" style="width: 180rpx;border-right: 1px solid #666666;"><text>{{$t('ticketDataCenter.text41')}}</text></view>
		</view>
		<scroll-view v-if="tableData.length > 0" scroll-y="true" style="width: 718rpx; border: 1px solid #666666;" :style="{'height': height}">
			<view v-for="(item, index) in tableData" class="tableList" :key="index">
				<view class="td" style="width: 170rpx; font-size: 12px;">{{item.payTime}}</view>
				<view class="td" style="width: 170rpx;">{{item.accountName}}</view>
				<view class="td" style="width: 200rpx;">{{item.raffleNumberStr}}</view>
				<view class="td" style="width: 180rpx;">{{item.multiple}}</view>
			</view>
		</scroll-view>
		<view v-if="tableData.length > 0" class="seeMore" @click="getMore">
			<text>{{$t('ticketDataCenter.text42')}}</text>
		</view>
		<view v-if="tableData.length == 0" class="noData">
			<text>{{$t('ticketDataCenter.text43')}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tableData: {
				Type: Array,
				default: ()=>[]
			},
			height: {
				Type: String,
				default: '400rpx'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			getMore() {
				this.$emit('getMore', true)
			}
		}
	}
</script>

<style lang="scss" scoped>
.leftDataBot{
	width: 720rpx;
	margin-left: 15rpx;
	margin-top: 10rpx;
	.tableTh{
		display: flex;
		width: 720rpx;
		.th{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50rpx;
			font-size: 12px;
			border-top: 1px solid #666666;
			border-left: 1px solid #666666;
		}
	}
	.tableList{
		display: flex;
		.td{
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-bottom: 1px solid #666666;
		}
	}
	.seeMore{
		width: 100%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #eeeeee;
	}
	.noData{
		width: 100%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #eeeeee;
	}
}
</style>
