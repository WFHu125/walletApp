<template>
  <div>
    <div class="h-header">
      <div class="pull-left" @click="back"><span class="iconfont icon-left"></span></div>
      <div class="h-title">个人信息</div>
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
          <div class="circle active"></div>
          <div class="process-info">个人信息</div>
        </div>
        <div class="process-text">
          <div class="circle"></div>
          <div class="process-info">提交成功</div>
        </div>
      </div>
    </div>
    <div class="v-container" ref="personalWrapper">
      <div class="v-wrapper" v-if="state === 0">
        <form action="" class="form_personal">
          <div class="title">请填写真实有效的信息，我们会严格审核！</div>
          <div class="input-wrapper">
            <label>用户人身份：</label>
            <input type="text" :value="role" @click="userSelectShow=!userSelectShow" placeholder="请选择用户身份" class="flex8"
                   readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label @click="address">居住地址：</label>
            <input type="text" :value="address" @click="showCity" readonly placeholder="请选择您的居住地址"
                   class="flex8">
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label></label>
            <input type="text" :value="detailsAddr" v-model="detailsAddr" placeholder="请输入详细地址">
          </div>
          <div class="input-wrapper">
            <label>教育程度：</label>
            <input type="text" :value="education" @click="selectShow=!selectShow" placeholder="请选择您的教育程度" class="flex8"
                   readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label>借款用途：</label>
            <input type="text" :value="loanPurpose" @click="chooseLoan" placeholder="请选择您的借款用途" class="flex8" readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="loanSelect" v-show="loanSelect">
            <span class="banner" v-for="(item,$index) in items" :class="{'active':item.active,'unactive':!item.active}"
                  @click="choosePurpose(item,$index)">{{item.text}}</span>
          </div>
        </form>
        <div class="btn-container margin35">
          <!--<router-link to="/contactPerson">-->
          <div class="btn btn-blue" @click="submitPersonal">下一步</div>
          <!--</router-link>-->
        </div>
      </div>
      <div class="v-wrapper" v-else-if="state === 2">
        <form action="" class="form_personal">
          <div class="title">请填写真实有效的信息，我们会严格审核！</div>
          <div class="input-wrapper">
            <label>用户人身份：</label>
            <input type="text" :value="role" placeholder="请选择用户身份" class="flex8"
                   readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label @click="address">居住地址：</label>
            <input type="text" :value="address" readonly placeholder="请选择您的居住地址"
                   class="flex8">
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label></label>
            <input type="text" :value="detailsAddr" placeholder="请输入详细地址" readonly>
          </div>
          <div class="input-wrapper">
            <label>教育程度：</label>
            <input type="text" :value="education" placeholder="请选择您的教育程度" class="flex8"
                   readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label>借款用途：</label>
            <input type="text" :value="loanPurpose" placeholder="请选择您的借款用途" class="flex8" readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
        </form>
        <div class="btn-container margin35">
          <router-link to="/ledalizeComplate">
            <div class="btn btn-blue">下一步</div>
          </router-link>
        </div>
      </div>
      <div class="v-wrapper" v-else-if="state === 1 || state === 3">
        <form action="" class="form_personal">
          <div class="title">请填写真实有效的信息，我们会严格审核！</div>
          <div class="input-wrapper">
            <label>用户人身份：</label>
            <input type="text" :value="role" @click="userSelectShow=!userSelectShow" placeholder="请选择用户身份" class="flex8"
                   readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label @click="address">居住地址：</label>
            <input type="text" :value="address" @click="showCity" readonly placeholder="请选择您的居住地址"
                   class="flex8">
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label></label>
            <input type="text" :value="detailsAddr" v-model="detailsAddr" placeholder="请输入详细地址">
          </div>
          <div class="input-wrapper">
            <label>教育程度：</label>
            <input type="text" :value="education" @click="selectShow=!selectShow" placeholder="请选择您的教育程度" class="flex8"
                   readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="input-wrapper">
            <label>借款用途：</label>
            <input type="text" :value="loanPurpose" @click="chooseLoan" placeholder="请选择您的借款用途" class="flex8" readonly>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <div class="loanSelect" v-show="loanSelect">
            <span class="banner" v-for="(item,$index) in items" :class="{'active':item.active,'unactive':!item.active}"
                  @click="choosePurpose(item,$index)">{{item.text}}</span>
          </div>
        </form>
        <div class="btn-container margin35">
          <!--<router-link to="/contactPerson">-->
          <div class="btn btn-blue" @click="submitPersonal">下一步</div>
          <!--</router-link>-->
        </div>
      </div>
    </div>
    <citySelect ref="citySelect" v-show="selectCityShow" @showC="showToggle" :list="list"
                @address="changeCity"></citySelect>
    <Vselect v-show="selectShow" @showE="showEducation" :list="list" @receive="changeEducation"></Vselect>
    <userSelect v-show="userSelectShow" @showR="showRole" :Role="Role" @userRole="changeRole"></userSelect>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import Vselect from '../Vselect/Vselect';
  import userSelect from '../Vselect/userSelect';
  import citySelect from '../citySelect/citySelect';
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        items: [
          {
            text: '开展实体店经营'
          },
          {
            text: '商城推广运营'
          },
          {
            text: '自主创业'
          },
          {
            text: '原材料费用增加资金周转'
          }
        ],
        show: false,
        model: '',
        selectShow: false,
        selectCityShow: false,
        userSelectShow: false,
        loanSelect: false,
        address: '',
        areaId: '',
        detailsAddr: '',
        education: '',
        role: '',
        roleId: '',
        loanPurpose: '',
        state: 0,
        personalInfo: []
      };
    },
    props: ['list', 'Role'],
    created() {
      var legalizeInfo = JSON.parse(sessionStorage.getItem('legalizeInfo'));
      if (legalizeInfo) {
        this.state = legalizeInfo.status;
        console.log(this.state);
        this.personalInfo = legalizeInfo.userExtend;
        console.log(legalizeInfo);
        if (this.state !== 0) {
          this.areaId = legalizeInfo.userExtend.areaCode;
          this.address = legalizeInfo.userExtend.regions.provincename + legalizeInfo.userExtend.regions.cityname + legalizeInfo.userExtend.regions.name;
          this.detailsAddr = legalizeInfo.userExtend.address;
          this.education = legalizeInfo.userExtend.education;
          this.loanPurpose = legalizeInfo.userExtend.loanPurpose;
          this.roleId = legalizeInfo.userExtend.role;
          var roleText = '';
          if (this.roleId === 'cooperation') {
            roleText = '合伙人';
          }
          if (this.roleId === 'ordinary') {
            roleText = '普通用户';
          }
          if (this.roleId === 'proxy') {
            roleText = '代理';
          }
          if (this.roleId === 'supplier') {
            roleText = '供应商';
          }
          if (this.roleId === 'vip') {
            roleText = '会员Plus';
          }
          this.role = roleText;
        }
//        console.log(this.state);
//  console.log(this.areaId);
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    },
    methods: {
      back: function () {
        this.$router.back(-1);
      },
      chooseLoan: function () {
        this.loanSelect = true;
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      choosePurpose: function (item, index) {
        this.$nextTick(function () {
          this.items.forEach(function (item) {
            Vue.set(item, 'active', false);
          });
          Vue.set(item, 'active', true);
          this.loanPurpose = item.text;
        });
      },
      submitPersonal: function () {
        var PersData = JSON.stringify({
          'actionName': 'insert',
          'controllerName': 'userExtend',
          'data': [{
            'address': this.detailsAddr,
            'areaCode': this.areaId,
            'education': this.education,
            'loanPurpose': this.loanPurpose,
            'role': this.roleId
          }]
        });
        var token = localStorage.getItem('token');
        console.log('sss' + this.areaId);
        if (this.role && this.address && this.detailsAddr && this.education && this.loanPurpose) {
          this.$http.post('http://139.224.132.124/fuxi-api/jd-service', PersData, {
            'headers': {
              'Content-Type': 'application/json',
              'token': token
            }
          }).then((response) => {
            let res = response.body;
            if (res.data.result === true) {
              this.$router.push('/ledalizeComplate');
            } else {
              this.$dialog.toast({mes: res.data.data});
            }
            console.log(res);
          });
        } else {
          this.$dialog.toast({mes: '信息填写不完整'});
        }
      },
      changeEducation: function (value) {
        this.education = value;
        this.selectShow = false;
      },
      changeRole: function (value) {
        this.role = value;
        var roleId = '';
        if (value === '合伙人') {
          roleId = 'cooperation';
        }
        if (value === '普通用户') {
          roleId = 'ordinary';
        }
        if (value === '代理') {
          roleId = 'proxy';
        }
        if (value === '供应商') {
          roleId = 'supplier';
        }
        if (value === '会员Plus') {
          roleId = 'vip';
        }
        this.roleId = roleId;
        console.log(this.roleId);
        this.userSelectShow = false;
      },
      changeCity: function (addr, id) {
        this.address = addr;
        this.areaId = id;
        this.selectCityShow = false;
        console.log('区域ID' + id);
      },
      showCity: function () {
        this.selectCityShow = true;
        this.$refs.citySelect.showProvence();
      },
      showToggle: function () {
        this.selectCityShow = false;
      },
      showEducation: function () {
        this.selectShow = false;
      },
      showRole: function () {
        this.userSelectShow = false;
      },
      _initScroll: function () {
        this.personalScroll = new BScroll(this.$refs.personalWrapper, {
          click: true
        });
      }
    },
    components: {Vselect, citySelect, userSelect}
  };
</script>

<style>
  @import "../../common/stylus/header.css";
  @import "../../common/stylus/public.css";

  .form_personal .title {
    width: 100%;
    padding: 12px 20px;
    font-size: 15px;
    box-sizing: border-box;
  }

  .loanSelect {
    width: 100%;
    padding: 0 20px 10px;
    margin-top: 6px;
    background-color: #FFFFFF;
    box-sizing: border-box;
  }

  .loanSelect .banner {
    display: inline-block;
    width: auto;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 10px;
    margin-right: 5px;
    border: solid 1px #fff;
  }

  .loanSelect .active {
    border: solid 1px #6b8c63;
    color: #6b8c63;
  }

  .loanSelect .unactive {
    background-color: #f5f5f5;
    color: #313131;
  }

</style>
