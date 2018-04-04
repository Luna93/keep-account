Page({
  data: {
    array: ['普通', '吃饭', '购物', '出行', '其他'],
    index: 0,
    date: '2016-09-01'
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
  }
})
