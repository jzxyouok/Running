const Api = require("./api/api.js")
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
var Session =null //用户登录信息token 和id
Page({
  data: {
    tabs: ["资料", "动态", "Run"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    who: null,
    age:'',
    birth:'',
    statusxianghuguanzhu:null//页面加载后把是否为相互关注状态存储起来。
  },
  //单击相互关注按钮,调用接口取消关注此人
  tapXianghuGuanzhu: function () {
    let that = this
    //我的信息：token和id，取消关注的人的id叫userid
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': that.data.who.id }
    Api.DelGuanzhuUser(data, function (res) {
      if (res.code) {
        let up = `who.xianghuguanzhu`
        let us = `who.yiguanzhu`
        that.setData({ [up]: false, [us]: false })
      }
    })
  },
  //单击关注按钮,调用接口关注此人
  tapGuanzhu:function(){
    let that = this;
    // 被我关注人的id为：this.data.who.id
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': that.data.who.id }
    Api.AddGuanzhuUser(data, function (res) {
      if (res.code) {
        if (that.data.statusxianghuguanzhu) {
          let up = `who.xianghuguanzhu`
          let ua = `who.yiguanzhu`
          that.setData({ [up]: true,[ua]:true })
        } else {
          let ua = `who.yiguanzhu`
          that.setData({ [up]: true })
        }
      }
    })    
  },
  //单击已关注按钮,调用接口取消关注此人
  tapQuxiaoGuanzhu: function () {
    let that = this
    //我的信息：token和id，取消关注的人的id叫userid
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': that.data.who.id }
    Api.DelGuanzhuUser(data, function (res) {
      if (res.code) {
        let up = `who.xianghuguanzhu`
        let ua = `who.yiguanzhu`
        that.setData({ [up]: false ,[ua]:false})
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    //资料选项卡获取用户资料
    Session = wx.getStorageSync("userInfo")
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': options.id }
    Api.GetUserInfo(data,function(res){
      if (res.code) {
        that.setData({ who: res.data })
        //进入本页面获取用户数据，并把用户有些数据状态起来
        if (res.data.dateOfBirth){
          let dateOfBirth = new Date(res.data.dateOfBirth * 1000)
          let age = new Date().getFullYear() - dateOfBirth.getFullYear() + "岁"
          let m = dateOfBirth.getMonth() + 1
          let d = dateOfBirth.getDate()
          let birth = `${m<10?'0'+m:m}月${d<10?'0'+d:d}日`
          that.setData({ age: age, birth: birth})//通过出生日期时间戳，获取用户的年龄
          
        }
        that.setData({ statusxianghuguanzhu: res.data.xianghuguanzhu })
      }
    })
    
    



    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //预览头像
  previewImg: function () {
    wx.previewImage({
      urls: [this.data.who.avatarUrl]
    })
  },
  onShow: function () {
    let that = this
  },
  onPullDownRefresh: function () {
  },
  onShareAppMessage: function () {
  }
})