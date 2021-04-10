// pages/location/location.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: ''
  },
  /**
   * 页面的初始数据
   */
  submitForm: function (e) {
    app.globalData.mapLocation = e.detail.value
    this.setData({
      'longitude': e.detail.value.longitude,
      'latitude': e.detail.value.latitude
    })
    wx.switchTab({ url: '../map/map' })
  },

  // 去往目的地
  toDirection: function () {
    let plugin = requirePlugin('routePlan');
    let key = app.globalData.secret.qqmap;  //使用在腾讯位置服务申请的key
    let referer = 'wx76a9a06e5b4e693e';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': '',
        'latitude': this.data.latitude,
        'longitude': this.data.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
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