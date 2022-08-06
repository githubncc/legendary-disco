// pages/exam/exam.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
      currentIndex: 0,
      total: 0,
  
      untext: null,
      untextList: [],
  
      finish:false,
  
      score:0,
      correctCount:0,
      wrongCount:0,
    },
  
    getList() {
      const that = this;
      wx.cloud
        .callFunction({
          name: "questionPool",
          data: {
            type: "text",
            page: 1,
            size: 5,
          },
        })
        .then((res) => {
          // console.log(res.result)
          const { untextList, errMsg, errCode } = res.result;
  
          if (errCode == 0) {
            const total = untextList.length;
            const untext = untextList[that.data.currentIndex];
  
            that.checkStar(untext._id);
  
            that.setData({
              untextList,
              total,
              untext,
            });
          } else {
            console.error(errMsg);
            wx.showToast({
              title: "查询题目失败",
              icon: "error",
            });
          }
        })
        .catch(console.error);
    },
    _collectAnswer(selectedValue,tempuntext){
      if(tempuntext.type == 'radio'){
        return [selectedValue];
      }else if(tempuntext.type == 'checkbox'){
        let currentAnswer = tempuntext.userAnswer || [];
  
        if(currentAnswer.includes(selectedValue)){
          currentAnswer.splice(currentAnswer.indexOf(selectedValue),1)
        }else{
          currentAnswer.push(selectedValue)
        }
  
        return currentAnswer.sort();
      }
    },
    onItemClick(event){
      // console.log(event);
      const selectedValue = event.target.dataset.value;
  
      let tempuntext = this.data.untext;
      if(tempuntext.showAnswer){
        console.log("已经看过答案，不能修改选项")
        return;
      }
  
      tempuntext.userAnswer = this._collectAnswer(selectedValue,tempuntext);
  
      this.setData({
        untext:tempuntext,
      })
  
    },
  
    onShowAnswer(){
      let tempuntext = this.data.untext;
      tempuntext.showAnswer = true;
      this.setData({
        untext: tempuntext,
      })
  
      this.addCollection();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getList();
    },
  
    goPrev(){
      const that = this;
      const newIndex = that.data.currentIndex - 1;
      if(newIndex < 0){
        console.log("已经是第一题")
        return;
      }
  
      const tempuntext = that.data.untextList[newIndex];
      that.checkStar(tempuntext._id);
  
      that.setData({
        currentIndex: newIndex,
        untext:tempuntext,
      });
    },
    goNext(){
      const that = this;
  
      if (!that.data.untext.userAnswer) {
        console.log(`用户还未回答，不跳转`);
        wx.showToast({ title: "请先回答本题", icon: "none" });
        return;
      }
  
      // 切换前：验证是否答错并加入错题集
      that.addCollection();
  
      const newIndex = that.data.currentIndex + 1;
      if(newIndex > that.data.untextList.length - 1){
        console.log("已经是最后一题")
        return;
      }
  
      const tempuntext = that.data.untextList[newIndex];
      that.checkStar(tempuntext._id);
  
      that.setData({
        currentIndex: newIndex,
        untext:tempuntext,
      });
  
    },
  
    goResult(){
  
      const that = this;
  
      if (!that.data.untext.userAnswer) {
        console.log(`用户还未回答，不跳转`);
        wx.showToast({ title: "请先回答本题", icon: "none" });
        return;
      }
  
      const correctCount = that.data.untextList.reduce((val, cur) => {
        if (that._isCorrect(cur)) {
          val += 1;
        }
        return val;
      }, 0);
  
      const wrongCount = that.data.untextList.reduce((val, cur) => {
        if (!that._isCorrect(cur)) {
          val += 1;
        }
        return val;
      }, 0);
  
      const score = Math.round((correctCount * 100) / that.data.total);
  
      that._recordScore(score);
  
      that.setData({
        correctCount,
        wrongCount,
        score,
        finish: true,
      });
    },
  
    _recordScore(score){
      wx.cloud.callFunction({
        name:"questionPool",
        data:{
          type:"recordScore",
          score:score,
        }
      })
      .then(res=>{
        console.log(res);
        const { errCode, errMsg } = res.result;
  
        if (errCode == 0) {
          console.log(`已记录用户分数 ${score}`);
        } else {
          console.error(errMsg);
        }
      })
      .catch(console.error);
    },
  
    _isCorrect(untext){
      return untext.answer.sort().join() === untext.userAnswer.sort().join();
    },
  
    addCollection(){
      const that = this;
      let tempuntext = that.data.untext;
  
      if (!tempuntext.userAnswer) {
        console.log(`用户还未回答，不加错题本逻辑 ${tempuntext.title}`);
        return;
      }
  
      if (that._isCorrect(tempuntext)) {
        console.log(`用户答对了，不加错题本逻辑 ${tempuntext.title}`);
        return;
      }
  
      wx.cloud
      .callFunction({
        name:"questionPool",
        data:{
          type:"collect",
          untextId:tempuntext._id,
        }
      })
      .then(res=>{
        // console.log(res);
        const { errCode, errMsg } = res.result;
  
        if (errCode == 0) {
          // wx.showToast({ title: '已加入错题本', icon: 'none' });
          console.log(`已加入错题本 ${tempuntext.title}`);
        } else {
          console.error(errMsg);
        }
      })
      .catch(console.error);
  
    },
  
    addStar(){
      const that = this;
      const {showAnswer,starred,userAnswer,...untextForStar} = that.data.untext;
      wx.cloud
      .callFunction({
        name:"questionPool",
        data:{
          type:"addStar",
          untext: untextForStar,
        }
      })
      .then(res=>{
        console.log(res)
        const { errMsg } = res.result;
        if (errMsg == "document.set:ok") {
          let tempQustion = that.data.untext;
          tempQustion.starred = true;
          // const updateKey = `untextList[${that.data.currentIndex}]`;
  
          that.setData({
            untext: tempQustion,
            // [updateKey]:tempQustion,
          });
          wx.showToast({
            title: "收藏成功",
            icon: "success",
            duration: 2000,
          });
        } else {
          wx.showModal({
            title: "收藏失败",
            content: errMsg,
            showCancel: false,
          });
        }
      })
    },
  
    checkStar(untextId){
      const that = this;
      wx.cloud
        .callFunction({
          name: "questionPool",
          data: {
            type: "checkStar",
            untextId: untextId,
          },
        })
        .then((res) => {
          // console.log(res.result)
          const { errMsg, total } = res.result;
  
          if (errMsg == "collection.count:ok") {
            let tempuntext = that.data.untext;
            tempuntext.starred = total > 0;
  
            that.setData({
              untext: tempuntext,
            });
          } else {
            console.warn("查询收藏失败");
          }
          
        })
        .catch(console.error);
    },
  
    removeStar(){
      const that = this;
      wx.cloud
        .callFunction({
          name: "questionPool",
          data: {
            type: "removeStar",
            untextId: that.data.untext._id,
          },
        })
        .then((res) => {
          // console.log(res.result);
          const { errMsg } = res.result;
          if (errMsg == "collection.remove:ok") {
            let tempQustion = that.data.untext;
            tempQustion.starred = false;
            // const updateKey = `untextList[${that.data.currentIndex}]`;
  
            that.setData({
              untext: tempQustion,
              // [updateKey]:tempQustion,
            });
  
            wx.showToast({
              title: "取消收藏成功",
              icon: "success",
              duration: 2000,
            });
          } else {
            wx.showModal({
              title: "取消收藏失败",
              content: errMsg,
              showCancel: false,
            });
          }
        })
        .catch(console.error);
    },
  
    gotoCollection(){
      wx.redirectTo({
        url: '/pages/collection/collection',
      })
    },
  
    goHome(){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
  });
  