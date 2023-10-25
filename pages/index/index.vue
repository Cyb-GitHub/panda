<template>
	<view v-if="getLocalToken" class="index-content">
		<view class="index-content-head">
			<headLangSelector></headLangSelector>
		</view>
		<view style="width: 100%;">
			<image class="index-content-bamboo" src="@/static/images/1x/bambo.png" mode="widthFix">
			</image>
		</view>
		<view class="index-content-mid">
			<view class="index-content-mid-left">
				<view class="index-content-mid-left-my">
					<basicInfo :userLevelInfo="ammountInfo" @subComponentChange="subComponentChange($event)" />
				</view>
				<view class="index-content-mid-left-chat">
					<image src="@/static/images/1x/chat.png" mode="heightFix" @click="openChatView"
						class="index-content-mid-left-chat-icon"></image>
				</view>
			</view>
			<view class="index-content-mid-right">
				<accountInfo :accountInfo="ammountInfo"></accountInfo>
			</view>
		</view>
		<view class="index-content-airdrop">
			<airDrop></airDrop>
		</view>
		<view>
			<tabBar @changed="handleTabChange" :functionAreaShow="!popupShow"></tabBar>
		</view>
		<popupTemplate :show="popupShow" :tabDatas="getPopupTitle" @closePopup="closePopup" @changed="changePopupTab">
			<template v-slot:popup-content>
				<!-- <myAccount v-if="getTabUniqKey==='0-0' && currentPopupTab === 0"></myAccount> -->
				<component v-if="currentTabData"
					:is="getcurrentComp"
					v-bind="getcurrnetProp"
					:key="getcurrentKey"
					@updateChildEvent="childComponentName=$event"
					></component>
				<component v-if="getCurrenSubComponent"
					:is="getCurrenSubComponent['compName']"
					v-bind="getCurrenSubComponent['props']"
					:key="getCurrenSubComponent['compName']"
					></component>
					<!-- <component v-if="currentTabData !== null" :is="getcurrentComp"></component> -->
			</template>
		</popupTemplate>
	</view>
</template>

