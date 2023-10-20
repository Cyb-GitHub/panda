<template>
	<view class="all-ticket">
		<view class="all-ticket-my">
			<view class="all-ticket-my-info">
				<view class="all-ticket-my-info-lottery-time">
					{{`${currentLotteryInfo.drawTime}`}}
				</view>
				<view class="all-ticket-my-info-lottery-time">
					{{`${currentLotteryInfo.rafflePhase} ${$t('ticket.time')}`}}
				</view>
				<view class="all-ticket-my-info-back" @click="back">
					{{$t('back')}}
				</view>
			</view>
		</view>
		<scroll-view class="all-ticket-info" :scroll-y="true" :show-scrollbar="true">
			<view v-for="(item, index) in tickets" :key="index" class="all-ticket-info-details-item">
				<u-row class="all-ticket-info-rol" gutter="3">
					<u-col class="all-ticket-info-col" span="6">
						<view v-for="(num, numIndex) of item.raffleNumber" :key="numIndex" class="ticket-num-cycle">
							{{num}}
						</view>
					</u-col>
					<u-col class="all-ticket-info-col" span="6">
						<span class="txt mini">{{item.payTime}}</span>
						<span class="txt">{{`${item.multiple}${$t('ticket.mul')}`}}</span>
					</u-col>
				</u-row>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tickets: [],
				currentLotteryInfo: {
					drawTime: '2023-05-26',
					rafflePhase: 131,
				},
			}
		},
		props: {
			
		},
		mounted() {
			this.queryRaffleRecordPaged()
			this.queryRaffleActivityPaged()
		},
		methods: {
			queryRaffleActivityPaged() {
				this.$u.api.raffleBusinessApis.queryRaffleActivityPaged({
					raffleActivityStatus: 1,
					page: 1,
					pageSize: 6,
				}).then(res =>{
					if (res.code === 0) {
						this.currentLotteryInfo = res.data.list[0]
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
						this.tickets = res.data.list
						console.log(this.tickets)
					}
				}).catch(e => {
					
				})
			},
			back() {
				setTimeout(() => {
					this.$emit('updateChildEvent', undefined);
				}, 300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all-ticket-my {
		height: 50px;
		width: 100%;
		color: white;
		display: inline-flex;
		align-items: center;
		border-bottom: 1px black solid;
	}

	.all-ticket-my-head {
		height: 120px;
		width: 100%;
		display: flex;
	}

	.all-ticket-my-head-left {
		min-width: 100px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.all-ticket-my-info {
		display: inline-flex;
		justify-content: center;
		align-items: center;

	}

	.all-ticket-my-info-lottery-time {
		padding: 0px 5px;
	}
	
	.all-ticket-info {
		height: 350px;
		overflow-y: scroll;
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

	.all-ticket-info-details-item {
		align-items: center;
		justify-content: center;
		height: 50px;
		border-bottom: 1px black solid;
	}

	.all-ticket-info-rol {
		padding: 5px 0px 5px 10px;
	}

	.all-ticket-info-col {
		display: flex;
		padding: 5px 2px !important;

		.txt {
			color: white;
			padding: 2px 5px;
			& .mini {
				font-size: 6px;
			}
		}
	}

	.ticket-num-cycle {
		width: 20px;
		height: 20px;
		border-radius: 10px;
		margin-left: 8px;
		background-color: #87c721;
		color: white;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.5);
	}

	.all-ticket-my-info-back {
		position: absolute;
		right: 10px;
	}
</style>
