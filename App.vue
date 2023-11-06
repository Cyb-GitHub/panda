<script>
	import common from './utils/wxApplet/common.js'
	import { checkUpdate } from "./utils/app-update.js";
	export default {
		globalData: {
			$i18n: {},
			$t: {},
			$ws: undefined,
			$socket_timer: undefined,
			logined: false,
			socketOpen: false,
			timer: undefined,
		},
		watch: {
		    '$i18n.locale'(newVal, oldVal) {
			  const page = getCurrentPages()[0].route
			  console.log(page)
		      if (newVal !== oldVal) {
				try {
					if (page === 'pages/index/index' || 
						page === '/') {
						uni.reLaunch({url: "/pages/index/index"})
						return
					}
					// this.$router.go(0)
					uni.setStorageSync('CURRENT_LANG', newVal)
				} catch(e) {
					uni.reLaunch({url: "/pages/index/index"})
				}
		      }
		    },
			vuex_token(newVal) {
				console.log(1111)
				this.connectSocket(this.vuex_userInfo.id)
				this.$u.vuex("vuex_ws", this.$ws)
			}
		  },
		  destroyed() {
			  clearInterval(this.$socket_timer);
		  },
		onLaunch: function() {
			this.globalData.$i18n = this.$i18n
			console.log('>>>>>>>>>>>>>>>会话开始<<<<<<<<<<<<<<')
			// #ifdef H5
			try {
				if (this.$router.currentRoute.path === '/pages/user/register' ||
					this.$router.currentRoute.path === '/pages/login/login' ||
					this.$router.currentRoute.path === '/pages/user/download') {
					return;
				}
			} catch(e) {
				console.log(123)
			}
			this.readDataInterval()
			this.getReadData()
			// #endif
		},
		onShow: function() {
			console.log('show')
			this.checkAppUpdate()
			// if(!this.$ws && this.vuex_token) {
				this.connectSocket(this.vuex_userInfo.id)
				// this.$u.vuex("vuex_ws", this.$ws)
			// }
		},
		onHide: function() {
			this.socketOpen = false
			uni.closeSocket({success(res) {
					console.log("websocket断开成功");
				},
			fail(err) {
				console.log("报错", err);
			}});
		},
		onUnload: function() {
			uni.closeSocket({success(res) {
					console.log("websocket断开成功");
					// that.isSuccess = true
				},
				fail(err) {
					console.log("报错", err);
				}});
			this.socketOpen = false
			this.$u.vuex("vuex_token", "");
			this.$util.cache('token', '');
		},
		onHide: function() {},
		methods: {
			checkAppUpdate() {
			  this.$u.api.getVersion().then((res) => {
				console.log(res.data)
			    if(res.data) {
						// #ifdef APP-PLUS
						plus.runtime.getProperty(plus.runtime.appid, (wgtInfo)=> {
						console.log(wgtInfo)
						  if(wgtInfo.version < res.data.appVersion) {
						   setTimeout(() => {
						       let info = {
						           version: res.data.appVersion, //线上版本
						           now_url: res.data.appLink, //更新链接
						           silent: 0, //是否是静默更新
						           force: 1, //是否是强制更新
						           net_check: 0, //非WIfi是否提示
						           note: res.data.content, //更新内容
						       }
						       checkUpdate(info, 0).then(res => {
						         if (res.msg) {
						           plus.nativeUI.toast(res.msg);
						         }
						       });
						   }, 200)
						  }
						});
						// #endif
			    }
			  })
			},
			//连接websocket
			connectSocket(userId) {
				console.log(this.socketOpen)
				if (this.socketOpen) {
					return
				}
				if (!userId || !this.$util.cache('token') || !this.vuex_token) {
					console.log("断开");
					uni.closeSocket({success(res) {
							console.log("websocket断开成功");
						},
						fail(err) {
							console.log("报错", err);
						}});
					return
				}
				let that = this;
				console.log('调用连接websocket')
				that.$ws = uni.connectSocket({
						url: `wss://api.lpgcom.net/renren-fast/im/websocket/user/${this.vuex_token}/${userId}`,
						success(res) {
							that.socketOpen = true
							console.log("websocket连接成功");
							// that.isSuccess = true
						},
						fail(err) {
							that.socketOpen = false
							console.log("报错", err);
						}
					},
				);
				this.$ws.onOpen(function(res) {
					console.log('WebSocket连接已打开！');
					that.$u.vuex("vuex_ws", that.$ws)
					that.heart()
				})
				that.$ws.onMessage(function(res) {
					const ret = JSON.parse(res.data)
					if (ret.code === 11) {
						console.log(that.$t('pwdLogin.limitLoginInfo'));
						const time = 2000;
						that.logined = true;
						that.$u.toast(that.$t('pwdLogin.limitLoginInfo'), time);
						setTimeout(()=>{
							uni.reLaunch({
							  url: "/pages/login/login",
							})
						},time)
					} else if (ret.type === 17) {
						that.$u.vuex("vuex_signal", ret.type)
						that.$u.vuex("vuex_signal_1", ret.type)
					}
				});
			
			
				this.$ws.onError(function(res) {
					console.log('WebSocket连接打开失败，请检查！');
					console.log(JSON.stringify(res));
					// this.isSuccess = false
					// that.connectSocket()
			
					//进入重新连接
					that.reconnect();
			
				})
				// // 监听连接关闭 -
				this.$ws.onClose((e) => {
					console.log('WebSocket连接关闭！');
					clearInterval(that.timer)
					console.log(e)
					that.timer = ''
					if (!this.logined) {
						that.reconnect()
					}
				})
			},
			//进入重新连接
			reconnect() {
				console.log('进入断线重连');
				// this.$ws.close();
				this.connectSocket(this.vuex_userInfo.id)
			
			},
			
			//心跳
			heart() {
				let that = this;
				clearInterval(this.timer);
				let msg = {
					content: 'HEART_BEAT'
				}
				this.timer = setInterval(() => {
					if (this.$util.cache('token')) {
						this.$ws = undefined;
					} else {
						that.sendSocketMessage(JSON.stringify(msg)).then(res => {
							console.log(res)
						}).catch(res => {
							console.log('发送失败')
							console.log((res))
							that.socketOpen = false
							this.connectSocket(this.vuex_userInfo.id)
						})
					}
				}, 5000)
			},
			//白皮书数据
			readDataInterval() {
				console.log('----',this.vuex_userInfo.id)
				if(this.vuex_token) {
					const intervalId = setInterval(() => {
						this.getReadData()
					}, 60000);
				}
				
			},
			getReadData() {
				this.$u.api
					.whitePaperApis.unread({'accountId': this.vuex_userInfo.id})
					.then(res => {
						this.$u.vuex("vuex_whitePaperUnreadNum", res.data);
				})
				this.$u.api
					.privateMessageApis.unread({'accountId': this.vuex_userInfo.id})
					.then(res => {
						this.$u.vuex("vuex_privateMesUnreadNum", res.data);
				})
			},
			sendSocketMessage(msg) {
				return new Promise((reslove, reject) => {
					this.$ws.send({
						data: msg,
						success(res) {
							reslove(res)
						},
						fail(res) {
							reject(res)
						}
					});
				})
			},
			reload () {
				this.isRouterAlive = false
				this.$nextTick(function () {
					this.isRouterAlive = true
				})
			}
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";

	page {
		background: url("@/static/images/1x/back.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: $u-main-color;
		font-size: 28rpx;
		height: 100%;
		min-height: 100%;
	}


	view,
	navigator,
	image,
	text,
	scroll-view,
	swiper,
	swiper-item,
	input,
	textarea,
	button {
		box-sizing: border-box;
	}

	// /* #ifdef H5 */ 
	//   uni-page-head { display: none; } 
	//   /* #endif */
	  uni-page-head {  display: none; } 
	/* 文字避头尾法则 */
	.btw {
		table-layout: fixed;
		word-wrap: break-word;
		word-break: normal;
		text-align: justify;
		text-justify: inter-ideograph;
	}

	.bg-white {
		background: #fff;
	}
	

	.font-weight {
		font-weight: bold;
	}
	
	.uni-table{
		background-color: #A0A0A0!important;
	}
	
	.uni-table-text{
		color: #ffffff!important;
	}
</style>
