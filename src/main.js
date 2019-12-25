import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@babel/polyfill';
import Es6Promise from 'es6-promise'
import axios from 'axios';
import VueAwesomeSwiper from 'vue-awesome-swiper'  
Vue.use(VueAwesomeSwiper)
// 引入组件样式  
import './static/css/iconfont.css'
import 'swiper/dist/css/swiper.min.css';
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)

// import Vconsole from 'vconsole'
Es6Promise.polyfill()
Vue.config.productionTip = false; 

axios.defaults.withCredentials=true;
Vue.prototype.$axios = axios;  

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
