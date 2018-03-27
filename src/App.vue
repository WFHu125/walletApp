<template>
  <div id="app">
    <!--<lg-preview></lg-preview>-->
    <router-view></router-view>
    <div class="h-tabbar" v-show="$route.meta.navShow">
      <router-link to="/" class="tabbar-item" exact>
        <span class="iconfont icon-借款"></span>
        <span>借款</span>
      </router-link>
      <router-link to="/repayment" class="tabbar-item">
        <span class="iconfont icon-还款方式"></span>
        <span>还款</span>
      </router-link>
      <router-link to="/user" class="tabbar-item">
        <span class="iconfont icon-我的"></span>
        <span>我的</span>
      </router-link>
    </div>
    <!--<navBar v-show="$route.meta.navShow"></navBar>-->
  </div>
</template>

<script type="text/ecmascript">
  import loan from './components/loan/loan';
//  import repayment from './components/repayment/repayment';
//  import user from './components/user/user';
//  import login from './components/login/login';

  export default {
    components: {
      loan
    }
  };
</script>

<style>
  @import './common/stylus/iconfont.css';

  .h-tabbar {
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: rgb(238, 238, 238);
    z-index: 100;
    /*border-top: solid 1px rgb(203, 203, 203);*/
  }

  .tabbar-item {
    display: block;
    text-decoration: none;
    flex: 1;
    text-align: center;
    color: #818181;
  }

  .router-link-active {
    color: #2aa8f5;
  }

  .tabbar-item span {
    display: block;
    margin: auto;
    margin-top: 5px;
  }

  .tabbar-item span:last-child {
    font-size: 10px;
  }
</style>

