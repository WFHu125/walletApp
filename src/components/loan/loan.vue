<template>
  <div>
    <Sheader title="借款" record="借款记录"></Sheader>
    <div class="loan-container" ref="loanWrapper">
      <div class="loan-wrapper">
        <!--借款金额-->
        <div class="loan-total">
          <div class="loan-info">
            <p class="font-15">借款金额（元）
            <p class="font-26" id="current_money">{{money}}</p>
            <p class="font-13"><span id="total_money">总额度：{{totalAmount}}元</span><span
              class="loanAmount">(已借款：{{loanAmount}}元)</span>
            </p>
          </div>
          <div class="loan-progress">
            <div class="range" ref="range">
              <div class="range-progress"></div>
              <span class="range-bar" @touchmove="range"></span>
              <span class="range-text"></span>
            </div>
          </div>
        </div>
        <!--借款期限-->
        <div class="loan-deadline">
          <div class="deadline-title">借款期限</div>
          <div class="deadline-content">
            <button class="deadline-species" v-for="(item,$index) in items" :class="{'active':item.active,'unactive':!item.active}" @click="choose(item,$index)">{{item.day}}个月</button>
          </div>
        </div>
        <!--月供-->
        <div class="loan-monthly">
          <div class="monthly-section">月供</div>
          <div class="monthly-section">
            <p class="repayment-amount">{{currentMoney}}元</p>
            <!--<p class="service-fee">（含服务费￥{{service}}）</p>-->
          </div>
        </div>
        <!--绑定支付宝-->
        <div class="band-pay">
          <div class="band-left">
            <div class="pay-icon"><span class="iconfont icon-支付宝"></span></div>
            <div class="pay-text">
              <p>绑定支付宝账户</p>
              <p class="pay-style">支付宝账户需要本人实名认证</p>
            </div>
          </div>
          <div class="band-right" @click="bandPay">
            <span class="color-b">{{bandText}}</span>
            <span class="iconfont icon-right"></span>
          </div>
        </div>
        <!--提交申请-->
        <div class="loan-summit">
          <div class="big-btn" @click="loanSubmit">立即借款</div>
          <div class="loan-service">
            <input type="radio" class="radio" checked/><label class="radio">借款表示已同意
            <router-link to="/service" style="color: #2aa8f5">《咱的钱包服务协议》</router-link>
          </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Sheader from '../header/Sheader';
  import BScroll from 'better-scroll';
  import {config, headers} from '../../common/js/config';
  export default {
    data () {
      return {
        items: [],
        active: false,
        totalAmount: 300000, // 总金额
        loanAmount: 0, // 已借款
        money: 100, // 当前金额
        month: 1,
        rates: 0,
        bandText: '',
        legalizeInfo: [],
        state: 0
      };
    },
    created() {
//      var user = this.$route.query.user;
//      if (user) {
//        this._initLoan();
//      } else {
//        this._initLoan();
//      }
      this._initLoan();
    },
    computed: {
      currentMoney: function () {
        return (parseFloat(this.money) / parseFloat(this.month) + parseFloat(this.money) * this.rates).toFixed(2);
      },
      service: function () {
        return (parseFloat(this.money) * this.rates).toFixed(2);
      }
    },
    methods: {
      _initLoan: function () {
        var token = localStorage.getItem('token');
        var loanData = JSON.stringify({
          'actionName': 'findMyByIdInex',
          'controllerName': 'userLoanInfo',
          'data': []
        });
        var creditData = JSON.stringify({
          'actionName': 'findById',
          'controllerName': 'userAuth',
          'data': []
        });
        // 请求借款数据
        this.$http.post(config.base_url, loanData, headers(token)).then((response) => {
          var res = response.body;
          console.log(res);
          this.items = res.data.loanTime;
          Vue.set(this.items[0], 'active', true);
          this.rates = this.items[0].rate;
          console.log(this.items);
          if (res.data.userLoanInfo) {
            this.totalAmount = res.data.userLoanInfo.totalAmount;
            this.loanAmount = res.data.userLoanInfo.loanAmount;
            this.legalizeInfo = JSON.parse(localStorage.getItem('legalizeInfo'));
            console.log(this.legalizeInfo);
            // 判断绑定账号
            if (this.legalizeInfo) {
              if (this.legalizeInfo.alipay === true) {
                this.bandText = '修改账号';
              }
//              console.log('333333');
            }
          } else {
            this.bandText = '绑定账号';
          }
          this.$nextTick(() => {
            this._initScroll();
          });
          console.log('借款' + JSON.stringify(res));
        });
        // 获取基本认证信息
        console.log('111111');
        this.$http.post(config.request_url, creditData, headers(token)).then((res) => {
          console.log(res.body);
          sessionStorage.setItem('legalizeInfo', JSON.stringify(res.body.data));
          this.legalizeInfo = res.body.data;
          this.state = res.body.data.status;
          sessionStorage.setItem('state', res.body.data.status);
          if (res.body.data.alipay === true) {
            this.bandText = '修改账号';
          } else {
            this.bandText = '绑定账号';
          }
        });
      },
      choose (item, index) {
        this.$nextTick(function () {
          this.items.forEach(function (item) {
            Vue.set(item, 'active', false);
          });
          Vue.set(item, 'active', true);
          this.month = item.day;
          this.rates = item.rate;
        });
      },
      // 绑定支付宝
      bandPay: function () {
        var token = localStorage.getItem('token');
        var _this = this;
        if (token) {
          this.$root.tokenValidat(token, function (data) {
            if (data) {
//              var state = parseInt(sessionStorage.getItem('state'));
              if (_this.state === 0) {
                _this.$dialog.confirm({
                  title: '咱的钱包提示您：',
                  mes: '您还没有认证！',
                  opts: [
                    {
                      txt: '取消',
                      color: false
                    },
                    {
                      txt: '去认证',
                      color: true,
                      callback: () => {
                        _this.$router.push('/realLedalize');
                      }
                    }
                  ]
                });
              } else if (_this.state === 2) {
                _this.$router.push('/updatePay');
              } else if (_this.state === 1) {
                _this.$dialog.toast({mes: '实名认证审核中,请耐心等待。。。。'});
              } else if (_this.state === 3) {
                _this.$dialog.toast({mes: '审核失败'});
              }
            } else {
              _this.$router.push('/login');
            }
          });
        } else {
          this.$router.push('/login');
        }
      },
      loanSubmit: function () {
        var token = localStorage.getItem('token');
        var _this = this;
        if (token) {
          this.$root.tokenValidat(token, function (data) {
            if (data) {
              var loanData = JSON.stringify({
                'actionName': 'insert',
                'controllerName': 'userLoanRecord',
                'data': [{
                  'day': _this.month,
                  'loanAmount': _this.money
                }]
              });
              console.log(_this.legalizeInfo);
              if (_this.state === 0) {
                _this.$dialog.toast({mes: '您还没有认证'});
              } else if (_this.state === 1) {
                _this.$dialog.toast({mes: '正在审核中。。。'});
              } else if (_this.state === 2) {
                if (_this.legalizeInfo.alipay === true) {
                  _this.$dialog.confirm({
                    title: '咱的钱包',
                    mes: '您是否要借款？',
                    opts: () => {
                      _this.$http.post(config.base_url, loanData, headers(token)).then((res) => {
                        console.log(JSON.stringify(res.body));
                        _this.$dialog.alert({mes: res.body.data.remark});
                        localStorage.setItem('loanInfo', JSON.stringify(res.body.data.data));
                      });
                    }
                  });
                } else {
                  _this.$dialog.toast({mes: '您还没有绑定支付宝'});
                }
              }
            } else {
              _this.$router.push('/login');
            }
          });
        } else {
          this.$router.push('/login');
        }
      },
      _initScroll() {
        this.loanScroll = new BScroll(this.$refs.loanWrapper, {click: true});
      },
      range: function () {
        var _this = this;
        /* 阻止页面的默认滑动 */
        window.addEventListener('touchmove', function (e) {
          e.preventDefault();
        });
        var range = $('.range');
        var bar = $('.range-bar');
        var progress = $('.range-progress');
        var maxw = range.offsetWidth - bar.offsetWidth;// 计算可滑动的最大距离
        var rangex = range.offsetLeft;
        var half = bar.offsetWidth / 2;
        bar.addEventListener('touchstart', function (event) {
          var left = event.touches[0].pageX - rangex - half;
          render(left);
          event.preventDefault();
        });
        range.addEventListener('touchmove', function (event) {
          /* 计算滑块的left距离 */
          var left = event.touches[0].pageX - rangex - half;
          render(left);
        });
        range.addEventListener('touchstart', function (event) {
          var left = event.touches[0].pageX - rangex - half;
          render(left);
        });

        // 显示位置
        function render(value) {
          var left = value;
          /* 判断left距离不能小于0并且不能大于最大宽度 */
          if (left <= 0) {
            left = 0;
            progress.style.width = left + 'px';
            _this.money = 100;
          }
          if (left >= maxw) {
            left = maxw;
          }
          if (left > 0) {
            progress.style.width = left + 15 + 'px';
            var d = left / maxw;
            var s = 100 / _this.totalAmount;
            _this.money = Math.ceil(100 * Math.ceil(d / s));
            if (d === 1) {
              _this.money = _this.totalAmount;
            }
//            if (d < 0.1 && d > 0) {
//              d = 0.1;
//            } else if (d > 0.1 && d < 0.2) {
//              d = 0.2;
//            } else if (d > 0.2 && d < 0.3) {
//              d = 0.3;
//            } else if (d > 0.3 && d < 0.4) {
//              d = 0.4;
//            } else if (d > 0.4 && d < 0.5) {
//              d = 0.5;
//            } else if (d > 0.5 && d < 0.6) {
//              d = 0.6;
//            } else if (d > 0.6 && d < 0.7) {
//              d = 0.7;
//            } else if (d > 0.7 && d < 0.8) {
//              d = 0.8;
//            } else if (d > 0.8 && d < 0.9) {
//              d = 0.9;
//            } else if (d > 0.9 && d < 1) {
//              d = 1;
//            }
//            _this.money = Math.ceil(d * _this.totalAmount);
//            _this.money = Math.ceil(maxw * _this.totalAmount / Math.ceil(left));
//            console.log(maxw * _this.totalAmount / left);
          }
          /* 显示滑块的位置、进度条的长度、进度值 */
          bar.style.left = left + 'px';
        }

        function $(s) {
          return document.querySelector(s);
        }
      }
    },
    components: {
      Sheader
    }
  };

