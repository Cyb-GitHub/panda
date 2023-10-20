<template>
	<view class="coin-index-container">
		<view class="coin-index-container-txt">
			{{alterInfo}}
		</view>
		<view class="coin-index-container-opt">
			<button class="button" @click="goHome()">
				{{$t('coin.infoBtnHolder')}}</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		 return {
			alterInfo: this.$t('coin.alterInfo')
		 }
	},
	methods: {
		goHome(){
			uni.reLaunch({
				url: "/pages/index/index"
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.coin-index-container-txt{
		padding: 10px 5px;
		line-height: 1.6;
		letter-spacing: 1.5px;
		color: white;
		font-weight: bold;
	}
	.coin-index-container-opt{
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-top: 20px;
	}
	.button {
		max-width: 120px;
		width: 100%;
		height: 35px;
		border-radius: 5px;
		background: url("@/static/images/1x/button-mid.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: white;
		float: right;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
	}
</style>