<template>
  <div>
    <Vheader title="修改昵称"></Vheader>
    <div class="h-content especially">
      <div class="input-box">
        <label class="input-label flex2">昵称</label>
        <input type="text" class="input flex8" placeholder="请输入您要修改的昵称" v-model="nick">
      </div>
      <div class="btn-container margin100">
        <div class="btn btn-orange" @click="updateNick">确认修改</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vheader from '../header/childHeader.vue';
  import {config, headers} from '../../common/js/config';
  export default{
    data() {
      return {
        nick: ''
      };
    },
    methods: {
      updateNick() {
        var token = localStorage.getItem('token');
        var nick = JSON.stringify({
          'data': [{
            'nick': this.nick
          }],
          'controllerName': 'userInfo',
          'actionName': 'update'
        });
        this.$http.post(config.request_url, nick, headers(token)).then((response) => {
          if (response.body.data.result === true) {
            this.$dialog.toast({mes: '修改成功'});
            var s = localStorage.getItem('user');
            s = JSON.parse(s);
            s.nick = this.nick;
            localStorage.setItem('user', JSON.stringify(s));
            this.$router.push('/user');
            console.log(response.body);
          }
        }).catch(() => {
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
</style>
