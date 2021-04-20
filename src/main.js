import Vue from 'vue'
import ElementUI, {Menu} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import tree from "element-ui/packages/table/src/store/tree";


Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.use(Tree);
import {
  Tree,
  Form,
  FormItem
}from 'element-ui';
Vue.use(Form);
Vue.use(FormItem);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
