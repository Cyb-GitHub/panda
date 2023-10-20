<template>
	<view class="vote-container">
		<view v-if="voteInfo">
			<view class="vote-issue-title">
				{{voteInfo.issue}}
			</view>
			<view class="vote-info">
				<u-row class="vote-info-area" gutter="5">
					<u-col span="4">
						<u-circle-progress key="aggre" active-color="#3e8c25" :percent="getAgreeInfo">
								<view class="u-progress-content">
									<view class="u-progress-dot" :class="{aggre: true}">{{`${getAgreeInfo}%`}}</view>
									<text class='u-progress-info'>
									{{`${voteInfo.agreeCount.toFixed(2)}票`}}</text>
								</view>
							</u-circle-progress>
					</u-col>
					<u-col span="4">
						<u-circle-progress key="oppose" active-color="#ff1d00" :percent="getOpposeInfo">
								<view class="u-progress-content">
									<view class="u-progress-dot" :class="{oppose: true}">{{`${getOpposeInfo}%`}}</view>
									<text class='u-progress-info'>
									{{`${voteInfo.opposeCount.toFixed(2)}票`}}</text>
								</view>
							</u-circle-progress>
					</u-col>
					<u-col span="4">
						<u-circle-progress key="absent" active-color="#1dc8c8" :percent="getAbsentInfo">
								<view class="u-progress-content">
									<view class="u-progress-dot" :class="{absent: true}">{{`${getAbsentInfo}%`}}</view>
									<text class='u-progress-info'>
									{{`${voteInfo.absentCount.toFixed(2)}票`}}</text>
								</view>
							</u-circle-progress>
					</u-col>
				</u-row>
			</view>
			<view class="vote-date-info">
				<view class="time-alter">{{$t('date.countdownInfo')}}</view>
				<view class="time">
					<view class="shijian">
						<view class="time-block" v-for="(hs, index) in countdownh + ''" :key="index">
							{{hs}}
						</view>
					</view>
					<text>{{$t('date.hour')}}</text>
					<view class="shijian">
						<view class="time-block" v-for="(hm, index) in countdownm + ''" :key="index">
							{{hm}}
						</view>
					</view>
					<text>{{$t('date.min')}}</text>
					<view class="shijian">
						<view class="time-block" v-for="(hS, index) in countdowns + ''" :key="index">
							{{hS}}
						</view>
					</view>
					<text>{{$t('date.sec')}}</text>
				</view>
			</view>
			<view class="vote-opt-area">
				<u-row class="vote-opt" gutter="3">
					<u-col span="4"><button class="button " @click="handleVote(1)">
					{{$t('vote.agree')}}</button></u-col>
					<u-col span="4"><button class="button" @click="handleVote(2)">
					{{$t('vote.oppose')}}</button></u-col>
					<u-col span="4"><button class="button" @click="handleVote(3)">
					{{$t('vote.absent')}}</button></u-col>
				</u-row>
			</view>
			<view class="vote-content">
				{{voteInfo.content}}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		 return {
			voteInfo: undefined,
			allVotes: 0,
			countdownh:'',
			countdownm:'',
			countdowns:'',
			ammountInfo: {},
			timer: null, //重复执行
		 }
	},
	computed: {
		getAgreeInfo() {
			if (this.allVotes === 0) {
				return 0
			}
			return (this.voteInfo.agreeCount / this.allVotes * 100).toFixed(2)
		},
		getOpposeInfo() {
			if (this.allVotes === 0) {
				return 0
			}
			return (this.voteInfo.opposeCount / this.allVotes * 100).toFixed(2)
		},
		getAbsentInfo() {
			if (this.allVotes === 0) {
				return 0
			}
			return (this.voteInfo.absentCount / this.allVotes * 100).toFixed(2)
		},
	},
	mounted() {
		this.getVoteInfo()
		this.initAccountInfo()
	},
	methods: {
		handleVote(type) {
			console.log(type)
			this.$u.api.vote.join({
				'voteActivityId': this.voteInfo.id,
				'voteType': type,
				'accountId': this.vuex_userInfo.id,
				'voteCount': this.ammountInfo.lpgAmount,
			}).then(res => {
				this.getVoteInfo()
				if (type < 3) {
					this.$util.showToastSuc(this.$t('vote.voteInfo', { amount: this.ammountInfo.lpgAmount }));
				} else if (type === 3) {
					this.$util.showToastSuc(this.$t('vote.absentInfo'));
				}
			})
		},
		initAccountInfo() {
			this.$u.api.accountMessageApis.amountInfo(this.vuex_userInfo.id).then((res)=>{
				if (res.code === 0) {
					this.ammountInfo = res.data;
				}
			})
		},
		showtime () {
			var nowtime = new Date(),  //获取当前时间
			endtime = new Date(this.voteInfo.endTime);  //定义结束时间
			var lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
			leftd = Math.floor(lefttime/(1000*60*60*24)),  //计算天数
			lefth = Math.floor((lefttime/(1000*60*60)%24)+leftd*24) < 10 ? "0" + Math.floor((lefttime/(1000*60*60)%24)+leftd*24) : Math.floor((lefttime/(1000*60*60)%24)+leftd*24),  //计算小时数
			leftm = Math.floor(lefttime/(1000*60)%60) < 10 ? "0" + Math.floor(lefttime/(1000*60)%60) : Math.floor(lefttime/(1000*60)%60),  //计算分钟数
			lefts = Math.floor(lefttime/1000%60) < 10 ? "0" + Math.floor(lefttime/1000%60) : Math.floor(lefttime/1000%60);  //计算秒数
			this.countdownh = lefth  //返回倒计时的字符串
			this.countdownm = leftm//返回倒计时的字符串
			this.countdowns = lefts  //返回倒计时的字符串
			// 倒计时结束时，显示00:00:00
			if(lefttime < 0) {
				this.countdownh = this.countdownm= this.countdowns = "00"
			}
		},
		getVoteInfo() {
			this.$u.api.vote.queryVoteActivityPaged({
				voteActivityStatus: 1,
				page: 1,
				pageSize: 10,
			}).then(res => {
				this.voteInfo = res.data.list[0]
				if (this.voteInfo) {
					this.allVotes = this.voteInfo.agreeCount
									+ this.voteInfo.opposeCount
									+ this.voteInfo.absentCount
					this.timer = setInterval(()=>{
						this.showtime()
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.vote-issue-title {
	padding: 10px 10px;
	color: white;
	font-size: bold;
	border-bottom: 1px black solid;
}
.vote-content {
	padding: 10px 10px;
	color: white;
}
.vote-date-info {
	padding: 10px 10px;
	border-bottom: 1px black solid;
	.time {
		padding: 10px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.time-alter {
		padding: 10px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
	}
	.shijian {
		display: flex;
	}
}
.vote-info {
	padding: 10px 10px;
	/deep/ .u-circle-progress {
		background-color: transparent !important;
	}
	/deep/ .u-progress-dot {
		font-size: 18px;
		&.aggre {
			color: #3e8c25
		 }
		&.oppose {
			color: #ff1d00
		 }
		&.absent {
		 	color: #1dc8c8
		 }
	}
	border-bottom: 1px black solid;
}

.vote-opt-area {
	border-bottom: 1px black solid;
}
.button {
	max-width: 120px;
	width: 100%;
	height: 35px;
	border-radius: 5px;
	background: url("@/static/images/1x/button-mid.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	color: white;
	float: right;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
}
.time-block {
	margin-left: 5px;
	padding: 10px 5px;
	font-size: 18px;
	background-color: black;
	color: white;
}
.vote-opt {
	padding: 10px 10px;
	border-bottom: 1px black solid;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 15%;
}
</style>