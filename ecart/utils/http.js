// post form表单类型（暂时未使用）
const server = 'https://www.haichuang-tech.com:8082/webapi'
const app = getApp()
var lock = false

function getCurrentPage() {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let url = currentPage.route; //当前页面url
  return url
}

//封装接口post    json类型
function askFor(url, data) {
  return new Promise((resolve, reject) => {
    if (url.tokenFree) return resolve(request(url, data))
    return wx.getStorage({ key: 'userInfo' }).then(res => {
      let currentPage = getCurrentPage()
      if (!res.data.isLogin && currentPage[0].route !== 'pages/login/login') return wx.navigateTo({ url: '/pages/login/login' })
      return resolve(request(url, data, res.data.token))
    }).catch(res => {
      wx.navigateTo({ url: '/pages/login/login' })
      return reject(res)
    })
  })
}

function request(url, data, token) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '正在拼命加载' })
    wx.request({
      url: server + url.path,
      data: data,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "cache-control": "no-cache",
        "authentication": token || ''
      },
      method: url.method,
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 401) return wx.navigateTo({ url: '/pages/login/login' })
        if (res.data.code && res.data.code !== 20000) return wx.showModal({
          title: '错误提示',
          content: res.data.message || '未知错误',
          showCancel: false
        })
        resolve(res.data)
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false,
          success: res => { wx.navigateTo({ url: '/pages/login/login' }) }
        })
        reject(res)
      }
    })
  })
}

//将方法暴露
module.exports = {
  askFor
}