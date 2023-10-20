<template>
	<view class="index-share-container">
		<u-popup v-model="popShow" @close="close" mode="center" width="500rpx" height="600px">
			<view class="loading-wrap" v-if="isLoaded">
				<svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
					<circle id="loading-inner" cx="75" cy="75" r="60" />
				</svg>
			</view>
			<template v-else>
				<view v-if="popShow" class="qrcode-wrap" @longtap="shareImg()">
					<canvas :canvas-id="canvasId" class="qrcode" />
				</view>
				<view class="close">
					<button class="button opt" @click="saveHeadImgFile">
						{{$t('account.savaShare')}}
					</button>
				</view>
			</template>
		</u-popup>
	</view>
</template>

<script>
	import UQRCode from "@/utils/qr/uqrcode.js"
	export default {
		data() {
			return {
				isLoaded: false,
				shareUrl: '',
				popShow: false,
				picData: '',
				canvasId: 'qrcode',
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			show(newVal) {
				this.popShow = newVal;
				this.canvasQrCode()
			},
			shareUrl(newVal) {
				if (newVal) {
					this.canvasQrCode()
				}
			}
		},
		mounted() {
			this.isLoaded = true
			this.getShareUrl()
		},
		methods: {
			shareImg() {
				console.log(111);
				this.saveHeadImgFile();
			},
			close() {
				this.$emit('close')
			},
			saveHeadImgFile(dataurl) {
				let _this = this
				const url = Date.now() + ".png";
				// APP 保存图片
				// #ifdef APP-PLUS
				let ws = this.$mp.page.$getAppWebview();
				const bitmap = new plus.nativeObj.Bitmap("test");
				this.$nextTick(function() {
					setTimeout(() => {
						bitmap.loadBase64Data(this.picData, (e) => {
							bitmap.save(url, {
								overwrite: true,
								quality: 100
							}, (i) => {
								plus.gallery.save(i.target, (e) => {
									_this.$u.toast(_this.$t('share.saveSuc'))
									bitmap.clear(); //销毁
								}, (e) => {
									bitmap.clear(); //销毁
								});
							}, (e) => {
								_this.$u.toast(_this.$t('share.saveError'))
								console.log('保存图片失败：' + JSON.stringify(e));
							});
						}, (e) => {
							_this.$u.toast(_this.$t('share.saveError'))
							console.log('bitmap绘制图片失败：' + JSON.stringify(e));
						});
					}, 200)
				})
				// #endif


				// H5 保存图片
				// #ifdef H5
				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(this.picData, url);
				} else {
					let a = document.createElement("a");
					a.href = this.picData;
					a.setAttribute("download", url);
					a.click();
				}
				// #endif
			},
			getShareUrl() {
				this.$u.api.accountMessageApis.getShareQrCode().then((res) => {
					if (res.code === 0) {
						console.log(res)
						this.shareUrl = res.data
					}
				}).catch((e) => {
					console.log(e);
				})
			},
			canvasQrCode() {
				console.log(this.shareUrl)
				if (!this.shareUrl) {
					return
				}
				console.log(this.shareUrl)
				setTimeout(() => {
					this.isLoaded = false,
						UQRCode.make({
							canvasId: this.canvasId,
							componentInstance: this,
							text: this.shareUrl,
							size: 200,
							margin: 10,
							backgroundColor: '#ffffff',
							foregroundColor: '#000000',
							fileType: 'jpg',
							errorCorrectLevel: UQRCode.errorCorrectLevel.L,
							success: res => {
								console.log(res)
								this.picData = res;
							},
						})
				}, 200)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index-share-container {
		/deep/ .uni-scroll-view {
			background-color: transparent !important;
		}

		/deep/ .u-mode-center-box {
			background-color: transparent !important;
		}

		/deep/ .u-mask {
			background-color: rgba(0, 0, 0, 0.9);
		}
	}

	.qrcode-wrap {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30px 5px;

		.qrcode {
			width: 200px;
			height: 200px;
			background: #ffffff;
			justify-content: center;
			align-items: center;
		}
	}

	.loading-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 400rpx;

		.load-text {
			font-size: 30rpx;
			color: #000;
			padding-top: 50rpx;
		}

		#load {
			width: 55px;
			animation: loading 3s linear infinite;

			#loading-inner {
				stroke: {
					dashoffset: 0;
					dasharray: 300;
					width: 10;
					miterlimit: 10;
					linecap: round;
				}

				animation: loading-circle 2s linear infinite;
				stroke: #fff;
				fill: transparent;
			}
		}

		@keyframes loading {
			0% {
				transform: rotate(0);
			}

			100% {
				transform: rotate(360deg);
			}
		}

		@keyframes loading-circle {
			0% {
				stroke-dashoffset: 0;
			}

			100% {
				stroke-dashoffset: -600;
			}
		}
	}

	.close {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.button {
		max-width: 120px;
		width: 60px;
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

		&.opt {
			width: 120px;
		}
	}
</style>
