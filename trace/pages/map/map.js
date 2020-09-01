// pages/map.js
const app = getApp()
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
    rgcData: {}
  },

  makertap: function(e) {
    this.showSearchInfo(this.data.markers, e.markerId); 
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
  regeocoding: function (location) {
    app.qqmapsdk.reverseGeocoder({
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      success: (res) => {
        console.log(res);
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
          iconPath: '../../images/default-headshot.png',//图标路径
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
          longitude: res.location.lng
        })
      },
      fail: (res) => {}
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
    this.regeocoding(app.globalData.mapLocation)
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