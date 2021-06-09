//index.js

const { user } = require("../../utils/api")

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {
      image: '../../images/default-headshot.png',
      name: '',
      sex: 'female',
      age: '25'
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  toPage: function (e) {
    let path = e.currentTarget.dataset.path
    wx.navigateTo({ url: `../../pages/${path}/${path}` })
  },

  onShow: function() {
    wx.getStorage({ key: 'userInfo' }).then(info => {
      let userInfo = info.data
      this.setData({ 'userInfo.name': userInfo.username })
    }).catch(error => {})
  },

  onLoad: function () {
    if (app.globalData.wxUserInfo) {
      this.setData({
        userInfo: app.globalData.wxUserInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.wxUserInfo = res.userInfo
          this.setData({ userInfo: res.userInfo, hasUserInfo: true })
        }
      })
    }
  },

  toPravicy: function() {
    wx.navigateTo({ url: '../instruction/instruction' })
  },

  toAgreement: function() {
    wx.navigateTo({ url: '../agreement/agreement' })
  },
  
  getPhoneNumber (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  // 退出登录
  logout: function () {
    wx.getStorage({
      key: 'userInfo',
    }).then(info => {
      let userInfo = info.data
      userInfo.isLogin = false
      wx.setStorage({ data: userInfo, key: 'userInfo' })
    })
    wx.navigateTo({ url: '../login/login' })
  },

  getUserInfo: function(e) {
    app.globalData.wxUserInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function (e) {
  }
})
