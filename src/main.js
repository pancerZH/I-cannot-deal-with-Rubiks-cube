// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
const Vue = require('vue')
const ElementUI = require('element-ui')
const Three = require('three')
const Cube = require('cubejs')
import App from './App.vue'
import '../static/common.css'

//Vue.config.productionTip = false
Vue.prototype.$three = Three;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
