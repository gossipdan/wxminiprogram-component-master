
const config = require('../../api/config');

const device = wx.getSystemInfoSync();
const device_width = device.windowWidth;
const device_height = device.windowHeight;
const slider_width = 290;

Page({

  data: {
    video_url: '',
    video_cover: '',
    movearea_width: slider_width,
    video_width: device_width,
    video_height: device_height * 0.68,
    video_control: true,
    duration: null,  //视频时长
    currentDuration: '00:00', //视频当前播放时间
    startDuration: 0,  //视频播放当前时长
    endDuration: null,   //视频结束截取时长
    startTime: '00:00',   //视频截取开始时间
    endTime: null,  //视频截取结束时间
    pageStartX: 0,
    pageEndX: slider_width,
    progressMarginLeft: 0, //进度条距左边的距离
    tipBarStartState: false,   //截取开始bar显示状态
    tipBarEndState: false,   //截取结束bar显示状态
    progressWidth: slider_width,
    progressLeft: 0,
    timeBarState: true,
    all_duration: "00:00",
    progress_time: 0,
    rotate: 0,
    mask_pos: {
      offsetX: null,
      offsetY: null,
    },
    center_point: {},
  },

  onLoad: function (options) {
    // console.log(options.ratio)
    
    this.startMove = 0;

    let data = wx.getStorageSync('video_options'),
      all_duration = data.video_end - data.video_start,
      page_start = data.video_start * slider_width / data.duration,
      page_end = (data.duration - data.video_end) * slider_width / data.duration;

    // console.log(data)

    this.setData({
      ratio: options.ratio,
      video_url: data.mp4_path,
      video_cover: data.url,
      //左滑块初始化数据
      pageStartX: page_start,
      progressLeft: page_start,
      progress_time: page_start,
      pageEndX: slider_width - page_end,
      progressWidth: slider_width - page_start - page_end,
      //右滑块初始化数据
      startDuration: data.video_start,
      startTime: this.durationPicker(data.video_start),
      endDuration: data.duration,
      endTime: this.durationPicker(data.video_end),
      duration: data.duration,
      all_duration: this.durationPicker(all_duration),
      rotate: data.rotate,
    })
    this.videoContext = wx.createVideoContext('myVideo');
    this.videoContext.seek(data.video_start);
    this.videoContext.play();
  },

  onShow: function () {
    wx.createSelectorQuery().in(this).select('.mask_img').boundingClientRect((rect) => {
      this.mask_width = rect.width
      this.mask_height = rect.height
    }).exec()
    let video_height = this.data.video_height,
      video_width = this.data.video_width,
      center_point = {
        x: video_width / 2,
        y: video_height / 2
      };
    this.setData({
      center_point: center_point
    })
  },

  //格式化视频长度
  durationPicker: function (duration) {
    let now_duration = duration;
    let minute = parseInt(duration / 60);
    let second = parseInt(duration % 60);
    minute > 9 ? minute = minute : minute = '0' + minute;
    second > 9 ? second = second : second = '0' + second;
    return (minute + ':' + second);
  },

  //检测视频播放
  video_play_handle: function (e) {
    let current_time = e.detail.currentTime;
    this.setData({
      currentDuration: this.durationPicker(current_time)
    })
    let now_time = parseInt(this.durationPicker(current_time).replace(":", ''));
    let end_time = parseInt(this.data.endTime.replace(":", ''));
    if (now_time >= end_time) {
      //获取音乐时长，设置音乐时长
      let margin_left = e.detail.currentTime * slider_width / e.detail.duration;
      this.setData({
        progress_time: parseInt(margin_left) + 4,
        timeBarState: false
      })
      this.videoContext.pause();
    } else {
      //获取音乐时长，设置音乐时长
      let margin_left = e.detail.currentTime * slider_width / e.detail.duration;
      this.setData({
        progress_time: parseInt(margin_left) + 4,
      })
    }
  },

  touch_start: function (e) {

  },
  // 拖动变化位置获取
  tipStartMovehandle: function (e) {
    if (e.timeStamp - this.startMove > 100) {
      this.setData({
        video_control: true
      })
      let page_x = e.touches[0].pageX;
      let endDuration = this.data.endDuration, startDuration = this.data.startDuration;
      let now_duration = (page_x - 50) * this.data.duration / slider_width;
      startDuration = now_duration;
      let postion = now_duration * slider_width / this.data.duration;
      let all_duration = endDuration - startDuration;
      if (page_x >= 50) {
        this.setData({
          tipBarStartState: true,
          tipBarEndState: false,
          timeBarState: false,
        })
        if (all_duration >= 3) {
          this.setData({
            pageStartX: postion,
            progressWidth: slider_width - postion - (slider_width - this.data.pageEndX),
            progressLeft: postion,
            all_duration: this.durationPicker(all_duration),
            startTime: this.durationPicker(now_duration),
            startDuration: now_duration,
          })
        } else {
          this.setData({
            startDuration: this.data.startDuration,
          })
          wx.showToast({
            image: '../../images/error.png',
            title: '视频不能小于3s',
          })
        }
      }
      this.startMove = e.timeStamp;
    }
  },
  //结束时间拖动变化位置获取
  tipEndMovehandle: function (e) {
    // console.log(e)
    if (e.timeStamp - this.startMove > 100) {

      this.setData({
        video_control: true
      })
      let page_x = e.touches[0].pageX;
      let endDuration = this.data.endDuration, startDuration = this.data.startDuration;
      let now_duration = (page_x - 50) * this.data.duration / slider_width;
      endDuration = now_duration;
      let postion = (this.data.duration - now_duration) * slider_width / this.data.duration;
      let all_duration = endDuration - startDuration;
      if (page_x >= 50 && page_x <= 350) {
        this.setData({
          tipBarEndState: true,
          tipBarStartState: false,
        })
        // console.log(postion)
        if (all_duration >= 3) {
          this.setData({
            pageEndX: slider_width - postion,
            progressWidth: slider_width - postion - this.data.pageStartX,
            endTime: this.durationPicker(now_duration),
            all_duration: this.durationPicker(all_duration),
            endDuration: now_duration,
          })
        } else {
          this.setData({
            endDuration: this.data.endDuration
          })
          wx.showToast({
            image: '../../images/error.png',
            title: '视频不能小于3s',
          })
        }
      }
      this.startMove = e.timeStamp;
    }
  },
  tipTouchEnd: function (e) {
    this.videoContext.seek(this.data.startDuration);
    this.videoContext.play();
    setTimeout(() => {
      this.setData({
        timeBarState: true
      })
    }, 500)
    // console.log("startDuration:", this.data.startDuration)
    // console.log("endDuration:",this.data.endDuration)
    let all_duration = this.data.endDuration - this.data.startDuration
    this.setData({
      all_duration: this.durationPicker(all_duration)
    })
  },

  maskTouchstartCallback: function (e) {
    // console.log("Start:",e)
    let { clientX, clientY } = e.touches[0];
    let { offsetLeft, offsetTop } = e.currentTarget;
    this.startX = clientX;
    this.startY = clientY;
    this.touchStartEvent = e.touches;
    let { mask_pos } = this.data;
    mask_pos.offsetX = offsetLeft
    mask_pos.offsetY = offsetTop
    this.setData({
      mask_pos: mask_pos
    })

  },
  maskTouchmoveCallback: function (e) {
    // console.log("Move:",e)
    let _this = this, video_width = this.data.video_width, video_height = this.data.video_height;
    let { clientX, clientY } = e.touches[0];
    let { offsetLeft, offsetTop } = e.currentTarget;
    let offsetX = clientX - _this.startX;
    let offsetY = clientY - _this.startY;
    _this.startX = clientX;
    _this.startY = clientY;
    let { mask_pos } = _this.data;

    let ratio = this.data.ratio, rotate = this.data.rotate;
    let updown1 = ratio > 1 && (rotate == 1 || rotate == 3),
      updown2 = ratio < 1 && (rotate == 0 || rotate == 2);

    // top left 按视频比例上下移动或左右移动
    if (updown1 || updown2) {
      // console.log("上下")
      mask_pos.offsetY += offsetY;
      mask_pos.offsetLeftY = -mask_pos.offsetLeftY;
      if (mask_pos.offsetY <= 0) {
        mask_pos.offsetY = 0
      } else if (mask_pos.offsetY >= video_height - this.mask_height) {
        mask_pos.offsetY = video_height - this.mask_height
      }
      this.mask_pos = mask_pos
    } else {
      // console.log("左右")
      mask_pos.offsetX += offsetX;
      mask_pos.offsetLeftX = -mask_pos.offsetX;
      if (mask_pos.offsetX <= 0) {
        mask_pos.offsetX = 0
      } else if (mask_pos.offsetX >= video_width - this.mask_width) {
        mask_pos.offsetX = video_width - this.mask_width
      }
      this.mask_pos = mask_pos
    }

    if (e.timeStamp - this.startMove > 100) {
      this.setData({
        mask_pos: this.mask_pos
      })
      this.startMove = e.timeStamp;
    }

    // translate 平移
    // if (updown1 || updown2) {
    //   // console.log("上下")
    //   mask_pos.offsetY += offsetY;
    //   mask_pos.offsetLeftY = -mask_pos.offsetY;
    //   if (mask_pos.offsetLeftY >= offsetTop) {
    //     mask_pos.offsetY = -offsetTop
    //   } else if (mask_pos.offsetY >= offsetTop) {
    //     mask_pos.offsetY = offsetTop
    //   }
    // }else{
    //   // console.log("左右")
    //   mask_pos.offsetX += offsetX;
    //   mask_pos.offsetLeftX = -mask_pos.offsetX;
    //   if (mask_pos.offsetLeftX >= offsetLeft) {
    //     mask_pos.offsetX = -offsetLeft
    //   } else if (mask_pos.offsetX >= offsetLeft) {
    //     mask_pos.offsetX = offsetLeft
    //   }
    // }


    // console.log('mask_pos:',mask_pos)
  },
  maskTouchendCallback: function (e) {
    // console.log("End:",e)
    let { offsetLeft, offsetTop } = e.currentTarget
    let center_point = this.data.center_point, mask_center = { x: this.mask_width / 2, y: this.mask_height / 2 };
    center_point.x = offsetLeft + mask_center.x
    center_point.y = offsetTop + mask_center.y
    this.setData({
      center_point: center_point,
      mask_pos: this.mask_pos
    })
    // console.log(center_point)
  },

  cancel_edit: function () {
    wx.navigateBack()
  },

  rotate_edit: function () {
    let video_height = this.data.video_height,
      video_width = this.data.video_width,
      mask_pos = {
        offsetX: null,
        offsetY: null,
      },
      center_point = {
        x: video_width / 2,
        y: video_height / 2
      };
    mask_pos.offsetX = (video_width - this.mask_width) / 2
    mask_pos.offsetY = (video_height - this.mask_height) / 2

    let rotate = this.data.rotate
    switch (rotate) {
      case 0: rotate = 1; break;
      case 1: rotate = 2; break;
      case 2: rotate = 3; break;
      case 3: rotate = 0; break;
    }
    this.setData({
      mask_pos: mask_pos,
      center_point: center_point,
      rotate: rotate,
    })
  },

  confirm_edit: function () {
    // console.log(this.data.center_point)
    let all_duration = this.data.endDuration - this.data.startDuration;
    let data = wx.getStorageSync('video_options');
    let center_point = this.data.center_point, video_height = this.data.video_height,
      video_width = this.data.video_width;
    center_point.x = center_point.x / video_width
    center_point.y = center_point.y / video_height
    data.video_start = this.data.startDuration;
    data.video_end = this.data.endDuration;
    data.center_point = this.data.center_point;
    data.rotate = this.data.rotate;
    wx.setStorageSync('video_options', data)
    console.log(data)
    wx.navigateBack()

  }

})