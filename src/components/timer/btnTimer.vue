<template>
  <button @click="getCode" :disabled="disabled || time > 0" class="btn-vcode" :style="{backgroundColor:bgColor}">{{ text
    }}
  </button>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      second: {
        type: Number,
        default: 60
      },
      disabled: {
        type: Boolean,
        default: false
      },
      tel: {
        type: String
      }
    },
    data: function () {
      return {
        time: 0
      };
    },
    methods: {
      getCode: function () {
        if (this.tel !== '' && this.tel.length === 11) {
          this.time = this.second;
          this.timer();
          var codeData = JSON.stringify({
            'data': [this.tel, 'retrieve'],
            'controllerName': 'smsMessage',
            'actionName': 'sendSmsMessage'
          });
          console.log('llllllllll');
          console.log(this.tel);
          this.$http.post('http://139.224.132.124/fuxi-api/key-service', codeData, {
            'headers': {
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            console.log(res.body);
            if (res.body.data.result === true) {
              this.$dialog.toast({mes: res.body.data.remark});
              console.log('qqqqqqqqqqq');
              console.log(res.body);
            } else {
              this.$dialog.toast({mes: res.body.data.data});
            }
          });
        } else {
          this.$dialog.toast({mes: '请输入正确的手机号码'});
        }
//        console.log('sss' + this.time);
      },
      timer: function () {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        }
      }
    },
    computed: {
      text: function () {
        return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
      },
      bgColor: function () {
        return this.time > 0 ? '#a9a9a9' : '#2fa0ec';
      }
    }
  };
</script>

<style>
  .btn-vcode {
    border: none;
    outline: none;
    display: block;
    position: absolute;
    right: 5px;
    padding: 0 10px;
    color: #ffffff;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-top: 3px;
    margin-right: 5px;
    z-index: 5;
  }
</style>
