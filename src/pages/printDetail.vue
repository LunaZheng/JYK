<template>
  <div class="printDetail">
    <logo></logo>
    <navMenu :isTakeup="isTakeup"></navMenu>
    <div class="wrap">
      <div class="imgDetail-box">
        <div class="bigImg" @mouseover="toBig"  @mouseout="isShowToBig = false">
          <img v-for="(bigImg, idx) in data.imgList.bigImgSrc" :src="'/static/bfl-img/details/' + bigImg" v-if="curThumbId == idx" alt="">
        </div>
        <div class="toBig-box" v-if="isShowToBig">
          <img v-for="(toBigImg, idx) in data.imgList.toBigImgSrc" :src="'/static/bfl-img/details/' + toBigImg" v-if="curThumbId == idx" alt="">
        </div>
        <ul class="thumb">
          <li v-for="(thumb, idx) in data.imgList.thumbImg" @mouseover="curThumbId = idx" :class="{'on': curThumbId == idx}">
            <img :src="'/static/bfl-img/details/' + thumb" alt="">
          </li>
        </ul>
      </div>
      <div class="chooseInfo-box">
        <p class="name">
          <span>{{data.name}}</span>
        </p>
        <p class="price">价格： 
          <span class="price">{{data.price}}</span><span>元</span>
        </p>
        <p class="addr">配送至： 
          <span class="toCity">{{toCity}}</span>
          <span class="fastMail" v-for="(item, idx) in fastMailList">{{item.name}}：￥{{item.price}}</span>
        </p>
        <p class="saleStatus">此产品30天售出： 
          <span>{{data.saleStatus}}本</span>
        </p>
        <p class="num">数量： 
          <input type="num" value="1">
          <span>&nbsp;（库存{{data.stock}}件）</span>
        </p>
        <div class="btn-box">
          <a class="addCart-btn">开始定制</a>
          <router-link to="/toOrder" class="toBuy-btn">预览</router-link>
        </div>
      </div>
      <div class="btm">
        <like></like>
        <div class="detailInfo-box">
          <ul class="detailInfo-btn">
            <li v-for="(item, idx) in detailInfoBtns" :class="{'on': curDetailInfoBtn == idx}" @click="curDetailInfoBtn = idx">{{item}}</li>
          </ul>
          <div class="goodsDetail" v-if="curDetailInfoBtn == 0">
            <ul class="detailInfo">
              <li v-for="(item, idx) in data.detailInfo">
                <span class="name">{{item.name}}</span>
                <span class="val">{{item.val}}</span>
              </li>
            </ul>
            <ul class="detailInfoImg">
              <li v-for="(item, idx) in data.imgList.detailImg">
                <p class="title">{{item.title}}</p>
                <p class="subTitle">{{item.subTitle}}</p>
                <img v-for="(img, idx) in item.imgs" :src="'/static/bfl-img/details/' + img" alt="">
              </li>
            </ul>
          </div>
          <ul class="evaluate" v-if="curDetailInfoBtn == 1">
            <li v-for="(item, idx) in evaluate">
              <div class="left">
                <img :src="'/static/bfl-img/details/' + item.avatar" alt="">
                <span>{{item.name}}</span>
              </div>
              <div class="right">{{item.msg}}</div>
            </li>
          </ul>
          <div class="saleRecord" v-if="curDetailInfoBtn == 2">saleRecord</div>
        </div>
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
import like from '@/components/like'

