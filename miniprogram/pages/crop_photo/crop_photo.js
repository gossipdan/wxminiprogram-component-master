// pages/crop_photo/crop_photo.js
Page({

  data: {
    url:'',
  },

  onLoad: function (options) {
    this.setData({url:options.img})
  },

  onShow: function () {
    
  },

  cropped:function(e){
    this.setData({ url: e.detail.url})
    setTimeout(()=>{
      wx.navigateTo({
        url: '../index/index?img='+e.detail.url,
      })
    },3000)
  },
  cancel:function(){
    wx.navigateBack({})
  }

})