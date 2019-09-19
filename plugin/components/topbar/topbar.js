// plugin/components/topbar/topbar.js

const systemInfo = wx.getSystemInfoSync()

Component({
  externalClasses:['root-class'],
  properties: {
    title:{
      type: String,
      value: 'Luna'
    },
    color:{
      type: String,
      value: '#000000'
    },
    bgStyle:{
      type: String,
      value: ''
    },
    cover:{
      type:Boolean,
      value:false
    },
    position:{
      type:String,
      value:'relative'
    }
  },

  data: {
    rootStyle: '',
    statusBarStyle: '',
    navigationBarStyle: '',
    navigationStyle: '',
    menuStyle: '',
  },

  attached () { 
    this.setData({
      rootStyle: this.getRootStyle(),
      statusBarStyle: this.getStatusBarStyle(),
      navigationBarStyle: this.getNavigationBarStyle(),
      navigationStyle: this.getNavigationStyle(),
      menuStyle: this.getMenuStyle(),
    })
  },
  methods: {
    getRootStyle() {
      let menuPosition = this.getMenuPosition()
      let rootStyle = {
        width: systemInfo.windowWidth,
        height: (menuPosition.top - systemInfo.statusBarHeight) * 2 + menuPosition.height + systemInfo.statusBarHeight
      }
      this.triggerEvent('getheight', { height: rootStyle.height})
      return this.formatStyle(rootStyle)
    },
    // 获取胶囊按钮位置
    getMenuPosition() {
      let top = 4
      let right = 7
      let width = 87
      let height = 32
      if (systemInfo.platform === 'devtools' && systemInfo.system.indexOf('Android') === -1) {
        top = 6
        right = 10
      }
      else if (systemInfo.platform === 'devtools' && systemInfo.system.indexOf('Android') != -1) {
        top = 8
        right = 10
      }
      else if (systemInfo.system.indexOf('Android') != -1) {
        top = 8
        right = 10
        width = 95
      }
      return {
        top: systemInfo.statusBarHeight + top,
        left: systemInfo.windowWidth - width - right,
        width: width,
        height: height
      }
    },
    // 获取状态栏样式
    getStatusBarStyle() {
      let statusBarPosition = {
        top: 0,
        left: 0,
        width: systemInfo.windowWidth,
        height: systemInfo.statusBarHeight
      }
      return this.formatStyle(statusBarPosition)
    },
    // 获取导航栏样式
    getNavigationBarStyle() {
      let menuPosition = this.getMenuPosition()
      let navigationBarPosition = {
        top: systemInfo.statusBarHeight,
        left: 0,
        width: systemInfo.windowWidth,
        height: (menuPosition.top - systemInfo.statusBarHeight) * 2 + menuPosition.height
      }
      return this.formatStyle(navigationBarPosition)
    },
    // 获取导航样式
    getNavigationStyle() {
      let menuPosition = this.getMenuPosition()
      let padding = systemInfo.windowWidth - menuPosition.left - menuPosition.width
      let navigationPosition = {
        top: menuPosition.top,
        left: padding,
        width: systemInfo.windowWidth - padding * 3 - menuPosition.width,
        height: menuPosition.height
      }
      return this.formatStyle(navigationPosition)
    },
    // 获取胶囊按钮样式
    getMenuStyle() {
      return this.formatStyle(this.getMenuPosition())
    },
    // 格式化Style
    formatStyle(position) {
      let styles = []
      for (let key in position) {
        styles.push(`${key}: ${position[key]}px;`)
      }
      return styles.join(' ')
    }
  }
})
