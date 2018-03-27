import Vue from 'vue';
import Router from 'vue-router';
import loan from '@/components/loan/loan';
import repayment from '@/components/repayment/repayment';
import user from '@/components/user/user';
import loanRecord from '@/components/loanRecord/loanRecord';
import loanDetail from '@/components/loanRecord/loanDetail';
import repaymentRecord from '@/components/repaymentRecord/repaymentRecord';
import setting from '@/components/setting/setting';
import updatePassword from '@/components/modifyPassword/modifyPassword';
import updateNumber from '@/components/modifyMobile/modifyMobile';
import updateNick from '@/components/modifyNick/nick';
import updatePay from '@/components/modifyPay/modifyPay';
import feedback from '@/components/feedback/feedback';
import realLedalize from '@/components/realLedalize/realLedalize';
import personalInfo from '@/components/realLedalize/personalInfo';
import ledalizeComplate from '@/components/realLedalize/ledalizeComplate';
import register from '@/components/register/register';
import login from '@/components/login/login';
import forget from '@/components/forgetPassword/forgetPassword';
import agent from '@/components/agent/agent';
import agentDetail from '@/components/agent/agentDetails';
import confirmPay from '@/components/confirmPay/confirmPay';
import about from '@/components/about/about';
import service from '@/components/about/service';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: '/usr/share/nginx/html/jd',
  routes: [
    // {path: '/', redirect: '/loan'},
    {
      path: '/',
      name: 'loan',
      component: loan,
      meta: {
         // 添加该字段，表示进入这个路由是需要登录的
        navShow: true
      }
    },
    {
      path: '/repayment',
      name: 'repayment',
      component: repayment,
      meta: {navShow: true}
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      meta: {navShow: true}
    },
    {
      path: '/loanRecord',
      name: 'loanRecord',
      component: loanRecord
    },
    {
      path: '/loanDetail',
      name: 'loanDetail',
      component: loanDetail
    },
    {
      path: '/repaymentRecord',
      name: 'repaymentRecord',
      component: repaymentRecord
    },
    {
      path: '/setting',
      name: 'setting',
      component: setting
    },
    {
      path: '/updatePassword',
      component: updatePassword
    },
    {
      path: '/updateNumber',
      component: updateNumber
    },
    {
      path: '/updateNick',
      component: updateNick
    },
    {
      path: '/updatePay',
      component: updatePay
    },
    {
      path: '/feedback',
      component: feedback
    },
    {
      path: '/realLedalize',
      component: realLedalize
    },
    {
      path: '/personalInfo',
      component: personalInfo
    },
    {
      path: '/ledalizeComplate',
      component: ledalizeComplate
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/reg',
      component: register
    },
    {
      path: '/forget',
      component: forget
    },
    {
      path: '/agent',
      component: agent
    },
    {
      path: '/agentDetail',
      component: agentDetail
    },
    {
      path: '/confirmPay',
      component: confirmPay
    },
    {
      path: '/about',
      component: about
    },
    {
      path: '/service',
      component: service
    }
  ]
});
