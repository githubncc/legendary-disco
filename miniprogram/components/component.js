// component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  // 父组件传过来的题目数据
    question: {
      type: Object,
      observer: function(news, old,path) {
        const titleArr = news.content.split(''); // 将题目分割为数组
        let inputMap = new Map(); // 新建map
        for(let i = 0; i < titleArr.length; i++) { // 遍历分割的数组
          if(titleArr[i] === '_') {
            inputMap.set(i,''); // 如果遇到下划线，就set进map里
          }
        }
        this.setData({
          titleArr,
          inputMap
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleArr: [], // 题目分割的数组
    inputMap: new Map() // 新建map 存放用户输入的答案
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fnInput(e) {
      const value = e.detail.value;
      const index = e.currentTarget.dataset.value;
      let answerRes = '';
      this.data.inputMap.set(index, value);
      this.data.inputMap.forEach((value, key) => {
        answerRes += value +';'
      })
      answerRes = answerRes.substring(0,answerRes.length-1);
      this.triggerEvent('BlankEvent',{isBtnActive: true,answer: answerRes},{})
    }
  }
})