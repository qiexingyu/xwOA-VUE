// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import OACommon from '@/components/Common'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iView from 'iview'
import echarts from 'echarts'


Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.OACommon = OACommon
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts 

/* eslint-disable no-new */
new Vue({
  el: '#oaApp',
  router,
  template: '<App/>',
  components: { App }
})