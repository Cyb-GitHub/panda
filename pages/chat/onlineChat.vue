<template>
  <view class="chat">
    <div class="chat-box" ref="chatBox">
		<u-navbar
			class="transaction-container-navbar"
			:back-text="$t('chat.back')"
			titleWidth="320"
			@back="backHome"
			:title="$t('chat.title')"
		></u-navbar>
	  <view class="chat-overlay"></view>
      <view v-for="message in chatHistory"
		:key="message.itemId"
		:class="{ 'my-message': message.source === 0 }">
        <view class="message-content">
			<view v-if="message.source" class="avatar left">
			  <image src="@/static/images/1x/chat.png" class="avatar-img" />
			</view>
			<view class="message-text" v-if="message.msgType === 1 || message.type === 1">
				<span>{{ message.content }}</span>
			</view>
			<view class="message-image" v-if="message.msgType === 2 || message.type === 2" >
				<image class="message-image-item" mode="widthFix" :src="message.content"/>
			</view>
			<view class="message-header">
				<span v-if="message.source" class="username">{{ message.user }}</span>
				<view v-if="message.source === 0" class="avatar right">
				  <image src="@/static/images/1x/chatAva.png" class="avatar-img" />
				</view>
			</view>          
        </view>
      </view>
    </div>
	<view class="chat-functional-area">
		<view class="chat-functional-area-key">
			<view class="chat-functional-area-input">
				<u-input type="text" class="chat-message-input" v-model="messageText" />
			</view>
			<view class="chat-functional-buttons">
				<u-button type="submit" class="send-button" @click="upload">
					<uni-icons type="image" size="30"></uni-icons>
				</u-button>
				<u-button type="submit" class="send-button" @click="sendMessage(1, messageText)">Send</u-button>
			</view>
		</view>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chatHistory: [
		  ],
      messageText: '',
	  pageSize: 10,
	  currentPage: 1,
	  ws: '',
    };
  },
  watch: {
	chatHistory() {
		this.$nextTick(() => {
			const chatBox = this.$refs.chatBox;
			chatBox.scrollTop = chatBox.scrollHeight;
		});
	},
	vuex_ws(newVal) {
		if (newVal.OPEN)
		this.initData()
	},
	
  },
  mounted() {
	  uni.showLoading({
		  title: 'loading'
	  });
	  this.initData()
  },
  methods: {
	initData() {
		let that = this;
		if (that.vuex_ws) {
			// this.vuex_ws.onMessage= this.getMessage
			that.vuex_ws.onMessage(function(res) {
				that.getMessage(res.data) 
			});
			that.getHistory();
		}
	},
	upload() {
		let _this = this;
		console.log(_this.$u.http.config)
		uni.chooseImage({
			sourceType: ['camera', 'album'],
			compressed: false,
			success: function(res) {
				_this.handleUpload(res)
		}
		});
	},
	handleUpload(res) {
		let _this = this;
		const baseURL = _this.$u.http.config.baseUrl
		console.log(res)
			// self.src = res.tempFilePath;
			uni.showLoading({
				title: 'loading'
			});
			for (let i = 0; i < res.tempFilePaths.length; i++) {
				uni.uploadFile({
					url: `${baseURL}/app/oss/upload`,
					filePath: res.tempFilePaths[i],
					name: 'file',
					method: 'POST',
					header: {
						token: _this.vuex_token,
					},
					success: (uploadFileRes) => {
						console.log(JSON.parse(uploadFileRes.data).url)
						uni.hideLoading();
						_this.sendMessage(2, JSON.parse(uploadFileRes.data).url)
					},
					fail: (uploadFileRes) => {
							uni.hideLoading();
							// console.log(ures.data);
						}
					});
			}
			
	},
	backHome() {
		uni.reLaunch({
			url: "/pages/index/index"
		})
	},
    sendMessage(type, content) {
		if (!content || content.length ===0) {
			return;
		}
      const message = {
        itemId: Date.now(),
		created: Date.now(),
		source: 0,
        content: content,
		msgType: type,
		sendType: 1,
		toId: 0,
      };
	  this.sendSocketMessage(message)
	  this.chatHistory.push(message);
	  this.messageText = '';
    },
	getMessage(msg) {
		const res = JSON.parse(msg)
		console.log(res)
		if (res.code === 11) {
			console.log('账户在其他地方登陆')
		}
		// 获取历史消息
		if (res.type === 2) {
			this.chatHistory = [...res.data.records.reverse(), ...this.chatHistory]
		} else if (res.type === 4) {
			this.chatHistory.push(res.data)
		}
	},
	getHistory() {
		this.sendSocketMessage({
			history: true,
			size: this.pageSize,
			current: this.currentPage,
		}, this.chatHistory)
	},
	wsSend(message) {
		if (this.vuex_ws) {
			uni.hideLoading();
			this.vuex_ws.send(JSON.stringify(message))
		}
	},
	sendSocketMessage(msg) {
		console.log('发送信息')
		uni.hideLoading();
		return new Promise((reslove, reject) => {
			this.vuex_ws.send({
				data: JSON.stringify(msg),
				success(res) {
					console.log('发送成功')
					reslove(res)
				},
				fail(res) {
					console.log('发送失败')
					reject(res)
				}
			});
		})
	
	},
  },
};
</script>

<style lang="scss" scoped>
@import url("@/pages/chat/onlineChat.scss");
.chat-functional-buttons {
	/deep/ uni-button:after {
		border: none !important;
	}
}
.message-image {
	width: 60vw;
	.message-image-item {
	    width: 100%;
	}
}
</style>