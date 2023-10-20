<template>
	<view class="share-index-container">
		<view class="share-info-content-info">
			<view class="share-info-content-item" v-for="(accountItem, index) in accountItems" :key="index">
				<view class="share-info-content-item-icon"  :class="{[accountItem.class] : true}">
					<span v-if="index > 0">{{accountItem.label}}</span>
				</view>
				<view class="share-info-content-item-detail">
					<view class="share-info-content-item-detail-inner" :class="{[accountItem.color] : true}"
						:style="{ width: accountItem['innerWidth'] }">
						<span class="share-info-content-item-detail-inner-text">
							{{shareDataInfo[accountItem.valueKey]}}
							<!--{{accountItem.hasQualification ? shareDataInfo[accountItem.valueKey] : ''}}-->
						</span>
					</view>
				</view>
			</view>
			<view v-if="infoLevel < 2" class="share-info-txt" v-html="infoTxt">
			</view>
			<view class="share-info-content-item" v-for="(accountItem, index) in accountOtherItems" :key="accountItem.label">
				<view class="share-info-content-item-icon"  :class="{[accountItem.class] : true}">
					<span>{{accountItem.label}}</span>
				</view>
				<view class="share-info-content-item-detail">
					<view class="share-info-content-item-detail-inner" :class="{[accountItem.color] : true}"
						:style="{ width: accountItem['innerWidth'] }">
						<span v-if="infoLevel >= index + 2"" class="share-info-content-item-detail-inner-text">
							{{shareDataInfo[accountItem.valueKey]}}
						</span>
					</view>
				</view>
			</view>
			<view v-if="infoLevel >= 2" class="share-info-txt" v-html="infoTxt">
			</view>
		</view>
		<view class="share-info-content-btn-area">
			<view class="share-info-content-btn basic" key="basic" :class="{'nomal-txt': infoLevel < 2}">
				<button class="button" @click="detailInfo(0)">
					{{$t('share.detail')}}</button>
			</view>
			<view class="share-info-content-btn double" key="double">
				<button class="button" @click="detailInfo(1)">
					{{$t('share.detail')}}</button>
			</view>
			<view class="share-info-content-btn triple" key="triple">
				<button class="button" @click="detailInfo(2)">
					{{$t('share.detail')}}</button>
			</view>
		</view>
		<detailPopup :visiable="popupShow" @close="handleDetailClose">
			<template slot="title">
				{{$t('share.detail')}}
			</template>
			<template slot="content">
				<view class="share-info-detail-area">
					<view class="share-info-detail-area-info" v-html="getInfo()">
					</view>
					<view class="share-info-detail-area-txt" v-html="infoTxt">
					</view>
					<view v-if="currrentDetailIndex" class="share-info-detail-area-contact">
						<u-card v-if="!lodash.isEmpty(contacts)">
							<view class="" slot="body">
								<view v-for="(item,index) in contacts" :key="index" class="u-body-item">
									<view class="u-body-item-title u-line-2" key="name">
										{{`${$t('share.sharer')}：${item.name}(${item.uid})`}}
									</view>
									<view class="u-body-item-title u-line-2" key="lpgAccount">
										{{`${$t('share.lpgAmount')}：${item.lpgAccount}`}}
									</view>
									<view class="u-body-item-title u-line-2" key="hasQualification">
										{{`${$t('share.qualification')}： ${item.hasQualification ? $t('common.yes') : $t('common.no')}`}}
									</view>
									<hr />
								</view>
							</view>
						</u-card>
					</view>
				</view>
			</template>
		</detailPopup>
	</view>
</template>

