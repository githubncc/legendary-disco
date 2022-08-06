// index.js
// const app = getApp()
// const { envList } = require('../../envList.js');

Page({
    data: {
      showUploadTip: false,
      powerList: [{
        title: '单元学习',
        tip: ' ',
        showItem: false,
        item: [{
          title: '第一单元',
          page: 'Learnunitone'
        },
        //  {
        //   title: '微信支付'
        // },
         {
          title: '第二单元',
          page: 'Learnunittwo'
        },
        // {
        //   title: '发送订阅消息',
        // }
        {
          title: '第三单元',
          page: 'Learnunitthree'
        },
        {
          title: '第四单元',
          page: 'Learnunitfour'
        },
        {
          title: '第五单元',
          page: 'Learnunitfive'
        },
        {
          title: '第六单元',
          page: 'Learnunitsix'
        },
      ]
      }, {
        title: '单元检测',
        tip: ' ',
        showItem: false,
        item: [{
          title: '第一单元',
          page: 'textunitone'
        }, {
          title: '第二单元',
          page: 'textunitone'
        }, {
          title: '第三单元',
          page: 'textunitone'
        }, {
          title: '第四单元',
          page: 'textunitone'
        }
        , {
          title: '第五单元',
          page: 'textunitone'
        },
        {
          title: '第六单元',
          page: 'textunitone'
        }]
      }, {
        title: '课外知识',
        tip: ' ',
        showItem: false,
        item: [{
          title: '唐代诗人简介',
          page: 'Tintroduction'
        },
        {
          title: '宋代诗人简介',
          page: 'Sintroduction'
        },
        {
          title: '元代诗人简介',
          page: 'Yintroduction'
        },
        {
          title: '明代诗人简介',
          page: 'Mintroduction'
        },
        {
          title: '清代诗人简介',
          page: 'Qintroduction'
        }
      ]
      }, {
        title: '每日一诗',
        tip: ' ',
        showItem: false,
        item: [{
          title: '叙事诗',
          page: 'xvshishi'
        },
        {
          title: '抒情诗',
          page: 'xvshishi'
        },
        {
          title: '送别诗',
          page: 'xvshishi'
        },
        {
          title: '边塞诗',
          page: 'xvshishi'
        },
        {
          title: '山水田园诗',
          page: 'xvshishi'
        },
        {
          title: '怀古诗',
          page: 'xvshishi'
        },
        {
          title: '悼亡诗',
          page: 'xvshishi'
        },
        {
          title: '咏物诗',
          page: 'xvshishi'
        },
        {
          title: '军旅诗',
          page: 'xvshishi'
        }
      ]
      }],
      // envList,
      // selectedEnv: envList[0],
      // haveCreateCollection: false
    },
  
    onClickPowerInfo(e) {
      const index = e.currentTarget.dataset.index;
      const powerList = this.data.powerList;
      powerList[index].showItem = !powerList[index].showItem;
      if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
        this.onClickDatabase(powerList);
      } else {
        this.setData({
          powerList
        });
      }
    },
  
    onChangeShowEnvChoose() {
      wx.showActionSheet({
        itemList: this.data.envList.map(i => i.alias),
        success: (res) => {
          this.onChangeSelectedEnv(res.tapIndex);
        },
        fail (res) {
          console.log(res.errMsg);
        }
      });
    },
  
    onChangeSelectedEnv(index) {
      if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
        return;
      }
      const powerList = this.data.powerList;
      powerList.forEach(i => {
        i.showItem = false;
      });
      this.setData({
        selectedEnv: this.data.envList[index],
        powerList,
        haveCreateCollection: false
      });
    },
  
    jumpPage(e) {
      wx.navigateTo({
        url: `/pages/${e.currentTarget.dataset.page}/index?`,
      });
    },
  
    onClickDatabase(powerList) {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.selectedEnv.envId
        },
        data: {
          type: 'createCollection'
        }
      }).then((resp) => {
        if (resp.result.success) {
          this.setData({
            haveCreateCollection: true
          });
        }
        this.setData({
          powerList
        });
        wx.hideLoading();
      }).catch((e) => {
        console.log(e);
        this.setData({
          showUploadTip: true
        });
        wx.hideLoading();
      });
    }
  });
  