<template>
  <div class="agent">
    <childHeader title="代理中心"></childHeader>
    <div class="agent-container" ref="agentWrapper">
      <div class="agent-wrapper" v-if="this.loadData.length === 0">
        <div class="agent-img"><img src="../../common/img/nodata.png" alt=""></div>
        <div class="nodata">你当前还没有小伙伴借钱哦，赶紧约起来！</div>
      </div>
      <div class="agent-wrapper" v-else>
        <div class="approval-list" v-for="item in loadData">
          <div class="approval-info">
            <div class="approval-name">{{item.real_name}}</div>
            <div class="approval-addr">
              {{item.userAuth.userExtend.regions.provincename}}{{item.userAuth.userExtend.regions.cityname}}{{item.userAuth.userExtend.regions.name}}{{item.userAuth.userExtend.address}}
            </div>
            <div class="approval-money"><p>借款金额</p>
              <p>￥{{item.loan_amount}}</p></div>
          </div>
          <div class="approval-select">
            <button class="approval-option look" @click="readDetail(item.index)">
              查看详情
            </button>
            <button class="approval-option agree" :disabled="item.disabled" :style="{color:item.color}"
                    @click="agree(item.index,item.loan_id)">同意通过
            </button>
            <button class="approval-option disagree" :disabled="item.disabled" :style="{color:item.color}"
                    @click="disagree(item.index,item.loan_id)">拒绝通过
            </button>
          </div>
        </div>
        <div class="loading-hook"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  //  import Vue from 'vue';
  import childHeader from '../header/childHeader';
  import BScroll from 'better-scroll';
  import {config, headers} from '../../common/js/config';
  export default {
    data() {
      return {
        disabled: false,
        data: [],
        loadData: [],
        page: 1,
        color: ''
      };
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initAgent();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initAgent: function () {
        var token = localStorage.getItem('token');
        var agentData = JSON.stringify({
          'actionName': 'proxyQueryListPage',
          'controllerName': 'userLoanRecord',
          'data': [this.page]
        });
        this.$http.post(config.base_url, agentData, headers(token)).then((res) => {
          console.log(res.body);
          this.data = res.body.data.data;
          var index = 0;
          if (this.data !== null) {
            for (var i = 0; i < this.data.length; i++) {
              this.loadData.push(this.data[i]);
            }
            for (let j = 0; j < this.loadData.length; j++) {
              index = j;
              this.loadData[j].index = index;
              if (this.loadData[j].status !== 1) {
                this.loadData[j].color = '#6c6c6c';
                this.loadData[j].disabled = true;
              }
//              if (this.loadData[j].status === 66) {
//                this.loadData[j].agentState = '已同意';
//              }
//              if (this.loadData[j].status === 44) {
//                this.loadData[j].agentState = '已拒绝';
//              }
            }
            this.$nextTick(() => {
              this._initScroll();
            });
          }
        });
      },
      readDetail: function (index) {
        var agentDetail = JSON.stringify(this.data[index]);
        this.$router.push({path: '/agentDetail', query: {agentDetail: agentDetail}});
      },
      agree: function (index, id) {
        var token = localStorage.getItem('token');
        var agree = document.querySelectorAll('.agree')[index];
        var disagree = document.querySelectorAll('.disagree')[index];
        var data = JSON.stringify({
          'actionName': 'proxySuccess',
          'controllerName': 'userLoanRecord',
          'data': [id]
        });
        if (agree.disabled === true) {
          this.$dialog.toast({mes: '您已经审核过了，无法再继续审核~'});
        } else {
          this.$http.post(config.base_url, data, headers(token)).then((res) => {
            if (res.body.data.result === true) {
              this.$dialog.toast({mes: '已同意'});
              agree.style.color = '#6c6c6c';
              disagree.style.color = '#6c6c6c';
              agree.disabled = true;
              disagree.disabled = true;
              agree.innerHTML = '已同意';
            }
          });
        }
      },
      disagree: function (index, id) {
        var token = localStorage.getItem('token');
        var agree = document.querySelectorAll('.agree')[index];
        var disagree = document.querySelectorAll('.disagree')[index];
        var data = JSON.stringify({
          'actionName': 'proxyFail',
          'controllerName': 'userLoanRecord',
          'data': [id]
        });
        if (disagree.disabled === true) {
          this.$dialog.toast({mes: '您已经审核过了，无法再继续审核~'});
        } else {
          this.$http.post(config.base_url, data, headers(token)).then((res) => {
            if (res.body.data.result === true) {
              this.$dialog.toast({mes: '已拒绝'});
              agree.style.color = '#6c6c6c';
              disagree.style.color = '#6c6c6c';
              agree.disabled = true;
              disagree.disabled = true;
              disagree.innerHTML = '已拒绝';
            }
          });
        }
      },
      _initScroll: function () {
        if (!this.scroll) {
          this.agentScroll = new BScroll(this.$refs.agentWrapper, {click: true, probeType: 1});
          var _this = this;
          var bottomTip = document.querySelector('.loading-hook');
          this.agentScroll.on('scrollEnd', () => {
            // 滚动到底部
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd');
              bottomTip.innerText = '加载中...';
              setTimeout(function () {
                _this.page++;
                if (_this.repayList.length === 0) {
                  bottomTip.innerText = '无数据';
                } else {
                  _this.initAgent();
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
//                if (_this.data.length === 0) {
//                  bottomTip.innerText = '无数据';
//                } else {
//                  _this.initAgent();
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
      childHeader
    }
  }
  ;
</script>

<style>
  .agent-container {
    width: 100%;
    height: calc(100% - 44px);
    position: absolute;
    top: 44px;
    overflow: hidden;
  }

  .agent-img {
    width: 100%;
    padding-top: 20px;
    text-align: center;
  }
  .agent-img img {
    width: 119.5px;
    height: 131px;
  }

  .nodata {
    width: 100%;
    text-align: center;
    padding: 20px 0;
    font-size: 13px;
  }

  .agent-wrapper {
    width: 100%;
    margin-top: 5px;
    padding-bottom: 20px;
  }

  .agent-wrapper .approval-list {
    width: 100%;
    height: 110px;
    padding: 0 15px;
    background-color: #FFFFFF;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .agent-wrapper .approval-info {
    width: 100%;
    height: 66px;
    display: flex;
    text-align: center;
    font-size: 14px;
  }

  .agent-wrapper .approval-info > div:not(:first-child) {
    padding-top: 10px;
    line-height: 20px;
    box-sizing: border-box;
  }

  .agent-wrapper .approval-info .approval-name {
    flex: 2;
    line-height: 66px;
    overflow: hidden;
  }

  .agent-wrapper .approval-info .approval-addr {
    flex: 5;
    padding-top: 10px;
    line-height: 20px;
  }

  .agent-wrapper .approval-info .approval-money {
    /*line-height: 66px;*/
    flex: 4;
  }

  .agent-wrapper .approval-select {
    width: 100%;
    height: 44px;
    margin-top: 2px;
    display: flex;
  }

  .agent-wrapper .approval-select button {
    -webkit-appearance: none;
    border: none;
    outline: none;
  }

  .agent-wrapper .approval-option {
    flex: 1;
    line-height: 44px;
    font-size: 14px;
    text-align: center;
  }

  .agent-wrapper .approval-option:not(:last-child) {
    border-right: solid 1px #fff;
  }

  .agent-wrapper .approval-option.look {
    /*background-color: #30aafd;*/
    color: #f48224;
    /*border-right: solid 1px #c7c7c7;*/
  }

  .agent-wrapper .approval-option.agree {
    /*background-color: #30aafd;*/
    color: #30aafd;
    /*border-right: solid 1px #c7c7c7;*/
  }

  .agent-wrapper .approval-option.disagree {
    /*background-color: #f48224;*/
    color: #e53202;
  }

  .forbidden {
    color: #6c6c6c;
  }

  @media screen and (max-width: 320px) {
    .approval-info .approval-money {
      flex: 4;
      line-height: 20px;
      padding-top: 10px;
      box-sizing: border-box;
    }
  }
</style>
