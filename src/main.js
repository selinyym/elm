import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routerConfig from './router/router.config'
import axios from 'axios'
import './common/sass/_index.scss'
import filters from './common/filters'

//forEach里面的key代表filters对象的每一个item，Vue.filter的第一个参数key代表自定义过滤器的名称，第二个参数代表函数
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));
Vue.use(VueRouter);
const router=new VueRouter(routerConfig);

Vue.prototype.$http=axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue()
  }
})
