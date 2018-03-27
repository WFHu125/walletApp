<template>
  <div>
    <childHeader title="关于我们"></childHeader>
    <div class="about-content" ref="about">
      <div class="about-wrapper">
        <div class="about-logo">
          <img src="../../common/img/logo.png" alt="">
        </div>
        <div>咱的钱包是针对浙江福熙电子商务有限公司旗下APP咱的商城推出的服务工具，是为了对咱的商城做出合作与特殊贡献的用户进行一定的支持与回馈而做出的扶持计划，是为了更好的服务于用户，符合条件均可享受并参与其中，此服务不涉及任何金融借贷问题，活动扶持计划最终解释权归浙江福熙电子商务有限公司所有。</div>
        <p>如有疑问:请拨打客服电话400-0088761或关注公众号咱的商城,回复咱的钱包</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import childHeader from '../header/childHeader';
  import BScroll from 'better-scroll';
  export default {
    created() {
      this.scroll = new BScroll(this.$refs.about);
    },
    components: {
      childHeader
    }
  };
</script>

<style>

  .about-content {
    width: 100%;
    height: calc(100% - 44px);
    position: absolute;
    top: 44px;
    overflow: hidden;
  }

  .about-wrapper {
    width: 100%;
    padding: 0 15px;
    margin-top: 8px;
    line-height: 25px;
    background-color: #FFFFFF;
    box-sizing: border-box;
    font-size: 14px;
    text-indent:20px;
  }
  .about-logo{
    width: 100%;
    padding: 50px 0;
    text-align: center;
    box-sizing: border-box;
  }
  .about-logo img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

</style>
