<template>
  <div class="vueMenu">
    <div id="focus" v-show="!isTakeup">
      <div class="back">
        <ul class="img-list">
          <li v-for="(item, idx) in focusImg" :style="'background-image: url(/static/bfl-img/common/' + item + ');'" :class="{'on': curNavIdx == idx}">
          </li>
        </ul>
      </div>
    </div>
    <div class="nav-bar" :class="{'on': isTakeup}">
      <div class="wrap">
        <ul class="nav-list fr">
          <li v-for="(item, idx) in navList" :class="{'on': curNavUrl == item.url}">
            <router-link :to="item.url" @click="clickChange(idx)">{{item.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrap">
      <div class="menu-box">
        <div class="til" @click="showMenu">
          全部商品分类
          <img src="/static/bfl-img/common/down.png" alt="">
        </div>
        <ul class="menu-list" v-show="isShowMenu">
          <li v-for="(item, idx) in menuList" :class="{'on': curMenuType == item.protype}">
            <router-link :to="{path: '/goodsList', query:{sort: item.protype, idx: idx}}">{{item.proname}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vueMenu',
  props: ["isTakeup"],
  created() {
    // ******还原静态数据前*******
    /*this.$axios.get(this.sApi.product).then(response => { // 获取菜单
      let res = response.data
      if(res.type == 1) {
        this.menuList = res.data
        this.$emit('getSortItems', this.menuList[this.$route.query.idx])
      }
    })*/
  },
  data () {
    return {
      isShowMenu: true,
      focusImg: ['home-focus01.jpg', 'home-focus02.jpg', 'home-focus03.jpg'],
      curNavIdx: 0,
      curNavUrl: '/index',
      timer: '',
      navList: [
        {
          name: '首页',
          url: '/index'
        },{
          name: '个性印刷',
          url: '/printing'
        },{
          name: '创意生活',
          url: '/creativeLife'
        },
      ],
      menuList: [
        {
          idx: 0,
          protype: '台历',
          proname: '台历',
        }, {
          idx: 1,
          protype: '挂历',
          proname: '挂历',
        }, {
          idx: 2,
          protype: '照片书',
          proname: '照片书',
        }, {
          idx: 3,
          protype: '影楼册',
          proname: '影楼册',
        }, {
          idx: 4,
          protype: '3D数码周边',
          proname: '3D数码周边',
        }, {
          idx: 5,
          protype: '字母银饰',
          proname: '字母银饰',
        }, {
          idx: 6,
          protype: '冲印照片',
          proname: '冲印照片',
        }, {
          idx: 7,
          protype: '喝水杯',
          proname: '喝水杯',
        }, {
          idx: 8,
          protype: 'T恤',
          proname: 'T恤',
        }, {
          idx: 9,
          protype: '创意生活',
          proname: '创意生活',
        }
      ],
      curMenuType: 0,
    }
  },
  watch: {
    $route(to, from){
      this.curMenuType = to.query.sort
      this.$emit('getSortItems', this.menuList[to.query.idx])
    },
    deep: true
  },
  methods: {
    autoPlay() {
      this.timer = setInterval(()=> {
        this.curNavIdx++
        this.setState()
      }, 3000)
    },
    setState() {
      if (this.curNavIdx < 0) {
        this.curNavIdx = this.focusImg.length - 1
      }
      if (this.curNavIdx > this.focusImg.length - 1) {
        this.curNavIdx = 0
      }
      var imgs = $('.img-list').children()
      imgs.stop().fadeOut().eq(this.curNavIdx).stop().fadeIn()
    },
    closeAutoPlay() {
      clearInterval(this.timer)
    },
    clickChange(idx) {
      this.curNavIdx = idx
      this.curNavUrl = this.navList[idx].url
      if(this.curNavUrl != '/index') {
        this.isShowMenu = false
      } else {
        this.isShowMenu = true
      }
      this.setState()
    },
    showMenu() {
      this.isShowMenu = !this.isShowMenu
      if(this.isTakeup) {
        this.$emit('getIsTakeup', false)
      } else {
        this.$emit('getIsTakeup', true)
      }
    },
  },
  mounted() {
    this.curNavUrl = this.$route.fullPath
    this.curMenuType = this.$route.query.sort
    if(this.curNavUrl != '/index') {
      this.isShowMenu = false
    } else {
      this.isShowMenu = true
    }
    this.navList.forEach((item, idx)=> {
      if(this.curNavUrl == item.url) {
        this.curNavIdx = idx
        // banner 切换
        $('.img-list').children().stop().fadeOut().eq(this.curNavIdx).stop().fadeIn()
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vueMenu {position: relative;}
/* 轮播图 */
#focus {height: 548px; position: relative; background: #def; color: #c0a091;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
#focus .back {width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 1;}
#focus .back .img-list {height: 100%;}
#focus .back .img-list li {width: 100%; height: 100%; position: absolute; left: 0; top: 0; background: no-repeat center / cover; overflow: hidden;}

.nav-bar {position: absolute; top: 0; z-index: 10; background: rgba(255, 255, 255, 0.7); width: 100%; height: 48px; line-height: 48px; font-size: 20px;}
.nav-bar.on {background: #34a88e; color: #fff;}
.nav-bar ul.nav-list.fr {width: 38%; text-align: right;}
.nav-bar ul.nav-list.fr > li {display: inline-block; padding-left: 16%; font-weight: bold; position: relative;}
.nav-bar ul.nav-list.fr > li.on a,
.nav-bar ul.nav-list.fr > li a:hover {color: #ee6313;}
.menu-box {width: 15.6%; min-width: 230px; position: absolute; top: 0; z-index: 20; overflow: hidden; line-height: 48px; font-size: 20px;}
.menu-box .til {background: #34a88e; height: 48px; color: #fff; text-align: center; cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.menu-box .til img {vertical-align: middle; margin-top: -4px;}
.menu-box .menu-list {-height: calc(100% - 48px); height: 500px; background: #fff;}
.menu-box .menu-list li {height: 50px; line-height: 50px; background: #fff; text-align: center; font-size: 18px;}
.menu-box .menu-list li:hover a,
.menu-box .menu-list li.on a {color: #34a88e;}

@media screen and (min-width: 1401px) {
  .menu-box {width: 290px;}
}
@media screen and (min-width: 1201px) and (max-width: 1400px) {
  .nav-bar ul.nav-list.fr > li {padding-left: 13%;}
  #focus {height: 400px;} /*500*/
  .menu-box .menu-list {height: 352px;} /*452*/
} 
@media screen and (min-width: 769px) and (max-width: 1200px) {
  #focus {height: 400px;}
  .menu-box .menu-list {height: 352px;}
  .nav-bar ul.nav-list.fr > li {padding-left: 13%;}
}
@media screen and (max-width: 920px) {
  .nav-bar ul.nav-list.fr {width: 390px;}
  .nav-bar ul.nav-list.fr > li {padding-left: 50px;}
}
 @media screen and (max-width: 768px) {
  #focus {height: 310px;}
  .menu-box .menu-list {height: 262px;}
} 
@media screen and (max-width: 481px) {
  /*#focus {height: 260px;}
  .menu-box {min-width: 160px; font-size: 18px; line-height: 30px;}
  .menu-box .til {height: 40px; line-height: 40px;}
  .menu-box .menu-list {height: calc(100% - 30px);}
  .menu-box .menu-list li {height: 30px; line-height: 30px; font-size: 18px;}*/
  .nav-bar {height: 40px; line-height: 40px; font-size: 16px;}
  .nav-bar ul.nav-list.fr {width: 240px;}
  .nav-bar ul.nav-list.fr > li {padding-left: 26px;}
}
</style>