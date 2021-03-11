var bmap = require('../../lib/bmap-wx.min.js');
var wxMarkerData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: ''
  },

  onLoad: function () {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'uGLScSa3TZjBqzGY5Zy1GuFFAtBy2N0I'
    });

    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });  
    }
    BMap.geocoding({
      address: '北京市海淀区上地十街10号',
      fail: fail,
      success: success,
      iconPath: '../../images/marker_red.png',
      iconTapPath: '../../images/marker_red.png'
    });
  }

})