<template>
  <div class="register-container">
    <div class="background"><img src="../../common/img/login-bg.jpg" alt=""></div>
    <div class="container-wrapper" ref="register">
      <div class="register-wrapper">
        <div class="logo"><img src="../../common/img/logo.png" alt=""></div>
        <form action="" class="form_login">
          <div class="input_box">
            <label><span class="iconfont icon-用户"></span></label><input type="number" v-model="loginName"
                                                                        placeholder="请输入手机号"
                                                                        @bulr="checkMobile(loginName)"/>
          </div>
          <div class="input_box">
            <label><span class="iconfont icon-验证"></span></label><input type="text" v-model="code"
                                                                        placeholder="请输入手机验证码" @blur="checkCode(code)"/>
            <!--<btnTimer @run="send" :disabled="disabled" ref="btn" :second="30"></btnTimer>-->
            <div class="Vcode" @click="getCode(60)" :disabled="disabled || time > 0" :style="{backgroundColor:bgColor}">
              {{text}}
            </div>
          </div>
          <div class="input_box">
            <label><span class="iconfont icon-密码"></span></label><input type="password" v-model="password"
                                                                        placeholder="请设置6-16位字母，数字,下划线的密码"
                                                                        @blur="checkPass(password)"/>
          </div>
          <div class="input_box">
            <label><span class="iconfont icon-密码"></span></label><input type="password" v-model="confirmPassword"
                                                                        placeholder="请确认您的密码"
                                                                        @blur="checkConPass(password,confirmPassword)"/>
          </div>
        </form>
        <div class="btn_submit" @click="doSubmit">注册</div>
        <router-link class="a-login" to="/login">已有账号，立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {config, unHeaders, splitStr} from '../../common/js/config';
  export default {
    data() {
      return {
        disabled: false,
        time: 0,
        password: '',
        loginName: '',
        confirmPassword: '',
        code: '',
        count: 1,
        href: ''
      };
    },
    created() {
      this.href = window.location.href;
      var data = JSON.stringify({
        'actionName': 'updates',
        'controllerName': 'spreadInfo',
        'data': [{
          'count': this.count,
          'counts': 1,
          'spreadId': 4
        }]
      });
      this.$nextTick(function () {
        this.registerScroll = new BScroll(this.$refs.register, {click: true});
      });
      if (sessionStorage.getItem('count')) {
        this.$http.post(config.request_url, data, unHeaders).then((res) => {
          console.log(res.body);
        });
      } else {
        sessionStorage.setItem('count', 1);
        this.count = 0;
        this.$http.post(config.request_url, data, unHeaders).then((res) => {
          console.log(res.body);
        });
      }
    },
    computed: {
      text: function () {
        return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
      },
      bgColor: function () {
        return this.time > 0 ? '#a9a9a9' : '#2fa0ec';
      }
    },
    methods: {
      getCode(second) {
        if (this.checkMobile(this.loginName)) {
          this.time = second;
          this.timer();
          var codeData = JSON.stringify({
            'data': [this.loginName, 'register'
            ],
            'controllerName': 'smsMessage',
            'actionName': 'sendSmsMessage'
          });
          this.$http.post(config.request_url, codeData, unHeaders).then(function (response) {
            console.log(JSON.stringify(response.body));
            if (response.body.data.result === true) {
              this.$dialog.toast({mes: response.body.data.remark});
            } else {
              this.$dialog.toast({mes: response.body.data.data});
            }
          });
        }
      },
      timer: function () {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        }
      },
      doSubmit() {
        var codeVal = JSON.stringify({
          'data': [this.loginName, this.code, 'register'
          ],
          'controllerName': 'smsMessage',
          'actionName': 'validate'
        });
        var href = splitStr(this.href);
        var formData1 = JSON.stringify({
          'data': [{
            'password': this.password,
            'loginName': this.loginName,
            'code': this.code,
            'spread': href.spread === null ? '' : href.spread,
            'invite_user': href.invite_user === null ? '' : href.invite_user
          }],
          'controllerName': 'userInfo',
          'actionName': 'register'
        });
        console.log('参数' + formData1);
        this.$http.post(config.request_url, codeVal, unHeaders).then(function (response) {
          console.log('验证短信' + JSON.stringify(response.body));
          // 提交注册
          if (this.checkMobile(this.loginName) && this.checkPass(this.password) && this.checkConPass(this.password, this.confirmPassword)) {
            this.$http.post(config.request_url, formData1, unHeaders).then(function (response) {
              if (response.body.data.result === true) {
                this.$dialog.toast({mes: response.data.remark});
                this.login();
              } else {
                this.$dialog.toast({mes: response.body.data.data});
              }
            });
          }
        });
      },
      login() {
        var loginData = JSON.stringify({
          'data': [{
            'password': this.password,
            'loginName': this.loginName
          }],
          'controllerName': 'userInfo',
          'actionName': 'login'
        });
        this.$http.post(config.request_url, loginData, unHeaders).then(function (response) {
          console.log(JSON.stringify(response.body));
          if (response.body.data.result === true) {
            localStorage.setItem('token', response.body.data.token);
            localStorage.setItem('user', JSON.stringify(response.body.data.data));
//            this.$router.push({path: '/', query: {user: JSON.stringify(response.body.data.data)}});
            this.$router.push('/');
          } else {
            this.$dialog.toast({
              mes: response.body.data.data,
              timeout: 1500
            });
          }
        });
      },
      checkMobile(mobile) {
//        /^((13[0-9]{1})|(15[0-9]{1})|(17[0-8]{1})|(14[5,7]{1}|(18[0-9]{1}))+\d{8})$/
        var expMobile = /^1[34578]\d{9}$/;
        if (!expMobile.test(mobile)) {
          this.$dialog.toast({mes: '请输入有效的手机号码'});
          return false;
        } else {
          return true;
        }
      },
      checkCode(code) {
        if (code === '' || code.length < 4) {
          this.$dialog.toast({mes: '验证码不能为空或者长度不小于四位'});
          return false;
        } else {
          return true;
        }
      },
      checkPass(pass) {
        var expPass = /^(\w){6,16}$/;
        if (!expPass.test(pass)) {
          this.$dialog.toast({mes: '密码要为6~16位数字，字母下划线组成'});
          return false;
        } else {
          return true;
        }
      },
      checkConPass(pass1, pass2) {
        console.log(pass1);
        console.log(pass2);
        if (pass1 === pass2) {
          return true;
        } else {
          this.$dialog.toast({mes: '密码和之前密码不一致'});
          return false;
        }
      }
    }
  };
