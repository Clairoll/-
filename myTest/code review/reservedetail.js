const Moment = require('moment')
const regeneratorRuntime = require('../../utils/regenerator/runtime')

const { wxRequest } = require ('../../utils/wxRequest.js')
const { BASIC } = require ('../../config/domain')
const store = require('../../store/store.js');
import {reserveDetailStatus,moneyStatus,iconStatus,genderMap} from '../../config/const'
let app = getApp();

Page({
  data: {
    showLoading: false,
    statusbarHeight: 64,
    isIpx: false,
    flows: [],
    infoVersion: '',
    apm: '',
    payContent: {},
    isCui: '',
    shop: {},
    order: {},
    hasOrdered:true,
    showCancelReasonDlg: false,
    isShow:true,
    isInvativeShow:false
  },
  indata: {
    isShowLoading:false,
    orderId: '',
    loop:'',
    orderStorage:[ ],
    reserveId:'',
  },
  onLoad: function (options) {
    let that = this

    that.indata.reserveId = options.id

    let { isIphoneX } = app.globalData

    that.setData({
      isIphoneX: isIphoneX,
    })

    wx.getStorage({
      key: 'orderStorage',
      success: function(res){

        that.indata.orderStorage = res.data

        if(that.indata.orderStorage.indexOf(that.indata.reserveId)>-1){

          that.setData({
            hasOrdered:false
          })

        }
        // else{
        //   that.setData({
        //     hasOrdered:true
        //   })
        // }

      },
      fail:function(){
        that.setData({
          hasOrdered:true
        })
      }
    })
  },
  onShow: function () {
    
    // 预约单id
    this.indata.orderId = +this.options.id
    this.getReserveDetail()
  },

  onHide(){
    clearInterval(this.indata.loop)
  },

  onUnload(){
    clearInterval(this.indata.loop)
  },

  onPullDownRefresh(){
    clearInterval(this.indata.loop)
    this.getReserveDetail()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage:function(res){

    let { tlogo, id } = this.data.shop
    let {name,gender} = this.data.order
    let shopName = this.data.shop.name
    let sex = genderMap[gender]

    let shop = encodeURIComponent(JSON.stringify(this.data.shop))
    let order = encodeURIComponent(JSON.stringify(this.data.order))

    if(res.from==='button'){

      this.setData({
        isInvativeShow:false
      })

      return {
        title: `${name}${sex}，邀请您一起用餐`,
        path: `/pages/miniAuth/miniAuth?shareurl=${encodeURIComponent(`/packageFunction/invitation/invitation?shop=${shop}&order=${order}`)}`,
        imageUrl: tlogo || 'https://m.mwfile.cn/mm1005/image/20190213/mwLogo.png',
      }

    }else{

      return {
        title:shopName,
        path:`/pages/miniAuth/miniAuth?shareurl=${encodeURIComponent("/pages/shopdetail/shopdetail?shopid=")}${id}`,
        imageUrl:tlogo || 'https://m.mwfile.cn/mm1005/image/20190213/mwLogo.png',
      }

    }

  },

  async loopResult(orderId){
    // debugger
    let result = await wxRequest(`${BASIC}/orderByBook/${orderId}`, { orderId })
    if (result.errNo === 0) {
      let data = result.data
      let { orderDate } = data.order
      // 格式化日期
      if (orderDate) {
        data.order.orderDateFormat = Moment(String(orderDate)).startOf('day').format('YYYY.MM.DD')
      }
      this.setData({
        ...data,
        showLoading: false
      })

      let orderStatus = reserveDetailStatus[this.data.order.status]
      let imageStatus = iconStatus[this.data.order.status]
      let orderSGender = genderMap[this.data.order.gender]
      
      this.setData({
        orderStatus,
        imageStatus,
        orderSGender
      })

      if(this.data.order.status!==20){
        
        clearInterval(this.indata.loop)

        if(this.data.order.status===10){
          let StorageId = this.indata.reserveId

          if(this.indata.orderStorage.indexOf(StorageId) == -1){
            this.indata.orderStorage.push(StorageId)
            wx.setStorageSync('orderStorage', this.indata.orderStorage)
            this.setData({
              isInvativeShow:true
            })
          }
  
        }
      }
      
    } else {
      this.setData({ showLoading: false })
      wx.showToast({
        title: result.errMsg || '预约单信息加载失败',
        icon: 'none'
      });
    }
    
  },
  // 获取预约单详情
  async getReserveDetail (hasCancel) {

    if(!hasCancel){
      this.setData({showLoading:true})
    }

    this.setData({
      isShow:true,
    })

    let orderId = this.indata.orderId
    this.loopResult(orderId)

    wx.hideLoading()

    //轮询
    this.indata.loop = setInterval(()=>{

      if(this.data.order.status===20){

        let orderId = this.indata.orderId
        this.loopResult(orderId)

      }else{
        clearInterval(this.indata.loop)
      }
    },1000)

  },
 
  // 跳转至餐厅详情
  gotoShopDeatail () {
    wx.navigateTo({
      url: `/pages/shopdetail/shopdetail?shopid=${this.data.shop.id}`,
      success: function () {
        app.globalData.isFromReserveSubmit = false // 点击页面内容的跳转，false
      }
    })
  },
  // 取消订单
  cancelOrder () {
    this.setData({
      showCancelReasonDlg: true
    })
  },
  // 提醒餐厅
  async remindDiningRoom () {
    this.setData({ showLoading: true })
    let orderId = this.indata.orderId
    let result = await wxRequest(`${BASIC}/orderByBook/${orderId}/urge`, { orderId })
    if (result.errNo === 0) {
      wx.showToast({
        title: '已提醒，餐厅将尽快确认',
        icon: 'none'
      })
      this.setData({
        isCui: true,
        showLoading: false
      })
    } else {
      this.setData({ showLoading: false })
      wx.showToast({
        title: result.errMsg || '提醒失败',
        icon: 'none'
      });
    }
  },
  // 客服热线
  callServiceLine () {
    wx.makePhoneCall({
      phoneNumber: '400-8166-477',
    })
  },
  // 取消订单弹窗 取消操作
  handleCancel () {
    this.setData({
      showCancelReasonDlg: false,
    })
  },
  // 取消订单弹窗 确认取消
  async handleConfirm (event) {
    wx.showLoading({
      title:'正在取消订单'
    })
    let hasCancel = true
    let { cancelCause } = event.detail
    let orderId = this.indata.orderId
    let result = await wxRequest(`${BASIC}/orderByBook/${orderId}/cancel`, {
      orderId,
      shopId: this.data.shop.id,
      cancelCause
    })
    this.handleCancel()
    if (result.errNo === 0) {
      // 取消预定，通知列表页更新一次最新预约单
      app.globalData.indexData.refetchReserves = true;
      this.setData({
        isShow:false
      })

      setTimeout(()=>{
        this.getReserveDetail(hasCancel)
      },2000)

    } else {
      wx.showToast({
        title: result.errMsg || '预约单取消失败，请稍后重试',
        icon: 'none'
      });
    }
  },
  // 继续支付
  async goonPay () {
    this.setData({ showLoading: true })
    let orderId = this.indata.orderId
    let result = await wxRequest(`${BASIC}/orderByBook/${orderId}/payInfo`, {
      orderId,
      orderSource: app.globalData.isStarShop === 1 ? 43: 42
    })
    if (result.errNo === 0) {
      this.gotoPay(orderId, result.data.wx_req_data)
    } else {
      this.setData({ showLoading: false })
      wx.showToast({
        title: result.errMsg || '继续支付失败，请稍后重试',
        icon: 'none'
      });
    }
  },
  // 去支付(支付逻辑同提交页面支付方法)
  gotoPay (orderId, wx_req_data) {
    let that = this
    let { payContent, order, shop } = this.data
    let { money, tipsArr } = payContent
    let payDataStore = store.PayDataStore.getInstance()
    let payPageDataStore = store.PayPageDataStore.getInstance()
    payDataStore.setData(wx_req_data, { sync: true })
    payPageDataStore.setData({
      payResultUrl: `/packageReserve/reservedetail/reservedetail?id=${orderId}`,
      tipsArr: tipsArr
    }, { sync: true })
    let query = [
      'shopname=' + encodeURI(shop.name),
      'people=' + order.peopleCount,
      'price=' + money,
      'feeType=' + 2
    ]
    wx.navigateTo({
      url: '/packageFunction/pay/pay?way=reserve&' + query.join('&'),
      success: function () {
        that.setData({ showLoading: false })
      }
    });
  },
  // 重新预约
  rebook() {
    let { payContent, order, shop } = this.data
    let storeReserveInfo = {
      reserveInfo: {
        peopleCount: order.peopleCount,
        bookingDate: order.order,
        bookingTime: order.orderTime,
        apm: order.apm,
        position: order.position
      },
      payContent: payContent,
      personalInfo: {
        name: order.name,
        phone: order.phone,
        gender: order.gender
      },
      shopInfo: {
        shopId: shop.id,
        shopName: shop.name,
      },
      isAcceptAllocation: order.position === 20
    }
    wx.setStorageSync('storeReserveInfo', storeReserveInfo)
    wx.navigateTo({
      url: `/packageReserve/reservefilter/reservefilter`
    })
  },
  // 客服热线
  goToCallService(){
    wx.makePhoneCall({
      phoneNumber: this.data.vipNumber
    })
  },

  goToMap(){

    wx.openLocation({
      latitude:this.data.shop.latitude,
      longitude:this.data.shop.longitude,
      name:this.data.shop.name,
      address:this.data.shop.address
    })
  },

  closeInvate(){
    this.setData({
      isInvativeShow:false
    })
  },
  
  preventTouchMove(){
    return
  }
})