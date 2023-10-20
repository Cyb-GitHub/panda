<template>
	<view class="ticket-num-selector">
		<view class="ticket-num-selector-head">
		</view>
		<view class="ticket-num-selector-my-num">
			<span class="ticket-num-selector-my-num-txt">
				{{$t('ticket.myNum')}}
			</span>
			<view class="ticket-num-selector-my-num-group">
				<view v-for="(num, index) of currentSelectNums" :key="index"
					class="ticket-num-selector-my-num-group-item">
					<view class="ticket-num-selector-my-num-group-item-cycle">
						{{num}}
					</view>
					<view class="ticket-num-selector-my-num-del" @click="remove(index)">
						-
					</view>
				</view>
			</view>
		</view>
		<view class="ticket-num-selector-main">
			<view class="ticket-num-selector-main-button left" @click="leftPage">
			</view>
			<view class="ticket-num-selector-main-container">
				<view class="ticket-num-selector-group">
					<view class="ticket-num-selector-group-item" :class="{disable: currentSelectNums.includes(num)}"
						v-for="(num, index) in displayedTicketNums(0)" @click="selectNum(num)" :key="num">
						{{ num }}
					</view>
				</view>
				<view class="ticket-num-selector-group">
					<view class="ticket-num-selector-group-item" :class="{disable: currentSelectNums.includes(num)}"
						v-for="(num, index) in displayedTicketNums(1)" @click="selectNum(num)" :key="num">
						{{ num }}
					</view>
				</view>
			</view>
			<view class="ticket-num-selector-main-button right" @click="rightPage">
			</view>

		</view>
		<view class="ticket-num-selector-buttom">
			<u-row class="ticket-num-selector-opt" gutter="3">
				<u-col span="3"><button class="button " @click="selectNumGroup">
						{{$t('ticket.selectNumGroup')}}</button></u-col>
				<u-col span="3"><button class="button" @click="selfSelect">
						{{$t('ticket.selfSelect')}}</button></u-col>
				<u-col span="3"><button class="button" @click="generateRandomNums">
						{{$t('ticket.random')}}</button></u-col>
				<u-col span="3"><button class="button" @click="confirm">
						{{$t('ticket.confirm')}}</button></u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentSelectNums: [],
				currentPage: 0,
				ticketNumsPerPage: 7,
				ticketMaxNum: 39,
				resValue: [],
				loading: false,
				type: 1,
			}
		},
		computed: {
			getTotalPage() {
				return Math.ceil(this.ticketMaxNum / (this.ticketNumsPerPage * 2))
			}
		},
		mounted() {
			// this.generateRandomNums();
		},
		watch: {
			currentSelectNums(newVal) {
				if (!this.isOrdered(newVal)) {
					newVal.sort((a, b) => a - b);
					this.currentSelectNums = newVal;
				}
			},
			loading(newVal) {
				if (!newVal) {
					this.$emit('updateChildEvent', undefined);
				}
			}
		},
		methods: {
			isOrdered(arr) {
				for (let i = 1; i < arr.length; i++) {
					if (arr[i] < arr[i - 1]) {
						return false;
					}
				}
				return true;
			},
			remove(index) {
				this.currentSelectNums.splice(index, 1);
			},
			selectNumGroup() {
				this.$emit('updateChildEvent', undefined);
			},
			confirm() {
				const raffleInfo = {
					raffleNumber: this.currentSelectNums,
					multiple: 1,
					type: this.type,
				};
				this.loading = true;
				this.createRaffleRecord(raffleInfo)

			},
			createRaffleRecord(raffleInfo) {
				this.$u.api.raffleBusinessApis.createRaffleRecord({
					accountId: this.vuex_userInfo.id,
					raffleInfo,
				}).then(res => {
					if (res.code === 0 && res.data) {
						const group = this.vuex_ticket_group;
						group.push(raffleInfo);
						this.$u.vuex("vuex_ticket_group", group);
						this.loading = false;
					}
				}).catch(e =>{
					this.loading = false;
				})
			},
			selfSelect() {
				this.currentSelectNums = [];
				this.type = 0;
			},
			displayedTicketNums(row) {
				const start = (this.currentPage * 2 + row) * this.ticketNumsPerPage + 1;
				const end = start + this.ticketNumsPerPage - 1;
				const currentRowNum = Math.min(this.ticketNumsPerPage, this.ticketMaxNum - start + 1)
				return Array.from({
					length: currentRowNum
				}, (_, i) => start + i);
			},
			rightPage() {
				if (this.currentPage < this.getTotalPage - 1) {
					this.currentPage = this.currentPage + 1;
				}
			},
			leftPage() {
				if (this.currentPage > 0) {
					this.currentPage = this.currentPage - 1;
				}
			},
			generateRandomNums() {
				const nums = [];
				while (nums.length < 5) {
					const num = Math.floor(Math.random() * this.ticketMaxNum) + 1;
					if (!nums.includes(num) && !this.currentSelectNums.includes(num)) {
						nums.push(num);
					}
				}
				this.currentSelectNums = nums;
			},
			selectNum(num) {
				if (this.currentSelectNums.includes(num)) {
					return;
				}
				if (this.currentSelectNums.length < 5) {
					this.type = 0;
					this.currentSelectNums.push(num);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ticket-num-selector-head {
		height: 20px;
		// border-bottom: 1px black solid;
	}

	.ticket-num-selector-my-num {
		color: white;
		display: flex;
		border-bottom: 1px black solid;
		height: 50px;
		align-items: center;
		display: flex;
	}

	.ticket-num-selector-my-num-txt {
		padding: 0px 10px;
	}

	.ticket-num-selector-my-num-group {
		display: flex;
	}

	.ticket-num-selector-my-num-group-item {
		margin-left: 10px;
		width: 36px;
		display: flex;
	}

	.ticket-num-selector-my-num-group-item-cycle {
		width: 24px;
		height: 24px;
		border-radius: 12px;
		background-color: #87c721;
		color: white;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.5);
	}

	.ticket-num-selector-group {
		display: flex;
		margin-top: 10px;
	}

	.ticket-num-selector-group-item {
		width: 32px;
		height: 32px;
		border-radius: 16px;
		margin-left: 10px;
		background-color: #87c721;

		&.disable {
			background-color: #ababab;
		}

		color: white;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.5);
	}

	.ticket-num-selector-my-num-del {
		background: red;
		width: 12px;
		height: 12px;
		border-radius: 6px;
		margin-left: -10px;
		margin-top: -4px;
		align-items: center;
		justify-content: center;
		display: flex;
	}

	.ticket-num-selector-main {
		height: 250px;
		display: flex;
		padding: 0px 5px;
		border-bottom: 1px black solid;
	}

	.ticket-num-selector-main-container {
		height: 250px;
		width: 90vw;
		padding: 0px 5px;
		align-items: center;
		justify-content: center;
		display: grid;
	}

	.ticket-num-selector-main-button {
		width: 5vw;
		height: 100%;
		border-radius: 5px;

		&.left {
			background: url("@/static/images/1x/left-tri-button.png");
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}

		&.right {
			background: url("@/static/images/1x/right-tri-button.png");
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}
	
	color: white;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
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

	.ticket-num-selector-opt {
		padding: 5px 10px 5px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70px;
	}
</style>
