<template>
	<view>
		<view class="navBox">
			<view class="navLeft navItem" :style="{'backgroundColor' : select=='L'?'#333333':''}" @click="selectNav('L')">
				<text>即时数据</text>
			</view>
			<view class="navRight navItem" :style="{'backgroundColor' : select=='R'?'#333333':''}" @click="selectNav('R')">
				<text>历史数据</text>
			</view>
		</view>
		<view v-if="select=='L'" class="leftData">
			<text>left</text>
		</view>
		<view v-if="select=='R'" class="rightData">
			<text>right</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: 'ticketDataCenter',
				select: 'L'
			}
		},
		methods: {
			selectNav(nav) {
				this.select = nav
			}
		}
	}
</script>

<style lang="scss" scoped>
.navBox {
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	.navItem{
		width: 50%;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 16px;
	}
}
</style>
