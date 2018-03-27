<template>
  <div>
    <Vheader title="还款记录"></Vheader>
    <div class="repayRecord-container" ref="repayRecordWrapper">
      <div class="repayRecord-wrapper" v-if="loadData.length > 0">
        <div class="h-list" v-for="item in loadData">
          <div class="list-item">
            <span class="several-periods">{{item.numbercCount}}期</span>
            <span class="iconfont icon-金币 icon-style"></span>
            <span class="red">{{item.amount}}元</span>
          </div>
          <div class="list-item second">
            <div class="repay-state">{{item.repayState}}</div>
            <div class="repay-date">{{item.repaymentTime}}</div>
          </div>
        </div>
        <div class="loading-hook"></div>
      </div>
      <div class="repayRecord-wrapper" v-else>
        <div class="nodata">您还没有还过款哦~</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vheader from '../header/childHeader.vue';
  import BScroll from 'better-scroll';
  import {config, headers} from '../../common/js/config';
  export default{
    data () {
      return {
        repayList: [],
        loadData: [],
        page: 1
      };
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initRecord();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initRecord: function () {
        var token = localStorage.getItem('token');
        var repayData = JSON.stringify({
          'actionName': 'queryRepaymentRecordListPage',
          'controllerName': 'userRepaymentRrecord',
          'data': [{}, this.page]
        });
        this.$http.post(config.base_url, repayData, headers(token)).then((res) => {
          var list = res.body.data;
          this.repayList = list;
          console.log('1111111111');
          console.log(list);
          var repayState = '';
          for (let j = 0; j < list.length; j++) {
            this.loadData.push(list[j]);
          }
          for (let i = 0; i < this.loadData.length; i++) {
            if (this.loadData[i].status === 4) {
              repayState = '过期已还款';
            }
            if (this.loadData[i].status === 2) {
              repayState = '已还款';
            }
            this.loadData[i].repayState = repayState;
          }
          console.log('ssssssss' + JSON.stringify(this.loadData));
          this.$nextTick(() => {
            this._initScroll();
          });
        });
      },
      _initScroll: function () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.repayRecordWrapper, {
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
                _this.page++;
                if (_this.repayList.length === 0) {
                  bottomTip.innerText = '无数据';
                } else {
                  _this.initRecord();
                  bottomTip.innerText = '加载更多';
                }
                // 加载更多后,重新计算滚动区域高度
                _this.scroll.refresh();
              }, 1000);
            }
          });
//          this.scroll.on('touchend', (position) => {
//            var _this = this;
//            var bottomTip = document.querySelector('.loading-hook');
//            if (position.y < 0) {
//              bottomTip.innerText = '加载中...';
//              setTimeout(function () {
//                _this.page++;
//                if (_this.repayList.length === 0) {
//                  bottomTip.innerText = '无数据';
//                } else {
//                  _this.initRecord();
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
    components: {
      Vheader
    }
  };
</script>

<style type="text/css">

  .repayRecord-container {
    width: 100%;
    height: calc(100vh - 44px);
    position: absolute;
    top: 44px;
    overflow: hidden;
  }

  .repayRecord-wrapper {
    width: 100%;
    padding: 7px 0;
    height: auto;
  }

  .nodata {
    width: 100%;
    text-align: center;
    padding-top: 100px;
    font-size: 13px;
  }

  .loading-hook{
    width: 100%;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    color: #6c6c6c;
  }

  .h-list {
    width: 100%;
    height: 46px;
    display: flex;
    padding: 0 8px;
    background-color: #ffffff;
    margin-bottom: 2px;
    box-sizing: border-box;
  }

  .list-item {
    flex: 1;
    font-size: 14px;
    color: #313131;
  }

  .repayRecord-wrapper .list-item:first-child {
    display: flex;
    line-height: 46px;
  }

  .repayRecord-wrapper .list-item.second {
    text-align: right;
  }

  .repayRecord-wrapper .list-item.second .repay-date, .repay-state {
    height: 23px;
    font-size: 12px;
    line-height: 23px;
  }

  .repayRecord-wrapper .repay-state {
    color: #30aafd;
  }

  .repayRecord-wrapper .list-item .red {
    color: #ef0404;
    padding-left: 10px;
    font-size: 16px;
    width: 65%;
  }

  .list-item span {
    display: inline-block;
  }

  .repayRecord-wrapper .several-periods {
    color: #868686;
    font-size: 14px;
    width: 25%;
    padding-left: 6px;
  }

  .repayRecord-wrapper .icon-style {
    font-size: 22px;
    padding-top: 11.5px;
    padding-left: 5px;
    /*flex: 10%;*/
  }

  @media screen and (max-width: 320px) {
    .repayRecord-wrapper .several-periods {
      width: 30%;
    }
  }
</style>
