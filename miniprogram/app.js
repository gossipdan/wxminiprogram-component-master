
var plugin = requirePlugin("myPlugin")
let config = plugin.config

//app.js
App({
  globalData:{
    videoOptions:{},
    userInfo:{}
  },
  onLaunch: function () {
    config.c_version = 'EMJ-1.0.9'
    this.save_user_info()
  },
  save_user_info: function () {
    console.log('11111')
    wx.setStorageSync('id', '10000');
    wx.setStorageSync('token', '7be895c625dd4821a8e290f22f69e354');
    wx.setStorageSync('app_user_id', '12175321');
    wx.setStorageSync('app_atk', '506567e5e451423aa446fb14dab31940');
    wx.setStorageSync('union_id', '{\"open_id\": \"ojSLN4tPxBrHMF8d_0D1zgs2viqE\", \"union_id\": \"ore9ft9wRcjl40X44TXZvLEHh75A\"}');
    wx.setStorageSync('udid', 'b1971eadb09f8d8a');
    setTimeout(()=>{
      config.getToken()
    },1000)
  },
})