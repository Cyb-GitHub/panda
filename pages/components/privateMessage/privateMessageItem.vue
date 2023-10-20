<template>
	<uni-swipe-action>
		<uni-swipe-action-item
			:right-options="options"
			@change="swipeChange($event, index)"
			@click="swipeClick($event, index)"
			>
			<view class="content-box">
				<uni-row class="private-message-item">
					<uni-col :span="2">
						<view class="private-message-index">
							<text @click="open">{{ index + 1 }}</text>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="private-message-icons">
							<image v-if="privateMessageStatus.UNREAD === privateMessage.status"
								src="@/static/privateMessage/email-1.svg"
								@click="open"
								class="email-img" />
							<image v-if="privateMessageStatus.READ === privateMessage.status"
								src="@/static/privateMessage/email.svg"
								@click="open"
								class="email-img" /> 
							 <view v-if="privateMessageStatus.UNREAD === privateMessage.status" class="private-message-icons-red-point">
							 </view>
						</view>
					</uni-col>
					<uni-col :span="16">
						<view class="private-message-title">
							<text class="private-message-title-text" @click="open">{{privateMessage.title}}</text>
							<text class="private-message-title-time" @click="open">{{privateMessage.createTime}}</text>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="private-message-pin">
							<image v-if="privateMessage.messageType === privateMessageType.AWARD" src="@/static/privateMessage/pin.svg" @click="open" class="email-img" />
						</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-swipe-action-item>
	</uni-swipe-action>
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
			index: {
				required: true,
				default: 0,
				type: Number,
			},
		},
		data() {
			return {
				privateMessageStatus: pms.PRIVATE_MESSAGE_STATUS,
				privateMessageType: pms.PRIVATE_MESSAGE_TYPE,
				
				options: [
					{
						text: this.$t('privateMessage.deleteConcel'),
						style: {
							backgroundColor: '#007aff',
						},
					}, {
						text: this.$t('privateMessage.deleteConfirm'),
						style: {
							backgroundColor: '#F56C6C',
						},
					}
				],
			};
		},
		methods: {
			open() {
				this.$emit("openPrivateMessage", this.privateMessage);
			},
			swipeChange(event, index) {
			},
			swipeClick(event, index) {
				if (event.index !== 1) {
					return;
				}
				this.$emit('deletePrivateMessage', this.privateMessage);
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import url("@/pages/components/privateMessage/privateMessage.scss");
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";
	@import "@/pages/utils/normal.scss";
</style>