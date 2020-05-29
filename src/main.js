// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuex from 'vuex'
import jspdf from 'jspdf'
import axios from 'axios'
import qs from 'qs';

import toPath from'./util/img2path.js'
import myFabric from './util/myFabric.js'
import sApi from './util/sApi.js' // 服务接口
import fabric from 'fabric'
import ElementUI from 'element-ui'
import SHA256 from 'crypto-js/sha256'
import VueLazyLoad from 'vue-lazyload'

import './common/stylus/index.styl'
import 'babel-polyfill' // es6转为es5-->兼容IE
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(vuex)

Vue.use(VueLazyLoad, {
  preLoad: 1.3, // 预载高度比例
  error: require('./assets/img/err.jpg'),
  loading: require('./assets/img/loading.gif'),
  // attempt: 2, // 尝试计数(默认3)
})

Vue.prototype.$axios = axios
Vue.prototype.myFabric = myFabric
Vue.prototype.sApi = sApi
Vue.prototype.toPath = toPath
Vue.prototype.jspdf = jspdf
Vue.prototype.qs = qs
Vue.prototype.$SHA256 = SHA256

// xios 请求拦截器，设置token 及 Content-Type
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
axios.interceptors.request.use(
  config => {
    let token = Vue.prototype.getCookie('token')
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token = token
      // config.headers.token = JSON.parse(`${token}`)
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)
// xios 返回拦截器
axios.interceptors.response.use(
  response => {
    if(response.config.url.indexOf('www.j-ink.cn') > -1) {
      // 根据返回的 type 值来做不同的处理（和后端约定）
      if (response.data.type == -2) { // token 已过期，跳到登录页面
        Vue.prototype.clearCookie('token')
        Vue.prototype.$confirm(response.data.msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push({path: "/login"})
        }).catch(() => {
          Vue.prototype.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      } else if(response.data.type != 1) {
        Vue.prototype.$alert(response.data.msg, '提示', {
          type: 'error',
          confirmButtonText: '确定',
          callback: action => {}
        })
      }
    }
    return response
  },
  err => { // 这里是返回状态码不为 200 时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break
        case 401:
          err.message = '未授权，请登录'
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务器内部错误'
          break
        case 501:
          err.message = '服务未实现'
          break
        case 502:
          err.message = '网关错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网关超时'
          break
        case 505:
          err.message = 'HTTP版本不受支持'
          break
        default:
          err.message = err.response.statusText
      }
    }
    Vue.prototype.$alert(err.message, '提示', {
      type: 'error',
      confirmButtonText: '确定',
      callback: action => {}
    })
    // Do something with response error
    return Promise.reject(err)
  }
)

const store = new vuex.Store({
  state: {
    loginFailNum: 0, // 登录失败次数
    oldRouter: '', // 存储上一个路由
    username: '',
    cartNum: 0,
  },
  mutations: {
    isLogin (state, username) {
      state.username = username
    },
    errNum (state, n) {
      state.loginFailNum += n
    },
    setOldRouter (state, oldRouter) {
      state.oldRouter = oldRouter
    }
  }
})

// 全局导航钩子
router.beforeEach((to, from, next) => {
  // console.log(to.meta.requireAuth, !$.isEmptyObject(store.state.username))
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    // Vue.prototype.checkIsLogin()
    // if (!$.isEmptyObject(store.state.username)) {
    if (Vue.prototype.getCookie('token')) {
      store.state.oldRouter = from
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

// 跳转后返回顶部
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
  // $('body').css('height', $(window).height() + 'px')
  // console.log($(window).height() + 'px')
})

Vue.prototype.setCookie = function(c_name, c_val, exdays) { //设置cookie
  exdays = exdays === undefined ? 0 : exdays
  var exdate = new Date(); //获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
  // console.log(exdays, new Date(), exdate)
  // exdate.setTime(exdate.getTime() + 60 * 1000 * exdays); // 分钟(开发测试用)
  document.cookie = exdays ? c_name + "=" + escape(c_val) + ";expires=" + exdate.toGMTString() + ";path=/" : c_name + "=" + escape(c_val) + ";path=/" // toGMTString(GMT格林威治) toUTCString(UTC世界时间)
}
Vue.prototype.getCookie = function(name) { //读取cookie
  if (document.cookie.length > 0) {
    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('='); //再次切割
      if (arr2[0] == name) { //判断查找相对应的值
        return unescape(arr2[1])
      }
    }
  }
}
Vue.prototype.clearCookie = function(name) { //清除cookie
  console.log('清除' + name)
  this.setCookie(name, "", -1); //修改2值都为空，天数为负1天就好了
  if(name == 'token') this.checkIsLogin()
}
Vue.prototype.checkIsLogin = function() {
  // console.log(router.currentRoute.path)
  // let userData = this.getCookie('userInfo')
  // if(!userData) {
  let token = this.getCookie('token')
  if(token) {
    let userInfo = this.getCookie('userInfo')
    if(userInfo) {
      userInfo = JSON.parse(userInfo)
      let username = userInfo.vipnickname ? userInfo.vipnickname : userInfo.viptel
      store.state.username = username
      store.state.cartNum = userInfo.cartcount
      return true
    } else {
      store.state.username = ''
      store.state.cartNum = 0
      // this.clearCookie('token')
      this.clearCookie('userInfo')
      return false
    }
  } else {
    store.state.username = ''
    store.state.cartNum = 0
    // this.clearCookie('token')
    this.clearCookie('userInfo')
    return false
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
