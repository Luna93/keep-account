var util = require('../../utils/util.js');
// var userId = wx.getStorageSync('userId');
var app = getApp()

Page({
  data: {
    text: "第一页",
    zhichu: "0.00",
    shouru: "0.00",
    currentdate: util.formatTime3(new Date()),
    hideHeader: true,
    hideBottom: true,
    list: [],
    refreshTime: '', // 刷新的时间 
    //allPages: '',    // 总页数
    //currentPage: 1,  // 当前页数  默认是1
    //loadMoreData: '加载更多……'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    this.setData({
      refreshTime: date.toLocaleTimeString()
    })
    this.getData();
    
  },
  onShow: function () {
    var date = new Date();
    console.log('date=', date.toLocaleTimeString());
    this.setData({
      currentdate: util.formatTime3(new Date())
    })
    this.getData();
    this.data.list[0].open = true;
  },
  loadMore: function (e) {
    console.log(e);
    console.log('到底了要加载');
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      currentdate: e.detail.value
    })
    this.getData();
  },
  onPullDownRefresh: function () {
    this.setData({
      hideHeader: false
    })
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    this.getData();
    this.setData({
      hideHeader: true
    })
  },
  kindToggle: function (e) {
    console.log('e==',e);
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].selectDay == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  // 获取数据  pageIndex：页码参数
  getData: function () {
    var self = this;
    var userId = app.globalData.userId;
    console.log("list app.globalData.userId=" + userId);
    if(userId==''){
      wx.showModal({
        title: '',
        content: '用户未登录或授权，可删除小程序重新进入',
        confirmText: '确定',
        confirmColor: "#FD5E02",
        showCancel: false
      })
      return;
    }
    wx.request({
      url: 'http://47.98.144.103/account/list',
      method: 'GET',
      data: {
        userId: userId,
        selectDay: self.data.currentdate
      },
      success: function (res) {
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
          console.log('res.data.data=',res.data.data);
          var dataModel = res.data.data;
          self.setData({
            zhichu: dataModel.monthTotalExpend,
            shouru: dataModel.monthTotalIncome,
            list: dataModel.monthList
          })

        } else {
          wx.showModal({
            title: '',
            content: res.data.msg,
            confirmText: '确定',
            confirmColor: "#FD5E02",
            showCancel: false
          })
        }
        // if (dataModel.showapi_res_code == 0) {
        //   if (dataModel.showapi_res_body.ret_code == 0) {
        //     if (pageIndex == 1) { // 下拉刷新
        //       self.setData({
        //         allPages: dataModel.showapi_res_body.pagebean.allPages,
        //         contentlist: dataModel.showapi_res_body.pagebean.contentlist,
        //         hideHeader: true
        //       })
        //     } else { // 加载更多
        //       console.log('加载更多');
        //       var tempArray = self.data.contentlist;
        //       tempArray = tempArray.concat(dataModel.showapi_res_body.pagebean.contentlist);
        //       self.setData({
        //         allPages: dataModel.showapi_res_body.pagebean.allPages,
        //         contentlist: tempArray,
        //         hideBottom: true
        //       })
        //     }
        //   }
        // }
      },
      fail: function () {
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


})