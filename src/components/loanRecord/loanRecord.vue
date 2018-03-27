<template>
  <div>
    <Vheader title="借款记录"></Vheader>
    <div class="loanRecord-container" ref="loanRecordWrapper">
      <div class="loanRecord-wrapper" v-if="this.loanRecord.length === 0">
        <div class="nodata">您还没有借款，快去借款吧！</div>
        <router-link to="/" class="goLoan">去借款</router-link>
      </div>
      <div class="loanRecord-wrapper" v-else>
        <div class="h-list" v-for="item in loanRecord" @click="loanDetail(item.index)">
          <div class="list-item">
            <span class="iconfont icon-金币 icon-style"></span>
            <span class="red">{{item.loanAmount}}元</span>
            <!--<span class="blue">({{item.stateText}})({{item.day}}期)</span>-->
          </div>
          <div class="list-item">{{item.createTime}}</div>
          <div class="right"><i class="iconfont icon-right"></i></div>
        </div>
        <div class="loading-hook"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vheader from '../header/childHeader.vue';
  import BScroll from 'better-scroll';
  import {config, headers} from '../../common/js/config';
  export default{
    data() {
      return {
        loanRecord: [],
        page: 1
      };
    },
    props: {
      pullup: {
        type: Boolean,
        default: false
      }
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initrepay();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initrepay: function () {
        var token = localStorage.getItem('token');
        var loanRecord = JSON.stringify({
          'actionName': 'queryListPage',
          'controllerName': 'userLoanRecord',
          'data': [{}, this.page]
        });
        this.$http.post(config.base_url, loanRecord, headers(token)).then((res) => {
          console.log(JSON.stringify(res.body));
          localStorage.setItem('loanRecord', JSON.stringify(res.body.data));
          this.loanRecord = res.body.data;
          for (var i = 0; i < this.loanRecord.length; i++) {
            this.loanRecord[i].index = i;
          }
          this.$nextTick(() => {
            this._initScroll();
          });
        });
      },
      loanDetail: function (index) {
        var loanDetail = JSON.stringify(this.loanRecord[index]);
        this.$router.push({path: '/loanDetail', query: {loanDetail: loanDetail}});
      },
      _initScroll: function () {
        this.loanRecordScoll = new BScroll(this.$refs.loanRecordWrapper, {
          click: true
        });
        // 是否派发滚动到底部事件，用于上拉加载
        var _this = this;
        var bottomTip = document.querySelector('.loading-hook');
        this.loanRecordScoll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd');
            bottomTip.innerText = '加载中...';
            setTimeout(function () {
              _this.page++;
              if (_this.repayList.length === 0) {
                bottomTip.innerText = '无数据';
              } else {
                _this.initrepay();
                bottomTip.innerText = '加载更多';
              }
              // 加载更多后,重新计算滚动区域高度
              _this.scroll.refresh();
            }, 1000);
          }
        });
      }
    },
    components: {
      Vheader
    }
  };
</script>

<style type="text/css">


  .loanRecord-container {
    width: 100%;
    height: calc(100vh - 44px);
    position: absolute;
    top: 44px;
    /*bottom: 49px;*/
    overflow: hidden;
  }

  .loanRecord-wrapper {
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

  .goLoan {
    display: block;
    width: 120px;
    height: 32px;
    background-color: #30aafd;
    color: #ffffff !important;
    text-align: center;
    line-height: 32px;
    margin: 30px auto;
    font-size: 14px;
    border-radius: 5px;
  }

  .loanRecord-wrapper .h-list {
    width: 100%;
    height: 46px;
    line-height: 46px;
    display: flex;
    padding: 0 15px;
    margin-bottom: 2px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .loanRecord-wrapper .list-item {
    flex: 1;
    font-size: 14px;
    color: #313131;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }

  .loanRecord-wrapper .list-item:last-child {
    text-align: right;
    font-size: 12px;
  }

  .loanRecord-wrapper .list-item .red {
    color: #ef0404;
    padding-left: 10px;
    font-size: 16px;
  }

  .loanRecord-wrapper .list-item .blue {
    color: #439cde;
    font-size: 12px;
  }

  .loanRecord-wrapper .list-item span {
    display: inline-block;
  }

  .loanRecord-wrapper .icon-style {
    font-size: 22px;
    color: #30aafd;
    float: left;
    padding-top: 11.5px;
  }
</style>
