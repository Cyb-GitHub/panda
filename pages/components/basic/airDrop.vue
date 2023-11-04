<template>
	<view v-if="available" class="index-basic-air-drop">
		<view class="index-basic-air-drop-text">
			{{getAirDropText()}}
		</view>
		<!-- :class="{disable: !this.account}" -->
		<view class="index-basic-air-drop-but" @click="handleAirDrop">
			{{$t('airDrop.pick')}}
		</view>
		<detailPopup :visiable="showRulesPopup" @close="handleDetailClose">
			<template slot="title">
				{{$t('airDrop.airDropRules')}}
			</template>
			<template slot="content">
				<view class="airdropRulesBox">
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesTitle')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem1')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem2')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem3')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem4')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem5')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem6')}}</text>
					<text class="airdropRulesItem">{{$t('airDrop.airdropRulesItem7')}}</text>
				</view>
			</template>
		</detailPopup>
	</view>
</template>

<script>
import detailPopup from '@/pages/components/popup/detailPopup.vue';
export default {
	components: {
		detailPopup
	},
	data() {
		return {
			airDropInfo: {
				account: 0,
				unit: 'LPG',
			},
			accountId: 0,
			available: true,
			showRulesPopup: false,
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
		handleDetailClose() {
			this.showRulesPopup = false
		},
		handleAirDrop() {
			if (!this.account) {
				console.log('----')
				this.showRulesPopup = true
			} else {
				this.$u.api.airdropBusinessApis.pick({accountId: this.accountId}).then((res) => {
					if (res.code === 0) {
						this.$util.showToastSuc(this.$t('airDrop.suc'))
						this.airDropAvailable();
					}
				})
			}
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

.airdropRulesBox{
	display: flex;
	flex-direction: column;
	color: #d8d8d8;
	font-size: 14px;
}

.airdropRulesItem{
	margin-bottom: 10px;
}

</style>