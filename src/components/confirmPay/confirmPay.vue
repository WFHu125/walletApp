<template>
  <div>
    <div class="h-header">
      <div class="pull-left" @click="back"><span class="iconfont icon-left"></span></div>
      <div class="h-title">确认付款</div>
    </div>
    <div class="pay-container">
      <div class="pay-list">待付款金额(含服务费)：￥{{totalPrice}}元</div>
      <div class="pay-list">服务费：￥{{service}}元</div>
      <div class="btn-container margin35">
        <div class="btn btn-blue" @click="submitPay">立即付款</div>
      </div>
      <div id="pay"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        loanId: '',
        currentId: [],
        totalPrice: '',
        service: ''
      };
    },
    created() {
      this.loanId = this.$route.query.loan_id;
      this.currentId = JSON.parse(this.$route.query.list);
      this.totalPrice = this.$route.query.totalPrice;
      this.service = this.$route.query.service;
      console.log(this.loanId);
      console.log(this.currentId);
      console.log(this.totalPrice);
    },
    methods: {
      submitPay: function () {
        var token = localStorage.getItem('token');
        var payData = JSON.stringify({
          'controllerName': 'alipay',
          'actionName': 'userRepaymentRequest',
          'data': [{
            'loan_id': this.loanId,
            'list': this.currentId,
            'pay_type': 'wap'
          }]
        });
        console.log(this.totalPrice);
        if (this.totalPrice === '0.00') {
          this.$dialog.toast({mes: '您必须选择一条还款~'});
        } else {
          // 获取支付订单
          this.$http.post('http://139.224.132.124/fuxi-api/jd-service', payData, {
            'headers': {
              'ContentType': 'application/json',
              'token': token
            }
          }).then((response) => {
            // 从服务器获取支付信息
            var statement = response.body.data.order;
            document.getElementById('pay').innerHTML = statement;
            document.querySelector('form').submit();
            console.log(statement);
          });
        }
      },
      back: function () {
        this.$router.push('/repayment');
      }
    }
  };
</script>

<style>
  @import "../../common/stylus/header.css";
  @import "../../common/stylus/public.css";
  .pay-container{
    width: 100%;
    position: absolute;
    top: 44px;
    padding-top: 100px;
  }
  .pay-list {
    width: 80%;
    height: 40px;
    line-height: 40px;
    margin: 0 auto 10px;
  }
</style>
