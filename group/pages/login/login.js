// pages/login/login.js
const app = getApp()
const $http = app.http
const $api = app.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginForm: {
      appMarket: app.globalData.basicInfo.appMarket,
      appPackage: app.globalData.basicInfo.appPackage,
      appVersion: app.globalData.basicInfo.appVersion,
      password: '',
      username: ''
    }
  },
  // 跳转至用户手册
  toInstruction: function() { wx.navigateTo({ url: '../instruction/instruction' }) },
  // 跳转至登录页
  toRegister: function() { wx.navigateTo({ url: '../register/register' }) },
  // 登录
  login: function(e) {
    this.setData({
      'loginForm.username': e.detail.value.username,
      'loginForm.password': e.detail.value.password
    })
    $http.askFor($api.user.login, this.data.loginForm).then(res => {
      let userInfo = res.data.userVo
      userInfo.username = e.detail.value.username
      userInfo.password = e.detail.value.password
      userInfo.isLogin = true
      wx.setStorage({ data: userInfo, key: 'userInfo' })
      wx.switchTab({ url: '../main/main' })
    })
  }
})