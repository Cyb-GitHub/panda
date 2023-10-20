<template>
	<view class="white-paper">
		<uni-section :title="desc" type="line">
			<uni-collapse ref="collapse" @change="change">
				<uni-collapse-item class="white-papar-collpase" v-for="(v, i) in whitePapers" :key="i" :showArrow="false">
					<template v-slot:title>
						<text class="white-paper-item-title" style="height: 40x;line-height: 40px;">{{formatTitle(i, v.title)}}</text>
						<uni-icons :type="v.collapsed ? 'minus' : 'plusempty'" size="14" style="float:right;height: 40x;line-height: 40px;margin-right: 8px;"></uni-icons>
					</template>
					<white-paper-content
					  :title="v.title"
					  :content="v.content"
					  :createTime="v.createTime" />
				</uni-collapse-item>
			</uni-collapse>
		</uni-section>
		<uni-load-more 
		  :status="loading ? 'loading' : (total <= whitePapers.length ? 'noMore' : 'more')" 
		  :contentText="loadContext"
		  @clickLoadMore="nextPage"
		  />
	</view>
</template>

<script>
	import WhitePaperContent from "@/pages/components/whitepaper/whitePaperContent.vue";
	export default {
		components: {
			WhitePaperContent,
		},
		data() {
			return {
				desc: this.$t('whitePaper.desc'),

				loading: false,
				whitePapers: [],
				total: 0,
				offset: 0,
				
				INIT_SIZE: 35,
				NEXT_SIZE: 10,
				
				loadContext: {
					contentdown: this.$t('whitePaper.loadingMore'),
					contentrefresh: this.$t('whitePaper.loading'),
					contentnomore: this.$t('whitePaper.noMore'),
				},
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			async init() {
				this.loading = true;
				const lists = await this.$u.api.whitePaperApis.list({ offset: 0, limit: this.INIT_SIZE });
				this.loading = false;
				if (lists.code === 0) {
					this.whitePapers = this.formateList(lists.data.list);
					this.total = lists.data.total;
					this.offset = this.whitePapers.length;
				}
			},
			async nextPage(detail) {
				console.log('detail', detail);
				if (this.loading || detail.detail.status === 'noMore') {
					return;
				}
				this.loading = true;
				const lists = await this.$u.api.whitePaperApis.list({
					offset: this.offset,
					limit: this.NEXT_SIZE,
				});
				this.loading = false;
				if (lists.code == 0) {
					this.offset = this.offset + this.NEXT_SIZE;
					this.whitePapers = this.whitePapers.concat(this.formateList(lists.data.list));
				}
			},
			formatTitle(index, title) {
				return `${index+1}、【 ${title} 】`;
			},
			formateList(whiteList) {
				whiteList.forEach(w => {
					w['collapsed'] = false;
					return w;
				});
				return whiteList;
			},
			change(openSlots) {
				this.whitePapers.forEach(w => w.collapsed = false );
				openSlots.forEach(os => {
					console.log(this.whitePapers[os])
					this.$u.api
						.whitePaperApis.read({
							'accountId': this.vuex_userInfo.id,
							'whitePaperId': this.whitePapers[os].id,
						}).then(res => {
							this.getReadData()
						})
					this.whitePapers[os].collapsed = true;
				})
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
		}
	}
</script>

<style lang="scss" scoped>
@import url("@/pages/components/whitepaper/whitePaperList.scss");

</style>
