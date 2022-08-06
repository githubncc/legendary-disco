Page({

  /**
   * 页面的初始数据
   */
    data: {
      nickName:"点击登录",
      avatarUrl:"/images/user.png",
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
    },
    onLoad() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    },
    getUserProfile(e) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
    star(){
        wx.navigateTo({
          url: '../star/star',
        })
    },
    score(){
      wx.navigateTo({
        url: '../score/score',
      })
  },
    collection(){
        wx.navigateTo({
          url: '../collection/collection',
        })
    },
  onShareAppMessage:function(res){
      if(res.from==='button'){
          console.log(res.target)
      }
      return{
          title:"小学生诗词学堂",
          path:"/pages/index/index",
          success:function(res){

          }
      }
  }
});
