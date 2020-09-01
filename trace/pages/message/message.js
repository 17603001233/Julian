// pages/message/message.js
const app = getApp()
const $http = app.http
const $api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryParam: {
      toUsername: '',
      pageNum: 0,
      pageSize: 30
    },
    dealParam: {
      friendRequestId: '',
      agree: true
    },
    list: []
  },

  // 处理好友请求
  dealRequest: function (e) {
    console.log(e)
    wx.showModal({
      title: '处理请求',
      content: '是否同意该好友的定位申请',
      showCancel: true,
      cancelText: '拒绝',
      confirmText: '同意',
      cancelColor: 'cancelColor',
      success: res => {
        this.setData({ 'dealParam.friendRequestId': e.currentTarget.dataset.id })
        if (res.confirm) return this.sendRequest(true)
        if (res.cancel) return this.sendRequest(false)
      }
    })
  },

  // 发送处理好友请求结果
  sendRequest: function (flag) {
    this.setData({ 'dealParam.agree': flag })
    console.log(this.data.dealParam)
    $http.askFor($api.friend.dealRequest, this.data.dealParam).then(res => {
      wx.showModal({
        title: '处理结果',
        content: `${flag ? '同意' : '拒绝'}${res.code === 20000 ? '成功！' : res.message}`
      })
      this.getFriendRequest()
    })
  },

  // 获取好友请求通知
  getFriendRequest: function () {
    $http.askFor($api.friend.queryRequest, this.data.queryParam).then(res => {
      this.setData({ list: res.data.pageInfo.list })
    })
  },

  // 获取用户信息
  getUserInfo: function (cb) {
    wx.getStorage({
      key: 'userInfo'
    }).then(info => {
      this.setData({ 'queryParam.toUsername': info.data.username })
      if (cb) cb()
    }).catch(() => wx.navigateTo({ url: '../login/login' }) )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getUserInfo(() => { this.getFriendRequest() })
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