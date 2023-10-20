<template>
	<view class="date-selector">
		<view class="date-selector-col" span="3">
			<uni-data-select v-if="yearShow" class="date-selector-sel" key="year" :clear="false"
				:localdata="yearOptions" v-model="selectedYear" @change="onYearChange">
			</uni-data-select>
			<span>
				{{$t('date.year')}}
			</span>
		</view>
		<view class="date-selector-col" span="2">
			<uni-data-select v-if="monthShow" class="date-selector-sel" key="month" :clear="false"
				:localdata="monthOptions" v-model="selectedMonth" @change="onMonthChange">
			</uni-data-select>
			<span>
				{{$t('date.month')}}
			</span>
		</view>
		<view class="date-selector-col" span="2">
			<uni-data-select v-if="dayShow" class="date-selector-sel" key="day" @change="onDayChange" :clear="false" :localdata="dayOptions"
				v-model="selectedDay">
			</uni-data-select>
			<span>
				{{$t('date.day')}}
			</span>
		</view>
		<view class="date-selector-col" span="5">
			<button class="button" @click="getLatestThreeMonth">
				{{$t('account.lastThreeMon')}}</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				yearOptions: [], // Array to hold year options
				monthOptions: [], // Array to hold month options
				dayOptions: [], // Array to hold day options
				selectedYear: 2023, // Selected year
				selectedMonth: 1, // Selected month
				selectedDay: 1,
				yearShow: false,
				monthShow: false,
				dayShow: false,
			}
		},
		props: {
			defaultDate: {
				type: Object,
				default: () =>{
					return {
						year: 2023,
						month: 10,
						day: 1,
					}
				}
			}
		},
		created() {
		},
		methods: {
			// Method to generate year options
			generateYearOptions() {
				const currentYear = new Date().getFullYear();
				const yearOptions = [];
				for (let i = currentYear; i >= currentYear - 10; i--) {
					yearOptions.push({
						text: i.toString(),
						value: i,
					});
				}
				this.yearOptions = yearOptions;
				this.selectedYear = currentYear;
				this.yearShow = true;
			},
			// Method to generate month options
			generateMonthOptions() {
				const currentMonth = new Date().getMonth();
				const monthOptions = [];
				for (let i = 1; i <= 12; i++) {
					monthOptions.push({
						text: i.toString(),
						value: i,
					});
				}
				this.monthOptions = monthOptions;
				this.selectedMonth = currentMonth + 1;
				this.monthShow = true;
				this.emitDate();
			},
			// Method to generate day options
			generateDayOptions() {
				const daysInMonth = new Date(
					this.selectedYear,
					this.selectedMonth,
					0
				).getDate();
				const dayOptions = [];
				for (let i = 1; i <= daysInMonth; i++) {
					dayOptions.push({
						text: i.toString(),
						value: i,
					});
				}
				this.dayShow = true;
				this.dayOptions = dayOptions;
			},
			// Method to handle year change
			onYearChange(val) {
				this.selectedYear = val;
				this.generateDayOptions();
				this.emitDate();
			},
			// Method to handle month change
			onMonthChange(val) {
				this.selectedMonth = val;
				this.generateDayOptions();
				this.emitDate();
			},
			onDayChange(val) {
				this.selectedDay = val;
				this.emitDate();
			},
			onDayhChange(val) {
				this.selectedDay = val;
				this.emitDate();
			},
			emitDate() {
				this.$emit('dateChanged', {
					year: this.selectedYear,
					month: this.selectedMonth,
					day: this.selectedDay,
				})
			},
			getLatestThreeMonth() {
				const currentDate = new Date();
				const threeMonthsAgo = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000));
				this.selectedYear = threeMonthsAgo.getFullYear();
				this.selectedMonth = threeMonthsAgo.getMonth() + 1;
				this.emitDate()
			}
		},
		mounted() {
			this.generateYearOptions();
			this.generateMonthOptions();
			this.generateDayOptions();
		},
	}
</script>

<style lang="scss" scoped>
	.date-selector-sel {
		padding: 5px 5px 5px 5px;

		/deep/.uni-stat-box {
			background-color: #d8d8d8;
		}

		/deep/ .uni-icons {
			width: 20px;
			height: 100%;
			background: black;
			color: green;
			font-weight: bolder;
			justify-content: center;
			align-content: center;
			display: inline-grid;
			margin-right: -5px;
		}

		/deep/ .uni-select {
			height: 25px;
		}

		/deep/ .uni-select__input-box {
			height: 100%;
		}

		/deep/ .uni-scroll-view {
			background-color: #d8d8d8 !important;
		}

		/deep/ .uni-select__selector {
			background-color: #d8d8d8 !important;
		}

		/deep/ .uni-popper__arrow::after {
			border-bottom-color: #d8d8d8 !important;
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

	.date-selector-col {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 2px 0px 2px 0px;
	}
</style>
