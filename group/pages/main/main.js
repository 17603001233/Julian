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
    friendNumber: '',
    hiddenmodalput: true,
    userInfo: null, // 用户信息
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
    applicationList: [{
        id: 'subway',
        title: '地铁',
        icon: '../../images/subway.png',
        content: '',
        bindtap: 'toSubway'
      }, {
        id: 'map',
        title: '地图',
        icon: '../../images/map.png',
        content: '',
        bindtap: 'toMap'
      }, {
        id: 'route',
        title: '路线',
        icon: '../../images/map1.png',
        content: '',
        bindtap: 'toDirection'
      }, {
        id: 'BMI',
        title: 'BMI',
        icon: '../../images/dumbbell.png',
        content: '',
        bindtap: 'toBMI'
      }
    ],
    isShowFriendPanel: false
  },
  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput: function() {
    this.getUserInfo().then(res => {
      if (res === null) return wx.navigateTo({ url: '../login/login' })
      if (this.isCharge()) return this.goodsDetail()
      this.setData({ hiddenmodalput: !this.data.hiddenmodalput })
    })
  },
  //取消按钮  
  cancel: function() {
    this.setData({ hiddenmodalput: true });
    this.setData({ friendNumber: '' });
  },
  //确认  
  confirm: function(e) {
    this.setData({ hiddenmodalput: true });
    this.setData({ friendNumber: '' });
    this.sendFriendRequest()
  },

  // 去往目的地
  toDirection: function() {
    let key = app.globalData.secret.qqmap; //使用在腾讯位置服务申请的key
    let referer = 'wx76a9a06e5b4e693e'; //调用插件的app的名称
    let endPoint = JSON.stringify({ //终点
      'name': '深圳',
      'latitude': 22.54286,
      'longitude': 114.05956
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },

  // 查看地铁图
  toSubway: function() {
    let key = app.globalData.secret.qqmap // 使用在腾讯位置服务申请的key;
    let referer = 'wx76a9a06e5b4e693e' //调用插件的app的名称
    wx.navigateTo({
      url: 'plugin://subway/index?key=' + key + '&referer=' + referer
    });
  },

  // 查看疫情动态
  toCOVID: function() {
    wx.navigateTo({ url: '../virus/virus' })
  },
  
  // 查看BMI
  toBMI: function() {
    wx.navigateTo({ url: '../BMI/BMI' })
  },

  // 查看地图
  toMap: function() {
    wx.switchTab({ url: '../map/map' })
  },
  selectResult: function(e) {},

  // 跳转至家人页
  toFriends: function() {
    this.getUserInfo().then(res => {
      if (res === null) return wx.navigateTo({ url: '../login/login' })
      wx.navigateTo({ url: '../friends/friends' })
    })
  },

  // 跳转至助手页
  toAssistant: function() {
    wx.navigateTo({ url: '../assistant/assistant' })
  },

  // 跳转至消息页
  toMessage: function() {
    this.getUserInfo().then(res => {
      if (res === null) return wx.navigateTo({ url: '../login/login' })
      wx.navigateTo({ url: '../message/message' })
    })
  },

  // 获取好友最后一次位置
  locateFriend: function(e) {
    $http.askFor($api.location.findLast, {
      username: e.currentTarget.dataset.username
    }).then(res => {
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
  getFriendRequest: async function() {
    this.setData({ 'queryMessageNumParam.toUsername': this.data.userInfo.username })
    $http.askFor($api.friend.queryRequest, this.data.queryMessageNumParam).then(res => {
      this.setData({ requestNumber: res.data.pageInfo.total })
    })
  },

  // 发送好友请求
  sendFriendRequest: function() {
    if (this.data.friendNumber == '') return
      // 验证是否符合发送条件
    $http.askFor($api.friend.checkSendRequest, {
      friendUsername: this.data.friendNumber
    }).then(res => {
      switch (res.data.check) {
        case 0: case 1:
          wx.showModal({ title: '请求失败', content: ['用户未注册', '该用户名已经是您的好友'][res.data.check], showCancel: false })
          break;
        case 2:
          $http.askFor($api.friend.sendRequest, { toUsername: this.data.friendNumber }).then(result => {
            if (result.code !== 20000) return
            return wx.showModal({ title: '提示', content: '发送好友请求成功，等待朋友验证', showCancel: false })
          })
          break;
      }
    })
  },

  // 获取用户信息
  getUserInfo: async function() {
    return wx.getStorage({ key: 'userInfo' }).then(info => {
      this.setData({ userInfo: info.data })
      if (!info.data.isLogin) this.login(info.data)
      return info
    }).catch(() => { return null })
  },
  // 获取好友列表
  getFriendList: async function(e) {
    this.setData({ 'queryParam.username': this.data.userInfo.username })
    $http.askFor($api.friend.query, this.data.queryParam).then((res) => {
      this.setData({ friendList: res.data.pageInfo.list })
    })
  },
  // 跳转至助手详情页
  toDetail: function(e) {
    if (e.currentTarget.dataset.app.id === 'weather') this.getWeather()
    let path = e.currentTarget.dataset.app.path
    if (path !== '') wx.navigateTo({ url: `../../pages/${path}/${path}` })
  },

  // 获取天气信息（百度地图）
  getWeather: function() {
    app.BMap.weather({
      success: data => {
        let weatherData = data.currentWeather[0]
        weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n'
        let list = this.data.applicationList
        list.forEach(item => {
          if (item.id === 'weather') {
            item.content = data.currentWeather[0].temperature
            item.title = data.currentWeather[0].weatherDesc
          }
        })
        this.setData({ applicationList: list })
      }, fail: () => { console.log('get weather fail') }
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
  onLoad: function(options) {
  },

  // 判断是否会员
  isCharge: async function() {
    let userInfo = wx.getStorageSync('userInfo')
    let appInfo = wx.getStorageSync('appInfo')
    let isIOS = appInfo.system.toLowerCase().indexOf('ios') > -1
    await this.findConfig()
    if (userInfo && userInfo.config) {
      this.setData({ isShowFriendPanel: (parseInt(userInfo.config.isCharge) == 1 && !isIOS) || userInfo.productFeature !== null })
      return parseInt(userInfo.config.isCharge) == 1 && userInfo.productFeature == null && !isIOS
    } else {
      return false
    }
  },

  getOpenId: function() {
    let openId = wx.getStorageSync('users')
    let detailInfo = {
      "openId": openId.openid,
      "payDesc": "无支付宝.有微信。",
      "payType": 4,
      "phone": "",
      "productId": this.data.productId,
      "productName": this.data.productName,
      "rice": this.data.price
    }
    Object.assign(detailInfo, app.globalData.basicInfo)
    $http.askFor($api.payfor.createPay, detailInfo).then(res => {
      if (res.success) {
        let data = JSON.parse(res.data.orderVo.paymentData)
        let param = { "timeStamp": data.timeStamp, "package": data.package, "paySign": data.paySign, "signType": "MD5", "nonceStr": data.nonceStr }
        this.pay(param)
      }
    })
  },
  // 微信支付
  pay: function(param) {
    wx.requestPayment({
      nonceStr: param.nonceStr,
      package: param.package,
      paySign: param.paySign,
      signType: param.signType,
      timeStamp: param.timeStamp,
      success: () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        this.onShow()
      }, fail: (res) => {}, complete: (res) => {}
    })
  },
  // 获取商品列表
  goodsDetail: function() {
    $http.askFor($api.goods).then(result => {
      if (result.code === 20000) {
        let details = []
        for (const data of result.data.list) {
          details.push(data.id + '-' + data.productName + '-' + data.price + '元')
        }
        this.setData({ goods: details })
        wx.showActionSheet({
          itemList: details,
          success: (res) => {
            let str = details[res.tapIndex].split('-')
            this.setData({
              productId: str[0],
              productName: str[1],
              price: parseInt(str[2])
            })
            this.getOpenId()
          }, fail: () => {}
        })
      }
    })
  },
  
  // 逆地址解析
  regeocoding: function(location) {
    console.log(location)
    app.qqmapsdk.reverseGeocoder({
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      success: (result) => {
        let res = result.result;
        let mks = [];
        /**
         *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
         *
            for (let i = 0; i < result.pois.length; i++) {
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
          callout: { content: res.address, color: '#000', display: 'ALWAYS', padding: 10 } //在markers上展示地址名称，根据需求是否需要
        });
        this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          latitude: res.location.lat,
          longitude: res.location.lng,
          address: mks[0].title,
          city: res.address_component.province + res.address_component.city
        })
      },
      fail: (res) => {}
    })
  },
  // 判断是否需要收费
  findConfig: async function() {
    let add = { "address": this.data.city }
    Object.assign(add, app.globalData.basicInfo)
    return $http.askFor($api.findConfigAddress, add).then(res => {
      let userInfo = wx.getStorageSync('userInfo');
      userInfo.isCharge = parseInt(res.data.configAddress.isCharge)
      wx.setStorageSync('userInfo', userInfo);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    util.getLocation(res => {
      this.regeocoding(app.globalData.mapLocation)
      let list = this.data.applicationList
      list.forEach(item => { item.content = res.result.address_component.city })
      this.setData({ applicationList: list })
    })
    this.getUserInfo().then(res => {
      if (res === null) return
      this.getFriendList()
      this.getFriendRequest()
      this.isCharge()
    })
  }
})