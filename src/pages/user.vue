<template>
  <div class="user">
    <logo></logo>
    <navMenu :isTakeup="isTakeup" @getIsTakeup="getIsTakeup"></navMenu>
    <div class="wrap">
      <div class="left-box">
        <!-- <div class="nav-box" v-show="!isDraw"> -->
        <div class="nav-box" :class="{'on': isDraw}" @mouseover="isShowTooltip = true"  @mouseout="isShowTooltip = false">
          <!-- <img :src="avatar ? avatar : '/static/bfl-img/avatar.png'" alt="" class="avatar"> -->
          <div class="avatar" :style="'background-image: url(' + (avatar ? avatar : '/static/bfl-img/avatar.png') + ')'"></div>
          <p class="name">账户号: {{JSON.parse(this.getCookie('userInfo')).viptel}}</p>
          <ul class="nav">
            <li v-for="(nav, idx) in navList" @click='showSubNav'><i class="el-icon-arrow-down"></i>{{nav.nav}}
              <ul class="subNav">
                <li v-for="(item, idx2) in nav.subNav" :class="{'on': curNav == item.url}" @click="curNav = item.url">
                  <router-link :to="'/user/' + item.url" :key="idx2">{{item.name}}</router-link>
                  <!-- <router-link :to="{path: '/user/' + item.url, query: {'state': ''}}" :key="idx2">{{item.name}}</router-link> -->
                </li>
              </ul>
            </li>
          </ul>
          <el-tooltip v-show="isShowTooltip" class="item" effect="dark" :content="isDraw ? '显示菜单' : '隐藏菜单'" placement="right"><div class="hid-btn" @click="draw" :class="{'on': isDraw}"><i :class="isDraw ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i></div></el-tooltip>
        </div>
      </div>
      <div class="contain">
        <keep-alive>
          <router-view :isDraw="isDraw" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view :isDraw="isDraw" v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
    <vueFooter>
      <div slot="medal" class="medal">
        <div class="wrap">
          <img src="/static/bfl-img/footer.png" alt="">
        </div>
      </div>
    </vueFooter>
  </div>
</template>

<script>
import logo from '@/components/logo'
import navMenu from '@/components/navMenu'
import vueFooter from '@/components/vueFooter'

export default {
  name: 'user',
  components: {
    logo,
    navMenu,
    vueFooter
  },
  watch: {
    $route(newVal, oldVal){
      if(newVal.query.state != undefined) { // 订单中心
        this.curNav = newVal.query.state
      } else {
        var arr = newVal.path.split('/')
        this.curNav = arr[arr.length-1]
      }
    }
  },
  data () {
    return {
      isTakeup: true,
      isDraw: false,
      curNav: '',
      avatar: JSON.parse(this.getCookie('userInfo')).vipphoto,
      // userName: window.sessionStorage.getItem("username"),
      userName: 'zzUsername',
      navList: [
        {
          nav: '订单中心',
          subNav: [
            {
              name: '订单列表',
              url: 'orderList',
            },{
              name: '订单详情',
              url: 'orderDetail'
            }
          ]
        },{
          nav: '我的作品',
          subNav: [
            {
              name: '已完成作品',
              url: 'finished'
            }, {
              name: '未完成作品',
              url: 'unfinished'
            }
          ]
        },{
          nav: '照片管理',
          subNav: [
            {
              name: '我的相册',
              url: 'album'
            }
          ]
        },{
          nav: '账户管理',
          subNav: [
            {
              name: '购物车',
              url: 'cart'
            }, {
              name: '地址管理',
              url: 'addAddress'
            }, {
              name: '模块收藏',
              url: 'favorite'
            }, {
              name: '个人中心',
              url: 'userInfo'
            }
          ]
        }
      ],
      isAlowSearchOrder: false,
      isAlowSearchBill: false,
      isShowTooltip: false, // 是否显示菜单栏按钮
    }
  },
  methods: {
    getIsTakeup(val) {
      this.isTakeup = val
    },
    showSubNav(e) {
      var subNav = $(e.target).find('.subNav')
      var icon = $(e.target).find('.el-icon-arrow-down')
      if(subNav.css('display') != 'none') {
        subNav.css('display', 'none')
        icon.css('transform', 'rotate(-90deg)')
      } else {
        subNav.css('display', 'block')
        icon.css('transform', 'rotate(0deg)')
      }
    },
    draw() {
      this.isDraw = !this.isDraw
      if(this.isDraw) {
        $('.contain').css('margin-left', '26px')
      } else {
        $('.contain').css('margin-left', '297px')
      }
    },
    changeOrderState(name) {
      this.curNav = name
    }
  },
  mounted() {
    this.$nextTick(function() {
      var path = this.$route.fullPath
      if(this.$route.query.state != undefined) { // 订单中心
        this.curNav = this.$route.query.state
      } else {
        var arr = path.split('/')
        this.curNav = arr[arr.length-1]
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.left-box {height: 716px; padding-top: 74px; position: absolute;}
.nav-box {width: 272px; max-height: 820px; text-align: center; line-height: 44px; border: 1px solid #eee; margin-bottom: 50px; display: inline-block;}
.nav-box.on {width: 0; overflow: hidden;}
.nav-box img.avatar {display: inline-block; width: 190px; margin-top: 20px;}
.nav-box div.avatar {width: 190px; height: 133px; margin: 20px auto 0; background: center / contain no-repeat;}
.nav-box > p.name {font-size: 16px;}
.nav-box .nav {margin: 16px 0;}
.nav-box .nav > li {background: #f1f1f1; color: #33a88e;}
.nav-box .nav > li > img {vertical-align: middle;}
.nav-box .nav > li .subNav li {background: #fff; color: #666; font-size: 16px;}
.nav-box .nav > li .subNav li a {display: inline-block; width: 100%; height: 100%;}
.nav-box .nav > li .subNav li:hover,
.nav-box .nav > li .subNav li.on {color: #33a88e; background: #f8f8f8;}
/* .draw-btn {vertical-align: top; margin-top: 349px; border: 1px solid #eee; margin-left: -16px; padding: 12px 0; cursor: pointer; background: #fff;}
.draw-btn:hover {background: #ddd;} */
.el-icon-arrow-down {margin-right: 3px;}
.hid-btn {position: absolute; top: 60%; right: -14px; width: 14px; height: 120px; background: #ddd; border-radius: 0 16px 16px 0 / 0 30% 30% 0; font-size: 16px; color: #fff;}
.hid-btn > i {position: absolute; top: 50%; left: -1px; margin-top: -8px;}
.hid-btn.on,
.hid-btn:hover {color: #666; background: #eee;}

.contain {margin: 0 0 50px 297px; padding-top: 74px; min-height: 910px;}
</style>