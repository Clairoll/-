let regeneratorRuntime = require('../../utils/regenerator/runtime')
const {wxRequest} = require ('../../utils/wxRequest.js');
const {BASIC} = require ('../../config/domain');
const util = require('../../utils/util')

let app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    man:false,
    woman:false,
    sex:0,      //性别
    backshow:false,  //是否显示遮罩
    agreementShow:false, //是否显示美味黑卡协议
    disabled:false,  //验证码按钮是否可点击
    discode:true,   //防止验证码按钮再次激活
    notGetCode:false,
    hotline:false, //客服热线是否显示
    activateSuccess:false,  //是否激活成功
    activateCanuse:false,  //激活按钮是否可用
    time:"获取验证码",
    currentTime:61,
    userActivateCode:'',   //存储input值
    userName:'',    //姓名
    userPhoneNumber:'',//手机号
    userMessageCode:'',//验证码
    toastText:'',  //提示弹窗文本
    onShow:false,  //遮罩
    hasMobile:'',
    animationData:'',
    isIphoneX:false,
    hotlineback:false,
    noBoss:false
  },
  indata:{
    discode:true,
    interval:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    wx.showLoading({
      title:'加载中'
    });
    this.getBossCardUserInfo()
    //识别ipx
    let isIpx = app.globalData.isIphoneX
    if(isIpx){
      this.setData({
        isIphoneX:true
      })
    }

    wx.hideShareMenu(); // 隐藏分享按钮
        
    //获取toast组件数据
    this.toast=this.selectComponent("#toast");
      
  },

  //获取用户黑卡信息，判断是否为黑卡用户

  async getBossCardUserInfo () {

    //获取用户信息判断是否为黑卡用户
    let bossCardUserInfo = await wxRequest(`${BASIC}/i/bossCard`,{})
    // 如已经是黑卡用户，跳转至黑卡页面
        if(bossCardUserInfo.data.card != null){
          this.toUseBossCard();
        }else{
          this.setData({
            noBoss:true
          })
          //判断是否已绑定手机号
          if(bossCardUserInfo.data.mobile){
            this.setData({
              hasMobile:bossCardUserInfo.data.mobile,
              userPhoneNumber:bossCardUserInfo.data.mobile,
              notGetCode:true
            })
          }
        }
        wx.hideLoading()

  },


  //是否展示美味黑卡协议
  isShowAgrement(e){
      let {type} = e.target.dataset
      this.setData({
        agreementShow:type==='show' ? true : false,
        backshow:type==='show' ? true : false
      })
  },

  //是否显示客服热线
  isShowHotLine(e){
      let {type} = e.target.dataset
      this.setData({
        hotlineback:type==='show' ? true : false,
        hotline:type==='show' ? true : false,
      })
  },

  //拨打客服热线
  callHotLine(){
      wx.makePhoneCall({
        phoneNumber: '4008166477',
      })
  },

//选择性别
  chooseSex(e){

      let {sex} = e.target.dataset
      if(sex==='man'){
        this.setData({
          man:true,
          sex:1,
          woman:false
        })
      }else{
        this.setData({
          man:false,
          sex:2,
          woman:true
        })
      }

      this.canActivateUse()
  },


  // 激活按钮是否可点击
  canActivateUse(){
      let canActivate = this.data.userActivateCode && this.data.userName && this.data.userPhoneNumber && this.data.userMessageCode && (this.data.man || this.data.woman);

      if(canActivate){
        this.setData({
          activateCanuse:true  //激活按钮可点击状态
        })
      }else{
        this.setData({
          activateCanuse:false  //激活按钮不可点击状态
        })
      }
  },

  // 获取手机验证码
  async getcode(){

      let correct = this.data.userPhoneNumber&&util.validators.isMobile(this.data.userPhoneNumber)&&this.indata.discode

      if(correct){//判断手机号是否符合

        //调接口拿验证码
        let Vcode = await wxRequest(`${BASIC}/captcha`, {
          mobile:this.data.userPhoneNumber
        });

        this.indata.discode=false;

        this.setData({
          disabled:true,
          notGetCode:false,
          disabled:true
        });

        this.countDown();
        
      }else if(!this.indata.discode){
        this.showToast("验证码已发送，请注意查收")
      }else if(this.data.userPhoneNumber.length!=11){
        return
      }else{
        this.showToast("请输入正确的手机号码")
      }
  },

  //倒计时
  countDown(){
      let currentTime = this.data.currentTime;
      this.indata.interval = setInterval(() => {
          currentTime--;
          if(currentTime<=0){
            this.indata.discode=true;
            clearInterval(this.indata.interval);
            this.setData({
              time:"重新发送",
              currentTime:61,
              disabled:false,
              notGetCode:true
            })
          }else{
            this.setData({
              time:currentTime+'s'
            });
          }
        }, 1000);
  },

//toast弹窗
  showToast(value){
      this.setData({
        onShow:true
      })
      this.toast.showToast(value)
      setTimeout(()=>{
        this.setData({
          onShow:false
        })
      },3000)
  },

//获取存储input值
  getUserInput(e){
      let item = e.currentTarget.dataset.model;

      this.setData({
        [item]: e.detail.value
      });

      this.canActivateUse()

//判断手机号，决定验证码按钮是否为可点击状态
      if(this.data.userPhoneNumber.length==11 && this.indata.discode){
        this.setData({
          notGetCode:true
        })
      }else{
        this.setData({
          notGetCode:false
        })
      }
  },


//点击激活按钮
  async activateBossCard(){
      let hasComplete = this.data.userActivateCode && this.data.userName && this.data.userPhoneNumber && this.data.userMessageCode && (this.data.man || this.data.woman);
      if(hasComplete){
          let activate = await wxRequest(`${BASIC}/i/bossCard/activate`, {
            actNo:this.data.userActivateCode,
            userName:this.data.userName,
            gender:this.data.sex,
            mobile:this.data.userPhoneNumber,
            code:this.data.userMessageCode,
          })

          if(activate.errNo === 0){//成功

            this.setData({
                  activateSuccess:true
            })
          
          }else if(activate.errNo === 406300 ){

            this.showToast("验证码错误，请重新输入")
            
          }else if(activate.errNo === 100004){

            this.showToast("该激活码已被使用，请重新输入")

          }else{

            this.showToast("激活失败")

            let animation = wx.createAnimation({
                duration: 200,
                timingFunction: "ease",
                delay: 3000,
                transformOrigin: "50% 50%",
            })
            animation.left(15).step(); 
            this.setData({
                animationData: animation.export(),
            })
          }
      }
  },

  toUseBossCard(){
      wx.switchTab({
        url:"/pages/mymwee/mymwee"
      })
  },

})
