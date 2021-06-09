// pages/login/login.js
const app = getApp()
const $http = app.http
const $api = app.api
var wxMarkerData = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    longitude: '',
    latitude: '',
    rgcData: {},
    loginForm: {
      appMarket: '',
      appPackage: 'wx.ecart.friendtrack',
      appVersion: '1.0.0',
      password: '',
      username: ''
    },
    error: {
      username: false,
      password: false
    }
  },

  toPravicy: function() {
    wx.navigateTo({ url: '../instruction/instruction?flag=privacy' })
  },

  toAgreement: function() {
    wx.navigateTo({ url: '../instruction/instruction?flag=agreement' })
  },

  toRegister: function() {
    wx.navigateTo({ url: '../register/register' })
  },

  login: function(e) {
    this.setData({ 'error.username': !e.detail.value.username, 'error.password': !e.detail.value.password });
    if (this.data.error.username || this.data.error.password) return;
    this.setData({
        'loginForm.appMarket': app.globalData.basicInfo.appMarket,
        'loginForm.appPackage': app.globalData.basicInfo.appPackage,
        'loginForm.appVersion': app.globalData.basicInfo.appVersion,
        'loginForm.username': e.detail.value.username,
        'loginForm.password': e.detail.value.password
      })
      //测试账号 miniprogramtest 1314
    $http.askFor($api.user.login, this.data.loginForm).then(res => {
      let userInfo = res.data.userVo
      userInfo.username = e.detail.value.username
      userInfo.password = e.detail.value.password
      userInfo.isLogin = true
      wx.setStorage({ data: userInfo, key: 'userInfo' })
      wx.switchTab({ url: '../main/main' })
    })
  },
})