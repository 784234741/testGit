// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入element-ui
import ElementUI from 'element-ui'
//引入样式
import 'element-ui/lib/theme-chalk/index.css';
//引入axios
import Axios from 'axios'
//导入状态管理
import store from "./store/store.js"

Vue.config.productionTip = false
Vue.use(ElementUI);  //在Vue中使用element-ui

Axios.defaults.baseURL = process.env.NODE_ENV == "development" ? "api/" : "";
Vue.prototype.$http = Axios;  //将Axios绑定到了Vue的原型对象上

Vue.prototype.$isLogin = function(){
  //验证用户是否登录
  if(!sessionStorage.getItem("id")){
    console.log("用户未登录！");
    this.$router.push("/login");
  }
}
Vue.prototype.$baseURL = "http://localhost:3000/";  //服务器地址

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
