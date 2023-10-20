<template>
	<view class="white-paper-panel-content">
		<view class="white-paper-content">
		    <div>
	    	    <p v-html="content"></p>
	        </div>
	        <div class="white-paper-timestamp">
			  {{formateTime}}
    	    </div>
    	</view>
    </view>
</template>

<script>
	import moment from "moment";
	export default {
		props: {
			title: {
				required: true,
				type: String,
				default: "",
			},
			content: {
				required: true,
				type: String,
				default: "",
			},
			createTime: {
				required: true,
				type: String,
				default: ""
			}
		},
		data() {
			return {};
		},
		computed: {
			formateTime: function () {
				const f = "YYYY" + this.$t('date.year') + "M" + this.$t('date.month') + "D" + this.$t("date.day");
				return moment(this.createTime).format(f);
			}
		}
	}
</script>

<style lang="scss" scoped>
@import url("@/pages/components/whitepaper/whitePaperList.scss");
.white-paper-content {
	padding: 10px 10px;
	border-bottom: 0px solid black;
	max-width: -webkit-fill-available;
	.white-paper-timestamp {
		padding: 10px 10px;
		text-align: right;
	}
	
	/deep/ img {
		max-width: -webkit-fill-available;
	}
}
</style>