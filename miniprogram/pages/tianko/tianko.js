// pages/tianko/tianko.js
Page({

    /**
       * 页面的初始数据
       */
      data: {
        question: {
          content: '春眠不觉晓，_。夜来风雨声，_。',
          title: '填空题',
          score: 10,
          answer: '处处闻啼鸟；花落知多少'
        }, // 从后台获取的题目信息
        isBtnActive: false,
        answer: '', // 回答的答案
        isShowNext: false // 确定按钮和下一题按钮的显示隐藏控制
      },
    
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
       
      },
      /**
       * 接收填空题组件的值来控制按钮isactive
       * @param {*} e 
       */
      choiceEvent: function(e) {
        // isBtnActive 为true，按钮激活； answer为用户输入的答案
        const {isBtnActive,answer} = e.detail;
        this.setData({
          isBtnActive,
          answer
        });
      } ,
       /**
       * 点击确定，调后台接口保存用户答题的答案
       * @param {*} e 
       */
      fnSave: function(e) {
        if(!this.data.isBtnActive) { return false;}
        const that = this;
        const params = {
          answer: this.data.answer
        };
        wx.request({
          url: 'http://127.0.0.1:3000/',
          method: 'POST',
          data: params,
          header: {
            'Content-type': 'application/x-www-form-urlencode' 
          },
          success:(res)=> {
            console.log(res);
          },
          error(err){
            wx.showToast({
              title: '网络请求错误，错误信息：'+err,
            })
          }
        })
      },
      fnToNext: function() {}
      
    })

//     success:function(res){
//       wx.showToast({
//         title: '成功连接到后台',//弹窗弹出的文字
//         icon: 'success',   //微信小程序自带的成功弹窗
//         duration: 2000     //弹窗持续时间
//       })
//     },
//     fail:function(res){
//       wx.showToast({
//         title: '无法连接到后台',
//         icon: 'none',     //微信小程序自带的失败弹窗
//         duration: 2000
//       })
//     }
//   })
// },
// })