<template>
	<view>
		<view class="navBox">
			<view class="navItem" :style="{'backgroundColor' : select=='L'?'':'#333333'}" @click="selectNav('L')">
				<text>{{$t('ticketDataCenter.text1')}}</text>
			</view>
			<view class="navItem" :style="{'backgroundColor' : select=='R'?'':'#333333'}" @click="selectNav('R')">
				<text>{{$t('ticketDataCenter.text2')}}</text>
			</view>
		</view>
		<view v-if="select=='L'" class="leftData">
			<view class="leftDataTop">
				<view class="leftDataTopLeft">
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text3',{n: queryTotalData.currentRafflePhase })}}</text>
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text4',{n: queryTotalData.currentRaffleCount })}}</text>
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text5',{n: queryTotalData.currentRafflePayCount })}}</text>
					<view class="searchBox">
						<input v-model="ruleForm.accountName" type="text" :placeholder="$t('ticketDataCenter.text6')">
						<view class="btn" @click="searchFn">
							<text>{{$t('ticketDataCenter.text7')}}</text>
						</view>
					</view>
				</view>
				<view class="leftDataTopRight">
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text8',{n: queryTotalData.currentRaffleRewardCount })}}</text>
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text9',{n: queryTotalData.currentRaffleRewardLpgCount })}}</text>
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text10',{n: queryTotalData.currentRaffleRewardX2LpgCount })}}</text>
					<text class="dataTopLeftItem">{{$t('ticketDataCenter.text11',{n: queryTotalData.currentRaffleRewardX3LpgCount })}}</text>
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
						<text class="num">{{$t('ticketDataCenter.text3',{n: item.rafflePhase})}}</text>
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
						<text>{{$t('ticketDataCenter.text12',{n: lotteryDetail.rafflePhase})}}</text>
						<text>{{$t('ticketDataCenter.text13',{n: changeNum(lotteryDetail.winningNumber)})}}</text>
					</view>
				</view>
				<view class="hdTable2">
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text14')}}</text>
								<text>{{$t('ticketDataCenter.text15')}}</text>
								<view class="sanjiao" @click="getPointDetail('ALL', $t('ticketDataCenter.text16'), lotteryDetail.rafflePhase, lotteryDetail)"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.raffleTicketCount}}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text17')}}</text>
								<text>{{$t('ticketDataCenter.text18')}}</text>
								<view class="sanjiao" @click="getPointDetail('A', $t('ticketDataCenter.text19'), lotteryDetail.prize1, lotteryDetail)"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize1}}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text20')}}</text>
								<text>{{$t('ticketDataCenter.text18')}}</text>
								<view class="sanjiao" @click="getPointDetail('B', $t('ticketDataCenter.text21'), lotteryDetail.prize2, lotteryDetail)"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize2}}</text>
							</view>
						</view>
					</view>
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text22')}}</text>
								<text>{{$t('ticketDataCenter.text18')}}</text>
								<view class="sanjiao" @click="getPointDetail('C', $t('ticketDataCenter.text23'), lotteryDetail.prize3, lotteryDetail)"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize3}}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text24')}}</text>
								<text>{{$t('ticketDataCenter.text18')}}</text>
								<view class="sanjiao" @click="getPointDetail('D', $t('ticketDataCenter.text25'), lotteryDetail.prize4, lotteryDetail)"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.prize4}}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text26')}}</text>
								<view class="sanjiao" @click="getPointDetail('E')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.assignableBambooCount }}</text>
							</view>
						</view>
					</view>
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text27')}}</text>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.lastAssignableBambooCount}}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text28')}}</text>
								<text>{{$t('ticketDataCenter.text29')}}</text>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.lpgBambooCount}}</text>
							</view>
						</view>
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text30')}}</text>
								<text>{{$t('ticketDataCenter.text31')}}</text>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.activityBambooCount}}</text>
							</view>
						</view>
					</view>
					<view class="table-row">
						<view class="table-col">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text32')}}</text>
								<view class="sanjiao" @click="getPointDetail('F')"></view>
							</view>
							<view class="table-col-bot">
								<text>{{lotteryDetail.remainingSumAssignableBambooCount }}</text>
							</view>
						</view>
						<view class="table-col table-col-min">
							<view class="table-col-top">
								<text>{{$t('ticketDataCenter.text33')}}</text>
								<text>{{$t('ticketDataCenter.text34')}}</text>
								<view class="sanjiao" @click="getPointDetail('G')"></view>
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
					<view v-if="!isE || !isF || !isG" class="hdTable3TopR">
						<text>{{hdTable3Title}} <text v-if="showM">:</text> {{hdTable3Value}}</text>
					</view>
					<!-- <view class="allSearchBox">
						<view class="btnGroup">
							<view class="btnItem">
								<text>查昵称</text>
							</view>
							<view class="btnItem">
								<text>查选号</text>
							</view>
						</view>
						<view class="nameSearchBox">
							<input v-model="ruleForm.accountName" type="text" placeholder="请输入昵称">
							<view class="btn" @click="searchFn">
								<text>查询</text>
							</view>
						</view>
						<view class="numSearchBox">
							<input v-model="ruleForm.accountName" type="text" placeholder="请输入昵称">
							<view class="btn" @click="searchFn">
								<text>查询</text>
							</view>
						</view>
					</view> -->
				</view>
				<prize-data-table v-if="isPrizeTable" :tableData="prizeData" height="350rpx" @getMore="prizeTableGetMore"></prize-data-table>
				<data-center-table v-if="isAllTable" :tableData="nowData" height="400rpx" @getMore="nowTableGetMore"></data-center-table>
				<view v-if="isE" class="infoBox">
					<text>{{$t('ticketDataCenter.text35')}}</text>
				</view>
				<view v-if="isF" class="infoBox">
					<text>{{$t('ticketDataCenter.text36')}}</text>
				</view>
				<view v-if="isG" class="infoBox">
					<text>{{$t('ticketDataCenter.text37')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dataCenterTable from '../tickets/dataCenterTable.vue'
	import prizeDataTable from '../tickets/prizeDataTable.vue'
	export default {
		components: {
			dataCenterTable,
			prizeDataTable
		},
		data() {
			return {
				name: 'ticketDataCenter',
				select: 'L',
				hdTableType: 1,
				hdTable3Title: '',
				hdTable3Value: '',
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
				  rafflePhase: null,
				  raffleStatusList: [
					0
				  ]
				},
				isAllTable: false,
				isPrizeTable: false,
				isE: false,
				isF: false,
				isG: false,
				showM: true,
				prizeData: [],
				prizeRuleForm: {
				  page: 1,
				  pageSize: 30,
				  rafflePhase: null,
				  raffleRecordId: null,
				  winLevel: null,
				  rafflePhase: null
				},
				queryTotalData: {
					currentRaffleCount: 0,
					currentRafflePayCount: 0,
					currentRafflePhase: 0,
					currentRaffleRewardCount: 0,
					currentRaffleRewardLpgCount: 0,
					currentRaffleRewardX2LpgCount: 0,
					currentRaffleRewardX3LpgCount: 0
				}
			}
		},
		created() {
			this.queryRaffleActivityPaged(1, 30)
			this.queryRaffleActivityPaged(2, 30)
			this.queryRaffleDcRecordPaged()
			this.raffleDcRecordQueryTotal()
		},
		methods: {
			getTabDetail(i) {
				this.queryRaffleActivityDetail(2, i.id)
				this.hdTableType = 2
				this.prizeRuleForm.rafflePhase = i.rafflePhase
				this.prizeRuleForm.raffleRecordId = i.rafflePhase
			},
			getPointDetail(type = null, title, value = null, data = null) {
				this.prizeData = []
				this.prizeRuleForm.page = 1
				this.hdTable3Title = title
				this.hdTable3Value = value
				this.isAllTable = false
				this.isPrizeTable = false
				this.isE = false
				this.isF = false
				this.isG = false
				this.showM = true
				
				if (type == 'ALL') {
					// 支付抽奖券总数
					this.isAllTable = true
					this.ruleForm.rafflePhase = data.rafflePhase
					this.ruleForm.accountName = null
					this.searchFn()
				} else if (type == 'A') {
					// 1等奖
					this.prizeRuleForm.winLevel = 1
					this.prizeRuleForm.rafflePhase = data.rafflePhase
					this.isPrizeTable = true
					this.queryRaffleDcRecordWin()
				} else if (type == 'B') {
					// 2等奖
					this.prizeRuleForm.winLevel = 2
					this.prizeRuleForm.rafflePhase = data.rafflePhase
					this.isPrizeTable = true
					this.queryRaffleDcRecordWin()
				} else if (type == 'C') {
					// 3等奖
					this.prizeRuleForm.winLevel = 3
					this.prizeRuleForm.rafflePhase = data.rafflePhase
					this.isPrizeTable = true
					this.queryRaffleDcRecordWin()
				} else if (type == 'D') {
					// 4等奖
					this.prizeRuleForm.winLevel = 4
					this.prizeRuleForm.rafflePhase = data.rafflePhase
					this.isPrizeTable = true
					this.queryRaffleDcRecordWin()
				} else if (type == 'E') {
					this.isE = true
					this.showM = false
				} else if (type == 'F') {
					this.isF = true
					this.showM = false
				} else if (type == 'G') {
					this.isG = true
					this.showM = false
				}
				
				this.hdTableType = 3
			},
			nowTableGetMore(bol) {
				this.ruleForm.page ++
				this.queryRaffleDcRecordPaged(true)
			},
			prizeTableGetMore(bol) {
				this.prizeRuleForm.page ++
				this.queryRaffleDcRecordWin(true)
			},
			searchFn() {
				this.ruleForm.page = 1
				this.queryRaffleDcRecordPaged()
			},
			selectNav(nav) {
				this.select = nav
				this.hdTableType = 1
				this.ruleForm.rafflePhase = null
				this.searchFn()
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
			raffleDcRecordQueryTotal() {
				this.$u.api.raffleBusinessApis.raffleDcRecordQueryTotal().then(res =>{
					if (res.code === 0) {
						console.log('-w-w-w-', res)
						this.queryTotalData = res.data
					}					
				})
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
					rafflePhase: this.ruleForm.rafflePhase,
					// raffleStatusList: [2],
					// raffleActivityStatus: 1,
					page: this.ruleForm.page,
					pageSize: this.ruleForm.pageSize,
				}).then(res => {
					if (res.code === 0) {
						let list = res.data.list
						for(let i=0; i<list.length; i++) {
							if (list[i].raffleNumber) {
								list[i].raffleNumberStr = list[i].raffleNumber.join(',')
							}
							// let arr = null
							// if (list[i].raffleNumber && list[i].winningNumber) {
							// 	arr = list[i].winningNumber.filter(item => list[i].raffleNumber.indexOf(item) > 1)
							// }
							// const RaffleList = list[i].raffleNumber
							// let raffleArr = []
							// for (let j=0; j<RaffleList.length; j++) {
							// 	for (let k=0; k<arr.length; k++) {
							// 		if(RaffleList[j] == arr[k]) {
							// 			raffleArr.push({ num: RaffleList[j], isWin: true})
							// 		} else {
							// 			raffleArr.push({ num: RaffleList[j], isWin: false})
							// 		}
							// 	}
							// }
							// list[i].raffleArr = raffleArr
						}
						console.log('列表---', list)
						if (more) {
							this.nowData = this.nowData.concat(list)
						} else {
							this.nowData = list
						}
					}
				})
			},
			queryRaffleDcRecordWin(more = false) {
				this.$u.api.raffleBusinessApis.queryRaffleDcRecordWin({
					winLevel: this.prizeRuleForm.winLevel,
					rafflePhase: this.prizeRuleForm.rafflePhase,
					raffleRecordId: this.prizeRuleForm.raffleRecordId,
					page: this.prizeRuleForm.page,
					pageSize: this.prizeRuleForm.pageSize,
				}).then(res => {
					if (res.code === 0) {
						let list = res.data.list
						for(let i=0; i<list.length; i++) {
							if (list[i].raffleNumber) {
								list[i].raffleNumberStr = list[i].raffleNumber.join(',')
							}
						}
						console.log('详情列表---', list)
						if (more) {
							this.prizeData = this.prizeData.concat(list)
						} else {
							this.prizeData = list
						}
					}
				})
			},
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
				justify-content: center;
				color: #FFFFFF;
				font-size: 14px;
			}
		}
		.infoBox{
			width: 90%;
			height: 60rpx;
			margin-left: 5%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #eeeeee;
		}
	}
}
</style>
