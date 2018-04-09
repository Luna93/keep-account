//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var _this = this;
    // 登录
    wx.login({
      success: res => {
        var jsCode = res.code;
        if (jsCode) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              this.globalData.userInfo = res.userInfo;
              toLogin(jsCode, res.encryptedData, res.iv, _this);
            },
            fail: res => {
              console.info("1授权失败返回数据");
              wx.showModal({
                content: '没有授权将无法使用此小程序的功能',
                confirmText: "去授权",
                cancelText: "取消",
                confirmColor: "#FD5E02",
                success: res => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: res => {
                        if (res.authSetting["scope.userInfo"]) { // 如果成功打开授权
                          console.info("success+" + res.authSetting["scope.userInfo"]);
                          wx.getUserInfo({
                            withCredentials: true,
                            success: res => {
                              this.globalData.userInfo = res.userInfo;
                              toLogin(jsCode, res.encryptedData, res.iv, _this);
                            }
                          })
                        } else {  // 如果用户依然拒绝授权
                          console.info("fail");
                        }
                      }

                    })
                  }
                }
              });

            }
          })


        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: '',
    userId: ''
  }
})

function toLogin(jsCode, encryptedData, iv, _this) {
  wx.request({
    url: 'http://weixin.frp2.chuantou.org/login/miniapp-login',
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      jsCode: jsCode,
      encrypteData: encryptedData,
      ivStr: iv
    },
    success: res => {
      
      if (res.statusCode != 200){
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
        var _data = res.data.data;
        _this.globalData.openId = _data.openid;
        _this.globalData.userId = _data.id;
        console.log('globalData=', _this.globalData);
        wx.setStorageSync('openId', _data.openid);
        wx.setStorageSync('userId', _data.id);

        //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        //坑！！！这里不加的话会先加载完onLoad再加载onLaunch，头像那边就不能显示了
        if (_this.userInfoReadyCallback) {
          _this.userInfoReadyCallback(_this.globalData);
        }
      } else {
        wx.showModal({
          title: '',
          content: res.data.msg,
          confirmText: '确定',
          confirmColor: "#FD5E02",
          showCancel: false
        })
      }
    }
  })
}