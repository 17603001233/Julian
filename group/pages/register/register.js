// pages/register/register.js
const app = getApp()
const $http = app.http
const $api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerForm: {
      appPackage: '',
      appVersion: '',
      agencyChannel: '',
      appMarket: '',
      application: '',
      devicePlatform: '',
      password: '',
      username: ''
    }
  },

  register: function(e) {
    let reg = /([0-9a-zA-Z]){5,11}/;

    //手机号码校验
    if (!reg.test(e.detail.value.username)) {
      wx.showModal({
        title: '手机号码有误',
        content: '手机号码有误，请重新输入',
        showCancel: false,
        success: res => {
          this.setData({
            'registerForm.username': '',
            'registerForm.password': ''
          })
        }
      })
    } else {
      this.setData({ // 设置注册基本信息
        'registerForm.appPackage': app.globalData.basicInfo.appPackage,
        'registerForm.appVersion': app.globalData.basicInfo.appVersion,
        'registerForm.agencyChannel': app.globalData.basicInfo.agencyChannel,
        'registerForm.appMarket': app.globalData.basicInfo.appMarket,
        'registerForm.application': app.globalData.basicInfo.application,
        'registerForm.devicePlatform': app.globalData.basicInfo.system,
        'registerForm.username': e.detail.value.username,
        'registerForm.password': e.detail.value.password
      })
      $http.askFor($api.user.register, this.data.registerForm).then(res => {
        wx.setStorage({
          data: {
            username: res.data.user.username,
            isLogin: false
          },
          key: 'userInfo',
        })
        this.toLoginPage()
      })
    }
  },

  // 跳转登录页
  toLoginPage: function() {
    wx.navigateTo({ url: `../login/login` })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})