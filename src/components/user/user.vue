<template>
  <div class="user-container" ref="userWrapper">
    <div class="user-wrapper">
      <div class="user-header">
        <div class="background">
          <img src="../../common/img/user-bg.jpg" alt="">
        </div>
        <div class="avatar"><img :src="avatar"/></div>
        <div class="name">{{nick}}</div>
      </div>
      <div class="user-content">
        <div class="view-row" @click="realLedalize">
          <div class="icon-box"><span class="iconfont icon-认证"></span></div>
          <div class="icon-text">我的认证</div>
          <div class="state">{{stateText}}</div>
          <div class="pull-right"><span class="iconfont icon-right"></span></div>
        </div>
        <div class="view-row" @click="agentPerson">
          <div class="icon-box"><span class="iconfont icon-代理商"></span></div>
          <div class="icon-text">我是代理人</div>
          <div class="pull-right"><span class="iconfont icon-right"></span></div>
        </div>
        <a class="view-row" @click="callPhone">
          <div class="icon-box"><span class="iconfont icon-客服"></span></div>
          <div class="icon-text">联系客服</div>
          <!--<div class="state">4000088761</div>-->
          <div class="pull-right"><span class="iconfont icon-right"></span></div>
        </a>
        <router-link to="/setting" class="view-row">
          <div class="icon-box"><span class="iconfont icon-设置"></span></div>
          <div class="icon-text">设置</div>
          <div class="pull-right"><span class="iconfont icon-right"></span></div>
        </router-link>
        <a class="view-row" @click="share">
          <div class="icon-box"><span class="iconfont icon-分享"></span></div>
          <div class="icon-text">我的分享</div>
          <div class="pull-right"><span class="iconfont icon-right"></span></div>
        </a>
        <router-link to="/about" class="view-row">
          <div class="icon-box"><span class="iconfont icon-关于我们"></span></div>
          <div class="icon-text">关于我们</div>
          <div class="pull-right"><span class="iconfont icon-right"></span></div>
        </router-link>
        <!--<a href="tel:4000088761" id="mobile" hidden></a>-->
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {config, unHeaders, headers, isAndroid, isiOS} from '../../common/js/config';
  export default {
    data () {
      return {
        avatar: '',
        nick: '',
        userId: '',
        state: 0,
        agent: null, // 代理状态
        stateText: '未认证',
        contact: []
      };
    },
    created() {
//      this.initPage();
      var token = localStorage.getItem('token');
      if (token) {
        this.initPage();
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      initPage: function () {
        var _this = this;
        var token = localStorage.getItem('token');
        this.$root.tokenValidat(token, function (data) {
          if (data) {
            _this.initUser();
          } else {
            _this.$router.push('/login');
          }
        });
      },
      initUser: function () {
        // 个人信息
        var token = localStorage.getItem('token');
        var user = JSON.parse(localStorage.getItem('user'));
        this.avatar = user.avatar;
        this.nick = user.nick;
        this.userId = user.userId;
        console.log(user);
        this.$nextTick(() => {
          this._initScroll();
        });
        // 获取基本认证信息
        console.log('111111');
        var creditData = JSON.stringify({
          'actionName': 'findById',
          'controllerName': 'userAuth',
          'data': []
        });
        this.$http.post(config.request_url, creditData, headers(token)).then((res) => {
          console.log(res.body);
          if (res.body.data !== null) {
            sessionStorage.setItem('legalizeInfo', JSON.stringify(res.body.data));
            this.state = res.body.data.status;
            if (this.state === 1) {
              this.stateText = '待审核';
            } else if (this.state === 2) {
              this.stateText = '审核通过';
              this.agent = res.body.data.proxy;
            } else if (this.state === 3) {
              this.stateText = '审核失败';
            }
          }
        });
      },
      realLedalize: function () {
        if (this.state === 2) {
          this.$router.push('/realLedalize');
        } else {
          if (isAndroid) {
            this.contact = window.JsAndroid.getPhoneContacts();
          }
          if (isiOS) {
            window.tianbai.call();
            this.contact = JSON.parse(localStorage.getItem('contact'));
          }
          this.submitContact();
        }
      },
      submitContact: function () {
        var token = localStorage.getItem('token');
        if (this.contact.length > 0) {
          var data = JSON.stringify({
            'actionName': 'insert',
            'controllerName': 'userContact',
            'data': [this.contact]
          });
          this.$http.post(config.base_url, data, headers(token)).then((response) => {
            var res = response.body;
            this.$router.push('/realLedalize');
            console.log('获取通讯录成功' + JSON.stringify(res));
          });
        } else {
          this.$dialog.toast({mes: '请开启通讯录权限~'});
        }
      },
      agentPerson: function () {
        if (this.agent === true) {
          this.$router.push('/agent');
        } else {
          this.$dialog.toast({mes: '您还不是代理人哦~'});
        }
      },
      _initScroll: function () {
        this.userScroll = new BScroll(this.$refs.userWrapper, {
          click: true
        });
      },
      callPhone: function () {
//        var mobile = document.getElementById('mobile');
//        mobile.click();
//        if (isAndroid) {
//          try {
//            window.JsAndroid.callPhone('4000088761');
//          } catch (e) {
//            console.log('拨打电话');
//          }
//        }
//        if (isiOS) {
//          var callInfo = {'mobile': '4000088761'};
//          window.tianbai.getCall(callInfo);
//        }
      },
      share: function () {
        var userId = this.userId;
        var data = JSON.stringify({
          'actionName': 'queryListPage',
          'controllerName': 'spreadInfo',
          'data': [{}]
        });
        this.$http.post(config.request_url, data, unHeaders).then((response) => {
          console.log('1111' + JSON.stringify(response.body));
          if (isAndroid) {
            window.JsAndroid.share(userId, JSON.stringify(response.body.data));
          }
          if (isiOS) {
            window.tianbai.getShare({userId: userId, data: response.body.data});
          }
        });
      }
    }
  };
</script>
<style type="text/css">
  .user-container {
    width: 100%;
    height: calc(100% - 49px);
    position: absolute;
    overflow: hidden;
  }

  .user-wrapper {
    width: 100%;
    margin-bottom: 49px;
  }

  .user-header {
    width: 100%;
    height: 225px;
    position: relative;
    overflow: hidden;
  }

  .user-header .background {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    filter: blur(10px);
  }

  .user-header .background img {
    width: 100%;
    height: 100%;
  }

  .user-header .avatar {
    width: 100%;
    margin-top: 91.5px;
  }

  .user-header .avatar img {
    display: block;
    width: 86px;
    height: 86px;
    border-radius: 100%;
    margin: auto;
  }

  .user-header .name {
    width: 100%;
    font-size: 13px;
    color: #ffffff;
    margin-top: 16px;
    margin-bottom: 18.5px;
    text-align: center;
  }

  .user-content {
    width: 100%;
    position: relative;
    margin-top: 13.5px;
    padding-bottom: 13.5px;
  }

  .user-content .view-row {
    width: 100%;
    height: 46px;
    background-color: #ffffff;
    margin-bottom: 1px;
    display: flex;
    box-sizing: border-box;
  }

  .user-content .view-row .icon-box {
    padding-left: 16px;
    padding-top: 8px;
  }

  .user-content .view-row .icon-text {
    flex: 8;
    line-height: 46px;
    font-size: 14px;
    color: #313131;
    padding-left: 9px;
  }

  .user-content .view-row .state {
    position: relative;
    top: 0;
    height: 46px;
    right: 0;
    line-height: 46px;
    font-size: 13px;
  }

  .user-content .view-row .pull-right {
    flex: 1;
    height: 46px;
    text-align: right;
    padding-right: 16px;
    padding-top: 14px;
    box-sizing: border-box;
  }
</style>
