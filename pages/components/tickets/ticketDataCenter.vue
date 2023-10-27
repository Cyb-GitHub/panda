<template>
	<view>
		<view class="navBox">
			<view class="navItem" :style="{'backgroundColor' : select=='L'?'':'#333333'}" @click="selectNav('L')">
				<text>即时数据</text>
			</view>
			<view class="navItem" :style="{'backgroundColor' : select=='R'?'':'#333333'}" @click="selectNav('R')">
				<text>历史数据</text>
			</view>
		</view>
		<view v-if="select=='L'" class="leftData">
			<view class="leftDataTop">
				<view class="leftDataTopLeft">
					<text class="dataTopLeftItem">第203期</text>
					<text class="dataTopLeftItem">参与本期抽奖人数：12345</text>
					<text class="dataTopLeftItem">已支付抽奖券数量：123450</text>
					<view class="searchBox">
						<input type="text" placeholder="请输入昵称">
						<view class="btn">
							<text>查询</text>
						</view>
					</view>
				</view>
				<view class="leftDataTopRight">
					<text class="dataTopLeftItem">获得共建奖励人数:123456</text>
					<text class="dataTopLeftItem">获得共建奖励LPG数量:123456</text>
					<text class="dataTopLeftItem">获得共建奖励x2LPG数量:123456</text>
					<text class="dataTopLeftItem">获得共建奖励x3LPG数量:123456</text>
				</view>
			</view>
			<view class="leftDataBot">
				<view class="tableTh">
					<view class="th" style="width: 145rpx;"><text>支付时间</text></view>
					<view class="th" style="width: 145rpx;"><text>昵称</text></view>
					<view class="th" style="width: 250rpx;"><text>选号</text></view>
					<view class="th" style="width: 180rpx;border-right: 1px solid #666666;"><text>支付抽奖券数量</text></view>
				</view>
				<scroll-view scroll-y="true" style="width: 718rpx; height: 400rpx;border: 1px solid #666666;">
					<view v-for="(item, index) in tableData" class="tableList" :key="index">
						<view class="td" style="width: 145rpx;">{{item.a}}</view>
						<view class="td" style="width: 145rpx;">{{item.b}}</view>
						<view class="td" style="width: 250rpx;">{{item.c}}</view>
						<view class="td" style="width: 180rpx;">{{item.d}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="seeMore">
				<text>查看更多</text>
			</view>
		</view>
		<view v-if="select=='R'" class="rightData">
			<text>right</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: 'ticketDataCenter',
				select: 'L',
				tableData: [
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'},
					{a:'1', b:'2', c:'3', d:'4'}
				]
			}
		},
		methods: {
			selectNav(nav) {
				this.select = nav
			}
		}
	}
</script>

<style lang="scss" scoped>
.navBox {
	width: 100%;
	height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	.navItem{
		width: 50%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 16px;
	}
}
.leftData{
	width: 100%;
	height: 720rpx;
	display: flex;
	flex-direction: column;
	color: #ffffff;
	.leftDataTop{
		display: flex;
		.leftDataTopLeft{
			margin-left: 20rpx;
			margin-top: 10rpx;
			display: flex;
			flex-direction: column;
			font-size: 12px;
			.searchBox{
				display: flex;
				align-items: center;
				input {
					width: 200rpx;
					height: 50rpx;
					border-radius: 25rpx;
					background-color: #eeeeee;
					font-size: 12px;
					text-indent: 4rpx;
					color: #333333;
				}
				.btn{
					width: 80rpx;
					height: 50rpx;
					background-color: #333333;
					color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-left: 10rpx;
					border-radius: 4rpx;
				}
			}
		}
		.leftDataTopRight{
			margin-left: 30rpx;
			margin-top: 10rpx;
			display: flex;
			flex-direction: column;
			font-size: 12px;
		}
		.dataTopLeftItem{
			margin: 6rpx 0;
		}
	}
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
				height: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 1px solid #666666;
			}
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
}
</style>
