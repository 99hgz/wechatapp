var flag = false;
/*var u2u = [[
    { id: 0, unique: 'unique_00', oj: 'uoj', name: '99hgz' },
    { id: 1, unique: 'unique_01', oj: 'lydsy', name: '99hgz' }
  ], [
    { id: 0, unique: 'unique_10', oj: 'uoj', name: 'hekai' },
    { id: 1, unique: 'unique_11', oj: 'lydsy', name: 'hekai' }
  ], []];*/
var u2u=[[]]
var grouparray = ['新建一个']
var id=0
var oj2id={lydsy:0,uoj:1,loj:2,codeforces:3},id2oj=['lydsy','uoj','loj','codeforces'];
var openid,that,changed=false;
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    color:'window',
    grouparray: grouparray,
    index:id,
    u2u:u2u,
    o2n:app.globalData.curu2u,
    oj2id:oj2id,
    id2oj:id2oj
  },

  onReady: function () {
    that=this;
  },

  click:function(){
    var color=''
    if(flag){
      color='window'
    }else{
      color='window-red'
    }
    flag=!flag
    this.setData({color})
    refresh()
  },
  
  bindPickerChange:function(e){
    id = e.detail.value
    app.globalData.curu2u = JSON.parse(JSON.stringify(u2u[id]))
    changed=false
    this.setData({
      index:id,
      o2n:app.globalData.curu2u
    })
  },

  binddel:function(e){
    var tmp = parseInt(e.currentTarget.id)
    for(var i=0;i<app.globalData.curu2u.length;i++){
      if(app.globalData.curu2u[i].id==tmp){
        app.globalData.curu2u.splice(i,1);
        break;
      }
    }
    changed = true
    this.setData({
      o2n: app.globalData.curu2u
    })
  },

  bindadd:function(e){
    var tmp;
    if (app.globalData.curu2u.length==0)
      tmp=-1
    else
      tmp = app.globalData.curu2u[app.globalData.curu2u.length - 1].id
    app.globalData.curu2u.push({id: tmp+1, unique: 'unique_' + id + (tmp+1), oj: 'lydsy', name: 'admin'})
    changed = true
    this.setData({
      o2n: app.globalData.curu2u
    })
  },

  namesaver:function(e){
    var tmp = parseInt(e.currentTarget.id)
    for (var i = 0; i < app.globalData.curu2u.length; i++) {
      if (app.globalData.curu2u[i].id == tmp) {
        app.globalData.curu2u[i].name = e.detail.value;
        break;
      }
    }
    changed = true
    this.setData({
      o2n: app.globalData.curu2u
    })
  },
  bindojchange:function(e){
    var tmp = parseInt(e.currentTarget.id)
    for (var i = 0; i < app.globalData.curu2u.length; i++) {
      if (app.globalData.curu2u[i].id == tmp) {
        app.globalData.curu2u[i].oj = id2oj[e.detail.value];
        break;
      }
    }
    changed = true
    this.setData({
      o2n: app.globalData.curu2u
    })
  },
  delgroup:function(e){
    u2u.splice(id,1)
    save()
  },
  savegroup:function(e){
    u2u[id]=JSON.parse(JSON.stringify(app.globalData.curu2u))
    save()
  },
  querygroup:function(e){
    wx.navigateTo({
      url: 'result'
    })
    /*wx.request({
      url: 'https://matulj3k.qcloud.la/query.php',
      data:{
        data:JSON.stringify(app.globalData.curu2u)
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(data){
        wx.hideLoading()
    })
    wx.showLoading({
      title: noticeString[parseInt(Math.random() * noticeString.length, 10)],
      mask:true
    })*/
  }
})

function save(){
  for(var i=0;i<u2u.length;i++)
    if(u2u[i].length==0){
      u2u.splice(i,1);
      i--;
    }
  for(var i=0;i<u2u.length;i++)
    for(var j=0;j<u2u[i].length;j++){
      u2u[i][j].id=j;
      u2u[i][j].unique = 'unique_' + i + j;
    }
  changed = false

  wx.request({
    url: 'http://114.67.64.147:8080/wechatapps/server/change.php',
    data:{
      openid:openid,
      data:JSON.stringify(u2u)
    },
    method:"POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success:function(e){
      if (e.data.trim()=='success'){
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
      }
      refresh()
    }
  })
}

function refresh() {
  wx.request({
    url: 'http://114.67.64.147:8080/wechatapps/server/get.php',
    data: {
      openid: openid,
      _t: new Date().getTime()
    },
    success: function (res) {
      u2u = res.data
      grouparray = []
      for (var i = 0; i < u2u.length; i++)
        if (typeof (u2u[i][0]) != "undefined")
          grouparray = grouparray.concat([u2u[i][0].oj + '-' + u2u[i][0].name])
      grouparray = grouparray.concat(['新建一个'])
      if (id >= grouparray.length - 1)
        id = grouparray.length - 2
      id=Math.max(id,0)
      u2u=u2u.concat([[]])
      //console.log(u2u)
      app.globalData.curu2u = JSON.parse(JSON.stringify(u2u[id]))
      //console.log(that)
      that.setData({
        grouparray: grouparray,
        index: id,
        u2u: u2u,
        o2n: app.globalData.curu2u
      })
    }
  })
}

wx.login({
  success: function (res) {
    if (res.code) {
      wx.request({
        url: 'http://114.67.64.147:8080/wechatapps/server/login.php',
        data: {
          code: res.code
        },
        success: function (res) {
          openid = res.data
          refresh()
        }
      })
    } else {
      console.log('登录失败！' + res.errMsg)
    }
  }
})