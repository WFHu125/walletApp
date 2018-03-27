<template>
  <div class="h-header">
    <div class="pull-left" @click="back"><span class="iconfont icon-left"></span></div>
    <div class="h-title">{{title}}</div>
  </div>
</template>

<script>
  export default{
    props: {
      title: {
        type: String
      }
    },
    data () {
      return {
      };
    },
    methods: {
      back: function () {
        this.$router.back(-1);
      }
    }
  };
</script>

<style>
  .h-header{
    width: 100%;
    height: 44px;
    position: fixed;
    top:0;
    background-color: #FFFFFF;
    z-index: 100;
  }
  .h-header .h-title{
    text-align: center;
    line-height: 44px;
    font-size: 17px;
    color: #313131;
  }
  .h-header .pull-left{
    position: absolute;
    left: 15px;
    top:11.5px;
  }
  .h-header .h-record {
    position: absolute;
    right: 15px;
    top: 0;
    color: #50aff7;
    font-size: 13px;
    line-height: 44px;
  }
  .h-content {
    width: 100%;
    position: absolute;
    top: 44px;
    padding: 0;
  }
  .h-content.especially{
    margin-top: 7px;
  }

</style>

