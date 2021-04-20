// pages/BMI/BMI.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: 0,
    height: '',
    weight: '',
    sexOptions: [
      { text: '男', value: 0 },
      { text: '女', value: 1 }
    ],
    bmi: 0,
    bmiNotice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // bmi计算
  submit: function() {
    this.setData({
      bmi: (this.data.weight/Math.pow(this.data.height/100, 2)).toFixed(1)
    })
    const data = this.data.bmi
    switch (true) {
      case (data <= 18.4):
        this.setData({ bmiNotice: `您的BMI 值: ${data}，身体状态：偏瘦` })
        break;
      case (data > 18.5 && data <= 23.9):
        this.setData({ bmiNotice: `您的BMI 值: ${data}，身体状态：正常` })
        break;
      case (data > 24.0 && data <= 27.9):
        this.setData({ bmiNotice: `您的BMI 值: ${data}，身体状态：过重` })
        break;
      case (data >= 28.0):
        this.setData({ bmiNotice: `您的BMI 值: ${data}，身体状态：肥胖` })
        break;
      default:
        break;
    }
  },
  // 实现输入框双向绑定
  bindAndSet(e) {
    let name = e.currentTarget.dataset.inpval;
    this.setData({
      [name]: e.detail.value
    })
  }
})