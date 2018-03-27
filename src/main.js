// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import resource from 'vue-resource';
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
import {config, unHeaders} from './common/js/config';

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};

Vue.use(resource);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  methods: {
    tokenValidat(token, cb) {
      var data = JSON.stringify({
        'data': [token],
        'controllerName': 'userToken',
        'actionName': 'validate'
      });
      this.$http.post(config.request_url, data, unHeaders).then((res) => {
        cb(res.body.data);
      });
    }
  },
  components: {App}
});
