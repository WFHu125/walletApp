<template>
  <div>
    <childHeader title="借款详情"></childHeader>
    <div class="loanDetail" ref="loanDetail">
      <div class="loandetail-wrapper">
        <div class="loanDetail-list">
          借款单号：{{loanDetail.flowingNo}}
        </div>
        <div class="loanDetail-list">
          借款期限：{{loanDetail.day}}个月
        </div>
        <div class="loanDetail-list">
          借款金额：{{loanDetail.loanAmount}}元
        </div>
        <div class="loanDetail-list">
          审批金额：{{loanDetail.validateAmount}}元
        </div>
        <div class="loanDetail-list">
          服务费：{{loanDetail.serviceAmount}}元
        </div>
        <div class="loanDetail-list">
          借款状态：{{loanDetail.stateText}}
        </div>
        <div class="loanDetail-list">
          借款时间：{{loanDetail.createTime}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import childHeader from '../header/childHeader.vue';
  import BScroll from 'better-scroll';
  export default{
    data() {
      return {
        loanDetail: {}
      };
    },
    created() {
      this.loanDetail = JSON.parse(this.$route.query.loanDetail);
      if (this.loanDetail.status === 1) {
        this.loanDetail.stateText = '借款申请提交待审核';
      } else if (this.loanDetail.status === 2) {
        this.loanDetail.stateText = '审核成功';
      } else if (this.loanDetail.status === 3) {
        this.loanDetail.stateText = '审核失败';
      } else if (this.loanDetail.status === 4) {
        this.loanDetail.stateText = '打款成功';
      } else if (this.loanDetail.status === 5) {
        this.loanDetail.stateText = '打款失败';
      } else if (this.loanDetail.status === 6) {
        this.loanDetail.stateText = '还款中';
      } else if (this.loanDetail.status === 7) {
        this.loanDetail.stateText = '还款完成';
      } else if (this.loanDetail.status === 66) {
        this.loanDetail.stateText = '代理人审核通过';
      } else if (this.loanDetail.status === 44) {
        this.loanDetail.stateText = '代理人审核不通过';
      }
      this.$nextTick(() => {
        this._initScroll();
      });
    },
    methods: {
      _initScroll: function () {
        this.loanDetailScoll = new BScroll(this.$refs.loanDetail, {
          click: true
        });
      }
    },
    components: {
      childHeader
    }
  };
</script>

<style type="text/css">


  .loanDetail {
    width: 100%;
    height: calc(100vh - 44px);
    position: absolute;
    top: 44px;
    /*bottom: 49px;*/
    overflow: hidden;
  }

  .loandetail-wrapper {
    width: 100%;
    padding: 7px 0;
    height: auto;
    margin-top: 7px;
    background-color: #ffffff;
  }

  .loandetail-wrapper .loanDetail-list {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    font-size: 14px;
    box-sizing: border-box;
  }
</style>
