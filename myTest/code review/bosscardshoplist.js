const regeneratorRuntime = require('../../utils/regenerator/runtime')
const {wxRequest} = require ('../../utils/wxRequest.js');
const {BASIC} = require ('../../config/domain')
let app =  getApp();

Page({
  data: {
    bossCardCityId:'',
    bossCardCityName:'',
    cardNo:'',        //黑卡卡号
    page:1,               //页码
    userName:'',           //姓名
    userGender:'',         //性别
    BossCardShopList:[],   //黑卡餐厅列表
    mapSex:{
      1:'先生',
      2:'女士'
    }
  },
  indata:{
    latitude:'',
    longitude:'',
    showCounts: 0,
    noRest:false
  },

  async onLoad(options) {
    this.getBossCardUserInfo()
    this.getUserCityInfo();
    wx.hideLoading();
    wx.hideShareMenu()  //关闭转发分享
  },

  onShow: function () {
    this.indata.showCounts++
    this.indata.noRest=true
    if(this.indata.showCounts<=1){
      return
    }
    if(!app.globalData.isFromOrderDetail&&this.indata.noRest){

      this.getUserCityInfo();
    }
  },

  onPullDownRefresh: function () {
    
    this.setData({
      BossCardShopList:'',
      page:1,
      hasEnd:false
    })
    wx.showLoading({
      title:"刷新中"
    })
    this.getUserCityInfo();
    wx.stopPullDownRefresh();
    
  },

  onReachBottom: function () {
    
    if(this.data.BossCardShopList.length == this.data.total){
      this.setData({
        hasEnd:true
      })
    }else{
      wx.showLoading({
        title:'加载中'
      })
      this.getMoreList(this.indata.latitude,this.indata.longitude)

    }
  },
   
  async getBossCardUserInfo(){
    //获取用户黑卡信息
    let bossCardUserInfo = await wxRequest(`${BASIC}/i/bossCard`,{})
    //获取城市id
    let bossCardCity = await wxRequest(`${BASIC}/city/bossCard`,{})
    let userInfoData = bossCardUserInfo.data.card
    let bosCardCityInfo = bossCardCity.data[0]
    if (userInfoData) {
      this.setData({
        cardNo:userInfoData.cardNo.replace(/(.{4})/g, "$1 "),
        userName:userInfoData.userName,
        userGender:this.data.mapSex[userInfoData.gender],
        bossCardCityId:bosCardCityInfo.id,
        bossCardCityName:bosCardCityInfo.name,
      })
    }
  },

  //获取使用的地理位置信息
  getUserCityInfo(){

    let that = this

    wx.getSetting({
      success(res){
        //如果为true,获取当前地理位置
        if(res.authSetting['scope.userLocation']){
          
          that.getCoorDinate()
        }else{
          wx.hideLoading();
          var tips = [
            "由于未能获取您当前的位置，",
            "所以无法为您准确推荐附近的餐厅，",
            "请及时开启您的定位"
          ];
          
          // 否则提示去允许授权
          wx.showModal({
            title: "提示",
            content: tips.join(""),
            confirmText: '去开启',
            cancelText: '取消',
            success: function (res) {
              if (res.confirm) {
                that.getUserLocationAgain()
              }
            }
          })
        }
      }
    })
  },

  getUserLocationAgain(){
    
    let that = this
    wx.openSetting({
      success(res){
        if(res.authSetting['scope.userLocation']){
          that.getCoorDinate()
        }
      }
    })
  },

  getCoorDinate(){
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res){
        that.indata.latitude = res.latitude,
        that.indata.longitude = res.longitude,
        that.getBossCardShopList(that.indata.latitude,that.indata.longitude)
      }
    })
  },

  // 获取黑卡列表
  async getBossCardShopList(latitude,longitude){
    wx.showLoading({
      title:"加载中"
    })
    let BossCardShopList = await wxRequest(`${BASIC}/shops/bossCard`,{
      bossCardCityId:this.data.bossCardCityId,
      latitude,
      longitude,
      page:this.data.page,
    })

    if (BossCardShopList.errNo === 0) {
      this.setData({
        BossCardShopList:BossCardShopList.data.data,
        total:BossCardShopList.data.total
      })
    } else {
      wx.showToast({
        title: BossCardShopList.errMsg,
        icon: 'none'
      })
    }

    wx.hideLoading()
  },

  // 加载更多
  async getMoreList(latitude,longitude){
    if(latitude){

      let moreShopList = await wxRequest(`${BASIC}/shops/bossCard`,{
        bossCardCityId:this.data.bossCardCityId,
        page:this.data.page + 1,
        latitude,
        longitude
      })
  
      this.setData({
        BossCardShopList:this.data.BossCardShopList.concat(moreShopList.data.data),
        page:this.data.page + 1,
      })
      
      wx.hideLoading()
    }
    
  },

  //跳转详情页
  toShopDetail(shopId){
    wx.navigateTo({
      url: `/pages/shopdetail/shopdetail?shopid=${shopId}`,
    })
  },

  callServiceNumber(){
    wx.makePhoneCall({
      phoneNumber: '4008166477',
    })
  },

})
