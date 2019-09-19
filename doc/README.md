# api

## config
### c_version       
    小程序版本，需手动修改 
###	base_url   
    调用接口基础域名
###	socket_url  
    socket推送域名
###	setBaseUrl(env) 
    切换域名 env环境（tapi、api2、mp） 与 getVersion 作用相同，选一个使用 
###	getVersion() 
    获取小程序版本(开发版、体验版、线上版)，切换不同域名
###	handleResponseState(res_data)  
    判断接口响应状态
###	getToken ()     
    获取token（wx_id , token）(利用本地缓存，存储登录用户信息)
###	getCookie()     
    获取cookie（app_user_id, app_atk, union_id, udid）
###	app_call_post(url, data, success,error) 
    post 请求封装，url 接口地址，data 参数， success 请求成功回调函数，error请求失败回调函数
###	app_call_get(url, data, success,error) 
  get 请求封装，url 接口地址，data 参数， success 请求成功回调函数，error请求失败回调函数
###	uploadUserAvatar (userInfo ,storage) 
    七牛上传用户微信头像 userInfo 用户信息， storage 接口返回
###	qiniuUpload(path,dirname) 
    七牛上传 path 图片路径数组，dirname 图片存储目录（例如，表情wx_emoji，画中画wx_picture）
###	uploadOneImage (path,dirname)
    上传一张图片 path 图片路径string，dirname图片存储目录 同上
###	formatUploadPhotos(path,dirname)
    上传多张图片 path 图片路径数组，dirname 图片存储目录 同上
###	uploadVideoHandle(videoObj) 
    上传视频  videoObj{video_path,duration} 视频路径，视频时长
###	getUrlRelativePath(url) 
    截取相对路径 参数为 网络图片路径
### miniprogramUpdate() 
    小程序检测更新机制


# components

## topbar  (自定义导航栏)
    root-class     组件的使用者可以指定这个样式类对应的 class ，就像使用普通class属性一样
  
    属性名                 类型             默认值            说明
    title                 String           'Luna'            页面标题
    color                 String           '#000000'         标题颜色
    bgStyle               String                             背景颜色样式 style
    cover                 Boolean           false            值为true时可覆盖video等原生组件
    position              String            relative         元素定位
    getheight             EventHandle                        获取topbar高度event.detail = {height}

    tip: 需使用返回按钮时 如下 <topbar><image src="back.png"/></topbar>

##	update_modal   (40301更新) 小程序更新弹窗组件
    属性名                 类型             默认值            说明
    showModalStatus       Boolean          false             显示弹窗
    msg                   String                             提示内容
    bindhideModal         EventHandle                        关闭弹窗event.detail = {showModalStatus}

## cropper   (图片裁剪) 
    属性名                 类型             默认值            说明
    url                   String                             图片路径
    bindcancel            EventHandle                        取消裁剪
    bindcrop              EventHandle                        确定裁剪event.detail = {url:相对路径}
