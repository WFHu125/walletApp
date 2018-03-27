<template>
  <div>
    <sHeader title="还款" record="还款记录"></sHeader>
    <div class="repay-container list-wrapper-hook" ref="repayWrapper">
      <div class="repay-list" v-if="this.repayList.length === 0">
        <div class="nodata">您还没有可还款项哦~</div>
      </div>
      <div class="repay-list" v-else>
        <table class="list-content-hook">
          <tr v-for="item in repayList">
            <td class="checkbox">
              <div class="h-checkbox">
                <input type="checkbox" :id="item.repaymentId" v-model="checkboxModel" :value="{
              repaymentId: item.repaymentId,
              repayIndex: item.repayIndex
            }"
                       class="check-one check"/>
                <label :for="item.repaymentId"></label>
              </div>
            </td>
            <td class="price">
              <p class="periods">第{{item.numbercCount}}期 / 借款编号：{{item.loanId}}</p>
              <p class="q-price">￥{{item.amount}}</p>
            </td>
            <td class="date">
              <p class="state">{{item.repayState}}</p>
              <p class="dead-date">{{item.repaymentTime}}</p>
            </td>
          </tr>
        </table>
        <div class="loading-hook"></div>
      </div>
    </div>
    <div class="repay-settle" v-if="this.repayList.length > 0">
      <div class="all-checkbox">
        <input type="checkbox" v-model="checked" id="check-all" class="check-all check" @click="checkedAll"/>
        <label for="check-all"></label><span class="all-check-text">全选</span>
      </div>
      <div class="pay-price">
        <div class="pay-money-text">总金额(含服务费)</div>
        <div class="pay-money">￥{{totalPrice}}元</div>
      </div>
      <div class="repay-box">
        <button id="paying" @click="submitPay">确认付款</button>
        <!--<button id="paying">立即付款</button>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import sHeader from '../header/Sheader';
  import BScroll from 'better-scroll';
  import {config, headers} from '../../common/js/config';
  export default {
    data () {
      return {
        repayList: [], // 所有数据
        listData: [], // 分页数据
        checkboxModel: [],
        checked: '',
        showSelect: false,
        currentId: [],
        loanId: '',
        day: [],
        page: 1
      };
    },
    created() {
//      this.initPage();
      var token = localStorage.getItem('token');
      if (token) {
        this.initPage();
      } else {
        this.$router.push('/login');
      }
    },
    computed: {
      totalPrice: function () {
        var total = 0;
        var arr = [];
        if (this.checkboxModel.length !== 0) {
          for (let i = 0; i < this.checkboxModel.length; i++) {
            let id = {'repaymentId': this.checkboxModel[i].repaymentId};
            let index = this.checkboxModel[i].repayIndex;
            let price = this.repayList[index].amount + this.repayList[index].serviceAmount;
            total += parseFloat(price);
            arr.push(id);
            this.currentId = arr;
          }
          console.log('选中的还款记录' + JSON.stringify(this.currentId));
        }
        return total.toFixed(2);
      },
      service: function () {
        var service = 0;
        if (this.checkboxModel.length !== 0) {
          for (let i = 0; i < this.checkboxModel.length; i++) {
            let index = this.checkboxModel[i].repayIndex;
            let serviceAmount = this.repayList[index].serviceAmount;
            service += parseFloat(serviceAmount);
          }
        }
        return service.toFixed(2);
      }
    },
    methods: {
      initPage: function () {
        var token = localStorage.getItem('token');
        var _this = this;
        this.$root.tokenValidat(token, function (data) {
          if (data) {
            _this.loadList();
          } else {
            _this.$router.push('/login');
          }
        });
      },
      loadList: function () {
        var token = localStorage.getItem('token');
        var repayData = JSON.stringify({
          'actionName': 'queryListPage',
          'controllerName': 'userRepaymentRrecord',
          'data': [{}, this.page]
        });
        this.$http.post(config.base_url, repayData, headers(token)).then((res) => {
          this.listData = res.body.data;
          console.log('每页数据' + JSON.stringify(res.body.data));
          var repayState = '';
          for (var i = 0; i < this.listData.length; i++) {
            this.repayList.push(this.listData[i]);
          }
          for (var j = 0; j < this.repayList.length; j++) {
            if (this.repayList[j].status === 1) {
              repayState = '待还款';
            }
            if (this.repayList[j].status === 3) {
              repayState = '已过期';
            }
            console.log(this.repayList[j].status);
            this.repayList[j].repayState = repayState;
            this.loanId = this.repayList[j].loanId;
            this.repayList[j].repayIndex = j;
            console.log(this.repayList[j].repayIndex);
            console.log('还款' + JSON.stringify(this.repayList));
          }
          console.log('每次还款' + JSON.stringify(this.repayList));
          this.$nextTick(() => {
            this._initScroll();
          });
        });
      },
      checkedAll: function () {
        var _this = this;
        console.log('ssssssssss' + _this.checkboxModel);
        console.log(this.checked);
        if (!this.checked) {
          _this.checkboxModel = [];
        } else {
          _this.checkboxModel = [];
          _this.repayList.forEach(function (item) {
            _this.checkboxModel.push({
              repaymentId: item.repaymentId,
              repayIndex: item.repayIndex
            });
            console.log('aaaaaaa');
          });
        }
      },
      selectPay: function () {
        this.showSelect = false;
      },
      submitPay: function () {
        if (this.totalPrice === '0.00') {
          this.$dialog.toast({mes: '您必须选择一条还款~'});
        } else {
          this.$router.push({
            path: '/confirmPay',
            query: {
              loan_id: this.loanId,
              list: JSON.stringify(this.currentId),
              totalPrice: this.totalPrice,
              service: this.service
            }
          });
        }
      },
      _initScroll: function () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.repayWrapper, {
            click: true,
            probeType: 1
          });
          // 是否派发滚动到底部事件，用于上拉加载
          this.scroll.on('scrollEnd', () => {
            // 滚动到底部
            var _this = this;
            var bottomTip = document.querySelector('.loading-hook');
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd');
              bottomTip.innerText = '加载中...';
              setTimeout(function () {
                // 向列表添加数据
                _this.page++;
                console.log('页数' + _this.page);
                if (_this.listData.length === 0) {
                  bottomTip.innerText = '无数据';
                } else {
                  _this.loadList();
                  console.log('还款' + JSON.stringify(_this.repayList));
                  bottomTip.innerText = '加载更多';
                }
                // 加载更多后,重新计算滚动区域高度
                _this.scroll.refresh();
              }, 1000);
            }
          });
          // 滑动结束
