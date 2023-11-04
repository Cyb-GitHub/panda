<template>
	<view class="ticket-num-info">
		<view class="ticket-num-info-head">
		</view>
		<view class="ticket-num-info-group">
			<view v-for="(item, index) of ticketsNumGroups" :key="index" class="ticket-num-info-group-item">
				<span class="ticket-num-txt">
					{{`${item.type ? $t('ticket.random') : $t('ticket.selfSelect')}${index + 1}`}}
				</span>
				<view v-for="(num, numIndex) of item.raffleNumber" :key="numIndex" class="ticket-num-cycle">
					{{num}}
				</view>
				<view class="ticket-num-buttons">
					<button class="button" @click="removeGroup(index)">
						{{$t('ticket.delete')}}
					</button>
					<u-input class="ticket-num-input" type="number" :maxlength="3" :clearable="false" placeholder=""
						v-model="item.multiple">
						<template slot="prefix">
							<view class="fix" @click="decNum(index)">-</view>
						</template>
						<template slot="suffix">
							<view class="fix" @click="IncNum(index)">+</view>
						</template>
					</u-input>
				</view>
			</view>
			<u-empty v-if="!ticketsNumGroups.length" :text="$t('noMoreData')"></u-empty>
		</view>
		<view class="ticket-num-info-opt">
			<u-row class="my-account-opt" gutter="24">
				<u-col span="4">
					<button class="button" @click="showLotteryRules('rule')">
						{{$t('ticket.lotteryRules')}}
					</button>
				</u-col>
				<u-col span="4">
					<button class="button" @click="showLotteryRules('add')">
						{{$t('ticket.addSelect')}}
					</button>
				</u-col>
				<u-col span="4">
					<button class="button opt" :disabled="getTotalRaffleTickets() === 0" @click="payRaffleRecord">
						{{`${$t('ticket.payTickets')}(${getTotalRaffleTickets()})`}}
					</button>
				</u-col>
			</u-row>
		</view>
		<detailPopup :visiable="showLotteryRulesPopup" @close="handleDetailClose">
			<template slot="title">
				{{$t('ticket.lotteryRules')}}
			</template>
			<template slot="content">
				<view class="lotteryRulesBox">
					<text class="lotteryRulesItem">{{$t('ticket.lotteryRulesTitle', { 'n': 537})}}</text>
					<text class="lotteryRulesItem">{{$t('ticket.lotteryRulesItem1')}}</text>
					<text class="lotteryRulesItem">{{$t('ticket.lotteryRulesItem2')}}</text>
					<view class="lotteryRulesRule">
						<text>{{$t('ticket.lotteryRulesItem3')}}</text>
						<text>{{$t('ticket.lotteryRulesItem4')}}</text>
						<text>{{$t('ticket.lotteryRulesItem5')}}</text>
						<text>{{$t('ticket.lotteryRulesItem6')}}</text>
					</view>
				</view>
			</template>
		</detailPopup>
	</view>
</template>