</script>
<style type="text/css">
  .loan-container {
    width: 100%;
    height: calc(100% - 93px);
    position: absolute;
    top: 44px;
    overflow: hidden;
  }

  .loan-wrapper {
    width: 100%;
    margin-bottom: 49px;
  }

  /*借款金额*/
  .loan-total {
    width: 100%;
    height: 181px;
    background-color: #029cf5;
  }

  .loan-total .loan-info {
    width: 100%;
    text-align: center;
    color: #fff;
    line-height: 40px;
  }

  .loan-total .loan-info p {
    margin: 0;
    padding: 0;
  }

  .font-15 {
    font-size: 15px;
  }

  .font-26 {
    font-size: 26px;
  }

  .font-13 {
    font-size: 13px;
  }

  .loanAmount {
    padding-left: 10px;
  }

  .loan-total .loan-progress {
    width: 90%;
    height: 40px;
    margin: auto;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }

  .range {
    width: 95%;
    height: 40px;
    position: relative;
    margin: auto;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .range:before, .range-bar, .range-text, .range-progress {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
  }

  .range:before {
    content: '';
    display: block;
    width: 100%;
    background-color: #e3e3e3;
    border-radius: 20px;
  }

  .range:before, .range-progress {
    height: 20px;
    left: 0;
  }

  .range-bar {
    position: absolute;
    width: 30px;
    height: 20px;
    border-radius: 20px;
    background: url("../../common/img/huakuai.png") no-repeat;
    background-size: 30px 20px;
    z-index: 100;
  }

  .range-progress {
    background-color: #93ddff;
    border-radius: 20px;
  }

  .range-text {
    top: 100%;
    left: 90%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    color: #999;
  }

  /*借款期限*/
  .loan-deadline {
    width: 100%;
    /*height: 88px;*/
    background-color: #ffffff;
  }

  .loan-deadline .deadline-title {
    padding: 9px 15px;
    font-size: 14px;
    color: #151515;
    text-align: left;
    box-sizing: border-box;
  }

  .loan-deadline .deadline-content {
    width: 100%;
    height: auto;
    padding: 9px 37px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
  }

  .loan-deadline .deadline-species {
    width: calc((100% - 74px) / 3);
    text-align: center;
    height: 31px;
    line-height: 31px;
    border: none;
    border-radius: 8px;
    outline: none;
    margin-bottom: 12px;
  }

  .loan-deadline .deadline-species:not(:nth-child(3n)) {
    margin-right: 37px;
  }

  .loan-deadline .active {
    background-color: #029cf5;
    color: #ffffff !important;
  }

  .loan-deadline .unactive {
    background-color: #f5f5f5;
    color: #313131;
  }

  /*月供*/
  .loan-monthly {
    width: 100%;
    height: 59px;
    margin-top: 12px;
    margin-bottom: 5px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    font-size: 14px;
    background-color: #ffffff;
  }

  .loan-monthly .monthly-section {
    flex: 1;
  }

  .loan-monthly .monthly-section:first-child {
    line-height: 59px;
  }

  .loan-monthly .monthly-section:last-child {
    text-align: right;
    line-height: 59px;
  }

  /*.loan-monthly .repayment-amount {*/
    /*padding: 10px 20% 10px 0;*/
    /*font-size: 14px;*/
    /*box-sizing: border-box;*/
  /*}*/

  /*.loan-monthly .service-fee {*/
    /*font-size: 13px;*/
  /*}*/

  /*绑定支付宝*/
  .band-pay {
    width: 100%;
    height: 59px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    font-size: 14px;
    background-color: #ffffff;
  }

  .band-pay .band-left {
    flex: 2;
    text-align: left;
    display: flex;
  }

  .band-left .pay-icon {
    flex: 2;
    font-size: 30px;
    padding: 14.5px 0;
    box-sizing: border-box;
  }

  .band-left .pay-text {
    flex: 8;
  }

  .band-left .pay-text .pay-style {
    font-size: 12px;
    color: #6e6e6e;
  }

  .band-left .pay-text p:first-child {
    padding-top: 13px;
    padding-bottom: 8px;
    box-sizing: border-box;
  }

  .band-pay .band-right {
    flex: 1;
    text-align: right;
    line-height: 59px;
  }

  .band-right .color-b {
    color: #039cf5;
  }

  .band-pay .band-right span:last-child {
    float: right;
    margin-top: 19.5px;
    margin-left: 10px;
    box-sizing: border-box;
  }

  /*提交申请*/
  .loan-summit {
    width: 100%;
    padding-top: 42.5px;
    text-align: center;
    padding-bottom: 35px;
  }

  .loan-summit .big-btn {
    width: 80%;
    border-radius: 8px;
    text-align: center;
    background-color: #029cf5;
    color: #ffffff;
    font-size: 17px;
    padding: 10px 0;
    margin: auto;
  }

  .loan-summit .loan-service {
    padding-top: 8px;
  }

  .loan-summit .loan-service input[type=radio].radio {
    opacity: 0;
    display: inline-block;
  }

  .loan-summit .loan-service label.radio {
    background: url(../../common/img/unchecked.png) no-repeat;
    background-size: 14px 14px;
    background-position: left top;
    padding-left: 25px;
    font-size: 13px;
  }

  .loan-summit .loan-service input[type=radio].radio:checked + .radio {
    background: url(../../common/img/checked.png) no-repeat;
    background-size: 14px 14px;
    background-position: left top;
  }


</style>

