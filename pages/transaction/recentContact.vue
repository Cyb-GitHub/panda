<template>
	<view class="recent-contact-container">
		<view class="contact-list-container">
			<u-card>
				<view slot="head">
					<span>{{title}}</span>
					<span class="right-span" @click="optShow = !optShow"><u-icon name="setting-fill"/></span>
				</view>
				<view class="" slot="body">
					<view v-for="(item,index) in contacts" :key="index" class="u-body-item">
						<view @click="handleChoseContact(item)">
							<view class="u-body-item-title u-line-2">{{item.alias}}</view>
							<view class="u-body-item-title u-line-2">{{item.uid}}</view>
							<view class="u-body-item-title u-line-2">{{item.name}}</view>
						</view>
						<view v-if="optShow" class="opt-area">
							<span @click="handleEdit(item)" class="txt-span">{{$t('transfer.edit')}}</span>
							<span @click="handleDelete(item)" class="txt-span">{{$t('transfer.delete')}}</span>
						</view>
					</view>
					
				</view>
			</u-card>
		</view>
		<view class="button-container">
			<button class="button contact-button" @click="handleCloseContact()">
			{{$t('cancel')}}
			</button>
		</view>
		<u-popup v-model="editShow" mode="bottom" length="60%">
			<view class="transfer-suc-form">
				<u-form :model="selectedContactInfo" :label-width="200" ref="uForm">
					<u-form-item :label="$t('transfer.toUid')"><u-input v-model="selectedContactInfo.uid" disabled/></u-form-item>
					<u-form-item :label="$t('transfer.toName')"><u-input v-model="selectedContactInfo.name" disabled/></u-form-item>
					<u-form-item :label="$t('transfer.alias')"><u-input v-model="selectedContactInfo.alias"/></u-form-item>
				</u-form>
			</view>
			<view class="transfer-suc-opt">
				<button class="button" type="primary" @click="saveContact">
					{{$t('confirm')}}</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: this.$t('recentContact.title'),
				contacts: [],
				optShow: false,
				editShow: false,
				selectedContactInfo: {},
			}
		},
		mounted() {
			this.getContactsList()
		},
		methods: {
			handleEdit(item) {
				console.log(item)
				this.editShow = true
				this.selectedContactInfo = item
			},
			handleDelete(item) {
				console.log(item)
				this.$u.api.accountMessageApis.deleteContact(item).then(res => {
					this.$util.showToastSuc(this.$t('recentContact.deleteSuc'));
					this.getContactsList()
				})
			},
			getContactsList() {
				this.$u.api.accountMessageApis.listContact({accountId: this.vuex_userInfo.id}).then(res => {
					console.log(res)
					this.contacts = res.data.recentContacts
				})
			},
			handleChoseContact(val) {
				// if (this.optShow) {
				// 	return;
				// }
				this.$emit('choseContact', val);
			},
			saveContact(){
				this.$u.api.accountMessageApis.updateContact(this.selectedContactInfo).then(res => {
						this.editShow = false;
						this.$util.showToastSuc(ths.$t('recentContact.updateSuc'));
					})
			},
			handleCloseContact() {
				this.$emit("closeContact");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recent-contact-container {
		height: 100vh;
		width: 100%;
		background: transparent;
		/deep/ .u-card {
			padding: 15px 15px;
			margin: 0px !important;
			background-color: transparent;
		}
		/deep/ .u-card__head {
			border: 1px #b8b9b9 solid;
			border-radius: 3px;
			justify-content: center;
			display: flex;
			font-size: 16px;
			font-style: inherit;
		}
		
		/deep/ .u-card__body {
			padding: 20px 30px
		}
	}
	.contact-list-containe {
		background: transparent;
		padding: 15px;
	}
	.button-container {
		
	}
	.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
	}
	
	.u-body-item {
		font-size: 16px;
		color: #333;
		padding: 10px 5px;
		border: 1px solid #b8b9b9;
		margin-top: 10px;
		border-radius: 5px;
		display: flex;
		height: 80px;
	}
	.opt-area {
		justify-content: center;
		display: flex;
		text-align: center;
		float: right;
		right: 40px;
		position: absolute;
	}
	.txt-span {
		justify-content: center;
		display: flex;
		text-align: center;
		padding: 2px 4px;
		height: 20px;
	}
	span.right-span {
	    right: 10px;
	    position: absolute;
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
	.button-container {
		justify-content: center;
		align-content: center;
		display: grid;
		margin-top: 10px;
		width: 100vw;
	}
	.transfer-suc-opt {
		justify-content: center;
		align-content: center;
		display: grid;
		margin-top: 10px;
		width: 100vw;
	}
	.transfer-suc-form {
		padding: 5px 20px;
	}
</style>
