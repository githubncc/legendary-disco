// index.js
// const app = getApp()


Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '单元学习',
      tip: ' ',
      showItem: false,
      item: [{
        title: '第一单元',
        page: 'getOpenId'
      },
      //  {
      //   title: '微信支付'
      // },
       {
        title: '第二单元',
        page: 'getMiniProgramCode'
      },
      // {
      //   title: '发送订阅消息',
      // }
      {
        title: '第三单元',
        page: 'getMiniProgramCode'
      },
      {
        title: '第四单元',
        page: 'getMiniProgramCode'
      },
      {
        title: '第五单元',
        page: 'getMiniProgramCode'
      },
    ]
    }, {
      title: '单元检测',
      tip: ' ',
      showItem: false,
      item: [{
        title: '第一单元',
        page: 'createCollection'
      }, {
        title: '第二单元',
        page: 'updateRecord'
      }, {
        title: '第三单元',
        page: 'selectRecord'
      }, {
        title: '第四单元',
        page: 'sumRecord'
      }
      , {
        title: '第五单元',
        page: 'sumRecord'
      }]
    }, {
      title: '课外知识',
      tip: ' ',
      showItem: false,
      item: [{
        title: '上传文件',
        page: 'uploadFile'
      }]
    }, {
      title: '每日一题',
      tip: ' ',
      showItem: false,
    }],
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
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
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
