<template>
	<view class="index-popup">
		<u-popup v-model="popupShow" mode="bottom" :mask="true" @close="close" :closeable="true">
			<view class="index-popup-title">
				<view
					class="index-popup-title-item"
					v-for="(item, index) in tabDatasOptions"
					:key="index"
					@click="currentSelected=index"
					:class="{checked: index === currentSelected}"
				>
					{{item}}
				</view>
			</view>
			<view class="index-popup-content">
				<slot class="index-popup-content-slot" name="popup-content"></slot>
			</view>
		</u-popup>
	</view>
</template>
<script>
  export default {
    data() {
      return {
		  popupShow: false,
		  tabDatasOptions: [],
		  currentSelected: 0,
      }
    },
	watch: {
		show(val) {
			this.popupShow = val;
		},
		tabDatas(val) {
			this.currentSelected = 0;
			this.tabDatasOptions = val;
		},
		currentSelected(val) {
			this.$emit('changed', val)
		}
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		tabDatas: {
			type: Array,
			default: () => []
		}
	},
	mounted() {
		this.tabDatasOptions = this.tabDatas;
	},
    methods: {
      open() {
      },
      close() {
		this.$emit('closePopup');
      }
    }
  }
</script>
<style lang="scss" scoped>
.index-popup {
	/deep/.u-drawer {
		bottom: 107px;
	}
	/deep/ .u-drawer-content {
		height: 430px !important;
	}
	/deep/ .uni-scroll-view {
		background-color: #a0a0a0;
	}
	/deep/ .u-close--top-right {
		top: 6px;
	}
}
.index-popup-title {
  position: fixed;
  top: 0;
  width: 100%;
  display: -webkit-box;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  padding: 2px 0px 2px 0px;
  background: url("@/static/images/1x/button.png");
  background-color: rgba(0, 0, 0, 0.6);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  z-index: 3;
}
.index-popup-content {
	background-color: #a0a0a0;
	height: 400px;
	margin-top: 30px;
	overflow-y: scroll;
}
.index-popup-title {
	overflow-x: scroll;
	.index-popup-title-item {
		padding: 0px 4px 0px 4px;
		&.checked {
			border-bottom: 1px solid #8d8d8d;
			box-shadow: inset 0 -3px 3px -3px #00ff00;

		}
	}
}
.close-icon {
	display: flex;
	align-items: center;
	padding-right: 10px;
}
</style>