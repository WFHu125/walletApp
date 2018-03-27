<template>
  <div>
    <Vheader title="找回密码"></Vheader>
    <div class="h-content especially">
      <div class="input-box">
        <label class="input-label flex2">手机号:</label>
        <input type="number" class="input flex8" placeholder="请输入当前手机号" v-model="loginName">
      </div>
      <div class="input-box">
        <label class="input-label flex2">验证码:</label><input type="text" v-model="code" class="input flex8"
                                                            placeholder="请输入手机验证码"/>
        <div class="Vcode" @click="getCode(60)" :disabled="disabled || time > 0" :style="{backgroundColor:bgColor}">
          {{text}}
        </div>
      </div>
      <div class="input-box">
        <label class="input-label flex2">密码:</label>
        <input type="password" class="input flex8" placeholder="请再次输入新密码" v-model="password">
      </div>
      <div class="btn-container margin100">
        <div class="btn btn-orange" @click="forgetSubmit">提交</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vheader from '../header/childHeader.vue';
  import {config, unHeaders} from '../../common/js/config';
  export default{
    data() {
      return {
        disabled: false,
        time: 0,
        password: '',
        loginName: '',
        code: ''
      };
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
      getCode(time) {
        if (this.loginName !== '' && this.loginName.length === 11) {
          this.disabled = true;
          this.time = time;
          this.timer();
          var codeData = JSON.stringify({
            'data': [this.loginName, 'retrieve'
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
        } else {
          this.$dialog.toast({mes: '请输入正确的手机号码'});
        }
      },
      timer() {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        }
      },
      forgetSubmit() {
//          验证手机验证码
        var codeData = JSON.stringify({
          'data': [this.loginName, this.code, 'retrieve'],
          'controllerName': 'smsMessage',
          'actionName': 'validate'
        });
        var forgetData = JSON.stringify({
          'data': [{
            'password': this.password,
            'loginName': this.loginName
          }],
          'controllerName': 'userInfo',
          'actionName': 'retrieve'
        });
        if (this.code === '' || this.code.length < 4) {
          this.$dialog.toast({mes: '验证码不能为空或者长度不小于四位'});
          return;
        }
        this.$http.post(config.request_url, codeData, unHeaders).then(function (response) {
          console.log('验证短信' + JSON.stringify(response.body));
          this.$http.post(config.request_url, forgetData, unHeaders).then(function (res) {
            if (res.body.data.result === true) {
              this.$dialog.toast({mes: res.body.data.remark});
              this.$router.push('/login');
            } else {
              this.$dialog.toast({mes: res.body.data.remark});
            }
          }).catch(function (error) {
            this.$dialog.toast({mes: error});
          });
        }).catch(function () {
          this.$dialog.toast({mes: '服务器异常'});
        });
      }
    },
    components: {
      Vheader
    }
  };
</script>

<style>
  @import "../../common/stylus/header.css";
  @import "../../common/stylus/iconfont.css";
  @import "../../common/stylus/public.css";

  .Vcode {
    position: absolute;
    right: 10%;
    padding: 8px 5px;
    margin-top: 8.5px;
    /*background-color: #67a2ab;*/
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 5px;
  }

</style>
