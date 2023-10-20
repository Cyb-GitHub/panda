<template>
	<view class="ticket-lottery-recorder">
		<view v-for="(item, index) in myTicketInfo" :key="index" class="ticket-lottery-recorder-details-item">
			<u-row class="ticket-lottery-recorder-rol" gutter="3">
				<u-col class="ticket-lottery-recorder-col" span="7">
					<view class="ticket-lottery-recorder-basic-info">
						<view class="ticket-lottery-recorder-txt">
							{{`${item.drawTime.toString().slice(0, 10)}`}}
						</view>
						<view class="ticket-lottery-recorder-txt">
							{{`${item.rafflePhase} ${$t('ticket.time')}`}}
						</view>
					</view>
					<view class="ticket-num-cycle-group">
						<view v-for="(num, numIndex) in item.raffleNumber" :key="num" :class="getClass(item, num)">
							{{num}}
						</view>
					</view>
				</u-col>
				<u-col class="ticket-lottery-recorder-col" span="2">
					<view class="txt">{{getTotalAwardTxt(item)}}</view>
					<view class="txt">{{`${item.multiple}${$t('ticket.group')}`}}</view>
				</u-col>
				<u-col class="ticket-lottery-recorder-col" span="3">
					<image src="@/static/images/1x/bamboo-ticket-1.png" :src="getImageSrc(item.win)" mode="heightFix"
						class="ticket-lottery-recorderc-bamboo"></image>
				</u-col>
			</u-row>
			<view class="ticket-lottery-recorder-ad-info">
				<view class="ticket-lottery-recorder-txt">
					{{`${$t('ticket.submitTime')}: ${item.payTime}`}}
				</view>
			</view>
		</view>
		<u-empty v-if="!myTicketInfo.length" :text="$t('noMoreData')"></u-empty>
	</view>
</template>

<script>
	import _ from 'lodash';
	export default {
		data() {
			return {
				myTicketInfo: [
				],
				sortFunc: function(a,b){
				  return a-b;
			    }
			}
		},
		mounted() {
			this.queryRaffleRecordPaged()
		},
		methods: {
			getTotalAwardTxt(item) {
				if (item.totalRewardBambooCount) {
					return item.totalRewardBambooCount
				} else if (item.win) {
					return this.$t('vote.toBeOpen');
				} else {
					return 0;
				}
			},
			queryRaffleRecordPaged() {
				this.$u.api.raffleBusinessApis.queryRaffleRecordPaged({
					accountId: this.vuex_userInfo.id,
					raffleStatusList: [2],
					raffleActivityStatus: 2,
					page: 1,
					pageSize: 100,
				}).then(res => {
					if (res.code === 0) {
						this.myTicketInfo = res.data.list
						this.myTicketInfo.forEach(m => {
							m.raffleNumber.sort(this.sortFunc);
						})
					}
				})
			},
			getImageSrc(type) {
				if (type) {
					return '/static/images/1x/bamboo-ticket-1.png';
				} else {
					return '/static/images/1x/bamboo-ticket-0.png';
				}
			},
			getClass(item, num) {
				console.log('item, ', item, num, item.winningNumber);
				console.log(item.winningNumber.includes(num))
				if (item.winningNumber.includes(num)) {
					return {
						'ticket-num-cycle': true,
					};
				} else {
					return {
						'ticket-num-cycle': true,
						'ticket-num-cycle-fail': true,
					};
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ticket-lottery-recorder {
		color: white;
	}

	.ticket-lottery-recorder-details-item {
		align-items: center;
		justify-content: center;
		height: 100px;
		border-bottom: 1px black solid;
	}

	.ticket-lottery-recorder-rol {
		padding: 0px 0px 0px 10px;
	}

	.ticket-lottery-recorder-col {

		padding: 5px 2px !important;

		.txt {
			color: white;
			padding: 2px 5px;
		}
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
	
	.ticket-num-cycle-fail {
		background-color: gray;
	}

	.ticket-lottery-recorderc-bamboo {
		width: 50px;
		height: 50px;
	}

	.ticket-num-cycle-group {
		display: flex;
		padding: 0px 5px;
	}

	.ticket-lottery-recorder-basic-info {
		display: flex;
	}

	.ticket-lottery-recorder-txt {
		padding: 0px 5px;
	}

	.ticket-lottery-recorder-ad-info {
		padding: 5px 5px;
	}
</style>
