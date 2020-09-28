// pages/result.js

var _ac='td ac',_wa='td wa';
var first1=true;
const app = getApp()
var noticeString = [
  "正在拼命加载",
  "前方发现楼主",
  "年轻人,不要着急",
  "让我飞一会儿",
  "大爷,您又来了?",
  "未满18禁止入内",
  "正在前往 花村",
  "正在前往 阿努比斯神殿",
  "正在前往 沃斯卡娅工业区",
  "正在前往 观测站：直布罗陀",
  "正在前往 好莱坞",
  "正在前往 66号公路",
  "正在前往 国王大道",
  "正在前往 伊利奥斯",
  "正在前往 漓江塔",
  "正在前往 尼泊尔"
]
var that
Page({
  onLoad:function(e){
    that=this
    first1=false
    wx.showLoading({
      title: noticeString[parseInt(Math.random() * noticeString.length, 10)],
      mask: true
    })
    wx.request({
      url: 'http://114.67.64.147:8080/wechatapps/driverforspider.php',
      data:{
        data: JSON.stringify(app.globalData.curu2u)
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        wx.hideLoading()
        that.setData({
          inf:res.data
        })
      },
      fail:function(res){
        wx.hideLoading()
        wx.showToast({
          title: '查询超时',
          icon:'none',
          duration:1000
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  data: {
    _ac:_ac,
    _wa:_wa
  },

  close:function(e){
    wx.navigateBack({
      delta: 1
    })
  }
})
