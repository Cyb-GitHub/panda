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
						<input v-model="ruleForm.accountName" type="text" placeholder="请输入昵称">
						<view class="btn" @click="searchFn">
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
			<data-center-table :tableData="nowData" height="400rpx" @getMore="nowTableGetMore"></data-center-table>
		</view>
		<view v-if="select=='R'" class="rightData">
			<!-- 历史数据-期数列表 -->
			<view v-if="hdTableType == 1" class="hdTable1">
				<view class="tableRow" v-for="(item, index) in lotteryRecords" :key="index">
					<view class="tableRowL">
						<text class="date">{{item.drawTime.substring(0, 10)}}</text>
						<text class="num">第{{item.rafflePhase}}期</text>
					</view>
					<view class="tableRowR" @click="getTabDetail(item)">
						<text style="margin-top: -8rpx;">+</text>
					</view>
				</view>
			</view>
			
			<!-- 历史数据 - 期数详情 -->
			<view v-if="hdTableType == 2" class="hdTable2Box">
				<view class="hdTable2Top">
					<view class="hdTable2TopL">
						<text class="goTable1" @click="hdTableType = 1"></text>
					</view>
					<view class="hdTable2TopR">
						<text>期数：第{{lotteryDetail.rafflePhase}}期</text>
						<text>开奖号码：{{ changeNum(lotteryDetail.winningNumber) }}</text>
					</view>
				</view>
				<view class="hdTable2">
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>支付抽奖券</text>
								<text>总数量</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.raffleTicketCount}}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>1等奖</text>
								<text>奖励总数</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize1}}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text>2等奖</text>
								<text>奖励总数</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize2}}</text>
							</view>
						</view>
					</view>
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>3等奖</text>
								<text>奖励总数</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize3}}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>4等奖</text>
								<text>奖励总数</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize4}}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text>本期余额</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.assignableBambooCount }}</text>
							</view>
						</view>
					</view>
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>上期余额</text>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.lastAssignableBambooCount}}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>兑换LPG的</text>
								<text>竹子数量</text>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.lpgBambooCount}}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text>共建奖励等</text>
								<text>支付数量</text>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.activityBambooCount}}</text>
							</view>
						</view>
					</view>
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>总余额</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.remainingSumAssignableBambooCount }}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>获得共建奖励的</text>
								<text>LPG数量</text>
								<view class="sanjiao" @click="getPointDetail('A')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.cooperateActivityBambooCount }}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text></text>
							</view>
							<view class="table-col-bot">
								<text></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 历史数据 - 期数详情 - 数值详情 -->
			<view  v-if="hdTableType == 3" class="hdTable3Box">
				<view class="hdTable3Top">
					<view class="hdTable3TopL">
						<text class="goTable2" @click="hdTableType = 2"></text>
					</view>
					<view class="hdTable3TopR">
						<text>期数：第20期</text>
						<text>开奖号码：01.02.03.04.05</text>
					</view>
				</view>
				<data-center-table :tableData="nowData" height="400rpx" @getMore="nowTableGetMore"></data-center-table>
			</view>
		</view>
	</view>
</template>

