<template>
  <div class="vueHeader">
    <div class="wrap">
      <div class="left-box">
        <router-link class="login-btn" to="/login" v-show="!$store.state.username">请登录</router-link>
        <router-link class="register-btn" to="/register" v-show="!$store.state.username">免费注册</router-link>
        <router-link to="/user/userInfo" class="login-btn" v-show="$store.state.username">{{$store.state.username}} , 欢迎您！</router-link>
        <a href="javascript:" class="login-btn logout" v-show="$store.state.username" @click="logout(gotoLogin)">退出</a>
        <router-link class="logo" to="/" v-if="isEdit">
          <img src="/static/bfl-img/common/logo.png" alt="">
        </router-link>
      </div>
      <ul class="right-box fr">
        <li>
          <a href="javascript:" class="">
            <span>我的乐享</span>
            <i class="el-icon-arrow-down"></i>
          </a>
          <ul class="header-hidden">
            <li v-for="item in nav"><router-link :to="'/user/' + item.url">{{item.name}}</router-link></li>
            <!-- <li><a href="javascript:">我的足迹</a></li> -->
          </ul>
        </li>
        <li>
          <a href="javascript:" class="">
            <span>帮助中心</span>
            <img src="/static/bfl-img/icon/help.svg" alt="">
          </a>
          <ul class="header-hidden">
            <li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=313683028&amp;site=qq&amp;menu=yes">联系客服&nbsp; QQ</a></li>
            <li><a href="javascript:" @click="isShowPhone = true">联系客服 电话</a></li>
          </ul>
        </li>
        <li>
          <router-link to="/cart" class="">
            <span>购物车</span>
            <sup v-if="$store.state.cartNum > 0">{{$store.state.cartNum > 99 ? '99+' : $store.state.cartNum}}</sup>
            <img src="/static/bfl-img/icon/cart.svg" alt="">
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 正在加载 -->
    <el-dialog class="addAddress" title="请拨打下面客服电话" :visible.sync="isShowPhone" width="360px">
      <div class="dialog-box">
        <p></p>
        <i class="el-icon-phone"></i>13761018402
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'vueHeader',
  data () {
    return {
      isShowPhone: false,
      isEdit: false,
      nav: [
        {
          name: '订单中心',
          url: 'orderList',
        }, {
          name: '我的作品',
          url: 'finished'
        }, {
          name: '我的相册',
          url: 'album'
        }, {
          name: '个人中心',
          url: 'userInfo'
        }
      ]
    }
  },
  created() {
    this.checkIsLogin()
  },
  watch: {
    $route(newVal, oldVal) {
      if(newVal.name) {
        this.isEdit = (newVal.name.indexOf('edit') > -1 || newVal.name.indexOf('album') > -1) ? true : false
      }
    },
    deep: true
  },
  methods: {
    logout(callback) { // 退出
      this.clearCookie('token')
      callback() // 回调函数
    },
    gotoLogin() { // 回调函数
      this.$router.push({path: "/login"})
    }
  },
  mounted() {
    if(this.$route.path.indexOf('edit') > -1 || this.$route.path.indexOf('album') > -1) {
      this.isEdit = true
    } else {
      this.isEdit = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vueHeader {height: 30px; line-height: 30px; background: #f7f7f7; border-bottom: 1px solid #ececec; font-size: 15px;}
.wrap {height: 100%;}
.left-box, .right-box {display: inline-block;}
.left-box > a {margin-right: 50px;}
.left-box > a:hover {color: #35a68d;}
.left-box > a.register-btn {display: inline-block; width: 90px; height: 24px; line-height: 22px; text-align: center; border: 1px solid #35a68d; color: #35a68d; border-radius: 5px;}
.left-box > a.logo img {height: 28px; vertical-align: middle; margin-top: -3px;}
.right-box > li {display: inline-block; text-align: center; position: relative; border: 1px solid transparent;}
.right-box > li > a {display: inline-block; width: 110px;}
.right-box > li a > img {vertical-align: middle; margin-top: -2px;}
.right-box > li a > i {color: #f5610c; font-size: 16px; font-weight: bold;}
.right-box > li a > span {margin-right: 4px;}
.right-box > li .header-hidden {width: 100%; position: absolute; top: 28px; left: -1px; background: #fff; border: 1px solid transparent; border-top: none; box-sizing: content-box; display: none; z-index: 50;}
.right-box > li:hover {background: #fff; border: 1px solid #eee; border-top-color: transparent; border-bottom-color: transparent;}
.right-box > li:hover .header-hidden {display: block; background: #fff; border-color: #eee;}
sup {position: absolute; right: 6px; font-size: 12px; line-height: 14px; padding: 0 3px; border-radius: 12px; background: #f56c6c; color: #fff;}

.dialog-box {padding: 0 10px; line-height: 80px; text-align: center; font-size: 18px;}
</style>