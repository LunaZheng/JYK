<template>
  <div class="creativeLife">
    <logo></logo>
    <navMenu :isShowMenu="isShowMenu" @getIsShowMenu="getIsShowMenu"></navMenu>
    <div class="life">
      <ul class="wrap">
        <li v-for="(item, idx) in lifeList">
          <div class="box">
            <div class="img-box">
              <img v-lazy="item.url" alt="">
            </div>
          </div>
          <h1>{{item.title}}</h1>
          <p>{{item.msg}}{{item.title}}</p>
          <div class="btn">
            <span class="price">￥{{item.price}}元</span>
            <router-link :to="{path: 'edit', query: {'id': item.id }}" :key="idx">
              <button>开始制作</button>
            </router-link>
          </div>
        </li>
      </ul>
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
  name: 'creativeLife',
  components: {
    logo,
    navMenu,
    vueFooter
  },
  data () {
    return {
      isShowMenu: false,
      lifeList: [
        {
          url: "/static/bfl-img/life-ysk.png",
          title: '钥匙扣',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-xitie.png",
          title: '喜帖',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-notebook.png",
          title: '笔记本',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-mousepad.png",
          title: '鼠标垫',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-calendar.png",
          title: '年历',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-poster.png",
          title: '海报',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-pillow.png",
          title: '抱枕',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-sticker.png",
          title: '贴纸',
          msg: '做出自己独特的',
          price: '28.8'
        },{
          url: "/static/bfl-img/life-mirror.png",
          title: '化妆镜',
          msg: '做出自己独特的',
          price: '28.8'
        }
      ]
    }
  },
  methods: {
    getIsShowMenu(val) {
      this.isShowMenu = val
    },
  },
  mounted() {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.life ul {text-align: center; padding-top: 22px;}
.life ul li {width: 28%; display: inline-block; margin: 50px auto; margin-right: 8%;}
.life ul li:nth-child(3),
.life ul li:nth-child(6),
.life ul li:nth-child(9) {margin-right: 0px;}
.life ul li .box {width: 100%; display: inline-block; text-align: center; margin: 0; padding: 0 8px;}
.life ul li .img-box {border: 1px solid #eee; -webkit-box-shadow: 0 0 0 8px rgba(0,0,0,0.03); box-shadow: 0 0 0 8px rgba(0,0,0,0.03); display: flex; justify-content: center; align-items: center; padding: 20px 0;}
.life ul li .img-box img {max-height: 378px; width: 90%;}
.life ul li h1 {font-size: 22px; margin: 18px auto; padding: 10px 0; border-top: 1px solid #35a78e; border-bottom: 1px solid #35a78e; color: #35a78e;}
.life ul li p {color: #999; font-size: 18px; margin: 18px;}
.life ul li .btn {height: 56px; line-height: 56px; background: #35a78e; color: #fff; font-size: 26px; text-align: left;}
.life ul li .btn span.price {display: inline-block; width: 45%; text-align: center; margin-right: 4%;}
.life ul li .btn button {vertical-align: middle; background: #35a78e; border: 1px solid #fff; border-radius: 4px; color: #fff; font-size: 20px; padding: 18px 7.5%; cursor: pointer; line-height: 1px; margin-top: -4px; outline: none;}
.life ul li .btn button:hover {background: #2b9d84;}
</style>