export default {
  name: 'printDetail',
  components: {
    logo,
    navMenu,
    vueFooter,
    like
  },
  data () {
    return {
      isTakeup: true,
      curDetailInfoBtn: 0,
      detailInfoBtns: ['商品详情', '商品评价', '出售记录'],
      toCity: '上海市',
      fastMailList: [
        {
          name: '普通快递',
          price: '8.00'
        },
        {
          name: '顺丰快递',
          price: '12.00'
        }
      ],
      data: {
        id: 0,
        name: '照片印刷 高清',
        price: '88.8',
        saleStatus: 5, //销售状况
        unit: '本', // 单位
        stock: 85, // 库存
        detailInfo: [
          {
            name: '产品材质',
            val: '2.5mm硬壳纸 高光膜等'
          },{
            name: '成品大小',
            val: '20.5*20cm'
          },{
            name: '产品页数',
            val: '封面底面各1P+内页40P'
          },{
            name: '工艺',
            val: '封面热表技术'
          },{
            name: '装订',
            val: '精美封装'
          },{
            name: '制作周期',
            val: '3-5天'
          }
        ],
        imgList: {
          bigImgSrc: ['bigImg-1.png', 'bigImg-2.png', 'bigImg-3.png', 'bigImg-4.png'],
          toBigImgSrc: ['toBigImg-1.png', 'toBigImg-2.png', 'toBigImg-3.png', 'toBigImg-4.png'],
          thumbImg: ['thumb-1.png', 'thumb-2.png', 'thumb-3.png', 'thumb-4.png'],
          detailImg: [
            {
              title: '产品展示',
              subTitle: 'PRODUCT SPECIFICATON',
              imgs: ['detail-1.png', 'detail-2.png']
            },{
              title: '产品优势',
              subTitle: 'PRODUCT SPECIFICATON',
              imgs: ['detail-3.png']
            },{
              title: '产品包装',
              subTitle: 'PRODUCT SPECIFICATON',
              imgs: ['detail-4.png']
            }
          ]
        }
      },
      curThumbId: 0,
      isShowToBig: false,
      curSpec: '大框',
      evaluate: [
        {
          name: '13456',
          avatar: 'hotGoods-suyi.png',
          msg: '好好好好好好好好好好好好好好好好好好好好'
        },{
          name: '13456',
          avatar: 'hotGoods-suyi.png',
          msg: '好好好好好好好好好好好好好好好好好好好好'
        },{
          name: '13456',
          avatar: 'hotGoods-suyi.png',
          msg: '好好好好好好好好好好好好好好好好好好好好'
        },{
          name: '13456',
          avatar: 'hotGoods-suyi.png',
          msg: '好好好好好好好好好好好好好好好好好好好好'
        },{
          name: '13456',
          avatar: 'hotGoods-suyi.png',
          msg: '好好好好好好好好好好好好好好好好好好好好'
        }
      ]
    }
  },
  methods: {
    toBig(e) {
      this.isShowToBig = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.colorBar {width: 100%; height: 50px; background: #34a88e; position: absolute;}

.printDetail .wrap {position: relative; color: #666;}

.imgDetail-box {margin-top: 80px; width: 440px;}
.imgDetail-box .bigImg, .imgDetail-box .toBig-box {width: 100%; height: 440px; border: 1px solid #e4e4e4; padding: 18px 30px; font-size: 0px; position: relative;}
.imgDetail-box .toBig-box {position: absolute; top: 0; left: 450px; width: 440px; border-color: #aaa; overflow: hidden; z-index: 10; background: #fff;}
.imgDetail-box .bigImg img, .imgDetail-box .thumb li img  {max-width: 380px; max-height: 404px; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto; cursor: pointer;}
.imgDetail-box .thumb {text-align: center;}
.imgDetail-box .thumb li {display: inline-block; width: 94px; height: 84px; margin: 12px 12px 0 0; border: 2px solid transparent; overflow: hidden; position: relative;}
.imgDetail-box .thumb li:last-child {margin-right: 0;}
.imgDetail-box .thumb li.on {border-color: #34a88e;}
.imgDetail-box .thumb li img {max-width: 94px; max-height: 84px;}

.chooseInfo-box {position: absolute; top: 0; left: 502px; right: 0; height: 440px;}
.chooseInfo-box p {padding: 12px 48px; font-size: 18px;}
.chooseInfo-box p.name {font-size: 20px; border-bottom: 1px solid #b1b1b1; margin-bottom: 20px;}
.chooseInfo-box p.price span {color: #f4620c;}
.chooseInfo-box p.price span.price {font-size: 26px;}
.chooseInfo-box p.addr span {margin-right: 10px;}
.chooseInfo-box p.num input {width: 60px; text-align: center; height: 28px; border: 1px solid #ccc;}
.chooseInfo-box p.spec span {padding: 5px 12px; border: 1px solid #e4e4e4; margin-right: 14px;}
.chooseInfo-box p.spec span.on {border-color: #fe0100;}

.chooseInfo-box .btn-box {position: absolute; bottom: 0;}
.chooseInfo-box .btn-box a {display: inline-block; width: 198px; height: 50px; line-height: 50px; border: 1px solid #34a88e; text-align: center; font-size: 22px; color: #34a88e; margin-right: 16px;}
.chooseInfo-box .btn-box a.addCart-btn {background: #34a88e; color: #fff;}
.chooseInfo-box .btn-box a:hover,
.chooseInfo-box .btn-box a.toBuy-btn:hover {background: #43c5a8; color: #fff; border-color: #43c5a8;}

.btm {margin-top: 24px;}

/* 商品详情 */
.btm .detailInfo-box {margin-left: 408px; min-height: 1800px;}
.btm .detailInfo-box .detailInfo-btn {border-bottom: 1px solid #c2c2c2;}
.btm .detailInfo-box .detailInfo-btn li {height: 60px; line-height: 60px; display: inline-block; padding: 0 35px; font-size: 20px; border-bottom: 1px solid transparent; cursor: pointer; margin-bottom: -1px;}
.btm .detailInfo-box .detailInfo-btn li.on {border-bottom-color: #34a88e; color: #34a88e;}
.btm .detailInfo-box .detailInfo {margin: 22px 0 14px; border: 1px solid #f5f5f5; box-shadow: 1px 1px 0 1px #f5f5f5;}
.btm .detailInfo-box .detailInfo li {display: inline-block; width: 50%;}
.btm .detailInfo-box .detailInfo li span {display: inline-block; line-height: 56px;}
.btm .detailInfo-box .detailInfo li span.name {width: 28%; padding-left: 25px; background: #f5f5f5;}
.btm .detailInfo-box .detailInfo li span.val {width: 70%; padding-left: 32px; color: #999;}
.btm .detailInfo-box .detailInfoImg {margin-bottom: 60px;}
.btm .detailInfo-box .detailInfoImg li {text-align: center;}
.btm .detailInfo-box .detailInfoImg li p {color: #aaa; font-size: 22px; padding-bottom: 28px;}
.btm .detailInfo-box .detailInfoImg li p.title {color: #000; font-size: 28px; padding: 36px 0 30px;}
.btm .detailInfo-box .detailInfoImg li p.subTitle {font-family: 'Microsoft JhengHei';}
.btm .detailInfo-box .detailInfoImg li p.title:before, .btm .detailInfo-box .detailInfoImg li p.title:after {content: ''; display: inline-block; width: 16px; height: 28px; background: linear-gradient(295deg, #fff 11px, #f56e2d 13px, #fff 15px); vertical-align: middle; margin: 0 20px;}
.btm .detailInfo-box .detailInfoImg li img {width: 100%; margin-bottom: 14px;}

/* 商品评论 */
.btm .detailInfo-box .evaluate {padding: 30px;}
.btm .detailInfo-box .evaluate li {clear: both; min-height: 90px; border-bottom: 1px solid #d5d5d5; margin-bottom: 15px;}
.btm .detailInfo-box .evaluate li .left {float: left; width: 60px;}
.btm .detailInfo-box .evaluate li .left img {width: 60px; display: block;}
.btm .detailInfo-box .evaluate li .right {margin-left: 80px;}
</style>