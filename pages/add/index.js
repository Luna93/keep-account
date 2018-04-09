var util = require('../../utils/util.js');
//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    array: ['普通', '吃饭', '购物', '出行', '娱乐','居家','投资','人情','生意','其他'],
    index: 0,
    date: util.formatTime2(new Date),
    amountVal: '',
    inputVal:'',
    loadingflag: false,
    userInfo: {},
    userId:'',
    // hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        userId: wx.getStorageSync('userId')
        // hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          userId: wx.getStorageSync('userId')
          // hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            userId: wx.getStorageSync('userId')
            // hasUserInfo: true
          })
        }
      })
    }  
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
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
    var _this = this;
    resetfun(_this);
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var _this = this;
    var atype = e.detail.value.type;
    var amount = e.detail.value.amount.replace(/\s+/g, '');
    var remark = e.detail.value.remark.replace(/\s+/g, '');
    var subType = e.detail.value.subType;
    var subTypeName = e.detail.value.subTypeName;
    var accountTime = e.detail.value.accountTime;
    var userId = _this.data.userId;
    
    if (amount == "" || amount.length == 0){
      this.setData({
        amountVal: '',
        amountPlace: '请输入金额!'
      })
      return
    }
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
   
    if (!reg.test(amount)) {
      console.log('1')
      this.setData({
        amountVal: '',
        amountPlace: '金额格式错误!'
      })
      return
    }

    this.setData({
      loadingflag: true
    })
    toSave(atype, amount, remark, subType, subTypeName, accountTime, userId, _this);
    this.setData({
      loadingflag: false
    })
  }
})
function resetfun(_this){
  _this.setData({
    array: ['普通', '吃饭', '购物', '出行', '娱乐', '居家', '投资', '人情', '生意', '其他'],
    index: 0,
    date: util.formatTime2(new Date),
    amountVal: '',
    inputVal:'',
    loadingflag: false,
    amountPlace: ''
  })
}
function toSave(atype, amount, remark, subType, subTypeName, accountTime, userId, _this) {
  wx.request({
    url: 'http://weixin.frp2.chuantou.org/account/save',
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      type: atype,
      amount: amount,
      remark: remark,
      subType: subType,
      subTypeName: subTypeName,
      accountTime: accountTime,
      userId: userId
    },
    success: res => {
      if (res.statusCode != 200) {
        wx.showModal({
          title: '',
          content: '404网络异常',
          confirmText: '确定',
          confirmColor: "#FD5E02",
          showCancel: false
        })
        return;
      }
      if (res.data.code == 200) {
        wx.showToast({
          title: "保存成功"
        })
        resetfun(_this);

      } else {
        wx.showModal({
          title: '',
          content: res.data.msg,
          confirmText: '确定',
          confirmColor: "#FD5E02",
          showCancel: false
        })
      }
    },
    fail: res => {
      wx.showModal({
        title: '',
        content: '网络异常',
        confirmText: '确定',
        confirmColor: "#FD5E02",
        showCancel: false
      })
    }
  })
}