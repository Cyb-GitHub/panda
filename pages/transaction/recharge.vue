<template>
	<view class="transaction-recharge-container">
		<view  v-if="popShow">
		<u-popup v-model="popShow" mode="bottom" :mask-close-able="false" :closeable="true" height="450px">
			<view class="transaction-recharge-pop-body">
				<u-subsection class="transaction-recharge-subsection" :list="list" @change="currentTab=$event"
					:currentTab="currentTab">
				</u-subsection>
			</view>
			<view class="transaction-recharge-pop-span">
				<span> {{textHolderInfo[currentTab].label}} </span>
			</view>
			<view>
				<view class="qrcode-wrap">
					<canvas :canvas-id="canvasId" class="qrcode" />
				</view>
			</view>
			<view class="transaction-recharge-pop-span">
				<span> {{$t('recharge.scanQrCode')}} </span>
			</view>
			<view class="transaction-recharge-pop-span">
				<view style="background-color: gainsboro;">
					<span> {{userAddr}}
					</span>
					<span @click="copyAddr">
						{{$t('recharge.copy')}}
						<u-icon name="share" />
					</span>
				</view>
			</view>
			<view class="transaction-recharge-pop-opt">
				<button class="button" type="primary" @click="saveImgFile">
					{{$t('account.savaShare')}}
				</button>
			</view>
		</u-popup>
		</view>
		<view v-else class="rechargge-confirm-users">
			<view class="rechargge-confirm-users-item">
				<span class="rechargge-confirm-users-label">
					{{$t('recharge.type')}}:
				</span>
				<view class="rechargge-confirm-users-view">
					<uni-data-select :clear="false"
						:localdata="chargeTypes"
						@change="changeRechargeType"
						 v-model="rechargeType">
					</uni-data-select>
				</view>
			</view>
			<view class="rechargge-confirm-users-item">
				<span class="rechargge-confirm-users-label">
					{{$t('recharge.amount')}}:
				</span>
				<view class="rechargge-confirm-users-view">
					<u-input v-model="rechargeValue"
					class="rechargge-confirm-users-to-addr"></u-input>
				</view>
			</view>
			<view class="transaction-recharge-pop-opt">
				<button class="button" :disabled="disabled" type="primary" @click="recharge()">
					{{$t('confirm')}}
				</button>
			</view>
			<view class="transfer-addr-but">
				<span @click="popShow=true">{{$t('recharge.checkAddress')}}</span>
			</view>
		</view>
	</view>
</template>

