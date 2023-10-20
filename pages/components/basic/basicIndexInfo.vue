<template>
	<view>
		<view v-if="titleShow" class="basic-index-info-nike-name">
			{{ vuex_userInfo.name }}
		</view>
		<view class="basic-index-info">
			<view class="basic-index-info-level">
				<view class="basic-index-info-level-basic">
					<view class="basic-index-info-level-basic-cell" :class="{
				'large-style': index === 0 || index === 6,
				'hight-light': cellHightLight(index),
				'normal-light': cellnormalLight(index),
				'dark-light': index === 6
			}" v-for="(item, index) in 7" :key="index">
						{{getLevelText(index)}}
					</view>
				</view>
				<view class="basic-index-info-level-detail">
					<view v-if="this.userLevelInfo.feedAmount" class="basic-index-info-level-detail-inner" :style="{ width: getInnerWidth() }">
					</view>
					<view class="basic-index-info-level-detail-text">
						{{getLevelDetailText()}}
					</view>
				</view>
			</view>
			<view v-if="feedingShow" class="basic-index-info-level-btn" @click="handleFeeding">
				{{$t('index.feeding')}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// userLevelInfo: {
				// 	nikeName: 'test',
				// 	curLevel: 0,
				// 	nextLevelFeedAmount: 1000,
				// 	feedAmount: 500,
				// }
			}
		},
		computed: {
			getUserNickNameText: function() {
				return this.userLevelInfo.nikeName
			},

		},
		props: {
			titleShow: {
				type: Boolean,
				default: true,
			},
			feedingShow: {
				type: Boolean,
				default: true,
			},
			userLevelInfo: {
				type: Object,
				default: () => {
					return {
						nikeName: '',
						level: 0,
						nextLevelFeedAmount: 300,
						feedAmount: 0,
					}
				}
			}
		},
		methods: {
			cellHightLight(index) {
				return Math.floor(this.userLevelInfo.feedAmount / this.userLevelInfo.nextLevelFeedAmount * 5) > index - 1;
			},
			cellnormalLight(index) {
				const upper = Math.ceil(this.userLevelInfo.feedAmount / this.userLevelInfo.nextLevelFeedAmount * 5)
				const lower = Math.floor(this.userLevelInfo.feedAmount / this.userLevelInfo.nextLevelFeedAmount * 5)
				return upper != lower && upper == index;
			},
			getLevelText(index) {
				if (index === 0) {
					return this.userLevelInfo.level
				} else if (index === 6 && this.userLevelInfo.level !== 12) {
					return this.userLevelInfo.level + 1
				} else {
					return ''
				}
			},
			getInnerWidth() {
				const percentage = this.userLevelInfo.feedAmount / this.userLevelInfo.nextLevelFeedAmount;
				return `${percentage * 100}%`;
			},
			getLevelDetailText() {
				return `${this.userLevelInfo.feedAmount}/${this.userLevelInfo.nextLevelFeedAmount}`;
			},
			handleFeeding() {
				this.$emit('subComponentChange', {
					componentName: 'handleFeeding',
					props: [],
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.basic-index-info-nike-name {
		padding: 1px 5px;
		font-size: 16px;
		font-weight: bold;
	}
	
	.basic-index-info {
		display: inline-flex;
		padding: 0px 0px 0px 5px;
		width: 95%;
	
		.basic-index-info-level {}
	}
	
	.basic-index-info-level-basic {
		display: -webkit-inline-box;
		flex-direction: column;
		justify-content: center;
	
	.basic-index-info-level-basic-cell {
			width: 15px;
			height: 6px;
			margin: 2px 1px 2px 1px;
			border-radius: 3px;
			border: 1px solid black;
			background-color: transparent;
			font-size: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
	
			&.large-style {
				width: 25px;
				height: 12px;
				border-radius: 6px;
				border: 1px solid black;
			}
	
			&.hight-light {
				background-color: #ff5d0a;
			}
	
			&.normal-light {
				background-color: #efc599;
			}
	
			&.dark-light {
				background-color: #818181;
			}
		}
	}
	
	.basic-index-info-level-detail {
		height: 16px;
		border-radius: 8px;
		border: 1px black solid;
		justify-content: center;
		align-items: center;
		padding: 2px 3px 2px 3px;
		font-size: 5px;
	
		.basic-index-info-level-detail-inner {
			border: 1px black solid;
			height: 10px;
			border-radius: 5px;
			background-color: #b21200;
		}
	
		.basic-index-info-level-detail-text {
			float: right;
			z-index: 9;
		}
	}
	
	.basic-index-info-level-btn {
		margin-top: 16px;
		height: 20px;
		width: 50px;
		border-radius: 10px;
		background-color: #a0cb54;
		border: 1px black solid;
		color: white;
		padding: 1px 2px;
		font-size: 4px;
		justify-content: center;
		align-items: center;
		display: flex;
		margin-left: 3px;
	}
</style>
