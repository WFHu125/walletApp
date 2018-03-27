<template>
  <div class="container">
    <div class="background"><img src="../../common/img/login-bg.jpg" alt=""></div>
    <div class="container-wrapper" ref="loginWrapper">
      <div class="login-wrapper">
        <div class="login_back" @click="back">返回</div>
        <div class="logo"><img src="../../common/img/logo.png" alt=""></div>
        <form action="" class="form_login">
          <div class="input_box">
            <label><span class="iconfont icon-用户"></span></label><input type="text" v-model="loginName"
                                                                        placeholder="请输入手机号/用户名"/>
          </div>
          <div class="input_box">
            <label><span class="iconfont icon-密码"></span></label><input type="password" v-model="password"
                                                                        placeholder="请输入密码"/>
          </div>
        </form>
        <div class="reg_box">
          <router-link to="/reg" class="reg_link">注册账号</router-link>
          <router-link to="/forget" class="reg_link">忘记密码？</router-link>
        </div>
        <div class="btn_submit" @click="isLogin">登录</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {config, unHeaders} from '../../common/js/config';
  export default {
    data() {
      return {
        loginName: '',
        password: ''
      };
    },
    created() {
      this._initScroll();
    },
    methods: {
      isLogin: function () {
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
            this.$dialog.toast({mes: response.body.data.remark});
//            this.$router.push({path: '/', query: {user: JSON.stringify(response.body.data.data)}});
            this.$router.push('/');
            console.log(response.body);
          } else {
            console.log(response.body.data);
            this.$dialog.toast({
              mes: response.body.data.data,
              timeout: 1500
            });
          }
        });
      },
      _initScroll: function () {
        this.loginScroll = new BScroll(this.$refs.loginWrapper, {click: true});
      },
      back: function () {
        this.$router.push('/');
      }
    }
  };
</script>

<style>
  @import '../../common/stylus/iconfont.css';

  .container {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .background {
    width: 100%;
    height: 100vh;
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

  .login_back{
    position: absolute;
    top:0;
    left: 0;
    padding: 15px;
    color: #fff;
    font-size: 14px;
  }
  .container-wrapper .logo {
    width: 100%;
    padding: 62.5px 0;
    text-align: center;
    box-sizing: border-box;
  }

  .container-wrapper .logo img {
    width: 108px;
    height: 108px;
    border-radius: 108px;
  }

  .container-wrapper .form_login {
    width: 80%;
    height: auto;
    margin: auto;
  }

  .form_login .input_box {
    width: 100%;
    height: 49px;
    border-radius: 5px;
    display: flex;
    margin-bottom: 9.5px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .form_login .input_box label {
    padding-left: 15px;
    padding-top: 14.5px;
    color: #fcfcfc;
    box-sizing: border-box;
  }

  .form_login .input_box input {
    flex: 9;
    padding-left: 15px;
    line-height: 45px;
    font-size: 16px;
    color: #313131;
    border: none;
    outline: none;
    background-color: transparent;
    box-sizing: border-box;
  }

  .form_login .input_box input::placeholder {
    color: #cccccc;
  }

  .reg_box {
    width: 80%;
    margin: 0 auto 44px;
    padding: 0 20px;
    display: flex;
    box-sizing: border-box;
  }

  .reg_box .reg_link {
    flex: 1;
    font-size: 13px;
    color: #cccccc;
  }

  .reg_box .reg_link:last-child {
    text-align: right;
  }

  .btn_submit {
    width: 80%;
    height: 49px;
    margin: 0 auto;
    background-color: rgba(78, 144, 254, 0.8);
    font-size: 17px;
    color: #FFFFFF;
    text-align: center;
    line-height: 49px;
    letter-spacing: 15px;
    border-radius: 5px;
  }
</style>