<script>
	import detailPopup from '@/pages/components/popup/detailPopup.vue';
	export default {
		components: {
			detailPopup,
		},
		data() {
			return {
				ticketsNumGroups: [],
				maxTicketNum: 999,
				maxGroup: 6,
				showLotteryRulesPopup: false,
				isAddRules: false,
				showAddRules: true,
				noTip: false
			}
		},
		computed: {},
		mounted() {
			// this.ticketsNumGroups = this.vuex_ticket_group;
			this.queryRaffleRecordPaged()
		},
		methods: {
			payRaffleRecord() {
				this.$u.api.raffleBusinessApis.payRaffleRecord({
					accountId: this.vuex_userInfo.id,
					totalRaffleTickets: this.getTotalRaffleTickets(),
					payRaffleInfo: this.ticketsNumGroups,
				}).then(res => {
					if (res.code === 0) {
						this.$util.showToastSuc(this.$t('ticket.paySuc'), () => {
							uni.reLaunch({
								url: "/pages/index/index"
							})
						})
					}
				})
			},
			getTotalRaffleTickets() {
				return this.ticketsNumGroups.reduce((acc, curr) => 
					Number.parseInt(acc) + (curr.multiple ? Number.parseInt(curr.multiple) : 0), 0);
			},
			queryRaffleRecordPaged() {
				this.$u.api.raffleBusinessApis.queryRaffleRecordPaged({
					accountId: this.vuex_userInfo.id,
					raffleStatusList: [1],
					// raffleActivityStatus: 1,
					page: 1,
					pageSize: 100,
				}).then(res => {
					if (res.code === 0) {
						this.ticketsNumGroups = res.data.list
					}
				})
			},
			decNum(index) {
				if (this.ticketsNumGroups[index].multiple > 1)
					this.ticketsNumGroups[index].multiple = Number.parseInt(this.ticketsNumGroups[index].multiple) - 1;
			},
			IncNum(index) {
				if (this.ticketsNumGroups[index].multiple < this.maxTicketNum)
					this.ticketsNumGroups[index].multiple = Number.parseInt(this.ticketsNumGroups[index].multiple) + 1;
			},
			async removeGroup(index) {
				const g = this.ticketsNumGroups[index];
				await this.$u.api.raffleBusinessApis.deleteRaffleRecord({
					id: g.id,
				});
				this.ticketsNumGroups.splice(index, 1);
				this.$util.showToast(this.$t('ticket.deleteInfo'))
			},
			continueAdd() {
				if (this.ticketsNumGroups.length >= this.maxGroup) {
					this.$util.showToast(this.$t('ticket.maxGroup'))
					return;
				}
				setTimeout(() => {
					this.$emit('updateChildEvent', 'ticketsNumSelector');
				}, 300)
			},
			showLotteryRules(type='add') {
				// 可参考 /pages/components/share/shareIndex.vue
				console.log('抽奖规则')
				if (type==='add') {
					if (this.showAddRules) {
						this.isAddRules = true
						this.showLotteryRulesPopup = true
					} else {
						this.continueAdd()
					}
				} else {
					this.showLotteryRulesPopup = true
				}
				
			},
			handleDetailClose() {
				this.showLotteryRulesPopup = false;
				if (this.isAddRules) {
					this.continueAdd()
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.ticket-num-info-group {
		min-height: 330px;
	}

	.ticket-num-info-head {
		height: 20px;
		// border-bottom: 1px black solid;
	}

	.ticket-num-info-group-item {
		display: flex;
		font-size: 16px;
		font-weight: bold;
		height: 50px;
		align-items: center;
		display: flex;
		border-bottom: 1px black solid;
	}

	.ticket-num-txt {
		padding: 0px 0px 0px 10px;
		color: white;
		width: 50px;

	}

	.ticket-num-cycle {
		width: 24px;
		height: 24px;
		border-radius: 12px;
		margin-left: 8px;
		background-color: #87c721;
		color: white;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.5);
	}

	.ticket-num-buttons {
		padding: 0px 0px 0px 10px;
		display: flex;
	}

	.button {
		max-width: 130px;
		width: 100px;
		height: 35px;
		border-radius: 5px;
		background: url("@/static/images/1x/button-mid.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: white;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;

		&.opt {
			width: 115px;
		}
	}

	.ticket-num-input {
		width: 60px;
		height: 35px;
		border-radius: 5px;
		margin-left: 25px;
		background: url("@/static/images/1x/button-mid.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: white;
	
	/deep/ .u-input__input {
			color: white;
		}
	}

	.fix {
		padding: 0px 2px;
	}

	.ticket-num-info-opt {
		width: 100%;
		margin-top: 10px;
		background-color: #a0a0a0;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 2p
	}
	.lotteryRulesBox{
		display: flex;
		flex-direction: column;
		font-size: 12px;
		color: #EEEEEE;
		.lotteryRulesItem{
			margin-bottom: 10px;
		}
		.lotteryRulesRule{
			display: flex;
			flex-direction: column;
		}
	}
</style>
