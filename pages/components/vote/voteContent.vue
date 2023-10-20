<template>
	<div>
		<div class="vote-content-content" v-html="vote.content">
		</div>
		<div class="vote-content-count">
			<div class='vote-content-count-item'>
				{{`${$t('vote.agree')}: ${vote.agreeCount}`}}
			</div>
			<div class='vote-content-count-item'>
				{{`${$t('vote.oppose')}: ${vote.opposeCount}`}}
			</div>
			<div class='vote-content-count-item'>
				{{`${$t('vote.absent')}: ${vote.absentCount}`}}
			</div>
			<div class='vote-content-count-item'>
				{{`${$t('vote.voteWeight')}: ${accountVote == null ? '-' : accountVote.voteCount}`}}
			</div>
		</div>
		<div class='vote-content-end-time'>{{vote.endTime}}</div>
	</div>
</template>

<script>
	export default {
		props: {
			vote: {
				type: Object,
				default: () => {
					return {
						issue: '',
						content: '',
						endTime: '',
						opposeCount: 0,
						agreeCount: 0,
						absentCount: 0,
					}
				}
			}
		},
		data() {
			return {
				accountVote: null
			}
		},
		mounted() {
			this.query()
		},
		methods: {
			async query() {
				const t = await this.$u.api.vote.queryVoteActivitySingle({ activityId: this.vote.id })
				this.accountVote = t.data
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/pages/components/vote/voteHistory.scss";
</style>
