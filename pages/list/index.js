Page({
  data: {
    text: "第一页",
    zhichu: "0.00",
    shouru: "0.00",
    currentdate: "2018-04",
    list: [
      {
        id: '30',
        name: '30号',
        open: true,
        pages: ['1','2']
      }, {
        id: '29',
        name: '29号',
        open: false,
        pages: ['text', 'icon', 'progress']
      }, {
        id: '28',
        name: '28号',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'radio', 'slider', 'switch', 'textarea']
      }, {
        id: '27',
        name: '27号',
        open: false,
        pages: ['navigator']
      }, {
        id: '26',
        name: '26号',
        open: false,
        pages: ['image', 'audio', 'video']
      }, {
        id: '25',
        name: '25号',
        pages: ['map']
      }, {
        id: '24',
        name: '24号',
        pages: ['canvas']
      }, {
        id: '23',
        name: '23号',
        pages: ['canvas']
      }, {
        id: '22',
        name: '22号',
        pages: ['canvas']
      }, {
        id: '21',
        name: '21号',
        pages: ['canvas']
      }
    ]
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
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }


})