<script>
	import headLangSelector from '@/pages/utils/head/head.vue'
	import tabBar from '@/pages/components/indexTabBar.vue'
	import basicInfo from '@/pages/components/basic/basicIndexInfo.vue'
	import airDrop from '@/pages/components/basic/airDrop.vue'
	import accountInfo from '@/pages/components/basic/accountInfo.vue'
	import popupTemplate from '@/pages/components/popup/popup.vue'
	import whitePaperList from '@/pages/components/whitepaper/whitePaperList.vue';
	import myAccount from '@/pages/components/account/myAccount.vue'
	import privateMessage from '@/pages/components/privateMessage/privateMessage.vue'
	import accountTransactions from '@/pages/components/account/accountTransactions.vue'
	import ticketsNumInfo from '@/pages/components/tickets/ticketsNumInfo.vue'
	import ticketsNumSelector from '@/pages/components/tickets/ticketsNumSelector.vue'
	import ticketHistory from '@/pages/components/tickets/ticketHistory.vue'
	import allTicketRecords from '@/pages/components/tickets/allTicketRecords.vue'
	import ticketLotteryRecorders from '@/pages/components/tickets/ticketLotteryRecorders.vue'
	import ticketDataCenter from '@/pages/components/tickets/ticketDataCenter.vue'
	import handleFeeding from '@/pages/components/basic/handleFeeding.vue'
	import vote from '@/pages/components/vote/vote.vue'
	import voteHistory from '@/pages/components/vote/voteHistory.vue'
	import shareReward from '@/pages/components/share/shareReward.vue'
	import shareIndex from '@/pages/components/share/shareIndex.vue'
	import coinIndex from '@/pages/components/coins/coinIndex.vue'
	import shareRecorder from '@/pages/components/share/shareRecorder.vue'
	import security from '@/pages/components/security.vue'
	
	
	export default {
		data() {
			return {
				currentTab: 0,
				tabIndex: {},
				popupShow: false,
				currentTabData: {
					tabBar: 0,
					functionTabBar: undefined,
				},
				accountId: 0,
				popupTitleInfo: {
					'0-0': [
						this.$t('index.account'), 
						this.$t('index.usdt'), 
						this.$t('index.lpg'), 
						this.$t('index.bamboo'),  
						this.$t('index.lpgAir'), ],
					'0-1': [this.$t('index.email')],
					'0-2': [this.$t('index.whitePapers')],
					'0-3': [
						this.$t('index.securityCenter'),
						this.$t('index.myShare'),
						this.$t('index.cooperateReward'),
						this.$t('index.shareReward')],
					'0-4': [
						this.$t('index.account'),
						this.$t('index.patiLockWallet'),
						this.$t('index.myLockWallet')],
					'0-4-1': [this.$t('index.lockWallet')],
					'1': [
						this.$t('index.luckyRaflle'),
						this.$t('index.raffleHistory'),
						this.$t('index.myRaffle'),
						this.$t('index.myRaffleTicket'),
						this.$t('index.dataCenter')],
					'handleFeeding': [this.$t('index.feeding')],
					'3': [
						this.$t('index.vote'),
						this.$t('index.voteHistory'),
					],
					'2': [
						this.$t('index.coin'),
					]
				},
				currentPopupTab: 0,
				childComponentName: undefined,
				subComponent: {
					handleFeeding: {
						compName: 'handleFeeding',
						props: [{'userLevelInfo': this.getAmountInfo}],
					}
				},
				currentSubComponent: undefined,
				currentTabDataSwap: undefined,
				ammountInfo: undefined,
			}
		},
		components: {
			headLangSelector,
			tabBar,
			basicInfo,
			airDrop,
			accountInfo,
			popupTemplate,
			myAccount,
			accountTransactions,
			privateMessage,
			whitePaperList,
			ticketsNumInfo,
			ticketsNumSelector,
			ticketHistory,
			allTicketRecords,
			ticketLotteryRecorders,
			ticketDataCenter,
			handleFeeding,
			vote,
			voteHistory,
			shareReward,
			shareIndex,
			coinIndex,
			shareRecorder,
			security
		},
		computed: {
			getAmountInfo() {
				return {...this.ammountInfo}
			},
			getLocalToken() {
				return this.$util.cache('token')
			},
			getPopupTitle: function() {
				return this.popupTitleInfo[this.getTabUniqKey]
			},
			getTabUniqKey: function() {
				if (this.currentSubComponent && this.currentSubComponent.componentName) {
					return this.currentSubComponent.componentName;
				}
				const newVal = this.currentTabData;
				if (!newVal) {
					return
				}
				console.log(newVal)
				var uniquKey = `${newVal.tabBar}`
				if (!newVal.tabBar) {
					uniquKey = `${newVal.tabBar}-${newVal.functionTabBar}`
				}
				return uniquKey;
			},
			getcurrentComp(){
				if (this.currentTabData.component) {
					if (typeof(this.currentTabData.component[this.currentPopupTab]) === 'string') {
						return this.currentTabData.component[this.currentPopupTab]
					} else if (typeof(this.currentTabData.component[this.currentPopupTab]) === 'object') {
						if (this.childComponentName) {
							return this.currentTabData.component[this.currentPopupTab].child[this.childComponentName]
						} else {
							return this.currentTabData.component[this.currentPopupTab].compName
						}
					}
				} else {
					return undefined;
				}
			},
			getCurrenSubComponent() {
				if (!this.currentSubComponent) {
					return undefined;
				}
				if (this.subComponent[this.currentSubComponent.componentName]) {
					return this.subComponent[this.currentSubComponent.componentName]
				} else {
					return undefined;
				}
			},
			handleChildComponentChanged(val) {
				// this.childComponentName = val;
			},
			getcurrentKey() {
				if (this.currentTabData.key) {
					return this.currentTabData.key[this.currentPopupTab]
				} else {
					return undefined;
				}
			},
			getcurrnetProp() {
				if (this.currentTabData.prop) {
					return this.currentTabData.prop[this.currentPopupTab]
				} else {
					return undefined;
				}
			},
		},
		onLoad() {
			this.accountId = this.vuex_userInfo.id;
			if (!this.$util.cache('token')) {
				console.log('login')
				uni.reLaunch({
					url: "/pages/login/login",
				})
			} else {
				this.initAccountInfo();
			}
		},
		watch: {
			currentTabData: {
				handler: function(newVal, oldValue) {
					this.childComponentName = undefined;
					if (!newVal) {
						return
					}
					if (newVal.tabBar || newVal.functionTabBar ||
						(newVal.tabBar === 0 && newVal.functionTabBar === 0)) {
						this.popupShow = true;
					} else {
						this.popupShow = false;
					}
					this.currentSubComponent = undefined;
				},
				immediate: true,
			},
			currentSubComponent: {
				handler: function(newVal, oldValue) {
					if (newVal) {
						this.popupShow = true;
					}
				}
			},
			vuex_signal(newVal) {
				this.handleSignal(newVal)
			}
		},
		methods: {
			handleSignal(val) {
				console.log(val)
				if (val === 17) {
					this.initAccountInfo()
					this.$util.showToastSuc(this.$t('transfer.receiveTransfer'))
				}
				this.$u.vuex("vuex_signal", -1)
			},
			subComponentChange(val) {
				console.log(val)
				if (this.currentTabData) {
					const swapPromise = new Promise((resole) => {
						this.currentTabDataSwap = JSON.parse(JSON.stringify(this.currentTabData));
						resole();
					})
					Promise.all([swapPromise]).then(() => {
						this.currentTabData = undefined;
					})
				}
				
				this.currentSubComponent = val;
				this.childComponentName = undefined;
			},
			handleTabChange(val) {
				this.currentTabData = val;
			},
			openChatView() {
				console.log('https://chat.ss-chat.com/service/fmjmjy')
				this.$u.route({
				  url: 'pages/index/webview'
				})
			},
			initAccountInfo() {
				this.$u.api.accountMessageApis.amountInfo(this.accountId).then((res)=>{
					console.log(res);
					if (res.code === 0) {
						this.ammountInfo = res.data;
					}
				})
			},
			closePopup() {
				if (this.currentSubComponent) {
					this.currentSubComponent = undefined;
				}
				this.popupShow = false;
			},
			changePopupTab(val) {
				this.childComponentName = undefined;
				this.currentPopupTab = val;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("@/pages/index/index.scss");

	.content {
		display: flex;
		flex-direction: column;
		padding: 40rpx;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
</style>
