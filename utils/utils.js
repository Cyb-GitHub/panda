// 提示框
const showToast = (title, callback, duration = 1500, mask = false, position = "center") => {
  uni.showToast({
    title,
    duration,
    position,
    mask,
    icon: "none",
    complete: () => {
      if (callback) {
        setTimeout(() => {
          callback();
        }, duration);
      }
    }
  });
}
// 成功提示框
const showToastSuc = (title, callback, duration = 1500, mask = false, position = "center") => {
  uni.showToast({
    title,
    duration,
    position,
    mask,
    icon: "success",
    complete: () => {
      if (callback) {
        setTimeout(() => {
          callback();
        }, duration);
      }
    }
  });
}
// 确定模态框(没有取消)
const submitModal = (title, content, callback) => {
  uni.showModal({
    title,
    content,
    confirmText: '确定',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        if (callback) {
          callback();
        }
      }
    }
  });
}

// 模态框
const showModal = (title, content, callback) => {
  uni.showModal({
    title,
    content,
    showCancel: true,
    cancelText: '确定',
    cancelColor: '#007aff',
    confirmText: '取消',
    confirmColor: '#e45656',
    success: function(res) {
      if (!res.confirm) {
        if (callback) {
          callback();
        }
      }
    }
  });
}

//四舍五入保留2位小数（不够位数，则用0替补）
const keepTwoDecimalFull = (num) => {
  var result = parseFloat(num);
  if (isNaN(result)) {
    return false;
  }
  result = Math.round(num * 100) / 100;
  var s_x = result.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

const isLogin = (vue) => {
  return !!vue.vuex_token;
}

const getPage = (level = 1) => {
  const pages = getCurrentPages();
  return pages[pages.length - level];
}

const copyTxt = (txt) => {
  return new Promise(function(resolve) {
    txt += "";
    if (txt == "null" || txt == "undefined" || txt == "") {
      console.warn("复制失败，内容为空");
      return;
    }
    let textarea = document.createElement("textarea")
    textarea.value = txt
    textarea.readOnly = "readOnly"
    document.body.appendChild(textarea)
    textarea.select() // 选中文本内容
    textarea.setSelectionRange(0, txt.length)
    let result = document.execCommand("copy")
    textarea.remove()
    resolve();
  });
}

const toAuth = () => {
  uni.showModal({
    title: "提示",
    content: "账户未认证,请先实名认证",
    showCancel: true,
    confirmText: "去认证",
    success: function(res) {
      if (res.confirm) {
        uni.navigateTo({
          url: '/pages/asset/auth'
        });
      }
    }
  });
}

const getParam = (url, paramName) => {
  var paramValue = "";
  var isFound = false;
  if (url.indexOf("?") == 0 && url.indexOf("=") > 1) {
    var arrSource = unescape(url).substring(1, url.length).split("&");
    var i = 0;
    while (i < arrSource.length && !isFound) {
      if (arrSource[i].indexOf("=") > 0) {
        if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
          paramValue = arrSource[i].split("=")[1];
          isFound = true;
        }
      }
      i++;
    }
  }
  return paramValue;
}

const cache = (key, value, seconds) => {
	var timestamp = Date.parse(new Date()) / 1000
	if (key && (value === null || value === undefined)) {
		//删除缓存
		//获取缓存
		var val = uni.getStorageSync(key);
		var tmp = val.split("|")
		if (!tmp[1] || timestamp >= tmp[1]) {
			console.log("key已失效")
			uni.removeStorageSync(key)
			return ""
		} else {
			return tmp[0]
		}
	} else if (key && value) {
		//设置缓存
		if (!seconds) {
			var expire = timestamp + (3600 * 3)
		}else{
			var expire = timestamp + seconds
		}
		value = value + "|" + expire
		uni.setStorageSync(key, value);
	} else {
		console.log("key不能空")
	}
}

const isInt = (n) => {
	var regs = /^\d+$/;
	return regs.test(n);
};

const checkPassword = (password) => {
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNum = /[0-9]/.test(password);
	if (!hasLower && !hasUpper && !hasNum) {
		return false;
	}
	//const specificSymbol = /[-`=\[\];',.~!@#$%^&*()_+|{}:"?]/;
	// const specificSymbol = /[-_?]/;
	// if (!specificSymbol.test(password)) {
	// 	return false;
	// }
	if (password.length < 8) {
		return false;
	}
	return true;
};

const isInteger = (obj) => {
 return (obj | 0) === obj
}


export default {
  showToast,
  showToastSuc,
  submitModal,
  showModal,
  getPage,
  isLogin,
  copyTxt,
  keepTwoDecimalFull,
  toAuth,
  getParam,
  cache,
  isInt,
  checkPassword,
  isInteger,
}
