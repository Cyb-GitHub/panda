<template>
	<view>
		<u-grid class="index-content-grid" :col="4">
			<view class="index-content-grid-function">
				<u-grid :col="1" class="index-content-grid-function-grid" v-if="currentTab === 0"
					v-show="functionalShow && functionAreaShow" hover-class="hover-class">
					<u-grid-item class="index-content-grid-function-grid-item" v-for="(grid, index) in functionalItems"
						@click="handleFunctionalGridClick(index, grid)" :index="index" :key="index">
						<text class="grid-text">{{ grid.label }}</text>
						<view
							v-if="grid.unread"
							class="private-message-icons-red-point normal">
							{{grid.unread}}
						</view>
					</u-grid-item>
				</u-grid>
			</view>
			<u-grid-item class="index-content-grid-item" v-for="(grid, index) in gridList"
				:class="{active: currentTab === index, [grid.name]: true}" :key="index"
				@click="handleGridClick(index, grid)">
				<view
					v-if="index === 0 && vuex_whitePaperUnreadNum + vuex_privateMesUnreadNum > 0"
					class="private-message-icons-red-point right">
					{{vuex_whitePaperUnreadNum + vuex_privateMesUnreadNum}}
				</view>
				<image class="index-content-grid-icon" :src="getGridIconSrc(currentTab === index, grid.name)"
					mode="widthFix">
				</image>
				<view class="index-grid-text">{{grid.label}}</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gridList: [{
					name: 'functional',
					label: this.$t('index.functional'),
					prop: [],
					component:[],
					key: ['0']
				}, {
					name: 'ticket',
					label: this.$t('index.ticket'),
					prop: [
						{
						}, {
						}, {
						}, {
							type: 3,
						},
					],
					component:[
						{
							compName: 'ticketsNumInfo',
							child: {ticketsNumSelector: 'ticketsNumSelector'},
						}, {
							compName: 'ticketHistory',
							child: {allTicketRecords: 'allTicketRecords'},
						}, {
							compName: 'ticketLotteryRecorders',
							child: {},
						}, {
							compName: 'accountTransactions',
							child: {},
						},
					],
					key: ['1-0','1-1','1-2','1-3']
				}, {
					name: 'coin',
					label: this.$t('index.coin'),
					prop: [],
					component:[{
							compName: 'coinIndex',
							child: {},
						}],
					key: ['2-0']
				}, {
					name: 'community',
					label: this.$t('index.community'),
					prop: [,],
					component:[{
							compName: 'vote',
							child: {},
						},
						{
							compName: 'voteHistory',
							child: {},
						}],
					key: ['3-0','3-1']
				}],
				functionalItems: [{
					name: ['0-0-0', '0-0-1', '0-0-2','0-0-3','0-0-4'],
					label: this.$t('index.account'),
					component: [
						'myAccount',
						'accountTransactions',
						'accountTransactions',
						'accountTransactions',
						'accountTransactions'
					],
					prop: [{
					},{
						type: 1
					}, {
						type: 4
					}, {
						type: 2
					}, {
						type: 5
					}],
				}, {
					name: ['0-1-0'],
					label: this.$t('index.email'),
					component: ['privateMessage'],
					unread: this.vuex_whitePaperUnreadNum,
					prop: [],
				}, {
					name: ['0-2-0'],
					label: this.$t('index.whitePapers'),
					component: ['whitePaperList'],
					unread: this.vuex_privateMesUnreadNum,
					prop: [],
				}, {
					name: ['0-3-0', '0-3-1', '0-3-2','0-3-3'],
					label: this.$t('index.securityAndSava'),
					prop: [],
					component:[
						'security',
						'shareRecorder',
						'shareIndex',
						'shareReward',
					],
				}, {
					name: ['0-4-0'],
					label: this.$t('index.tran'),
					prop: [],
					component:[],
				}],
				currentTab: 0,
				functionalShow: false,
			}
		},
		mounted() {
			this.functionalItems[1].unread = this.vuex_privateMesUnreadNum
			this.functionalItems[2].unread = this.vuex_whitePaperUnreadNum
		},
		props: {
			functionAreaShow: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			vuex_whitePaperUnreadNum(newValue, oldValue) {
				this.functionalItems[2].unread = newValue
			},
			vuex_privateMesUnreadNum(newValue, oldValue) {
				this.functionalItems[1].unread = newValue
			}
		},
		methods: {
			handleGridClick(val, grid) {
				console.log(val, grid);
				this.functionalShow = (val === 0 && !this.functionalShow);
				this.currentTab = val;
				this.$emit('changed', {
					prop: grid.prop,
					component: grid.component,
					key: grid.key,
					tabBar: val,
					functionTabBar: null,
				})
			},
			handleFunctionalGridClick(val, grid) {
				this.functionalShow = false;
				console.log(grid)
				this.$emit('changed', {
					prop: grid.prop,
					component: grid.component,
					key: grid.name,
					tabBar: this.currentTab,
					functionTabBar: val,
				})
			},
			getGridIconSrc(active, name) {
				if (active) {
					return `/static/images/1x/grid-${name}-active.png`;
				} else {
					return '';
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import url("@/pages/index/index.scss");

	.index-content-grid {
		position: fixed;
		bottom: 0px;
		left: 0;
		width: 100%;
		z-index: 10075;

		.index-content-grid-item {
			/deep/ .u-border-bottom:after {
				border-bottom-width: 0px;
			}

			/deep/.u-border-right:after {
				border-right-width: 0px;
			}
		}

		.index-content-grid-function {
			width: 100%;
			display: block;
		}

		.index-content-grid-function-grid {
			width: 25vw;
		}

		/deep/ .active {
			background-image: url("@/static/images/1x/grid-but.png") !important;
		}

		.index-content-grid-function-grid-item {
			background-image: url("@/static/images/1x/function-grid-item.png") !important;
			color: white;
			display: flex;

			&:hover {
				box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
			}
			/deep/ .u-grid-item-box {
				display: flex;
				flex-direction: row !important;
			}
		}
	}
	.private-message-icons-red-point {
		background: red;
		width: 24px;
		height: 24px;
		border-radius: 12px;
		/* margin-left: -6px; */
		/* margin-right: 0px; */
		align-items: center;
		justify-content: center;
		display: flex;
		&.right {
			position: absolute;
			top: 0px;
			right: 1px;
		}
		&.normal{
			width: 16px !important;
			height: 16px !important;
			border-radius: 8px !important;
			margin-left: 2px;
		}
		z-index: 4;
		color: white;
	}
</style>
