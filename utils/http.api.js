/**
 * http接口API集中管理
 */
const install = (Vue, vm) => {
	// 小程序通用的接口
	let wxLogin = (code) => vm.$u.get('/wxLogin/' + code);
	let wxGetUserInfo = (params = {}) => vm.$u.post('/wxGetUserInfo', params);
	let wxGetPhoneNumber = (params = {}) => vm.$u.post('/wxGetPhoneNumber', params);
	const login = (params = {}) => vm.$u.post("/app/login", params);
	const getVersion = () => vm.$u.post("/app/version", {});
	const userInfo = () => vm.$u.get('/app/userInfo');
	const checkGoogleKey = (email) => vm.$u.get(`/app/checkGoogleKey?email=${email}`);
	const register = (params) => vm.$u.post(`/app/register`, params);
	const getRegisterValidateCode = (email) => vm.$u.get(`/app/getRegisterValidateCode?email=${email}`);
	const checkEmailExist = (email) => vm.$u.get(`/app/checkEmailExist?email=${email}`);
	const resetPassword = (params) => vm.$u.post(`/app/resetPassword`, params);
	const setNewPasswdByOriginPasswd = (params) => vm.$u.post(`/app/setNewPasswdByOriginPasswd`, params);
	
	const whitePaperApis = {
		list: (params) => vm.$u.post(`/white-paper/`, params),
		unread: (params) => vm.$u.post(`/white-paper/unread`, params),
		read: (params) => vm.$u.post(`/white-paper/read`, params),
	};
	
	const privateMessageApis = {
		list: (params) => vm.$u.post(`/private-message/`, params),
		delete: (params, privateMessageId) => vm.$u.post(`/private-message/delete/${privateMessageId}`, params),
		read: (params, privateMessageId) => vm.$u.post(`/private-message/read/${privateMessageId}`, params),
		deleleReadMessage: (params) => vm.$u.post(`/private-message/delete-read-private-message`, params),
		unread: (params) => vm.$u.post(`/private-message/unread`, params),
		award: (privateMessageId) => vm.$u.get(`/private-message/award`, {privateMessageId: privateMessageId}),
	};
	
	const accountMessageApis = {
		// amountInfo: () => vm.$u.get(`/account`),
		amountInfo: (accountId) => vm.$u.get(`/account/amount/info/${accountId}`),
		bambooFeed: (params) => vm.$u.post(`/account/bamboo/feed`, params),
		startRecharge: (params) => vm.$u.post(`/account/recharge/start`, params),
		startWithdrawal: (params) => vm.$u.post(`/account/withdrawal/start`, params),
		transferAmount: (params) => vm.$u.post(`/account/transfer/amount`, params),
		exchangeAmount: (params) => vm.$u.post(`/account/exchange/amount`, params),
		transferCheck: (params) => vm.$u.post(`/account/transfer/check`, params),
		feed: (params) => vm.$u.post(`/account/bamboo/feed`, params),
		statementList: (params) => vm.$u.post(`/account/statement/list`, params),
		previewExchange: (params) => vm.$u.post(`/account/exchange/preview`, params),
		previewWithdrawal: (params) => vm.$u.post(`/account/withdrawal/preview`, params),
		updateNickname: (nickname) => vm.$u.get(`/app/user/updateNickname`, {'nickname': nickname}),
		getShareQrCode: () =>vm.$u.get(`/app/user/getShareQrCode`),
		parseShareQrCode: (token) =>vm.$u.get(`/app/user/parseShareQrCode`, {'token': token}),
		addContact: (params) => vm.$u.post(`/account/contact/add`, params),
		deleteContact: (params) => vm.$u.post(`/account/contact/delete`, params),
		updateContact: (params) => vm.$u.post(`/account/contact/update`, params),
		listContact: (params) => vm.$u.post(`/account/contact/list`, params),
		rewardDetail: (params) => vm.$u.post(`/account/statement/detail/lpg/share/reward`, params),
		queryCooperateProgress: (params) => vm.$u.post(`/cooperate/progress/query`, params),
		querySharedAccountCooperateProgressPaged: (params) => vm.$u.post(`/cooperate/shared/account/progress/query/paged`, params),
		
	}
	
	const airdropBusinessApis = {
		pick: (params) => vm.$u.post(`/airdrop/pick`, params),
		available: (params) => vm.$u.post(`/airdrop/available`, params),
		
	}
	
	//raffle
	const raffleBusinessApis = {
		createRaffleRecord: (params) => vm.$u.post(`/raffle/record/create`, params),
		deleteRaffleRecord: (params) => vm.$u.post(`/raffle/record/delete`, params),
		queryRaffleRecordPaged: (params) => vm.$u.post(`/raffle/record/query/paged`, params),
		queryRaffleRecordDetail: (params) => vm.$u.post(`/raffle/record/detail/query`, params),
		payRaffleRecord: (params) => vm.$u.post(`/raffle/record/pay`, params),
		queryRaffleActivityPaged: (params) => vm.$u.post(`/raffle/activity/query/paged`, params),
		queryRaffleActivityDetail: (params) => vm.$u.post(`/raffle/activity/query/detail`, params),
		queryRaffleDcRecordPaged: (params) => vm.$u.post(`/raffle/dc/record/query/paged`, params),
		queryRaffleDcRecordWin: (params) => vm.$u.post(`/raffle/dc/record/query/win`, params),
	}
	const vote ={
		queryVoteActivityPaged: (params) => vm.$u.post(`/vote/activity/query/paged`, params),
		queryVoteActivitySingle: (params) => vm.$u.post(`/vote/activity/query/single`, params),
		join: (params) => vm.$u.post(`/vote/join`, params),
		weightQuery: (params) => vm.$u.post(`/vote/weight/query`, params)
	}
	
	vm.$u.api = {
		wxLogin,
		wxGetUserInfo,
		wxGetPhoneNumber,
		login,
		getVersion,
		userInfo,
		checkGoogleKey,
		register,
		getRegisterValidateCode,
		checkEmailExist,
		resetPassword,
		setNewPasswdByOriginPasswd,
		whitePaperApis: whitePaperApis,
		privateMessageApis: privateMessageApis,
		accountMessageApis: accountMessageApis,
		airdropBusinessApis: airdropBusinessApis,
		raffleBusinessApis: raffleBusinessApis,
		vote: vote,
	}
}

export default {
	install
}
