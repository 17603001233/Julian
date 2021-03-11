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
      appMarket: '',
      appPackage: 'wx.hc.friendtrack',
      appVersion: '1.0.0',
      password: '',
      username: ''
    }
  },

  toInstruction: function() {
    wx.navigateTo({ url: '../instruction/instruction' })
  },

  toRegister: function() {
    wx.navigateTo({ url: '../register/register' })
  },

  // 获取用户信息
  getUserInfo: function () {
    wx.getStorage({
      key: 'userInfo'
    }).then(info => {
      this.setData({ 'loginForm.username': info.data.username })
    }).catch(res => console.log(res) )
  },

  login: function(e) {
    this.setData({
      'loginForm.appMarket': app.globalData.basicInfo.appMarket,
      'loginForm.appPackage': app.globalData.basicInfo.appPackage,
      'loginForm.appVersion': app.globalData.basicInfo.appVersion,
      'loginForm.username': e.detail.value.username,
      'loginForm.password': e.detail.value.password
    })
    $http.askFor($api.user.login, this.data.loginForm).then(res => {
      console.log(res)
      let userInfo = res.data.userVo
      userInfo.username = e.detail.value.username
      userInfo.password = e.detail.value.password
      userInfo.isLogin = true
      wx.setStorage({ data: userInfo, key: 'userInfo' })
      wx.switchTab({ url: '../main/main' })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})