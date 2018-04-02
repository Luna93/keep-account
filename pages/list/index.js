Page({
  data: {
    text: "第一页",
    zhichu: "0.00",
    shouru: "0.00",
    currentdate: "2018-04"
  },
  lower: function(e) {
    console.log(e);
    console.log('到底了要加载');
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      currentdate: e.detail.value
    })
  }


})