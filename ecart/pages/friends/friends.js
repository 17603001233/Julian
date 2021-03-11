// pages/friends/friends.js
const app = getApp()
const $http = app.http
const $api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, // 用户信息
    queryParam: { // 查询定位好友列表参数
      username: '',
      pageNum: 1,
      pageSize: 100
    },
    updateRemarkParam: { // 修改好友备注参数
      friendId: '',
      remark: ''
    },
    dialogShow: false, // 修改好友备注弹框
    buttons: [{text: '取消'}, {text: '确定'}]
  },

  // 关闭好友备注弹框
  bindclose: function (e) {
    console.log(e)
  },
  
  // 绑定修改备注value
  bindinput: function (e) {
    this.setData({ 'updateRemarkParam.remark': e.detail.value })
  },

  // 点击好友备注弹框按钮
  tapDialogButton: function (e) {
    console.log(e)
    console.log(this.data.updateRemarkParam)
    if (e.detail.item.text === '确定') {
      $http.askFor($api.friend.updateRemark, this.data.updateRemarkParam).then(res => {
        this.getFriendList()
        wx.showToast({ title: '修改成功' })
        this.setData({ dialogShow: false })
      })
    } else {
      this.setData({ dialogShow: false })
    }
  },

  // 获取用户信息
  getUserInfo: function (cb) {
    wx.getStorage({
      key: 'userInfo'
    }).then(info => {
      this.setData({ userInfo: info.data })
      if (cb) cb()
    }).catch((res) => { wx.navigateTo({ url: '../login/login' }) })
  },

  // 查询好友列表
  getFriendList: function (e) {
    this.setData({ 'queryParam.username': this.data.userInfo.username })
    $http.askFor($api.friend.query, this.data.queryParam).then((res) => {
      this.setData({ friendList: res.data.pageInfo.list })
    })
  },

  // 删除好友
  deleteFriend: function (e) {
    wx.showModal({
      title: '删除好友',
      content: `是否删除${e.currentTarget.dataset.friend.friendUsername}，不再查看TA的定位`,
      showCancel: true,
      cancelText: '取消',
      confirmText: '删除',
      cancelColor: 'cancelColor',
      success: res => {
        if (res.confirm) {
          $http.askFor($api.friend.delete, {
            friendId: e.currentTarget.dataset.friend.id,
            friendRequestId: e.currentTarget.dataset.friend.friendRequestId
          }).then(res => {
            wx.showModal({
              title: '提示',
              content: '删除成功！',
              success: () => { this.getFriendList() }
            })
          })
        }
      }
    })
  },

  // 获取好友最后一次位置
  locateFriend: function (e) {
    $http.askFor($api.location.findLast, {
      username: e.currentTarget.dataset.friend.username
    }).then(res => {
      console.log(res)
      if (res.code === 20000) {
        app.globalData.mapLocation = {
          latitude: res.data.locationRecord.lat,
          longitude: res.data.locationRecord.lon
        }
        wx.switchTab({ url: '/pages/map/map' })
      }
    })
  },

  // 修改好友备注
  changeFriendRemark: function (e) {
    console.log(e)
    this.setData({
      dialogShow: true,
      'updateRemarkParam.friendId': e.currentTarget.dataset.friend.id
    })
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
    this.getUserInfo(() => { this.getFriendList() })
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