<script>
	import UQRCode from "@/utils/qr/uqrcode.js"
	import AMOUNT from '@/pages/constant/amountEnum.js';
	
	export default {
		data() {
			return {
				userAddr: '',
				transAddr: '',
				disabled: false,
				popShow: true,
				currentTab: 0,
				rechargeValue: null,
				canvasId: 'qrcode',
				list: [{
						name: 'USDT',
					},
					{
						name: 'LPG'
					},
				],
				chargeTypes: [
					{
						value: AMOUNT.AMOUNT_TYPE_TYPES.USDT,
						text: this.$t(AMOUNT.AMOUNT_TYPE_TEXT[AMOUNT.AMOUNT_TYPE_TYPES.USDT]),
					}, {
						value: AMOUNT.AMOUNT_TYPE_TYPES.LPG,
						text: this.$t(AMOUNT.AMOUNT_TYPE_TEXT[AMOUNT.AMOUNT_TYPE_TYPES.LPG]),
					},
				],
				rechargeType: AMOUNT.AMOUNT_TYPE_TYPES.USDT,
				textHolderInfo: [{label: this.$t('recharge.usdtLimitInfo'), value: 1},
					{label:  this.$t('recharge.lpgLimitInfo'), value: 4}
				]
			}
		},
		watch: {
			userAddr(newVal) {
				if (this.userAddr) {
					this.canvasQrCode()
				}
			},
			popShow() {
				this.canvasQrCode()
			}
		},
		props: {
			ammountInfo: {
				type: Object,
				default: () => {},
			},
			amountLabelKey: {
				type: Object,
				default: () => {},
			},
			currentDotOptinos: {
				type: Array,
				default: () => [],
			},
			labelMap: {
				type: Object,
				default: () => {},
			}
		},
		mounted() {
			this.getUserAddr();
			this.canvasQrCode();
		},
		methods: {
			copyAddr() {
				uni.setClipboardData({
					data: this.userAddr, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: this.$t('recharge.copySuccess')
						})
					}
				});
			},
			saveImgFile(dataurl) {
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
									_this.$u.toast(_this.$t('recharge.saveSuccess'))
									bitmap.clear(); //销毁
								}, (e) => {
									bitmap.clear(); //销毁
								});
							}, (e) => {
								_this.$u.toast(_this.$t('recharge.saveFail'))
								console.log('保存图片失败：' + JSON.stringify(e));
							});
						}, (e) => {
							_this.$u.toast(_this.$t('recharge.saveFail'))
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
			recharge(){
				this.disabled = true
				if (this.rechargeValue === null || parseFloat(this.rechargeValue) === 0) {
					this.$u.toast(this.$t('transformation.emptyInfo'));
					this.disabled = false;
					return;
				}
				this.$u.api.accountMessageApis.startRecharge({
					accountId: this.vuex_userInfo.id,
					// amountType: this.textHolderInfo[this.currentTab].value,
					amountType: this.rechargeType,
					amount: parseFloat(this.rechargeValue),
					outerAddress: this.transAddr
					}).then(res => {
						if (res.code === 0) {
							this.$util.showToastSuc(this.$t('recharge.submitInfo'),()=>{
							this.disabled = false
							  uni.reLaunch({
								url: "/pages/index/index"
							  })
							})
						} else {
							this.disabled = false
						}
					}).catch(e => {
						this.disabled = false
					})
			},
			getUserAddr() {
				this.userAddr = this.vuex_userInfo.accountAddress;
			},
			changeRechargeType (t) {
				this.rechargeType = t;
			},
			canvasQrCode() {
				if (!this.userAddr) {
					return
				}
				setTimeout(() => {
					this.isLoaded = false,
						UQRCode.make({
							canvasId: this.canvasId,
							componentInstance: this,
							text: this.userAddr,
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
	.transaction-recharge-container {
		width: 100%;
		padding: 5px 10px;
	}

	.transaction-recharge-pop-body {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 5px 10px;
		border-bottom: 1px solid #84878d;
	}

	.transaction-recharge-subsection {
		width: 60%;
	}

	.transaction-recharge-pop-span {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 5px 10px;
		width: 100%;
		height: 50px;
	}

	.transaction-recharge-pop-opt {
		justify-content: center;
		align-content: center;
		display: grid;
		margin-top: 10px;
		width: 100vw;
	}

	.qrcode-wrap {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 5px 0px;

		.qrcode {
			width: 200px;
			height: 200px;
			background: #ffffff;
			justify-content: center;
			align-items: center;
		}
	}

	.button {
		width: 120px;
		height: 35px;
		border-radius: 5px;
		background: url("@/static/images/1x/button-mid.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: white;
		margin-left: 10px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
	}
	.rechargge-confirm-users {
		padding: 30px 0px 10px 0px;
		width: 100%;
		border-bottom: 1px #b8b9b9 solid;
	}
	.rechargge-confirm-users-item {
		height: 80px;
		margin-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.rechargge-confirm-users-label {
		width: 20%;
	}
	.rechargge-confirm-users-to-addr {
		width: 100%;
		height: 100%;
		/deep/ .u-input__input {
			height: 100%;
			color: #8fe201 !important;
			font-size: 16px;
		}
	}
	.rechargge-confirm-users-view {
		height: 65px;
		width: 70%;
		border-radius: 5px;
		border: 1px #b8b9b9 solid;
		margin-left: 10px;
		padding: 5px 5px;
		&.to {
			border: 1px #8fe201 solid;
		}
	}
	.transfer-suc-form-contact-but {
		float: right;
		height: 20px;
	}
	.wallet-recharge-input {
		width: 80%
	}
</style>
