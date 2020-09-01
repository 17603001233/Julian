// pages/direction.js
// pages/map.js
const app = getApp()
var plugin = requirePlugin('routePlan')
var wxMarkerData = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    longitude: '',
    latitude: '',
    speed: '',
    accuracy: '',
    category: '生活服务,娱乐休闲',
    rgcData: {},
    polyline: {}
  },

  makertap: function(e) {
    console.log(e)
    this.showSearchInfo(wxMarkerData, e.markerId); 
  }, 

  showSearchInfo: function(data, i) { 
    this.setData({ 
        rgcData: { 
            address: '地址：' + data[i].address + '\n', 
            desc: '描述：' + data[i].desc + '\n', 
            business: '商圈：' + data[i].business 
        } 
    }); 
  },

  tapMap: function (data) {
  },

  toLocation: function () {
    wx.navigateTo({ url: '../location/location' })
  },

  // 获取当前用户位置信息
  getLocation:function () {
    wx.getLocation({
      type: 'gcj02',
      success: (location) => {
        this.setData({
          latitude: location.latitude,
          longitude: location.longitude
        })
      }, complete: () => {}
    })
  },

  // 逆地址解析
  direction: function (location) {
    this.getLocation()
    app.qqmapsdk.direction({
      mode: 'driving',
      from: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      to: {
        longitude: 44.910924079685394,
        latitude: 82.04473747002413
      },
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
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
    // this.direction(app.globalData.mapLocation)
    let plugin = requirePlugin('routePlan');
    let key = 'ENQBZ-IJKKD-ACI4X-H5PXE-RUVZ5-75BVJ';  //使用在腾讯位置服务申请的key
    let referer = 'wx76a9a06e5b4e693e';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': '深圳',
        'latitude': 22.54286,
        'longitude': 114.05956
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
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