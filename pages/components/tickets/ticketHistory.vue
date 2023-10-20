<template>
	<view class="history-ticket">
		<view class="history-ticket-my" >
			<view class="history-ticket-my-head">
				<view class="history-ticket-my-head-left">
					{{$t('ticket.myNum')}}
				</view>
				<view class="history-ticket-my-head-right">
					<view v-if="myTicketInfo.length">
						<u-swipe-action class="history-ticket-my-head-right-swiper" @left="swiperLeft"
							@right="swiperRight" :options="options">
							<view class="title-wrap" v-if="myTicketInfo[getIntemIndex]">
								<text class="title u-line-2">{{ `${getIntemIndex + 1}${$t('ticket.group')}` }}</text>
								<view v-for="(num, numIndex) in myTicketInfo[getIntemIndex].raffleNumber"
									:key="numIndex" class="ticket-num-cycle">
									{{num}}
								</view>
								<text class="right-txt u-line-2">{{ `${myTicketInfo[getIntemIndex].multiple}${$t('ticket.mul')}` }}</text>
							</view>
							<view class="title-wrap" v-if="myTicketInfo[getIntemIndex1]">
								<text class="title u-line-2">{{ `${getIntemIndex1 + 1}${$t('ticket.group')}` }}</text>
								<view v-for="(num, numIndex) in myTicketInfo[getIntemIndex1].raffleNumber"
									:key="numIndex" class="ticket-num-cycle">
									{{num}}
								</view>
								<text class="right-txt u-line-2">{{ `${myTicketInfo[getIntemIndex1].multiple}${$t('ticket.mul')}` }}</text>
							</view>
						</u-swipe-action>
						<view class="history-ticket-my-head-right-swiper-bot">
							<view class="history-ticket-my-head-right-swiper-point" v-for="(page, index) in getPageNum"
								@click="clickSwiperPoint(index)" :class="{'hight-light': currentSwiperIndex === index}"
								:key="'point' +index">
							</view>
						</view>
					</view>
					<u-empty v-if="myTicketInfo.length == 0" :text="$t('noMoreData')"></u-empty>
				</view>
			</view>
			<view class="history-ticket-my-info">
				<!--<view v-if="countdown.day && countdown.hour">
				<view class="history-ticket-my-info-lottery-time">
					{{`${$t('ticket.lotteryTime')}:`}}
				</view>
				<view class="history-ticket-my-info-lottery-time hight-light">
					<span>
					{{`${countdown.day}${$t('date.day')}${countdown.hour}${$t('date.hour')}`}}
					</span>
				</view>
				</view>-->
				<view style="display: inline;">
					<span class="history-ticket-my-head-left-swiper-info">{{getDrawInofo}}</span>
					<span class="history-ticket-my-head-right-swiper-info" @click="clickShowAll">{{$t('ticket.showAll')}}</span>
				</view>
			</view>
		</view>
		<view class="history-ticket-recorders">
			<scroll-view scroll-y @scrolltolower="handle" style="height: 230px;" class="history-ticket-recorders-details" >
				<view v-for="(item, index) in lotteryRecords" :key="index"
					class="history-ticket-recorders-details-item">
					<u-row class="history-ticket-recorders-rol" gutter="3">
						<u-col class="history-ticket-recorders-col" span="6">
							<view v-for="(num, numIndex) in item.winningNumber" :key="numIndex" class="ticket-num-cycle">
								{{num}}
							</view>
						</u-col>
						<u-col class="history-ticket-recorders-col" span="2">
							<span class="txt">{{`${item.rafflePhase}${$t('ticket.time')}`}}</span>
						</u-col>
						<u-col class="history-ticket-recorders-col" span="4">
							<span class="txt">{{item.drawTime.substring(0, 10)}}</span>
						</u-col>
					</u-row>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import _ from 'lodash';
	import moment from "moment";

	export default {
		data() {
			return {
				myTicketInfo: [],
				currentLotteryInfo: {},
				nextlotteryDate: '2023-05-23 00:00:00',
				lotteryRecords: [
				],
				options: [],
				currentSwiperIndex: 0,
				pageNum: 0,
				pageSize: 2,
				loadStatus: 'nomore',
				historyPageSize: 6,
				maxHistoryPageSize: 66,
			}
		},
		computed: {
			getPageNum() {
				return Math.ceil(this.myTicketInfo.length / this.pageSize);
			},
			getIntemIndex() {
				return this.pageSize * this.currentSwiperIndex;
			},
			getIntemIndex1() {
				return this.pageSize * this.currentSwiperIndex + 1;
			},
			countdown() {
				const now = Date.now();
				const target = Date.parse(this.currentLotteryInfo['drawTime']);
				if (target < now) {
					return {
					};
				}
				const remaining = target - now;
				const days = Math.floor(remaining / 86400000);
				const hours = Math.floor((remaining % 86400000) / 3600000);
				console.log(days, hours)
				return {
					'day': days,
					'hour': hours
				};
			},
			getDrawInofo() {
				if (_.isEmpty(this.currentLotteryInfo)) {
					return "";
				} else {
					const drawTime = moment(this.currentLotteryInfo.drawTime, "YYYY-MM-DD HH:mm:ss");
					if (drawTime.isBefore(new Date())) {
						return this.$t('ticket.beforeDrawTime', {
							n: this.currentLotteryInfo.rafflePhase,
						})
					} else {
						const now = new moment();
						const duration = moment.duration(drawTime.diff(now))
						return this.$t('ticket.afterDrawTime', {
							n: this.currentLotteryInfo.rafflePhase,
							day: duration.days(),
							hour: duration.hours(),
							minute: duration.minutes(),
						})
					}
				}
			}
		},
		mounted() {
			this.queryRaffleRecordPaged()
			this.getCurrentTimeInfo()
			this.getHistoryTimeInfo()			
		},
		methods: {
			//上拉加载更多
			handle(){
				this.historyPageSize = this.historyPageSize + 30
				if (this.historyPageSize <= this.maxHistoryPageSize) {
					this.queryRaffleActivityPaged(2, this.historyPageSize)
				} else {
					this.$util.showToast(this.$t('ticket.noMoreRecorder'))
				}
			},
			getCurrentTimeInfo() {
				this.queryRaffleActivityPaged(1, 6)
			},
			getHistoryTimeInfo() {
				this.queryRaffleActivityPaged(2, 6)
			},
			queryRaffleActivityPaged(status, pagesSize) {
				this.$u.api.raffleBusinessApis.queryRaffleActivityPaged({
					raffleActivityStatus: status,
					page: 1,
					pageSize: pagesSize,
				}).then(res =>{
					if (res.code === 0) {
						if (status === 1) {
							this.currentLotteryInfo = res.data.list[0]
						} else if (status === 2) {
							this.lotteryRecords = res.data.list
						}
					}					
				})
			},
			queryRaffleRecordPaged() {
				this.$u.api.raffleBusinessApis.queryRaffleRecordPaged({
					accountId: this.vuex_userInfo.id,
					raffleStatusList: [2],
					raffleActivityStatus: 1,
					page: 1,
					pageSize: 100,
				}).then(res => {
					if (res.code === 0) {
						this.myTicketInfo = res.data.list
						console.log(this.myTicketInfo)
					}
				})
			},
			swiperLeft() {
				if (this.currentSwiperIndex > 0)
					this.currentSwiperIndex = this.currentSwiperIndex - 1;
			},
			swiperRight() {
				if (this.currentSwiperIndex < this.getPageNum - 1)
					setTimeout(() => {
						this.currentSwiperIndex = this.currentSwiperIndex + 1;
					}, 300)

			},
			clickSwiperPoint(index) {
				this.currentSwiperIndex = index;
			},
			clickShowAll() {
				setTimeout(() => {
					this.$emit('updateChildEvent', 'allTicketRecords');
				}, 300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.history-ticket-my {
		height: 150px;
		width: 100%;
		color: white;
		border-bottom: 1px black solid;
	}

	.history-ticket-my-head {
		height: 120px;
		width: 100%;
		display: flex;

		/deep/ .u-swipe-action {
			background-color: transparent !important;
		}

		/deep/ .title-wrap {
			display: flex;
		}
	}

	.history-ticket-my-head-left {
		min-width: 100px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.history-ticket-my-head-right {
		align-items: center;
		display: flex;

		/deep/ uni-view.title-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10px 2px;
		}
	}

	.history-ticket-my-head-right-swiper {
		background-color: transparent !important;
		min-width: 300px;
		// display: inline-flex;
		// justify-content: center;
		// align-items: center;
	}

	.ticket-num-cycle {
		width: 24px;
		height: 24px;
		border-radius: 12px;
		margin-left: 10px;
		background-color: #87c721;
		color: white;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.5);
	}

	.history-ticket-my-head-right-swiper-point {
		background-color: white;
		margin-left: 6px;
		border-radius: 3px;
		height: 6px;
		width: 6px;

		&.hight-light {
			background-color: #a8ff00;
			border-radius: 5px;
			height: 10px;
			width: 10px;
		}
	}

	uni-view.history-ticket-my-head-right-swiper-bot {
		width: 300px;
		align-items: center;
		justify-content: center;
		display: flex;
	}

	.history-ticket-my-head-right-swiper-info {
		position: absolute;
		right: 10px;
	}
	.history-ticket-my-head-left-swiper-info {
		margin-left: 10px;
		width: 80%;
	}

	.history-ticket-recorders-details-item {
		align-items: center;
		justify-content: center;
		height: 40px;
		border-bottom: 1px black solid;
	}
	.history-ticket-recorders-details {
		::-webkit-scrollbar {
			display: flex !important;  
			width: 5px !important;  
			// height: 2px !important; 
			background: rgba(180, 180, 180, 0.1) !important;  
		}
		::-webkit-scrollbar-thumb {
		    border-radius: 10px;
		    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.8)!important;
		    border-radius: 10px;
		    background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.86,rgb(60,60,60)),color-stop(0.72,rgb(187,187, 187)),color-stop(0.86,rgb(60,60,60))) !important;
		    transition: 0.3s ease-in-out !important;
		}
	}

	.history-ticket-recorders-rol {
		padding: 0px 0px 0px 10px;
	}
	.right-txt {
		margin-left: 5px;
	}

	.history-ticket-recorders-col {
		display: flex;
		padding: 5px 2px !important;

		.txt {
			color: white;
			padding: 2px 5px;
		}
	}

	.history-ticket-my-info {
		display: flex;
	}

	.history-ticket-my-info-lottery-time {
		margin-left: 10px;

		&.hight-light {
			color: #a8ff00;
		}
	}
</style>
