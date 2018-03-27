<template>
  <div>
    <Vheader title="修改绑定手机"></Vheader>
    <div class="h-content especially">
      <div class="input-box">
        <label class="input-label flex2">手机号</label>
        <input type="number" class="input flex8" placeholder="请输入手机号码" v-model="mobile">
        <btnTimer @getCode="send" :disabled="disabled" ref="btn" :second="60" :tel="mobile"></btnTimer>
      </div>
      <div class="input-box">
        <label class="input-label flex2">验证码</label>
        <input type="number" class="input flex8" placeholder="请输入手机验证码" v-model="code">
      </div>
      <div class="btn-container margin100">
        <div class="btn btn-orange" @click="updateMobile">确认修改</div>
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
        code: ''
      };
    },
    methods: {
      updateMobile() {
        var token = localStorage.getItem('token');
        var code = JSON.stringify({
          'data': [this.mobile, this.code, 'register'],
          'controllerName': 'smsMessage',
          'actionName': 'validate'
        });
        var mobile = JSON.stringify({
          'data': [{
            'mobile': this.mobile
          }],
          'controllerName': 'userInfo',
          'actionName': 'update'
        });
        if (this.code === '' || this.code.length < 4) {
          this.$dialog.toast({mes: '验证码不能为空或者长度不小于四位'});
          return;
        }
        this.$http.post(config.request_url, code, unHeaders).then((res) => {
          if (res.body.data.result === true) {
            this.$http.post(config.request_url, mobile, headers(token)).then((response) => {
              if (response.body.data.result === true) {
                this.$dialog.toast({mes: '修改成功'});
                this.$router.push('/user');
                console.log(response.body);
              }
            });
          }
        });
      },
      send: function () {
        this.disabled = true;
        setTimeout(this.sended, 2000);
      },
      sended() {
        this.$refs.btn.getCode();
        this.disabled = false;
      }
    },
    components: {
      Vheader, btnTimer
    }
  };
</script>

<style>
  @import "../../common/stylus/iconfont.css";
  @import "../../common/stylus/public.css";
</style>
