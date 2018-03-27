<template>
  <div class="h-header">
    <!--<div class="close" @click="close" v-show="show">关闭</div>-->
    <div class="h-title">{{title}}</div>
    <div class="h-record" @click="linkSelect">{{record}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String
      },
      record: {
        type: String
      }
    },
    data () {
      return {
//        show: false
      };
    },
//    created() {
//      if (this.title === '借款') {
//        this.show = true;
//      }
//    },
    methods: {
      linkSelect: function () {
        if (this.title === '借款') {
          this.$router.push('/loanRecord');
        }
        if (this.title === '还款') {
          this.$router.push('/repaymentRecord');
        }
      },
      close: function () {
//        window.opener = null;
        window.close();
      }
    }
  };
</script>

<style>
  .h-header {
    width: 100%;
    height: 44px;
    position: fixed;
    top: 0;
    background-color: #ffffff;
    z-index: 1000;
  }

  .close {
    position: absolute;
    left: 15px;
    top: 0;
    color: #50aff7;
    font-size: 13px;
    line-height: 44px;
  }

  .h-title {
    text-align: center;
    line-height: 44px;
    font-size: 17px !important;
    color: #313131;
  }

  .h-record {
    position: absolute;
    right: 15px;
    top: 0;
    color: #50aff7;
    font-size: 13px;
    line-height: 44px;
  }
</style>
