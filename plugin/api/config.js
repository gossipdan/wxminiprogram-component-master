const qiniuUploader = require("./qiniuUploader");
const Utils = require('./promise.js');
const env = require('./oss.js');
const md5 = require('./md5.js');
const wsAPI = require('./wxApi.js');

const config = {
  c_version: "",
  base_url: 'https://mp.colorv.com',
  socket_url: 'wss://mp.colorv.com/nws/socket.io/v2',

  getVersion: function() {
    console.log('envVersion', __wxConfig.envVersion);
    let version = __wxConfig.envVersion;
    switch (version) {
      case 'develop':
        config.base_url = 'https://tapi.colorv.cn'; 
        config.socket_url = 'wss://tapi.colorv.cn/nws/socket.io/v2'; break; // 测试版环境域名
      case 'trial':
        config.base_url = 'https://api2.colorv.cn';
        config.socket_url = 'wss://mp.colorv.com/nws/socket.io/v2'; break; // 体验版环境域名
      case 'release':
        config.base_url = 'https://mp.colorv.com';
        config.socket_url = 'wss://mp.colorv.com/nws/socket.io/v2'; break; // 线上版环境域名
      default:
        config.base_url = 'https://mp.colorv.com';
        config.socket_url = 'wss://mp.colorv.com/nws/socket.io/v2'; // 线上环境域名
    }
  },
  
  setBaseUrl: function (env) {
    switch (env) {
      case 'tapi':
        config.base_url = 'https://tapi.colorv.cn';
        config.socket_url = 'wss://tapi.colorv.cn/nws/socket.io/v2'; break; // tapi
      case 'api2':
        config.base_url = 'https://api2.colorv.cn';
        config.socket_url = 'wss://mp.colorv.com/nws/socket.io/v2'; break; // api2
      case 'mp':
        config.base_url = 'https://mp.colorv.com';
        config.socket_url = 'wss://mp.colorv.com/nws/socket.io/v2'; break; // mp 线上版环境域名
      default:
        config.base_url = 'https://mp.colorv.com';
        config.socket_url = 'wss://mp.colorv.com/nws/socket.io/v2'; // 线上环境域名
    }
  },

  // 判断响应状态state
  handleResponseState:function(res_data){
    if (res_data.state == 500) {
      wx.showToast({
        title: '服务器错误',
        image: '../../images/error.png',
        mask: true,
        duration: 2000
      })
    }
    if (res_data.state == 401) {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }
    let data = res_data.data;
    if (data != undefined){
      if (data.error_msg != null && data.error_msg != undefined ) {
        wx.showToast({
          title: data.error_msg,
          icon: 'none',
          mask: true,
          duration: 2500
        })
      }
    }
    if(res_data.state == 40301){
      let pages = getCurrentPages();
      currentPage = pages[pages.length-1]
      currentPage.setData({
        isShow_modal: true,
        res_msg: data.error_msg
      })
    }
  },

  // 获取本地token
  getToken: function () {
    let id = wx.getStorageSync('id'),
      token = wx.getStorageSync('token'),
      data = { id, token };
    console.log(wx.getStorageSync('id'))
    console.log(wx.getStorageSync('token'))
    return JSON.stringify(data);
  },

  // 获取cookie
  getCookie:function(){
    let id = wx.getStorageSync('app_user_id'),
      atk = wx.getStorageSync('app_atk'),
      union_id = wx.getStorageSync('union_id'),
      udid = wx.getStorageSync('udid'),
      data = { id, atk, union_id, udid}
    console.log(data)
    return JSON.stringify(data);
  },

  // post封装
  app_call_post: function (url, data, success, error) {
    let app_user_id = wx.getStorageSync('app_user_id'), app_token = wx.getStorageSync('app_token'), union_id = wx.getStorageSync('union_id'), udid = wx.getStorageSync('udid');
    console.log('插件里：', app_user_id)
    if (app_user_id == "" && app_token == "" && union_id == ""){
      console.log('aaaa1111')
      wx.request({
        url: config.base_url + url,
        method: 'POST',
        header: {
          "Utk": config.getToken(),
          'Accept': 'application/json',
          "Cversion": config.c_version,
        },
        data: data,
        success: function (res) {
          if (success) { success(res); config.handleResponseState(res.data) }
        },
        fail: function (res) { if (error) error(error); }
      })
    }else{
      console.log('bbbb1111111')

      wx.request({
        url: config.base_url + url,
        method: 'POST',
        header: {
          'Accept': 'application/json',
          "Utk": config.getToken(),
          "Cversion": config.c_version,
          "AppUtk": this.getCookie()
        },
        data: data,
        success: function (res) {
          if (success) { success(res); config.handleResponseState(res.data) }
        },
        fail: function (res) { if (error) error(error); }
      })
    }
  },

  // get封装
  app_call_get: function (url, data, success, error) {
    let app_user_id = wx.getStorageSync('app_user_id'), app_token = wx.getStorageSync('app_token'), union_id = wx.getStorageSync('union_id');
    if (app_user_id == "" && app_token == "" && union_id == "") {
      console.log('aaaa222222')

      wx.request({
        url: config.base_url + url,
        method: 'get',
        header: {
          "Utk": config.getToken(),
          "Cversion": config.c_version,
        },
        data: data,
        success: function (res) {
          if (success) { success(res); config.handleResponseState(res.data) }
        },
        fail: function (res) { if (error) error(error); }
      })
    }else{
      console.log('bbbb22222222')

      wx.request({
        url: config.base_url + url,
        method: 'get',
        header: {
          "Utk": config.getToken(),
          "Cversion": config.c_version,
          "AppUtk": config.getCookie()
        },
        data: data,
        success: function (res) {
          if (success) { success(res); config.handleResponseState(res.data) }
        },
        fail: function (res) { if (error) error(error); }
      })
    }
  },

  // 七牛上传用户微信头像
  uploadUserAvatar: function (userInfo, storage) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: userInfo.avatarUrl,
        success: res => {
          let path = res.tempFilePath, uuid = env.uuid(), key = "users/wxwx/" + uuid,
            postData = { keys: [key], storage: storage };
          config.app_call_post("/wx/upload/token", postData, (response) => {
            let token = response.data.tokens[key];
            qiniuUploader.upload(path, resp => {
              let editPostData = {
                icon: resp.key,
                name: userInfo.nickName,
                gender: userInfo.gender
              }
              // 服务器上传
              config.app_call_post('wx/user/edit', editPostData, ress => {
                // console.log(ress)
                resolve(ress)
              })
            }, (error) => {
              reject(error)
            }, { region: 'ECN', key: key, uptoken: token })
          })
        }
      })
    })
  },
  
  // 七牛上传 图片
  qiniuUpload: function (path,dirname) {   //path 需要上传图片的数据
    return new Promise((resolve, reject) => {
      let keys = [], dirname = dirname ? dirname:'wx_photos';
      path.forEach(el => {
        let pathMd5 = md5.hexMD5(el),
          pathSplit = el.split("."),
          pathType = pathSplit[pathSplit.length - 1],
          key = dirname + "/" + env.file_path() + pathMd5 + '.' + pathType;
        keys.push(key);
      })
      let postData = { keys: keys };
      config.app_call_post('/wx/upload/token', postData, (response) => {
        let res_arr = []
        keys.forEach((el, index) => {
          let token = response.data.tokens[el]
          let path_o = path[index]
          qiniuUploader.upload(path_o, (res) => {   //七牛上传
            res_arr.push(res)
            if (res_arr.length == keys.length) { resolve(res_arr) }
          }, (error) => { reject(error) }, { region: 'NCN', key: el, uptoken: token });
        })
      })
    })
  },

  // 上传一张图片
  uploadOneImage: function (path,dirname) {
    return new Promise((resolve, reject) => {
      this.qiniuUpload([path],dirname).then((res) => {
        let url = 'https://cdn-app-qn-bj.colorv.cn/' + res[0].key;
        resolve({ path: res[0].key, url: url });
      })
    })
  },

  // 格式化上传图片列表
  formatUploadPhotos: function (path,dirname) {
    return new Promise((resolve, reject) => {
      this.qiniuUpload(path, dirname).then((res) => {
        let photos = [];
        res.forEach((el, index) => {
          let ph = {
            path: el.key,
            etag: md5.hexMD5(path[index])
          }
          photos.push(ph)
        })
        // 服务器上传
        config.app_call_post('wx/photo/upload', {
          storage: 'qiniu-bj', photos,
        }, (resp) => {
          // console.log("photo/upload", resp)
          if (resp.data.state == 200) {
            // 存储工作室照片列表
            var photo_list = [];
            resp.data.data.forEach((el, index) => {
              photo_list.push({
                type: 'photo', id: el, font: "", rotate: 0,
                url: 'http://cdn-app-qn-bj.colorv.cn/' + res[index].key,
              });
            })
            resolve(photo_list);
          } else { reject(resp) }
        });

      })
    })
  },
  

  // 上传视频
  uploadVideoHandle: function (videoObj) {
    return new Promise((resolve, reject) => {
      let mp4_path = videoObj.video_path,
        logo_path = "",
        duration = videoObj.duration;

      let pathMd5 = md5.hexMD5(mp4_path),
        pathSplit = mp4_path.split("."),
        pathType = pathSplit[pathSplit.length - 1],
        key = "wx_videos/" + env.file_path() + pathMd5 + '.' + pathType;
      let postData = { keys: [key] };
      wx.showLoading()
      config.app_call_post('/wx/upload/token', postData, (response) => {
        let token = response.data.tokens[key];
        let formData = { token, key };
        const uploadTask = wx.uploadFile({
          url: 'https://up-z1.qbox.me',
          filePath: mp4_path,
          name: 'file',
          formData: formData,
          success: function (res) {
            // console.log(res)
            if (res.statusCode == 200) {
              mp4_path = key;
              config.app_call_post('/wx/video/upload', {
                storage: 'qiniu-bj',
                video: {
                  path: mp4_path,
                  etag: md5.hexMD5(mp4_path),
                  logo_path: logo_path,
                  duration: duration
                }
              }, (ress) => {
                if (ress.data.state == 200) {
                  // console.log(ress.data.data, 'start')
                  let mp4_id = ress.data.data.id;
                  logo_path = ress.data.data.video_logo_url;
                  let video_options = {
                    type: "video",
                    id: mp4_id,
                    url: logo_path,
                    mp4_path: 'http://cdn-app-qn-bj.colorv.cn/' + key,
                    video_start: 0,
                    video_end: duration,
                    duration: duration,
                    font: "",
                    rotate: 0
                  };
                  wx.hideLoading();
                  wx.showToast({
                    image: '../../images/right.png',
                    title: '上传成功',
                  })
                  resolve(video_options);
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    image: '../../images/error.png',
                    title: '上传失败',
                  })
                  reject(ress);
                }
              })
            }
          },
          fail: function (err) {
            wx.showToast({
              image: '../../images/error.png',
              title: '上传失败',
            })
            reject(err);
          }
        })
        uploadTask.onProgressUpdate((res) => {
          wx.showLoading({
            title: '已上传' + res.progress + '%',
            mask:true
          })
        })
      })
    })
  },



  // 截取相对路径
  getUrlRelativePath: function (url) {
    if (url.indexOf('//') == -1) {
      wx.showToast({
        title: 'Url错误',
        icon: 'none',
      })
      return ''
    }
    let arrUrl = url.split("//");
    let start = arrUrl[1].indexOf("/");
    // stop省略，截取从start开始到结尾的所有字符
    let relUrl = arrUrl[1].substring(start + 1);
    if (relUrl.indexOf("?") != -1) {
      relUrl = relUrl.split("?")[0];
    }
    return relUrl;
  },

  // 小程序检查更新机制
  miniprogramUpdate:function(){
    // 基础库版本 微信版本低  提示用户升级微信
    const device = wx.getSystemInfoSync();
    if (device.SDKVersion >= '1.5.8') {
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                confirmColor: '#f55a45',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                confirmColor: '#f55a45',
              })
            })
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，部分功能无法使用，请升级到微信版本后重试。',
        showCancel: false,
        confirmColor: '#f55a45',
      })
    }
  }

}
module.exports = config;

/**
 * 关于七牛上传参数
    region: 'NCN',
    domain: 'bzkdlkaf.bkt.clouddn.com', bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
    key: key,   [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名 
    以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
    uptoken: token, 由其他程序生成七牛 uptoken
    uptokenURL: 'UpTokenURL.com/uptoken', 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
    uptokenFunc: function () { return '[yourTokenString]'; }
 */

