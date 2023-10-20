<template>
	<view class="private-message-content-footer">
		<view v-if="privateMessage.messageType === privateMessageType.AWARD" class="private-message-content-attach">
			<div class="private-message-content-attach-title">
				<text>{{privateMessage.title}}</text>
			</div>
			<div class="private-message-content-attach-body">
				<image src="@/static/images/1x/bamboo-ticket-1.png"
					class="private-message-bamboo-img" />
				<text class="private-message-content-bonus">
				{{
					$t('privateMessage.bonusPostfix', { 'num': privateMessage.award })
				}}
				</text>
				<button class="private-message-get-bonus-button" type="primary" size="mini" @click="getBonus">
				{{$t('privateMessage.getBonus')}}
				</button>
			</div>
		</view>
		<view class="private-message-content-time">
			<text>{{privateMessage.createTime}}</text>
		</view>
	</view>
</template>

<script>
	import pms from "@/pages/constant/privateMessageEnum.js";
	export default {
		props: {
			privateMessage: {
				required: true,
				default: () => {
					return {};
				},
				type: Object,
			},
		},
		data() {
			console.log('pr', this.privateMessage);
			return {
				privateMessageType: pms.PRIVATE_MESSAGE_TYPE,
				/**
				 * 名称待修改
				 */
				attachment: {
					bonusNum: 100,
				},
			};
		},
		methods: {
			getBonus() {
				if (this.privateMessage.awardStatus === 0) {
					this.$util.showToast(this.$t('airDrop.pickUpDup'));
					return;
				}
				console.log('g b');
				this.$u.api.privateMessageApis.award(this.privateMessage.id).then(res => {
					this.$util.showToast(this.$t('airDrop.pickSuc'))
					uni.reLaunch({
						url: "/pages/index/index"
					})
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
@import url("@/pages/components/privateMessage/privateMessage.scss");
@import "@/uni_modules/uni-id-pages/common/login-page.scss";
@import "@/pages/utils/normal.scss";
</style>
