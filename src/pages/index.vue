<template>
  <div class="index">
    <logo></logo>
    <navMenu :isTakeup="isTakeup"></navMenu>
    <!-- <navMenu :isTakeup="isTakeup" :isShowMenu="isShowMenu" @getIsShowMenu="getIsShowMenu"></navMenu> -->
    <!-- 公告栏 -->
    <div class="wrap">
      <div class="notice-box">
        <span class="title"><img src="/static/bfl-img/common/notice-icon.png" alt="">公告栏</span>
        <ul class="notice" @mouseover="closeNoticeAutoPlay" @mouseout="noticeAutoPlay">
          <li v-for="(item, idx) in noticeList"><a href="javascript:">{{idx+1}}. {{item.msg}}</a></li>
        </ul>
        <div class="close-icon fr" @click="closeNotice">
          <!-- <i class="el-icon-close"></i> -->
        </div>
      </div>
    </div>
    <div class="series-box wrap">
      <div class="series-item" v-for="(item, idx) in seriesList">
        <div v-if="idx % 2 != 0">
          <div class="info">
            <h1>{{item.name + '系列'}}</h1>
            <router-link :to="{path: '/goodsList', query:{sort: item.protype, idx: item.idx}}">点击进入 &gt; </router-link>
            <h2>{{item.msg}}</h2>
          </div>
          <div class="img-box">
            <img v-lazy="item.url" alt="">
          </div>
        </div>
        <div v-if="idx % 2 == 0">
          <div class="img-box">
            <img v-lazy="item.url" alt="">
          </div>
          <div class="info">
            <h1>{{item.name + '系列'}}</h1>
            <router-link :to="{path: '/goodsList', query:{sort: item.protype, idx: item.idx}}">点击进入 &gt; </router-link>
            <h2>{{item.msg}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="DIY-box">
        <h1>DIY定制过程</h1>
        <ul>
          <li v-for="(item, idx) in DIYList">
            <img v-lazy="item.icon" alt="">
            <h2>{{item.text}}</h2>
          </li>
        </ul>
      </div>
    </div>
    <div class="wrap">
      <hot-goods></hot-goods>
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
import hotGoods from '@/components/hotGoods'
import vueFooter from '@/components/vueFooter'

export default {
  name: 'index',
  components: {
    logo,
    navMenu,
    hotGoods,
    vueFooter,
  },
  data () {
    return {
      isTakeup: false,
      isShowMenu: true,
      noticeTimer: '',
      noticeMoveX: 0,
      noticeList: [
        {
          id: 0,
          msg: '新品8折',
        },
        {
          id: 1,
          msg: '新品8折',
        },
        {
          id: 2,
          msg: '新品8折',
        },
        {
          id: 3,
          msg: '新品8折',
        }
      ],
      seriesList: [
        {
          name: '台历',
          url: '/static/bfl-img/calendarSeries.png',
          msg: '让照片做成书,翻阅成为你的习惯'
        },{
          name: '照片冲印',
          url: '/static/bfl-img/printSeries.png',
          msg: '让照片做成书,翻阅成为你的习惯'
        },{
          name: '相册书',
          url: '/static/bfl-img/photoSeries.png',
          msg: '让照片做成书,翻阅成为你的习惯'
        },{
          name: '挂历',
          url: '/static/bfl-img/creativeSeries.png',
          msg: '让照片做成书,翻阅成为你的习惯'
        },{
          name: '影楼册',
          url: '/static/bfl-img/studioSeries.png',
          msg: '让照片做成书,翻阅成为你的习惯'
        }],
      DIYList: [
        {
          icon: '/static/bfl-img/temp.svg',
          text: '选择模板'
        },{
          icon: '/static/bfl-img/design.svg',
          text: 'DIY设计'
        },{
          icon: '/static/bfl-img/order.svg',
          text: '确认下单'
        },{
          icon: '/static/bfl-img/send.svg',
          text: '生产发货'
        }
      ]
    }
  },
  created() {
    /*this.$axios.get(this.sApi.product).then(response => {
      let res = response.data
      if(res.type == 1) {
        var data = res.data
        var arr = this.seriesList.map((item)=> {
          for(let i = 0, len = data.length; i < len; i++) {
            if(item.name == data[i].proname) {
              item.protype = data[i].protype
              item.idx = i
              return item
            }
          }
        })
        this.seriesList = arr
      }
    })*/
  },
  methods: {
    getIsShowMenu(val) {
      this.isShowMenu = val
    },
    noticeAutoPlay() {
      var ul = $('.notice')
      this.noticeTimer = setInterval(()=> {
        this.noticeMoveX += 0.5 
        if(this.noticeMoveX > ul.height() / 2) {
          this.noticeMoveX = 0
        }
        ul.css('margin-top', -this.noticeMoveX + 'px')
      }, 10)
    },
    /*noticeAutoPlay() {
      this.noticeTimer = setInterval(()=> {
        this.noticeMoveX += 0.5 
        this.set()
      }, 13)
    },
    set() {
      var ul = $('.notice')
      if(this.noticeMoveX > ul.height() / 2) {
        clearInterval(this.noticeTimer)
        this.noticeMoveX = 0
        this.noticeAutoPlay()
      }
      ul.css('margin-top', -this.noticeMoveX + 'px')
    },*/
    closeNotice() {
      $('.notice-box').css('display', 'none')
    },
    closeNoticeAutoPlay(e) {
      clearInterval(this.noticeTimer)
      var ul = $('.notice')
      var idx = Math.round(Math.abs((ul.css('margin-top')+'').replace('px', '') / 55))
      ul.css('margin-top', -idx*55 + 'px')
    }
  },
  mounted() {
    var ul = $('.notice')
    ul.html(ul.html() + ul.html())
    this.noticeAutoPlay()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 公告栏 */
.notice-box {width: 100%; height: 55px; background: #f6f6f6; padding: 0 14px; position: relative; overflow: hidden;}
.notice-box span {line-height: 55px;}
.notice-box span.title {color: #f9610d; font-size: 20px;}
.notice-box span.title img {vertical-align: middle; margin: -4px 20px 0 0;}
.notice-box .notice {position: absolute; top: 0; left: 212px;}
.notice-box .notice li a {line-height: 55px;}
.notice-box .notice li a:hover {color: #fe0100;}

.series-box {display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; margin-top: 35px;}
.series-box .series-item {width: 19%; -width: 280px; -height: 354px; display: inline-block; margin-right: 1.4%; padding-bottom: 8px; background-color: #f3f3f3; vertical-align: top; text-align: center;}
.series-box .series-item:last-child {margin-right: 0;}
.series-box .series-item:nth-child(2n+1) {display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: reverse; -ms-flex-direction: column-reverse; flex-direction: column-reverse;}
.series-box .series-item .info {font-size: 18px; text-align: left; margin: 20px auto;}
.series-box .series-item .info a {display: inline-block; padding: 9px 26px; background: #fff; color: #35a78e; font-size: 18px; margin: 10px 0;}
.series-box .series-item .info h2 {color: #aaa; font-size: 14px; padding-left: 4px;}
.series-box .series-item .img-box {-height: 212px; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; margin: 25px auto;}
.series-box .series-item .img-box img {max-width: 100%; max-height: 226px;}
.DIY-box {background: #faf9f9; margin-top: 36px;}
.DIY-box h1 {width: 22.6%; height: 80px; line-height: 80px; display: inline-block; background: #f4f3f3; vertical-align: top; text-align: center; color: #35a78e; font-size: 24px;}
.DIY-box ul {width: 77%; display: inline-block;}
.DIY-box ul li {width: 25%; display: inline-block; text-align: center; margin-top: 16px; color: #35a78e;}

@media screen and (max-width: 1518px) {
  .DIY-box ul {width: 75%;}
}
@media screen and (max-width: 1400px) {
  .DIY-box ul {width: 70%;}
}
@media screen and (min-width: 801px) and (max-width: 1200px) {
  .series-box .series-item {width: 24.5%;}
  .series-box .series-item:nth-child(4) {margin-right: 0;}
  .series-box .series-item:last-child {display: none;}
}
/* @media screen and (max-width: 800px) {
  .series-box.wrap {display: block;}
  .series-box.wrap .series-item {width: 48.5%; display: inline-block; margin: 0 3% 3% 0;}
  .series-box.wrap .series-item:nth-child(2n) {margin-right: 0;}
  .series-box.wrap .series-item:nth-child(5) {display: none;}
  .series-box.wrap .series-item > div > div {width: 40%; display: inline-block; margin-right: 4%;}
  .series-box.wrap .series-item > div > div > img {}
  .series-box .series-item .info {min-width: 108px;}
  .series-box .series-item .info a {padding: 9px 6%;}
  .DIY-box h1 {font-size: 20px; width: 24%;}
}
@media screen and (max-width: 481px) {
  .DIY-box h1 {font-size: 18px; width: 25%;}
  .series-box.wrap .series-item {display: block; width: 100%; margin: 0 0 3% 0;}
} */
</style>