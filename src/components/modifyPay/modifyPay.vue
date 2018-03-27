<template>
  <div>
    <Vheader title="修改支付宝账号"></Vheader>
    <div class="h-content especially">
      <div class="input-box">
        <label class="input-label flex3">已认证姓名:</label>
        <input type="text" class="input flex7" :value="realName" readonly>
      </div>
      <div class="input-box">
        <label class="input-label flex3">您的手机号码:</label>
        <input type="text" class="input flex7" :value="mobile" readonly>
      </div>
      <div class="input-box">
        <input type="text" class="input input-row" placeholder="请输入支付宝账号" v-model="alipay">
      </div>
      <div class="input-box">
        <input type="number" class="input input-row" placeholder="请输入手机验证码" v-model="code">
        <div class="Vcode" @click="getCode(60)" :disabled="disabled || time > 0" :style="{backgroundColor:bgColor}">
          {{text}}
        </div>
      </div>
      <div class="btn-container margin100">
        <div class="btn btn-orange" @click="submitPay()">确认修改</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vheader from '../header/childHeader.vue';
  import btnTimer from '../timer/btnTimer.vue';
  import {config, headers, unHeaders} from '../../common/js/config';
  export default{
    data() {
      return {
        disabled: false,
        mobile: '',
        realName: '',
        code: '',
        alipay: '',
        time: 0
      };
    },
    computed: {
      text: function () {
        return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
      },
      bgColor: function () {
        return this.time > 0 ? '#a9a9a9' : '#67a2ab';
      }
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initUpPay();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initUpPay: function () {
        var legalizeInfo = JSON.parse(sessionStorage.getItem('legalizeInfo'));
        var user = JSON.parse(localStorage.getItem('user'));
        this.mobile = user.mobile;
        this.realName = legalizeInfo.realName;
        console.log(legalizeInfo);
      },
      getCode(second) {
        if (this.alipay !== '' && this.alipay.length === 11) {
          this.time = second;
          this.timer();
          var codeData = JSON.stringify({
            'data': [this.alipay, 'comm'],
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
          this.$dialog.toast({mes: '请输入正确的支付宝账号'});
        }
      },
      timer: function () {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        }
      },
      submitPay() {
        var token = localStorage.getItem('token');
        var code = JSON.stringify({
          'data': [this.alipay, this.code, 'comm'],
          'controllerName': 'smsMessage',
          'actionName': 'validate'
        });
        var payData = JSON.stringify({
          'actionName': 'insert',
          'controllerName': 'authAlipay',
          'data': [
            {
              'alipayUserId': this.alipay,
              'zmScore': '0'
            }
          ]
        });
        if (this.code === '' || this.code.length < 4) {
          this.$dialog.toast({mes: '验证码不能为空或者长度不小于四位'});
          return;
        }
        this.$http.post(config.request_url, code, unHeaders).then((res) => {
          console.log(res.body);
          if (res.body.data.result === true) {
            this.$http.post(config.request_url, payData, headers(token)).then((response) => {
              console.log(response.body);
              if (response.body.data.result === true) {
//                this.$dialog.toast({mes: '支付宝认证成功'});
                this.$router.push('/');
              } else {
                this.$dialog.toast({mes: res.body.data.remark});
              }
            });
          } else {
            this.$dialog.toast({mes: res.body.data.remark});
          }
        });
      }
    },
    components: {
      Vheader, btnTimer
    }
  };
</script>

<style>
  @import "../../common/stylus/iconfont.css";
  @import "../../common/stylus/header.css";
  @import "../../common/stylus/public.css";

  .input-box .Vcode {
    position: absolute;
    right: 10%;
    padding: 8px 5px;
    margin-top: 8.5px;
    background-color: #67a2ab;
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 5px;
  }
</style>
