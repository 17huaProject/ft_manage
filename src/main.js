// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import
require('swiper/dist/css/swiper.css')
import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'
const VueAwesomeSwiper = require('vue-awesome-swiper')
// const wx = require('weixin-js-sdk')
// import wxsdk from 'weixin-js-sdk'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
Vue.prototype.$http = axios
import 'vue2-animate/dist/vue2-animate.min.css'
Vue.use(Router)
Vue.use(Toast)
Vue.use(VueAwesomeSwiper)
//import router from './router'
// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
// import Home from './Main.vue'
import ManagerRegister from './components/ManagerRegister.vue'
import FeatureList from './components/FeatureList.vue'
import VerificationList from './components/VerificationList.vue'
import store from './store'
Vue.config.debug = true;
Vue.config.performance = true;
Vue.config.devtools = true;
const routes = [
  {
    path: '*',
    meta: {
      title: '后台系统首页',
      scrollToTop: true
    },
    component: ManagerRegister,
  },
  {
    path: '/fl',
    meta: {
      title: '后台功能列表',
      scrollToTop: true
    },
    component: FeatureList,
  },
  {
    path: '/vl',
    meta: {
      title: '审核列表',
      scrollToTop: true
    },
    component: VerificationList,
  }
]

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    // new navigation.
    // scroll to anchor
    if (to.hash) {
      return {
        anchor: true
      }
    }
    // explicitly control scroll position
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      return {
        x: 0,
        y: 0
      }
    }
  }
}
// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new Router({
  mode: 'hash',
  scrollBehavior,
  routes,
  base: __dirname,
  // （缩写）相当于 routes: routes
})
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
new Vue({
  el: '#app',
  router,
  store,
  components: {
    Vue
  },
  created() {
    this.getBaseInfo();
    this.getWXbaseAPi();
    // let codeFsd = {
    //   phone: 18116139078,
    //   password: 123
    // }
    // this.$store.commit('ConectionPara', codeFsd)
    // let getString = this.$store.state.getParamString;
    // let postString = getString.replace('?', '');
    // this.$http.get(this.$store.state.serverHost + '/yqhbsp/user/login' + getString).then(m => this.getInfoCaetae(m.data)).catch(r => console.log(r));
  },
  data() {
    return {
      goPage: 'animated fadeInRight',
      BackPage: 'animated fadeOutLeft',
      routerPath: []
    }
  },
  methods: {
    getBaseInfo() {
      this.$store.commit('ConectionPara', {})
      let getString = this.$store.state.getParamString;
      let postString = getString.replace('?', '');
      this.$http.get(this.$store.state.serverHost + '/yqhbsp/config/getSystem' + getString).then(m => this.$store.commit('getBaseConfig', m.data.record)).catch(r => console.log(r));
    },
    getWXbaseAPi() {
      let w = {
        url: window.location.href.split('#')[0]
      }
      this.$store.commit('ConectionPara', w)
      let getString = this.$store.state.getParamString;
      let postString = getString.replace('?', '');
      this.$http.get(this.$store.state.serverHost + '/yqhbsp/config/getWXJSConfig' + getString).then(m => this.setWXbaseAPi(m.data)).catch(r => console.log(r));
    },
    setWXbaseAPi(data) {
      if (data.errcode == 200) {
        this.$store.commit('saveWXconfig', data.record)
      } else {
        this.$toast.center(data.errmsg)
      }
    },
    getInfoByWXcode(r) {
      if (r) {
        let codeFsd = {
          code: r || 0
        }
        this.$store.commit('ConectionPara', codeFsd)
        let getString = this.$store.state.getParamString;
        let postString = getString.replace('?', '');
        this.$http.get(this.$store.state.serverHost + '/yqhbsp/user/checkWXUser' + getString).then(m => this.getInfoCaetae(m.data)).catch(r => console.log(r));
      } else {
        if (this.$store.state.openID == '') {
          sessionStorage.setItem('inWechat', true)
          location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb60b43aacf89c63e&redirect_uri=http%3a%2f%2fwx.17hua.me&response_type=code&scope=snsapi_userinfo&state=wxweb#wechat_redirect'
        }
      }

    },
    getInfoCaetae(data) {
      if (data.errcode == 200) {
        // data.record.is_user != 1 ? this.$router.replace({
        //   path: '/bdv'
        // }) : ''
        this.$store.commit('saveOpenID', data.record.open_id)
        this.$store.commit('getBaseUsrInfo', data.record.login_user)
        this.getUsrConnection();
      } else {
        this.$toast.center(data.errmsg)
        sessionStorage.setItem('inWechat', true)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb60b43aacf89c63e&redirect_uri=http%3a%2f%2fwx.17hua.me&response_type=code&scope=snsapi_userinfo&state=wxweb#wechat_redirect'
      }
    },
    getUsrConnection() {
      let g = {
        access_token: this.$store.state.usrInfomation.access_token
      }
      this.$store.commit('ConectionPara', g)
      let getString = this.$store.state.getParamString;
      let postString = getString.replace('?', '');
      this.$http.get(this.$store.state.serverHost + '/yqhbsp/userinfo/indexContact' + getString).then(m => this.setFirstConnection(m.data)).catch(r => this.$toast.bottom('系统错误'));
    },
    setFirstConnection(data) {
      if (data.records.length == 0) {
        let m = {
          name: '',
          phone: '',
          email: ''
        }
        this.$store.commit('saveConnectionObj', m)
      } else {
        this.$store.commit('saveConnectionObj', data.records[0])
      }

    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path == from.path) {
        this.$router.push({
          path: '/rbck'
        })
      }
      let inPathArray = (to.path.split('/')[1] || '0') + '-' + (from.path.split('/')[1] || '0');
      let ouPathArray = (from.path.split('/')[1] || '0') + '-' + (to.path.split('/')[1] || '0');
      if (this.$store.state.routerPath.indexOf(ouPathArray) < 0) {
        this.goPage = 'animated fadeInRight';
        this.BackPage = 'animated fadeOutLeft'
        this.$store.commit('PushINArr', inPathArray);
      } else {
        this.goPage = 'animated fadeInLeft'
        this.BackPage = 'animated fadeOutRight'
        this.$store.commit('DeletINArr', ouPathArray);
      }
      if (to.path.split('/')[1] != 'dt' && to.path.split('/')[1] != 'pt' && to.path.split('/')[1] != 'at') { //活动详情
        let share = {
          sharetitle: '我喜欢这个绘画活动，你也去一起画吧',
          sharelink: 'wx.17hua.me',
          shareimgUrl: 'http://wx.17hua.me/static/obj_img/logo_for_share.png',
          shareDesc: '创建独一无二的作品！'
        }
        this.$store.commit('useShareFun', share)
      }
    }
  },
  mounted() {
    this.getWXbaseAPi()
  }
})