</script>

<style>
  @import '../../common/stylus/iconfont.css';

  .register-container {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(10px);
  }

  .background img {
    width: 100%;
    height: 100%;
  }

  .container-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    overflow: hidden;
  }

  .register-wrapper {
    width: 100%;
    height: auto;
  }

  .register-wrapper .logo {
    width: 100%;
    padding: 62.5px 0;
    text-align: center;
    box-sizing: border-box;
  }

  .register-wrapper .logo img {
    width: 108px;
    height: 108px;
    border-radius: 108px;
  }

  .register-wrapper .form_login {
    width: 80%;
    height: auto;
    margin: auto;
  }

  .register-wrapper .input_box {
    width: 100%;
    height: 49px;
    border-radius: 5px;
    display: flex;
    margin-bottom: 9.5px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .register-wrapper .input_box label {
    padding-left: 15px;
    padding-top: 14.5px;
    color: #fcfcfc;
    box-sizing: border-box;
  }

  .register-wrapper .input_box input {
    flex: 9;
    padding-left: 15px;
    line-height: 49px;
    font-size: 16px;
    color: #606060;
    border: none;
    outline: none;
    background-color: transparent;
    box-sizing: border-box;
  }

  .register-wrapper .input_box input::placeholder {
    color: #cccccc;
    font-size: 13px;
  }

  .register-wrapper .Vcode {
    position: absolute;
    right: 10%;
    padding: 8px 5px;
    margin-top: 8.5px;
    background-color: #4e8ffe;
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 5px;
  }

  .register-wrapper .btn_submit {
    width: 80%;
    height: 49px;
    margin: 44px auto 0;
    background-color: rgba(77, 143, 254, 0.8);
    font-size: 17px;
    color: #FFFFFF;
    text-align: center;
    line-height: 49px;
    letter-spacing: 15px;
    border-radius: 5px;
  }

  .register-wrapper .a-login {
    display: block;
    width: 80%;
    margin: auto;
    padding-top: 20px;
    padding-bottom: 50px;
    text-align: right;
    color: #FFFFFF;
    font-size: 14px;
  }
</style>
