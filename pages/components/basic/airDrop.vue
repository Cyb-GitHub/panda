<template>
	<view v-if="available" class="index-basic-air-drop">
		<view class="index-basic-air-drop-text">
			{{getAirDropText()}}
		</view>
		<view class="index-basic-air-drop-but" :class="{disable: !this.account}" @click="handleAirDrop">
			{{$t('airDrop.pick')}}
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			airDropInfo: {
				account: 0,
				unit: 'LPG',
			},
			accountId: 0,
			available: true,
			account: 0,
		}
	},
	mounted() {
		this.accountId = this.vuex_userInfo.id;
		this.airDropAvailable();
	},
	methods: {
		getAirDropText() {
			return `${this.account} ${this.airDropInfo.unit}`
		},
		airDropAvailable() {
			this.$u.api.airdropBusinessApis.available({accountId: this.accountId}).then((res) => {
				console.log(res)
				if (res.code === 0) {
					this.account = res.data.lpgAmount
				}
			})
		},
		handleAirDrop() {
			this.$u.api.airdropBusinessApis.pick({accountId: this.accountId}).then((res) => {
				if (res.code === 0) {
					this.$util.showToastSuc(this.$t('airDrop.suc'))
					this.airDropAvailable();
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.index-basic-air-drop {
	width: 100%;
	height: 100%;
	margin-left: -20px;
	background-size: contain !important;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-image: url("@/static/images/1x/airDrop.png");
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
}
.index-basic-air-drop-text {
	display: block;
	color: white;
	height: 20px;
	bottom: 40px;
	position: absolute;
	font-size: 16px;
	font-weight: bold;
	padding: 5px 3px 5px 3px;
}
.index-basic-air-drop-but {
	display: block;
	width: 60px;
	height: 20px;
	position: absolute;
	padding: 5px 3px 5px 3px;
	bottom: 10px;
	background: url("@/static/images/1x/button.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	color: white;
	justify-content: center;
	align-items: center;
	display: flex;
}
.index-basic-air-drop-but.disable {
	opacity: 0.5;
	pointer-events: none;
}
</style>