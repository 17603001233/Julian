// pages/main/main.js
const app = getApp()
const $http = app.http
const $api = app.api
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHer: false,
    userInfo: null, // 用户信息
    inputShowed: false,
    inputVal: '',
    weatherData: {}, // 天气信息
    queryParam: { // 查询定位好友列表参数
      username: '',
      pageNum: 1,
      pageSize: 100
    },
    queryMessageNumParam: { // 查询未处理好友请求数量参数
      toUsername: '',
      pageNum: 0,
      pageSize: 30
    },
    requestNumber: 0, // 好友请求数量
    friendList: [], // 定位好友列表
    applicationList: [
      {
        id: 'weather',
        title: '今日温度',
        icon: '../../images/weather.png',
        content: '',
        path: 'weather'
      }, {
        id: 'subway',
        title: '地铁',
        icon: '../../images/subway.png',
        content: '',
        bindtap: 'toSubway'
      }
      // {
      //   id: 'COVID',
      //   title: '疫情动态',
      //   icon: '../../images/virus.png',
      //   content: '',
      //   bindtap: 'toCOVID'
      // }
    ]
  },

  // 判断用户
  checkUser: function (username) {
    // if (username === '18609099291') {
    if (username === '18609099291') this.setData({ isHer: true })
  },

  // 去往目的地
  toDirection: function () {
    let plugin = requirePlugin('routePlan');
    let key = 'ENQBZ-IJKKD-ACI4X-H5PXE-RUVZ5-75BVJ';  //使用在腾讯位置服务申请的key
    let referer = 'wx76a9a06e5b4e693e';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': '深圳',
        // 'latitude': 44.910924079685394,
        // 'longitude': 82.04473747002413
        'latitude': 22.54286,
        'longitude': 114.05956
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },

  // 查看地铁图
  toSubway: function () {
    let plugin = requirePlugin("subway");
    let key = 'ENQBZ-IJKKD-ACI4X-H5PXE-RUVZ5-75BVJ' // 使用在腾讯位置服务申请的key;
    let referer = 'wx76a9a06e5b4e693e' //调用插件的app的名称
    wx.navigateTo({
      url: 'plugin://subway/index?key=' + key + '&referer=' + referer
    });
  },

  // 查看疫情动态
  toCOVID: function () {
    wx.navigateTo({ url: '../virus/virus' })
  },

  search: function (value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{text: '搜索结果', value: 1}, {text: '搜索结果2', value: 2}])
        }, 200)
    })
  },

  selectResult: function (e) {
  },

  // 跳转至家人页
  toFriends: function () {
    wx.navigateTo({ url: '../friends/friends' })
  },

  // 跳转至助手页
  toAssistant: function () {
    wx.navigateTo({ url: '../assistant/assistant' })
  },

  // 跳转至消息页
  toMessage: function () {
    wx.navigateTo({ url: '../message/message' })
  },

  // 获取好友最后一次位置
  locateFriend: function (e) {
    $http.askFor($api.location.findLast, {
      username: e.currentTarget.dataset.username
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

  // 获取好友请求通知
  getFriendRequest: async function () {
    this.setData({ 'queryMessageNumParam.toUsername': this.data.userInfo.username })
    $http.askFor($api.friend.queryRequest, this.data.queryMessageNumParam).then(res => {
      this.setData({ requestNumber: res.data.pageInfo.total })
    })
  },

  // 发送好友请求
  sendFriendRequest: function (e) {
    if (!e.detail.value) return
    // 验证是否符合发送条件
    $http.askFor($api.friend.checkSendRequest, {
      friendUsername: e.detail.value
    }).then(res => {
      switch (res.data.check) {
        case 0:
          wx.showModal({
            title: '请求失败',
            content: '用户未注册',
            showCancel: false
          })
          break;
        case 1:
          wx.showModal({
            title: '请求失败',
            content: '该用户名已经是您的好友',
            showCancel: false
          })
          break;
        case 2:
          $http.askFor($api.friend.sendRequest, {
            toUsername: e.detail.value
          }).then(result => {
            if (result.code !== 20000) return
            return wx.showModal({
              title: '提示',
              content: '发送好友请求成功，等待朋友验证',
              showCancel: false
            })
          })
          break;
      }
    })
  },

  // 获取用户信息
  getUserInfo: async function () {
    return wx.getStorage({
      key: 'userInfo'
    }).then(info => {
      this.checkUser(info.data.username)
      this.setData({ userInfo: info.data })
      this.login(info.data)
      return info
    }).catch(() => {
      wx.navigateTo({ url: '../login/login' })
      return null
    })
  },

  getFriendList: async function (e) {
    this.setData({ 'queryParam.username': this.data.userInfo.username })
    $http.askFor($api.friend.query, this.data.queryParam).then((res) => {
      console.log(res)
      this.setData({ friendList: res.data.pageInfo.list })
    })
  },

  // 跳转至助手详情页
  toDetail: function (e) {
    if (e.currentTarget.dataset.app.id === 'weather') this.getWeather()
    let path = e.currentTarget.dataset.app.path
    if (path !== '') wx.navigateTo({ url: `../../pages/${path}/${path}` })
  },

  // 获取天气信息（百度地图）
  getWeather: function () {
    app.BMap.weather({
      success: data => {
        let weatherData = data.currentWeather[0]
        weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' +'日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' +'天气：' + weatherData.weatherDesc + '\n' +'风力：' + weatherData.wind + '\n'
        console.log(weatherData)
        let list = this.data.applicationList
        list.forEach(item => {
          if (item.id === 'weather') {
            item.content = data.currentWeather[0].temperature
            item.title = data.currentWeather[0].weatherDesc
          }
        })
        this.setData({ applicationList: list })
      },
      fail: () => { console.log('get weather fail') }
    })
  },

  // 登录
  login: function(data) {
    this.setData({
      'loginForm.appMarket': app.globalData.basicInfo.appMarket,
      'loginForm.appPackage': app.globalData.basicInfo.appPackage,
      'loginForm.appVersion': app.globalData.basicInfo.appVersion,
      'loginForm.username': data.username,
      'loginForm.password': data.password
    })
    $http.askFor($api.user.login, this.data.loginForm).then(res => {
      console.log(res)
      let userInfo = res.data.userVo
      userInfo.username = data.username
      userInfo.password = data.password
      userInfo.isLogin = true
      wx.setStorage({ data: userInfo, key: 'userInfo' })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    this.setData({ search: this.search.bind(this) })
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
    this.getUserInfo().then(res => {
      if (res === null) return
      this.getWeather()
      this.getFriendList()
      this.getFriendRequest()
      util.getLocation(res => {
        let list = this.data.applicationList
        list.forEach(item => { if (['subway', 'COVID'].indexOf(item.id) > -1) item.content = res.result.address_component.city })
        this.setData({ applicationList: list })
      })
    })
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