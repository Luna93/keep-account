//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    array: ['普通', '吃饭', '购物', '出行', '娱乐','居家','投资','人情','生意','其他'],
    index: 0,
    date: '2016-09-01',
    amountVal: '',
    loadingflag: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }  
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  radioChange: function (e) {
    if(e.detail.value == 1) {
      this.setData({
        index: 0,
        array: ['工资', '其他']
      })
    } else {
      this.setData ({
        index: 0,
        array: ['普通', '吃饭', '购物', '出行', '娱乐', '居家', '投资', '人情', '生意', '其他']
      })
    }
  },
  formReset: function (e) {
    this.setData({
      array: ['普通', '吃饭', '购物', '出行', '娱乐', '居家', '投资', '人情', '生意', '其他'],
      index: 0,
      date: '2016-09-01',
      amountVal: '',
      loadingflag: false
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var type = e.detail.value.type;
    var amount = e.detail.value.amount.replace(/\s+/g, '');
    var remark = e.detail.value.remark.replace(/\s+/g, '');
    var subType = e.detail.value.subType;
    var subTypeName = e.detail.value.subTypeName;
    var accountTime = e.detail.value.accountTime;
    
    if (amount == "" || amount.length == 0){
      this.setData({
        amountVal: '',
        amountPlace: '请输入金额!'
      })
      return
    }
    this.setData({
      loadingflag: true
    })
    toSave(type, amount, remark, subType, subTypeName, accountTime);
  }
})

function toSave(type, amount, remark, subType, subTypeName, accountTime) {
  wx.request({
    url: 'localhost:9999/test',
    data:{

    }
  })
}