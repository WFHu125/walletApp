<template>
  <div>
    <childHeader title="代理中心"></childHeader>
    <div class="agent-container" ref="agentDetailWrapper">
      <div class="agent-wrapper">
        <div class="agent-info">
          <div class="agent-row">
            <div class="agent-one">姓名：</div>
            <div class="agent-two">{{legalizeInfo.real_name}}</div>
          </div>
          <div class="agent-row">
            <div class="agent-one">角色：</div>
            <div class="agent-two">{{legalizeInfo.roleText}}</div>
          </div>
          <div class="agent-row">
            <div class="agent-one">身份证号码：</div>
            <div class="agent-two">{{legalizeInfo.id_card}}</div>
          </div>
          <div class="agent-row">
            <div class="agent-one">居住地址：</div>
            <div class="agent-two">{{address}}</div>
          </div>
          <div class="agent-row">
            <div class="agent-one">教育程度：</div>
            <div class="agent-two">{{education}}</div>
          </div>
          <div class="agent-row">
            <div class="agent-one">借贷用途：</div>
            <div class="agent-two">{{loanPurpose}}</div>
          </div>
          <div class="agent-row">
            <div class="agent-one">借款金额：</div>
            <div class="agent-two">{{loanAmount}}</div>
          </div>
        </div>
        <div class="agent-picture">
          <div class="picture-title">证件照片</div>
          <div class="picture-wrapper">
            <div class="img-block" v-for="item in legalizeInfo.userAuth.imageList">
              <img :src="item" alt=""/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import childHeader from '../header/childHeader';
  import BScroll from 'better-scroll';
  export default {
    data() {
      return {
        legalizeInfo: [],
        education: '',
        address: '',
        loanPurpose: '',
        loanAmount: 0
      };
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initDetail();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initDetail: function () {
        this.legalizeInfo = JSON.parse(this.$route.query.agentDetail);
        console.log('1111111111');
        console.log(this.legalizeInfo);
        this.address = this.legalizeInfo.userAuth.userExtend.regions.provincename + this.legalizeInfo.userAuth.userExtend.regions.cityname + this.legalizeInfo.userAuth.userExtend.regions.name + this.legalizeInfo.userAuth.userExtend.address;
        this.education = this.legalizeInfo.userAuth.userExtend.education;
        this.loanPurpose = this.legalizeInfo.userAuth.userExtend.loanPurpose;
        this.loanAmount = this.legalizeInfo.loan_amount;
        var role = this.legalizeInfo.userAuth.userExtend.role;
        var roleText = '';
        if (role === 'cooperation') {
          roleText = '合伙人';
        }
        if (role === 'ordinary') {
          roleText = '普通用户';
        }
        if (role === 'proxy') {
          roleText = '代理';
        }
        if (role === 'supplier') {
          roleText = '供应商';
        }
        if (role === 'vip') {
          roleText = '会员Plus';
        }
        this.legalizeInfo.roleText = roleText;
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      _initScroll: function () {
        this.scroll = new BScroll(this.$refs.agentDetailWrapper, {click: true});
      }
    },
    components: {
      childHeader
    }
  };
</script>

<style>
  .agent-container {
    width: 100%;
    height: calc(100vh - 44px);
    position: absolute;
    top: 44px;
    overflow: hidden;
  }

  .agent-wrapper {
    margin-top: 5px;
    padding-bottom: 10px;
    background-color: #fff;
  }

  .agent-info, .agent-picture {
    width: 100%;
    padding: 0 17px;
    box-sizing: border-box;
  }

  .agent-info .agent-row {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    display: flex;
  }

  .agent-info .agent-row .agent-two {
    flex: 7;
    padding-left: 10px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .picture-title {
    padding-top: 23.5px;
    padding-bottom: 11.5px;
    text-align: center;
    font-size: 20px;
  }

  .picture-wrapper {
    padding-top: 17.5px;
  }

  .picture-wrapper .img-block {
    width: 100%;
    height: 190px;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .picture-wrapper .img-block img {
    /*width: 100%;*/
    /*height: 100%;*/
  }
</style>