<script>
	import detailPopup from '@/pages/components/popup/detailPopup.vue';
	import _ from 'lodash';
	import Decimal from 'decimal.js'
	
	export default {
		data() {
			return {
				accountItems: [{
					class: 'panda',
					color: 'blue',
					valueKey: 'curLpgCount',
					label: this.$t('index.usdtTxt'),
				}, {
					class: 'black-background',
					color: 'orange',
					valueKey: 'containDay',
					label: this.$t('common.day'),
				},],
				accountOtherItems: [{
					class: 'black-background',
					color: 'green',
					valueKey: 'curAwardCount',
					label: 'X2',
				}, {
					class: 'black-background',
					color: 'royalblue',
					valueKey: 'curAwardCount',
					label: 'X3',
				}],
				shareDataInfo: {
					'aimDoubleAwardCount': 3,
					'aimTripleAwardCount': 7,
					'containDay': 0,
					'curAwardCount': 0,
					'curLpgCount': 0,
					'hasQualification': false,
					'needLpgCount': 1000,
					'remainDay': 0,
				},
				infoTxt: '',
				popupShow: false,
				currrentDetailIndex: 0,
				infoLevel: 0,
				contacts: [],
				lodash: _,
			}
		},
		components: {
			detailPopup,
		},
		mounted() {
			this.initShareData();
		},
		methods: {
			getTxtValue(index, item) {
				if (index === 2) {
					value = this.shareDataInfo['curAwardCount'];
					maxValue = this.shareDataInfo['aimDoubleAwardCount'];
					return Math.min(value, maxValue);
				} else {
					return this.shareDataInfo[item.valueKey];
				}
			},
			handleDetailClose() {
				this.popupShow = false;
			},
			detailInfo(index) {
				this.currrentDetailIndex = index;
				this.popupShow = true;
			},
			initShareData() {
				this.$u.api.accountMessageApis.queryCooperateProgress().then(res => {
					console.log(res)
					this.shareDataInfo = res.data
					this.shareDataInfo.containDay = this.shareDataInfo.containDay + 1;
					this.accountItems.forEach((item, index) => {
						console.log(item)
						this.initInnerWidth(index, item)
					})
					this.accountOtherItems.forEach((item, index) => {
						console.log(item)
						this.initInnerWidth(index + 2, item)
					})
				})
				this.$u.api.accountMessageApis.querySharedAccountCooperateProgressPaged({
					'accountId': this.vuex_userInfo.id,
					'page': 1,
					'pageSize': 100,
				}).then(res => {
					console.log(res.data.list)
					this.contacts = res.data.list
				})

			},
			getMaxValue(maxValueLabel, offset) {
				return this.shareDataInfo[maxValueLabel] - offset
			},
			getInfo() {
				const currrentDetailIndex = this.currrentDetailIndex
				if (currrentDetailIndex === 0) {
					return this.$t('share.desc');
				} else if (currrentDetailIndex === 1) {
					return this.$t('share.X2Desc');
				} else if (currrentDetailIndex === 2) {
					return this.$t('share.X3Desc');
				}
			},
			initInnerWidth(index, item) {
				let value = 0;
				let maxValue = 1000;
				let tempInfoTxt = '';
				const lpgCount = this.shareDataInfo['curLpgCount']
				if (index === 0) {
					value = lpgCount;
					maxValue = 1000;
					if (value < 1000) {
						tempInfoTxt = this.$t('share.noQualificationInfo', { amount: new Decimal(1000).sub(new Decimal(value)).toFixed() });
					}
				} else if (index === 1) {
					value = this.shareDataInfo['containDay'];
					maxValue = this.shareDataInfo['remainDay'] + value;
					if (value < maxValue) {
						tempInfoTxt = this.$t('share.noQualificationDayInfo', { day: maxValue - value });
					}
				} else if (index === 2) {
					value = this.shareDataInfo['curAwardCount'];
					maxValue = this.shareDataInfo['aimDoubleAwardCount'];
					if (value < maxValue) {
						tempInfoTxt = this.$t('share.qualificationInfo', {
							amount: Number(lpgCount/100).toFixed(0) * 100,
							type: 'X2',
							task: maxValue - value,
						});
					}
				} else if (index === 3) {
					value = this.shareDataInfo['curAwardCount'];
					maxValue = this.shareDataInfo['aimTripleAwardCount'];
					if (value < maxValue) {
						tempInfoTxt = this.$t('share.qualificationInfo', {
							amount: Number(lpgCount/100).toFixed(0) * 100,
							type: 'X3',
							task: maxValue - value,
						});
					} else if (value >= maxValue) {
						tempInfoTxt = this.$t('share.noQualificationDayInfo', { day: maxValue - value });
					}
				}
				if (!this.infoTxt.length) {
					this.infoTxt = tempInfoTxt
					this.infoLevel = index
				} else {
					item['class'] = 'gray'
				}
				
				var percentage = parseInt(value) / maxValue;
				if (percentage > 0) {
					percentage = percentage > 1 ? 1 : percentage;
				} else {
					percentage = 0;
				}
				if (index > this.infoLevel) {
					item['class'] = 'gray'
					percentage = 0
				}
				console.log(index)
				item['innerWidth'] = `${percentage * 100}%`;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.button {
		padding: 8px 12px;
		/* width: 16px; */
		width: auto;
		/* justify-content: center; */
		/* text-align: center; */
		display: inline;
		font-size: 14px;
	}

	.share-info-content-btn {
		padding: 2px 5px;
		height: 44px;
		width: 90%;
		margin-left: 5px;
		margin-top: 8px;

		&.basic {
			&.nomal-txt {
				height: 140px;
			}
			padding: 0px 5px;
			height: 80px;
		}
	}

	.share-info-content-btn-area {
		padding: 2px 3px 2px 3px;
		width: 35%;
		height: 200px;
	}

	.share-index-container {
		padding: 20px 10px;
		justify-content: center;
		text-align: center;
		display: flex;
	}

	.share-info-content-info {
		width: 60%;
		padding: 2px 3px 2px 3px;
	}

	.share-info-content-item {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 100%;

		.share-info-content-item-detail {
			width: 80%;
			border: 1px solid black;
			height: 24px;
			border-radius: 12px;
			margin-left: 5px;
			margin-top: 20px;

			.share-info-content-item-detail-inner {
				height: 22px;
				border-radius: 11px !important;
				background-color: #b21200;
				float: left;
				display: inline-flex;
				align-items: center;

				&.blue {
					background-color: #00ffe6;
					// border: 1px #00ffe6 solid;
				}

				&.orange {
					background-color: #ffb600;
					// border: 1px #ffb600 solid;
				}

				&.green {
					background-color: #a8ff00;
					// border: 1px #a8ff00 solid;
				}

				&.royalblue {
					background-color: #aaffff;
					// border: 1px #aaffff solid;
				}
			}
		}

		.share-info-content-item-icon {
			width: 30px;
			height: 30px;
			background-position: center !important;
			background-repeat: no-repeat !important;
			background-size: cover !important;

			&.black-background {
				background: #000;
				border-radius: 15px;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				color: #fff;
			}

			&.gray {
				background: gray;
				border-radius: 15px;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				color: #000;
			}

			&.panda {
				background: url("@/static/images/1x/panda-icon.png");
			}
		}
	}

	.share-info-content-item-detail-inner-text {
		margin-left: 5px;
	}

	.share-info-txt {
		text-align: center;
		align-content: center;
		display: inline-grid;
		line-height: 2;
		margin-top: 5px;
		height: 60px;
	}

	.share-info-detail-area-info {
		line-height: 1.6;
		letter-spacing: 1.5px;
		color: white;
	}

	.share-info-detail-area-txt {
		margin-top: 5px;
		letter-spacing: 1.5px;
		color: #ffb600;
	}

	.share-info-detail-area-contact {
		overflow-y: scroll;
	}

	.share-info-detail-area {
		/deep/ .u-card__head {
			display: none;
		}
		// height: 400px;
		overflow-y: scroll;
	}
</style>
