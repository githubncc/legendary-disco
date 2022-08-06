// pages/score/score.js
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
// // const DB = wx.cloud.database().collection("history")
// // var Ttime = require('../../utils/utils.js');
// var utils = require('../../utils/utils.js');
// var data=new Data(that.data.mytime);
// that.data.mytime=utils.formatTime(data);

Page({
  
    onLoad: function (options) {
        wx.cloud.database().collection("history").get().then(res=>{
            console.log("shuju",res)
           
            this.setData({
                list:res.data,
                score:res.data[0].score,
                createTime:this._formatTime(res.data[0].createTime),
                
            })
        })
        
      },
  /**
   * 页面的初始数据
   */
  data: {
   
  },

  onReady: function () {},

// for (let a = 0; a < res.data.length; a++) {
//   var time_t=new Date(res.data[a].createTime)
//   var date = time_t.getFullYear()+"年"+(time_t.getMonth()+1)+"月"+time_t.getDate()+"日"+time_t.getHours()+"时"+time_t.getMinutes()+"分"+time_t.getSeconds()+"秒";
//   res.data[a].createTime=date;
// }
  _formatTime(time_t){
    // for (let a = 0; a < res.data.length; a++) {
  // var time_t=new Date(res.data.createTime)
  var data = time_t.getFullYear()+"年"+(time_t.getMonth()+1)+"月"+time_t.getDate()+"日"+time_t.getHours()+"时"+time_t.getMinutes()+"分"+time_t.getSeconds()+"秒";
  // res.data[0].createTime=date;
  return data
// }
    // var date = time_t.getFullYear()+"年"+(time_t.getMonth()+1)+"月"+time_t.getDate()+"日"
    // var time = time_t.getHours()+"时"+time_t.getMinutes()+"分"+time_t.getSeconds()+"秒"
    // return date+time
  }
  
});
