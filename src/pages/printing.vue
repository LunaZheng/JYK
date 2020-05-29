<template>
  <div class="printing">
    <logo></logo>
    <navMenu :isShowMenu="isShowMenu" @getIsShowMenu="getIsShowMenu"></navMenu>
    <div class="print wrap">
      <div class="print-box" v-for="(sort, idx) in printList">
        <h1>{{sort.title}}</h1>
        <ul>
          <li v-for="(item, idx) in sort.itemList">
            <h1>{{item.title}}</h1>
            <p>{{item.msg}}</p>
            <img v-lazy="item.url" alt="">
            <div>
              <router-link to="/edit" class="button">{{sort.btn}}</router-link>
            </div>
          </li>
        </ul>
        <i class="btn-icon icon-prev"></i>
        <i class="btn-icon icon-next"></i>
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
  name: 'printing',
  components: {
    logo,
    navMenu,
    vueFooter
  },
  data () {
    return {
      isShowMenu: false,
      printList: [
        {
          title: '冲印照片',
          itemList: [{
            title: '冲印照片',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/printPto01.png'
          },{
            title: '护照证件照',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/printPto01.png'
          },{
            title: '影楼艺术照',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/printPto01.png'
          }],
          btn: '立即冲印'
        },{
          title: '喝水杯',
          itemList: [{
            title: '白色马克杯',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/printCup01.png'
          },{
            title: '彩色马克杯',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/printCup02.png'
          },{
            title: '定制马克杯',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/printCup01.png'
          }],
          btn: '开始制作'
        },{
          title: 'T恤',
          itemList: [{
            title: '儿童款',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/T-shirt01.png'
          },{
            title: '情侣款',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/T-shirt02.png'
          },{
            title: '亲子款',
            msg: '留住您最美好的回忆！',
            url: '/static/bfl-img/T-shirt01.png'
          }],
          btn: '开始制作'
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
.print-box {position: relative; margin-bottom: 50px;}
.print-box >h1 {text-align: center; font-size: 32px; position: relative; margin: 50px auto;}
.print-box >h1:after {content: ''; display: inline-block; width: 32px; height: 3px; background: #e76811; position: absolute; bottom: -16px; left: 50%; margin-left: -16px;}
.print-box ul {text-align: center; white-space: nowrap; width: 78.67%; overflow: hidden; margin: 0 auto; padding-right: 1px;}
.print-box ul li {vertical-align: top; width: 50%; height: 544px; display: inline-block; border: 1px solid #ccc; border-right: none; text-align: center;}
.print-box ul li:last-child {border-right: 1px solid #ccc;}
.print-box ul li >h1 {margin: 26px auto 16px; font-size: 24px; color: #666;}
.print-box ul li >p {color: #aaa; font-size: 20px; margin-bottom: 32px;}
.print-box ul li >img {height: 312px;}
.print-box ul li >div .button {display: inline-block; width: 166px; height: 44px; line-height: 40px; margin: 38px auto 34px; background: #35a78e; border: 1px solid #35a78e; border-radius: 4px; color: #fff; font-size: 20px; cursor: pointer;}
.print-box ul li >div .button:hover {background: #2b9d84;}
</style>