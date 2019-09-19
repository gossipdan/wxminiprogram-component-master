let plugin = requirePlugin("myPlugin")
let config = plugin.config
let app = getApp()
Page({
  data:{
    showModalStatus:false,
    msg: "更新",
    url:'',
    all_userInfo:{},
    userInfo:{},
    args: { hello: 'world' }
  },
  onLoad: function(option) {
    if(option.img) this.setData({ url: option.img })
  },
  getUserInfo:function(e){
    if (e.detail.userInfo != undefined) {
      // console.log(e.detail)
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        all_userInfo: e.detail,
      }, () => {
        
      })
    } else {

      // 授权不成功
    }
  },
  getHeight:function(e){
    console.log(e)
    console.log(e.detail.height)
  },
  
  showModal:function(){
    this.setData({ showModalStatus: true, msg: "更新更新更新更新更新更新更新更新" })
  },
  hideUpdateModal: function(e){
    this.setData({ showModalStatus:e.detail.showModalStatus })
  },
  cropper:function(){
    wx.chooseImage({
      count:1,
      success: res=> {
        var data = res.tempFilePaths;
        wx.navigateTo({
          url: '../crop_photo/crop_photo?img=' + data[0],
        })
      },
    })
  },
  upvideo:function(){
    console.log("示例小程序里：",wx.getStorageSync('id'))
    wx.chooseVideo({
      compressed: true,
      success: res => {
        let ratio = res.width / res.height,
          videoObj = {
            video_path: res.tempFilePath,
            duration: res.duration,
          };
        config.uploadVideoHandle(videoObj).then(res=>{
          app.globalData.videoOptions = res
          wx.navigateTo({
            url: '../edit_video/edit_video?ratio=' + ratio,
          })
        })
      }
    })
  },
  goto_editvideo:function(){
    let videoOptions = JSON.stringify(app.globalData.videoOptions)
    wx.navigateTo({
      url: 'plugin://myPlugin/editvideo?video_optipns=' + videoOptions,
    })
  }
})