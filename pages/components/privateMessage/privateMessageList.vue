<template>
	<view class="private-message-list">
		<private-message-item v-for="(v, i) in privateMessages"
		  class="private-message-item-panel"
		  :key="i"
		  :privateMessage="v"
		  :index="i"
		  @openPrivateMessage="openPrivateMessage"
		  @deletePrivateMessage="deletePrivateMessage"
		  >
		</private-message-item>
	</view>
</template>

<script>
	import privateMessageItem from "@/pages/components/privateMessage/privateMessageItem.vue";
	
	export default {
		components: {
			privateMessageItem,
		},
		props: {
			privateMessages: {
				required: true,
				default: () => {
					return [];
				},
				type: Array,
			},
		},
		data() {
			return {};
		},
		methods: {
			openPrivateMessage(pm) {
				this.$emit("openPrivateMessage", pm);
			},
			deletePrivateMessage(pm) {
				this.$emit('deletePrivateMessage', pm);
			}
		},
	}
</script>

<style>
</style>