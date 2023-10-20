<template>
	<uni-popup ref="popup"
	 mask-background-color="transparent"
	 background-color="transparent"
	 type="dialog"
	 class="detail-popup"
	 @change="change">
		<view class="account-detail-title">
			<div class="account-detail-title-contain">
				<slot name='title'></slot>
			</div>
		</view>
		<view class="account-detail-content">
			<div class="account-detail-content-contain">
				<slot name='content'></slot>
			</div>
			<div class="account-detail-button-contain">
				<button size="mini" @click="handleConfirm">{{$t('confirm')}}</button>
			</div>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			visiable: {
				default: Boolean,
				default: false,
			}
		},
		data() {
			return {};
		},
		watch: {
			visiable: {
				handler: function(val) {
					if (val) {
						this.$refs.popup.open();
					}
				},
				immediate: true
			},
		},
		methods: {
			handleConfirm() {
				this.$refs.popup.close();
			},
			change(v) {
				if (!v.show) {
					this.$emit('close', v.show);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("detailPopup.scss");
</style>