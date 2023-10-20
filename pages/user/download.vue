<template>
	<view class="download-center">
		<image src="@/static/images/1x/LOGO.png" mode="widthFix"></image>
		<div>
			<button class="download-btn" type="primary" @click="download">
			{{$t('downloadText')}}
			</button>
		</div>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				appLink: '',
			}
		},
		created() {
			this.getApp();
		},
		methods: {
			async getApp() {
				const res = await this.$u.api.getVersion();
				if (res.code === 0) {
					this.appLink = res.data.appLink;
				}
			},
			download() {
				 window.open(this.appLink);
			}
		},
	}
</script>

<style>
	.download-btn {
		width: 70%;
		border-radius: 10px;
		background: url("@/static/images/1x/button.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	
	.download-center {
		padding-top: 30%;
		text-align: center;
	}
</style>