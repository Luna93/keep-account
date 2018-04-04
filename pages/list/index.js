Page({
  data: {
    text: "第一页",
    zhichu: "0.00",
    shouru: "0.00",
    currentdate: "2018-04",
    hideHeader: true,
    hideBottom: true,
    list: [],
    refreshTime: '', // 刷新的时间 
    allPages: '',    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    loadMoreData: '加载更多……'

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
  loadMore: function(e) {
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
  },
  // 上拉加载更多
  loadMore: function () {
    var self = this;
    // 当前页是最后一页
    if (self.data.currentPage == self.data.allPages) {
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = self.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        currentPage: tempCurrentPage,
        hideBottom: false
      })
      self.getData();
    }, 300);
  },
  // 下拉刷新
  refresh: function (e) {
    var self = this;
    setTimeout(function () {
      console.log('下拉刷新');
      var date = new Date();
      self.setData({
        currentPage: 1,
        refreshTime: date.toLocaleTimeString(),
        hideHeader: false
      })
      self.getData();
    }, 300);
  },
  // 获取数据  pageIndex：页码参数
  getData: function () {
    var self = this;
    var pageIndex = self.data.currentPage;
    wx.request({
      url: '',
      data: {
        showapi_appid: '19297',
        showapi_sign: 'cf606a68a01f45d196b0061a1046b5b3',
        page: pageIndex
      },
      success: function (res) {
        var dataModel = res.data;
        if (dataModel.showapi_res_code == 0) {
          if (dataModel.showapi_res_body.ret_code == 0) {
            if (pageIndex == 1) { // 下拉刷新
              self.setData({
                allPages: dataModel.showapi_res_body.pagebean.allPages,
                contentlist: dataModel.showapi_res_body.pagebean.contentlist,
                hideHeader: true
              })
            } else { // 加载更多
              console.log('加载更多');
              var tempArray = self.data.contentlist;
              tempArray = tempArray.concat(dataModel.showapi_res_body.pagebean.contentlist);
              self.setData({
                allPages: dataModel.showapi_res_body.pagebean.allPages,
                contentlist: tempArray,
                hideBottom: true
              })
            }
          }
        }
      },
      fail: function () {

      }
    })
  }


})