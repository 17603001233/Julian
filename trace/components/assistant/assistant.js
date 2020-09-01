// components/assistant/assistant.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    applicationList: [
      {
        id: 'weather',
        title: '今日温度',
        icon: '../../images/weather.png',
        content: '28.3℃',
        path: ''
      }, {
        id: 'sport',
        title: '运动步数',
        icon: '../../images/sport.png',
        content: '5577',
        path: ''
      }, {
        id: 'health',
        title: '健康提醒',
        icon: '../../images/health.png',
        content: '',
        title: '晴',
        path: 'health'
      }, {
        id: 'record',
        title: '语音备忘录',
        icon: '../../images/record.png',
        content: '',
        path: 'record'
      }, {
        id: 'physicalExamination',
        title: '体质监测',
        icon: '../../images/physical-examination.png',
        content: '',
        path: 'physicalExamination'
      }, {
        id: 'bodySurfaceExamination',
        title: '体表监测',
        icon: '../../images/body-surface-examination.png',
        content: '',
        path: 'bodySurfaceExamination'
      }, {
        id: 'antiLostCode',
        title: '防丢码生成',
        icon: '../../images/anti-lost-code.png',
        content: '',
        path: 'antiLostCode'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function (event) {
      let path = event.currentTarget.dataset.path
      if (path === '') return
      wx.navigateTo({
        url: `../../pages/${path}/${path}`,
      })
    }
  }
})
