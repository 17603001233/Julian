module.exports = {
  user: {
    login: {
      path: '/user/login',
      method: 'POST',
      tokenFree: true
    },
    register: {
      path: '/user/register',
      method: 'POST',
      tokenFree: true
    },
    code2Session: {
      path: '/user/code2Session',
      method: 'GET',
      tokenFree: true
    }
  },
  index: {
    // 获取天气
    getWeather: {
      path: '/index/getWeatherByCityid',
      method: 'GET'
    },
    // 获取用户协议
    getAgreement: {
      path: '/index/agreement',
      method: 'GET',
      tokenFree: true
    },
    // 获取用户隐私
    getPravicy: {
      path: '/index/privacy',
      method: 'GET',
      tokenFree: true
    },
  },
  friend: {
    // 验证是否符合发送好友请求
    checkSendRequest: {
      path: '/friend/checkSendFriendRequest',
      method: 'GET'
    },
    // 处理好友请求
    dealRequest: {
      path: '/friend/dealFriendRequest',
      method: 'GET'
    },
    // 删除好友
    delete: {
      path: '/friend/deleteFriend',
      method: 'GET'
    },
    // 查询好友列表
    query: {
      path: '/friend/queryFriend',
      method: 'GET'
    },
    // 查询好友请求列表
    queryRequest: {
      path: '/friend/queryFriendRequest',
      method: 'GET'
    },
    // 发送好友请求
    sendRequest: {
      path: '/friend/sendFriendRequest',
      method: 'POST'
    },
    // 修改好友备注
    updateRemark: {
      path: '/friend/updateFriendRemark',
      method: 'GET'
    }
  },
  location: {
    // 上传用户位置
    add: {
      path: '/location/addLocationRecord',
      method: 'POST'
    },
    // 查询好友最后一次定位
    findLast: {
      path: '/location/findRecentLocationRecord',
      method: 'GET'
    },
    // 查询好友位置记录
    queryRecord: {
      path: '/location/queryFriendLocationRecord',
      method: 'GET'
    }
  },
  goods:{
    path: '/product/queryProduct',
    method: 'GET'
  },
  // 支付
  payfor:{
    createPay:{
      path: '/order/createOrder',
      method: 'post'
    }
  },
  // 登陆传给后台位置信息
  findConfigAddress:{
    path: '/config/findConfigAddress',
    method: 'post',
    tokenFree: true
  },
  // 获取地址是否收费
  findConfigColumn:{
    path: '/config/findConfigColumn',
    method: 'post',
    tokenFree: true
  }
}
