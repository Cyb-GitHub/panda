<template>
	<view class="handle-feeding">
		<view class="handle-feeding-level">
			<u-row>
				<u-col span="3">
					<image
						src="@/static/images/1x/color-level-icon.png"
						mode="heightFix"
						class="my-account-basic-icon"
					></image>
				</u-col>
				<u-col class="handle-feeding-level-basic-info" span="6">
					<basicInfo :userLevelInfo="ammountInfo" :feedingShow="false" :titleShow="false"/>
					<view style="margin-top: 5px;">
					<span class="txt-span">{{$t('feed.feedingPlaceholder', { 'lpgDiff': getFeedDiff})}} </span>
					</view>
				</u-col>
				<u-col span="3">
					<image
						src="@/static/images/1x/gray-level-icon.png"
						mode="heightFix"
						class="my-account-basic-icon"
					></image>
				</u-col>
			</u-row>
		</view>
		<view  class="handle-feeding-opt-area">
			<view class="handle-feeding-opt">
				<u-input  v-model="bambooCount" class="handle-feeding-input" :placeholder="$t('feed.tips')"/>
				<button class="button handle-feeding-button" @click="handleFeeding()">
					{{$t('index.feeding')}}</button>
			</view>
			<span class="txt-span"> {{$t('feed.feedingAmount', { 'bambooAmount': ammountInfo.bambooAmount})}}</span>
		</view>
	</view>
</template>

<script>
import basicInfo from '@/pages/components/basic/basicIndexInfo.vue'

export default {
	data() {
		 return {
			ammountInfo: {},
			accountId: 0,
			bambooCount: undefined,
		 }
	},
	components: {
		basicInfo,
	},
	props: {
	},
	mounted() {
		this.accountId = this.vuex_userInfo.id;
		this.initAccountInfo();
	},
	computed: {
		getFeedDiff() {
			console.log(this.ammountInfo)
			return 10 - this.ammountInfo.feedAmount % 10
		}
	},
	methods: {
		initAccountInfo() {
			console.log(this.$u.api.accountMessageApis)
			this.$u.api.accountMessageApis.amountInfo(this.accountId).then((res)=>{
				console.log(res);
				if (res.code === 0) {
					this.ammountInfo = res.data;
				}
			})
		},
		handleFeeding() {
			if (!this.$util.isInt(this.bambooCount)) {
				this.$util.showToast(this.$t('feed.feedErrorNotInt'))
				return;
			}
			this.$u.api.accountMessageApis.feed({
				'accountId': this.accountId,
				'bambooCount': this.bambooCount,
			}).then(res => {
				if (res.code === 0) {
					console.log(parseInt(this.bambooCount) + parseInt(this.getFeedDiff))
					const lpgRes = (parseInt(this.bambooCount) - parseInt(this.getFeedDiff)) >= 0 ? this.$t('feed.sucWithLpg') : ''
					this.$util.showToastSuc(this.$t('feed.suc', {'lpg': lpgRes}),()=>{
					  uni.reLaunch({
						url: "/pages/index/index"
					  })
					})
				}
			})
			
		}
	}
}
</script>

<style lang="scss" scoped>
	.handle-feeding {
		height: 400px;
		width: 100%;
	}
	.handle-feeding-level {
		padding: 30px 10px;
		height: 250px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		/deep/ .u-col {
			display: flex;
			justify-content: center !important;
			align-items: center !important;
		}
		border-bottom: 1px black solid;
	}
	.handle-feeding-opt-area {
		height: 150px;
		padding: 5px 10px;
	}
	.handle-feeding-opt {
		padding: 20px 2px 5px 0px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		/deep/ .u-input__input {
			background-color: white;
			width: 150px;
			color: #b8b9b9;
			border-radius: 5px;
			border: 1px black solid;
		}
	}
	.my-account-basic-icon {
		width: 50px;
		height: 100px;
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
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
	}
	.handle-feeding-input {
		width: 150px;
		padding: 0px 10px !important;
	}
	.handle-feeding-level-basic-info {
		display: inline !important;
	}
	.txt-span {
		line-height: 1.5;
		font-size: 14px;
		letter-spacing: 1px;
		color: #dddddd
	}
</style>