<template>
	<view class="private-message-content">
		<view class="private-message-content-button">
			<button class="private-message-content-return-button" type="primary" size="mini" @click="close">
			{{$t('privateMessage.return')}}
			</button>
		</view>
		<view class="private-message-content-title">
			<text>{{$t('privateMessage.title', { title: privateMessage.title })}}</text>
		</view>
		<view class="private-message-content-body">
			<div v-html="privateMessage.content">
			</div>
		</view>
		<view class="private-message-content-footer">
			<private-message-footer :privateMessage="privateMessage"></private-message-footer>
		</view>
	</view>
</template>

<script>
	import privateMessageFooter from "@/pages/components/privateMessage/privateMessageFooter.vue";
	import pms from "@/pages/constant/privateMessageEnum.js";
	
	export default {
		components: {
			privateMessageFooter,
		},
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
			return {
				privateMessageType: pms.PRIVATE_MESSAGE_TYPE,
			};
		},
		methods: {
			close() {
				this.$emit("closePrivateMessage", this.privateMessage);
			},
		},
	};
</script>

<style lang="scss" scoped>
@import url("@/pages/components/privateMessage/privateMessage.scss");
@import "@/uni_modules/uni-id-pages/common/login-page.scss";
@import "@/pages/utils/normal.scss";
</style>
