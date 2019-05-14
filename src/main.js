// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
const Three = require('three')
import App from './App.vue'
import { Button, Icon, Row, Col, MessageBox, Dialog, Slider } from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Icon.name, Icon);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(MessageBox.name, MessageBox);
Vue.component(Dialog.name, Dialog);
Vue.component(Slider.name, Slider);

//Vue.config.productionTip = false
Vue.prototype.$three = Three;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
