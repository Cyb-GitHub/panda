<template>
	<div class='voteHistoryPanel'>
		<div class='voteWeightInfoPanel'>
			<div class='voteWeightInfo'>
				{{$t('vote.voteWeightInfo', { weight: weight === null ? 0 : weight })}}
			</div>
		</div>
		<view class="vote-list">
			<uni-collapse ref="collapse" @change="change">
				<uni-collapse-item class="vote-collpase" v-for="(v, i) in votes" :key="i" :showArrow="false">
					<template v-slot:title>
						<text class="vote-item-title">{{formatTitle(i, v.issue)}}</text>
						<uni-icons :type="v.collapsed ? 'minus' : 'plusempty'" size="14" style="float:right;"></uni-icons>
					</template>
					<VoteContent :vote='v' />
				</uni-collapse-item>
			</uni-collapse>
			<uni-load-more
			  :status="loading ? 'loading' : (total <= votes.length ? 'noMore' : 'more')" 
			  :contentText="loadContext"
			  @clickLoadMore="nextPage"
			  />
		</view>
	</div>
</template>

<script>
	import VoteContent from '@/pages/components/vote/voteContent.vue'
	
	export default {
		components: {
			VoteContent
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				votes: [],
				loadContext: {
					contentdown: this.$t('vote.loadingMore'),
					contentrefresh: this.$t('vote.loading'),
					contentnomore: this.$t('vote.noMore'),
				},
				weight: null
			}
		},
		mounted() {
			this.weightQuery();
			this.init();
		},
		methods: {
			async weightQuery() {
				const w = await this.$u.api.vote.weightQuery({});
				this.weight = w.data;
			},
			async init() {
				this.loading = true;
				const votes = await this.$u.api.vote.queryVoteActivityPaged({
					voteActivityStatus: 2,
					page: this.page,
					pageSize: this.pageSize,
				})
				this.loading = false;
				this.page = this.page + 1;
				this.total = votes.data.totalCount;
				this.votes = this.formateList(votes.data.list);
			},
			change(openSlots) {
				this.votes.forEach(v => v.collapsed = false );
				openSlots.forEach(os => {
					this.votes[os].collapsed = true;
				})
			},
			formatTitle(index, title) {
				return `${index+1}、【 ${title} 】`;
			},
			formateList(voteList) {
				voteList.forEach(v => {
					v['collapsed'] = false;
					return v;
				});
				return voteList;
			},
			async nextPage(detail) {
				if (this.loading || detail.detail.status === 'noMore') {
					return;
				}
				this.loading = true;
				const lists = await this.$u.api.vote.queryVoteActivityPaged({
					voteActivityStatus: 2,
					page: this.page,
					pageSize: this.pageSize,
				});
				this.loading = false;
				if (lists.code == 0) {
					this.page = this.page + 1
					this.votes = this.votes.concat(this.formateList(lists.data.list));
				}
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import "@/pages/components/vote/voteHistory.scss";
</style>