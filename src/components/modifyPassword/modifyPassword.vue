<template>
  <div>
    <Vheader title="修改密码"></Vheader>
    <div class="h-content especially">
      <div class="input-box">
        <label class="input-label flex2">当前密码:</label>
        <input type="password" class="input flex8" v-model="password" @blur="checkPass(password)"
               placeholder="请输入当前密码">
      </div>
      <div class="input-box">
        <label class="input-label flex2">新密码:</label>
        <input type="password" class="input flex8" v-model="newPassword" @blur="checkPass(newPassword)"
               placeholder="请输入6-16位新密码">
      </div>
      <div class="input-box">
        <label class="input-label flex2">确认密码:</label>
        <input type="password" class="input flex8" v-model="confirmPassword"
               @blur="checkConPass(newPassword,confirmPassword)" placeholder="请再次输入新密码">
      </div>
      <div class="btn-container margin100">
        <div class="btn btn-orange" @click="updatePass()">确认修改</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vheader from '../header/childHeader.vue';
  import {config, headers} from '../../common/js/config';
  export default{
    data () {
      return {
        password: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    methods: {
      updatePass() {
        var token = localStorage.getItem('token');
        var dataPass = JSON.stringify({
          'data': [{
            'password': this.password,
            'newPassword': this.newPassword
          }],
          'controllerName': 'userInfo',
          'actionName': 'updatePassword'
        });
        console.log(this.checkPass(this.password));
        console.log(this.checkPass(this.newPassword));
        console.log(this.checkConPass(this.newPassword, this.confirmPassword));
        if (this.checkPass(this.password) && this.checkPass(this.newPassword) && this.checkConPass(this.newPassword, this.confirmPassword)) {
          this.$http.post(config.request_url, dataPass, headers(token)).then(function (response) {
            if (response.body.data.result === true) {
              this.$dialog.toast({mes: response.body.data.remark});
              this.$router.push('/user');
            } else {
              this.$dialog.toast({mes: response.body.data.remark});
            }
            console.log(response.body);
          }).catch(function () {
            this.$dialog.toast({mes: '服务器异常'});
          });
        } else {
          this.$dialog.toast({mes: '服务器异常'});
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
        if (pass1 !== pass2) {
          this.$dialog.toast({mes: '密码和之前密码不一致'});
          return false;
        } else {
          return true;
        }
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
</style>