//          this.scroll.on('touchend', (position) => {
//            var _this = this;
//            var bottomTip = document.querySelector('.loading-hook');
//            // 上拉加载更多
//            if (position.y < 0) {
//              bottomTip.innerText = '加载中...';
//              setTimeout(function () {
//                // 向列表添加数据
//                _this.page++;
//                if (_this.listData.length === 0) {
//                  bottomTip.innerText = '无数据';
//                } else {
//                  _this.loadList();
//                  bottomTip.innerText = '加载更多';
//                }
//                // 加载更多后,重新计算滚动区域高度
//                _this.scroll.refresh();
//              }, 1000);
//            }
//          });
        } else {
          this.scroll.refresh();
        }
      }
    },
    watch: {
      'checkboxModel': {
        handler: function () {
          if (this.checkboxModel.length === this.repayList.length) {
            this.checked = true;
            console.log('Wtrue');
          } else {
            this.checked = false;
            console.log('Wfalse');
          }
        },
        deep: true
      }
    },
    components: {
      sHeader
    }
  };
</script>

<style type="text/css">
  @font-face {
    font-family: 'iconfont';
    src: url('../../common/fonts/iconfont.ttf');
  }

  .repay-container {
    width: 100%;
    height: calc(100% - 132px);
    position: absolute;
    top: 44px;
    bottom: 88px;
    overflow: hidden;
  }

  .repay-list {
    width: 100%;
    background-color: #f5f5f5;
    padding: 5px 0;
  }

  .nodata {
    width: 100%;
    text-align: center;
    padding-top: 100px;
    font-size: 13px;
  }

  .loading-hook {
    width: 100%;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    color: #6c6c6c;
  }

  .repay-list table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 2.5px;
    border: 0;
  }

  .repay-list table tr {
    width: 100%;
    height: 54px;
    background-color: #FFFFFF;
    /*background-color: red;*/
  }

  .checkbox {
    width: 10%;
    padding-left: 15px;
  }

  .check {
    display: none;
  }

  .check + label {
    background-color: #FFF;
    border: 1px solid #C1CACA;
    padding: 12px;
    border-radius: 100%;
    display: inline-block;
    position: relative;
    margin-right: 9.5px;
    margin-left: 4px;
  }

  .h-checkbox .check + label {
    top: 13px;
  }

  .check + label:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px 1px 3px rgba(0, 0, 0, 0.1);
  }

  .check:checked + label {
    background-color: #ECF2F7;
    border: 1px solid #f84701;
    color: #f84701;
  }

  .check:checked + label:after {
    font-family: iconfont;
    content: '\e903'; /*勾选符号 */
    font-size: 20px;
    color: #f84701;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 1px 0 0 0;
    vertical-align: text-top;
  }

  .repay-list .price, .date {
    width: 45%;
  }

  .repay-list .price .periods {
    line-height: 27px;
    font-size: 12px;
    color: #7d7d7d;
  }

  .repay-list .price .q-price {
    font-size: 14px;
    color: #f80101;
  }

  .repay-list .date {
    text-align: right;
    padding-right: 15px;
  }

  .repay-list .date .state {
    font-size: 12px;
    color: #707070;
    line-height: 27px;
  }

  .repay-list .date .dead-date {
    font-size: 13px;
    color: #313131;
  }

  .repay-settle {
    width: 100%;
    height: 39px;
    display: flex;
    position: fixed;
    bottom: 49px;
    padding: 0 0 0 15px;
    box-sizing: border-box;
    background-color: #FFFFFF;
  }

  .repay-settle .pay-price {
    flex: 4;
    padding-left: 19px;
    font-size: 11px;
  }

  .repay-box {
    flex: 4;
    text-align: right;
  }

  .all-checkbox .check + label {
    top: 5.5px;
  }

  .all-checkbox .all-check-text {
    display: inline-block;
    font-size: 13px;
    line-height: 39px;
  }

  .pay-price .pay-money-text {
    color: #9e9e9e;
    padding-top: 5.6px;
    box-sizing: border-box;
  }

  .pay-price .pay-money {
    color: #ff0e0e;
    padding-top: 5.6px;
    box-sizing: border-box;
  }

  .repay-box button {
    width: 114.5px;
    height: 39px;
    line-height: 39px;
    border: none;
    background-color: #ff4e00;
    color: #fff;
    font-size: 16px;
    outline: none;
  }
</style>
