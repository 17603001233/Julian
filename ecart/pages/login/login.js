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
      appPackage: 'wx.hc.friendtrack',
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

  // 获取用户信息
  getUserInfo: function() {
    wx.getStorage({
      key: 'userInfo'
    }).then(info => {
      this.setData({ 'loginForm.username': info.data.username })
    }).catch(res => console.log(res))
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
      this.getLocation()
    })
  },
  findConfig: function() {
    var add = {
      "address": this.data.address,
      "agencyChannel": "miniProgram",
      "appMarket": "miniProgram",
      "appPackage": "wx.hc.friendtrack",
      "appVersion": "1.0.0",
      "application": "sjdw"
    }
    $http.askFor($api.findConfigAddress, add).then(res => {
      console.log(res)
      // if (res.data.configAddress.isCharge == '0') {
        var userInfo = wx.getStorageSync('user');
        userInfo.isCharge = 0
        wx.setStorageSync('userInfo', userInfo);
      // }
    })
  },
  // 获取当前用户位置信息
  getLocation: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: (location) => {
        this.setData({
          latitude: location.latitude,
          longitude: location.longitude
        })
        that.regeocoding(location)
      },
      complete: () => {

      }
    })
  },

  // 逆地址解析
  regeocoding: function(location) {
    app.qqmapsdk.reverseGeocoder({
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      success: (res) => {
        var res = res.result;
        var mks = [];
        /**
         *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
         *
            for (var i = 0; i < result.pois.length; i++) {
            mks.push({ // 获取返回结果，放到mks数组中
                title: result.pois[i].title,
                id: result.pois[i].id,
                latitude: result.pois[i].location.lat,
                longitude: result.pois[i].location.lng,
                iconPath: './resources/placeholder.png', //图标路径
                width: 20,
                height: 20
            })
            }
        *
        **/
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/default-headshot.png', //图标路径
          width: 40,
          height: 40,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: res.address,
            color: '#000',
            display: 'ALWAYS',
            padding: 10
          }
        });
        this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          latitude: res.location.lat,
          longitude: res.location.lng,
          address: mks[0].title
        })
        this.findConfig()
      },
      fail: (res) => {}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo()
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