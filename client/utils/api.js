const Host ='http://localhost/wxrunapi/';
// const Host = 'https://itliming.cn/wxrunapi/';


//let upData = $.extend({}, SessionObj, data)//合并两个对象。

const Login = function(data,callback){
  wx.showLoading({
    title: '登录中...',
  })
  wx.request({
    url: `${Host}Login/index`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      wx.hideLoading()
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      wx.hideLoading()
      return typeof callback == "function" && callback(false)  
    }
  })
}



module.exports= {
  Login: Login,
}