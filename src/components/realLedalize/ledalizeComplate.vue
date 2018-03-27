<template>
<div>
  <div class="h-header">
    <div class="pull-left" @click="back"><span class="iconfont icon-left"></span></div>
    <div class="h-title">认证完成</div>
    <!--<div class="h-record">常见问题</div>-->
  </div>
  <div class="process-bar">
    <div class="process"></div>
    <div class="process-wrapper">
      <div class="process-text">
        <div class="circle"></div>
        <div class="process-info">实名认证</div>
      </div>
      <div class="process-text">
        <div class="circle"></div>
        <div class="process-info">个人信息</div>
      </div>
      <div class="process-text">
        <div class="circle active"></div>
        <div class="process-info">提交成功</div>
      </div>
    </div>
  </div>
  <div class="v-container" ref="scrWrapper">
    <div class="v-wrapper">
      <!--<div class="credit-title"><img src="../../common/img/sesame@2x.png" alt=""></div>-->
      <!--<div class="credit-content">-->
        <!--<p class="emphasize">实名认证成功后您将享受如下权益：</p>-->
        <!--<div class="emphasize_text">-->
          <!--<p>1、可以在咱的钱包借款</p>-->
          <!--<p>2、可以在咱的钱包借款</p>-->
          <!--<p>3、可以在咱的钱包借款</p>-->
        <!--</div>-->
      <!--</div>-->
      <div class="complate-img">
        <img src="../../common/img/complate.png" alt="">
        <p>认证信息提交成功，等待审核！</p>
      </div>
      <div class="btn-container">
        <router-link to="/user">
          <div class="btn btn-blue">确认完成</div>
        </router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default{
    created() {
      this.$nextTick(() => {
        this._initScroll();
      });
    },
    methods: {
      _initScroll: function () {
        this.scrScroll = new BScroll(this.$refs.scrWrapper, {
          click: true
        });
      },
      back: function () {
        this.$router.back(-1);
      }
    }
  };
</script>

<style>
  @import "../../common/stylus/header.css";
  @import "../../common/stylus/public.css";


  .complate-img{
    width: 80%;
    margin: 90px auto;
    text-align: center;
  }
  .complate-img img{
    width: 100px;
    height: 100px;
  }
  .complate-img p{
    font-size: 14px;
    line-height: 45px;
  }
  .credit-title {
    width: 100%;
    height: 40px;
    background-color: #FFFFFF;
    text-align: center;
  }

  .credit-title img {
    width: 124px;
    height: 35.5px;
  }

  .credit-content {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    margin-bottom: 93px;
  }

  .emphasize {
    padding: 20px 0;
    font-size: 14px;
  }
  .emphasize_text{
    font-size: 12px;
    color: #313131;
    line-height: 25px;
  }

</style>