<script>
	import dataCenterTable from '../tickets/dataCenterTable.vue'
	export default {
		components: {
			dataCenterTable
		},
		data() {
			return {
				name: 'ticketDataCenter',
				select: 'L',
				hdTableType: 1,
				lotteryRecords: [
				],
				lotteryDetail: {},
				currentLotteryInfo: {},
				nowData: [],
				ruleForm: {
				  accountId: null,
				  accountName: null,
				  enumRaffleActivityStatus: "TO_BE_DRAWN",
				  enumRaffleStatusList: [
					"TO_BE_PAID"
				  ],
				  page: 1,
				  pageSize: 30,
				  raffleActivityStatus: 0,
				  raffleNumber: null,
				  raffleStatusList: [
					0
				  ]
				}
			}
		},
		created() {
			this.queryRaffleActivityPaged(1, 30)
			this.queryRaffleActivityPaged(2, 30)
			this.queryRaffleDcRecordPaged()
		},
		methods: {
			getTabDetail(i) {
				this.queryRaffleActivityDetail(2, i.id)
				this.hdTableType = 2
			},
			getPointDetail(type) {
				console.log('--当期数值详情--', type)
				this.hdTableType = 3
			},
			nowTableGetMore(bol) {
				this.ruleForm.page ++
				this.queryRaffleDcRecordPaged(true)
			},
			searchFn() {
				this.ruleForm.page = 1
				this.queryRaffleDcRecordPaged()
			},
			selectNav(nav) {
				this.select = nav
			},
			changeNum(str) {
				if (str) {
					let strs = str + ''
					let arr = strs.split('-')
					for (let i=0; i<arr.length; i++) {
						if (arr[i] < 10) {
							arr[i] = '0' + arr[i]
						}
					}
					return arr.join('.')
				} else {
					return str
				}
			},
			queryRaffleActivityPaged(status, pagesSize) {
				this.$u.api.raffleBusinessApis.queryRaffleActivityPaged({
					raffleActivityStatus: status,
					page: 1,
					pageSize: pagesSize,
				}).then(res =>{
					if (res.code === 0) {
						if (status === 1) {
							let id = res.data.list[0].id
							this.queryRaffleActivityDetail(1, id) 
						} else if (status === 2) {
							this.lotteryRecords = res.data.list
						}
					}					
				})
			},
			queryRaffleActivityDetail(status, id) {
				this.$u.api.raffleBusinessApis.queryRaffleActivityDetail({
					raffleRecordId: id
				}).then(res =>{
					if (res.code === 0) {
						if (status === 1) {
							this.currentLotteryInfo = res.data
						} else if (status === 2) {
							this.lotteryDetail = res.data
						}
					}					
				})
			},
			queryRaffleDcRecordPaged(more = false) {
				this.$u.api.raffleBusinessApis.queryRaffleDcRecordPaged({
					accountId: this.ruleForm.accountId,
					accountName: this.ruleForm.accountName,
					enumRaffleActivityStatus: this.ruleForm.enumRaffleActivityStatus,
					enumRaffleStatusList: this.ruleForm.enumRaffleStatusList,
					raffleNumber: this.ruleForm.raffleNumber,
					// raffleStatusList: [2],
					// raffleActivityStatus: 1,
					page: this.ruleForm.page,
					pageSize: this.ruleForm.pageSize,
				}).then(res => {
					if (res.code === 0) {
						let list = res.data.list
						for(let i=0; i<list.length; i++) {
							list[i].raffleNumberStr = list[i].raffleNumber.join(',')
						}
						console.log('列表---', list)
						if (more) {
							this.nowData = this.nowData.concat(list)
						} else {
							this.nowData = list
						}
					}
				})
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
}
.rightData{
	width: 100%;
	height: 720rpx;
	display: flex;
	flex-direction: column;
	color: #ffffff;
	padding: 32rpx 0;
	.hdTable1{
		width: 718rpx;
		height: 100%;
		margin-left: 16rpx;
		overflow-y: scroll;
		border-top: 2rpx solid #666666;
		.tableRow{
			width: 100%;
			height: 80rpx;
			border-left: 2rpx solid #666666;
			border-right: 2rpx solid #666666;
			border-bottom: 2rpx solid #666666;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.tableRowL{
				width: 400rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				color: #ffffff;
				.date{
					width: 200rpx;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
				}
				.num{
					width: 200rpx;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
				}
			}
			.tableRowR{
				width: 48rpx;
				height: 48rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
				font-size: 28rpx;
				margin-right: 24rpx;
				background-color: #333333;
			}
		}
	}
	.hdTable2Box{
		width: 750rpx;
		height: 100%;
		.hdTable2Top{
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			.hdTable2TopL{
				width: 60rpx;
				height: 120rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 30rpx;
				.goTable1{
					width: 48rpx;
					height: 60rpx;
					background-color: #666666;
					clip-path: polygon(100% 0, 30% 50%, 100% 100%);
				}
			}
			.hdTable2TopR{
				height: 120rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				color: #FFFFFF;
				font-size: 14px;
			}
		}
		.hdTable2{
			width: 718rpx;
			height: calc(100% - 130rpx);
			margin-top: 10rpx;
			margin-left: 16rpx;
			border-top: 2rpx solid #666666;
			border-left: 2rpx solid #666666;
			border-right: 2rpx solid #666666;
			display: flex;
			flex-direction: column;
			.table-row{
				width: 100%;
				height: 25%;
				display: flex;
				.table-col-min{
					border-left: 2rpx solid #666666;
					border-right: 2rpx solid #666666;
				}
				.table-col{
					display: flex;
					flex-direction: column;
					border-bottom: 2rpx solid #666666;
					width: 33.33%;
					.table-col-top{
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 100%;
						height: 60%;
						font-size: 14px;
						border-bottom: 2rpx solid #666666;
						position: relative;
						.sanjiao{
							position: absolute;
							right: 0;
							bottom: 0;
							width: 36rpx;
							height: 36rpx;
							background-color: limegreen;
							clip-path: polygon(100% 0,0 100%,100% 100%);
						}
					}
					.table-col-bot{
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						height: 40%;
					}
				}
			}
		}
	}
	.hdTable3Box{
		width: 100%;
		height: 100%;
		.hdTable3Top{
			width: 100%;
			height: 160rpx;
			background-color: papayawhip;
			display: flex;
			align-items: center;
			.hdTable3TopL{
				width: 60rpx;
				height: 120rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 30rpx;
				.goTable2{
					width: 48rpx;
					height: 60rpx;
					background-color: #666666;
					clip-path: polygon(100% 0, 30% 50%, 100% 100%);
				}
			}
			.hdTable3TopR{
				height: 120rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				color: #FFFFFF;
				font-size: 14px;
			}
		}
	}
}
</style>
