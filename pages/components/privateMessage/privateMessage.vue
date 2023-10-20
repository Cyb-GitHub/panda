<template>
	<div>
		<template v-if="!openPrivateMessageStatus">
			<view class="private-message-desc">
				<text>{{$t('privateMessage.desc', { num: vuex_privateMesUnreadNum })}}</text>
			</view>
			<view class="private-message-delete">
				<button class="private-message-delete-button" type="primary" size="mini" @click="deletePrivateMessage">
				{{$t('privateMessage.delete')}}
				</button>
			</view>
			<private-message-list
			    class="private-message-list"
				:privateMessages="privateMessages"
				@openPrivateMessage="openPrivateMessage"
				@deletePrivateMessage="deleteSinglePrivateMessage">
			</private-message-list>
		</template>
		<private-message-content
		  v-else
		  :privateMessage="currentPrivateMessage"
		  @closePrivateMessage="closePrivateMessage">
		</private-message-content>
	</div>
</template>

<script>
import privateMessageList from "@/pages/components/privateMessage/privateMessageList.vue";
import privateMessageContent from "@/pages/components/privateMessage/privateMessageContent.vue";
import PMS from "@/pages/constant/privateMessageEnum.js";

export default {
	components: {
		privateMessageList,
		privateMessageContent,
	},
	data() {
		return {
			unreadNum: 1,
			privateMessages: [],
			
			currentPrivateMessage: {},
			openPrivateMessageStatus: false,
		};
	},
	mounted() {
		this.list();
		this.getReadData();
	},
	methods: {
		async list() {
			const pms = await this.$u.api.privateMessageApis.list({ accountId: this.$store.state.vuex_userInfo.id });
			if (pms.code === 0) {
				this.privateMessages = pms.data.messages;
			}
		},
		deletePrivateMessage() {
			const pms = this.privateMessages.filter(pm => {
				return pm.status !== PMS.PRIVATE_MESSAGE_STATUS.READ;
			});
			this.privateMessages = pms;
			this.$u.api.privateMessageApis.deleleReadMessage({ accountId: this.$store.state.vuex_userInfo.id });
		},
		openPrivateMessage(pm) {
			const ps = this.privateMessages.map(p => {
				if (p.id === pm.id && p.status === PMS.PRIVATE_MESSAGE_STATUS.UNREAD) {
					p.status = PMS.PRIVATE_MESSAGE_STATUS.READ;
					this.$u.api.privateMessageApis
					.read({ accountId: this.$store.state.vuex_userInfo.id }, p.id).then(res =>{
						this.getReadData();
					});
				}
				return p;
			})
			this.$set(this.privateMessages, ps);
			this.openPrivateMessageStatus = true;
			this.currentPrivateMessage = pm;
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
		closePrivateMessage(pm) {
			this.openPrivateMessageStatus = false;
		},
		deleteSinglePrivateMessage(pm) {
			const pms = this.privateMessages.filter(p => {
				return p.id !== pm.id;
			});
			this.privateMessages = pms;
			this.$u.api.privateMessageApis.delete({ accountId: this.$store.state.vuex_userInfo.id }, pm.id);
		},
	}
}
</script>

<style lang="scss" scoped>
@import url("@/pages/components/privateMessage/privateMessage.scss");
@import "@/uni_modules/uni-id-pages/common/login-page.scss";
@import "@/pages/utils/normal.scss";
</style>
