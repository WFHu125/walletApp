<template>
  <div>
    <childheader title="意见反馈"></childheader>
    <div class="h-content especially">
      <form action="" class="form-feedback">
        <textarea v-model="content" cols="30" rows="10" placeholder="您的反馈是我们前行的动力，欢迎提出建议和意见，我们将尽快跟进提升用户体验。"></textarea>
      </form>
      <div class="btn-container margin100">
        <div class="btn btn-orange" @click="feedback">确认提交</div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import childheader from '../header/childHeader.vue';
  import {config, headers} from '../../common/js/config';
  export default {
    data() {
      return {
        content: ''
      };
    },
    methods: {
      feedback: function () {
        var token = localStorage.getItem('token');
        var feedData = JSON.stringify({
          'actionName': 'insert',
          'controllerName': 'userFeedBack',
          'data': [{
            'content': this.content
          }]
        });
        this.$http.post(config.base_url, feedData, headers(token)).then((res) => {
            console.log(res.body);
          if (res.body.data.result === true) {
            this.$dialog.toast({mes: '提交成功'});
            this.$router.push('/setting');
          } else {
            this.$dialog.toast({mes: res.body.data.remark});
          }
        });
      }
    },
    components: {
      childheader
    }
  };
</script>

<style>
  @import '../../common/stylus/header.css';
  @import "../../common/stylus/public.css";

  .form-feedback {
    width: 100%;
    height: 200px;
  }

  .form-feedback textarea {
    width: 100%;
    outline: none;
    border: none;
    padding: 5px;
    box-sizing: border-box;
    font-size: 14px;
    color: #313131;
  }

</style>
