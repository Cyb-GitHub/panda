<template>
	<view class="uni-lang">
		<view class="uni-lang-sel">
			<uni-data-select :clear="false"
			  class="uni-lang-sel-com"
				:localdata="langLists"
				@change="changeLang"
				 v-model="lang">
			</uni-data-select>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupMenuOpened: false,
				mpCapsule: 0,
				langIndex:0,
				lang: "zh-Hant",
				langList: [{
					label: '简体中文',
					value: 'zh-Hans',
				},{
					label: '繁體中文',
					value: 'zh-Hant',
				},{
					label: 'English',
					value: 'en',
				}],
				langLists: [
					{
						text: '简体中文',
						value: 'zh-Hans',
					},{
						text: '繁體中文',
						value: 'zh-Hant',
					},{
						text: 'English',
						value: 'en',
					}
				],
			}
		},
		mounted() {
			this.lang = uni.getStorageSync('CURRENT_LANG');
			this.changeLang(this.lang);
		},
		methods: {
			changeLang(language) {
				this._i18n.locale = language;
				uni.setStorageSync('CURRENT_LANG', language)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.uni-lang {
		display: block;
		font-size: 5px !important;
		margin-top: 20px;
		.uni-lang-sel {
			display: flex;
			width: 80px;
			float: right;
			/deep/ .uni-combox{
				padding: 1px 1px 1px 1px;
			}
			/deep/.uni-combox__input {
				font-size: 5px;
			}
			/deep/ .uni-combox__selector-item {
				font-size: 5px;
				padding: 1px 5px 1px 5px;
				.hight-light {
					font-weight: bold;
					color: black;
				}
			}
		}
	}
	.uni-lang-sel-com {
		border: 1px solid black;
		background-color: white;
		font-size: 12px;
		height: 26px;

		/deep/ .uni-stat-box {
			height: 23px;
		}
		/deep/ .uni-select {
						height: 23px;
			font-size: 12px;
		}
		/deep/ .uni-select__input-box {
			height: 23px;
		}
		/deep/ .uni-select__selector-item {
			font-size: 12px;
		}
	}

</style>