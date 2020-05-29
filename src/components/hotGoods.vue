<template>
  <div class="hot-goods-box">
    <h1 class="title">热推产品</h1>
    <ul class="hot-goods">
      <li v-for="(item, idx) in hotGoodsList">
        <div class="info">
          <h2><router-link :to="{path: 'printing'}" :key="idx">{{item.name}}</router-link></h2>
          <span class="price">￥{{item.price}}元</span>
          <span class="saleNum fr">月售: {{item.saleNum}}件</span>
        </div>
        <div class="img-box" :style="'background-image: url(' + item.url + ')'">
          <router-link :to="{path: 'printing'}" :key="idx"></router-link>
        </div>
      </li>
    </ul>
    <div class="display" v-for="(display, idx) in displayList">
      <ul class="top">
        <li v-for="(item, idx) in display.top" :class="'item-' + (idx + 1)" >
          <p class="title">{{item.title}}</p>
          <!-- <router-link :to="{path: 'productDetail', query: {'id': item.id }}" :key="idx">
            <img v-lazy="'/static/bfl-img/' + item.img" alt="">
          </router-link> -->
          <a href="javascript:">
            <img v-lazy="'/static/bfl-img/' + item.img" alt="">
          </a>
        </li>
      </ul>
      <ul class="bottom">
        <li v-for="(item, idx) in display.bottom">
          <p class="title">{{item.title}}</p>
          <!-- <router-link :to="{path: 'productDetail', query: {'id': item.id }}" :key="idx">
            <img v-lazy="'/static/bfl-img/' + item.img" alt="">
          </router-link> -->
          <a href="javascript:">
            <img v-lazy="'/static/bfl-img/' + item.img" alt="">
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hot-goods',
  data () {
    return {
      hotGoodsList: [
        {
          name: '姓名贴',
          price: 5.5,
          saleNum: 956,
          url: '/static/bfl-img/hotGoods-stiker.png'
        },{
          name: '自驾游',
          price: 86,
          saleNum: 956,
          url: '/static/bfl-img/hotGoods-travelling.png'
        },{
          name: '马克杯',
          price: 28,
          saleNum: 956,
          url: '/static/bfl-img/hotGoods-cup.png'
        },{
          name: '手机壳',
          price: 28,
          saleNum: 956,
          url: '/static/bfl-img/hotGoods-phoneShell.png'
        }
      ],
      displayList: [
        {
          top: [
            {
              id: 4,
              title: '水晶套系',
              img: 'hotGoods-loveGift.png'
            },
            {
              id: 5,
              title: '',
              img: 'hotGoods-center01.png'
            },
            {
              id: 6,
              title: '相册摆台',
              img: 'hotGoods-album.png'
            },
            {
              id: 7,
              title: '水晶摆件',
              img: 'hotGoods-decoration.png'
            }
          ],
          bottom: [
            {
              id: 8,
              title: '照片墙',
              img: 'hotGoods-well.png'
            },
            {
              id: 9,
              title: '抱枕',
              img: 'hotGoods-pillow.png'
            },
            {
              id: 10,
              title: '婚纱相册',
              img: 'hotGoods-weddingAblum.png'
            },
            {
              id: 11,
              title: '银饰吊坠',
              img: 'hotGoods-diaozhui.png'
            }
          ]
        },
        {
          top: [
            {
              id: 12,
              title: '塑艺套系',
              img: 'hotGoods-suyi.png'
            },
            {
              id: 13,
              title: '',
              img: 'hotGoods-center02.png'
            },
            {
              id: 14,
              title: '甜美小公主',
              img: 'hotGoods-album.png'
            },
            {
              id: 15,
              title: '故事书',
              img: 'hotGoods-decoration.png'
            }
          ],
          bottom: [
            {
              id: 16,
              title: '钥匙扣',
              img: 'hotGoods-yaoshikou.png'
            },
            {
              id: 17,
              title: '迷你相册',
              img: 'hotGoods-pillow.png'
            },
            {
              id: 18,
              title: '快乐生活',
              img: 'hotGoods-weddingAblum.png'
            },
            {
              id: 19,
              title: '卡通杯',
              img: 'hotGoods-katongbei.png'
            }
          ]
        }
      ]
    }
  },
  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hot-goods-box {margin: 50px 0 52px;}
.hot-goods-box > .title {font-size: 28px;}
.hot-goods-box > .title:before {content: ''; display: inline-block; width: 5px; height: 24px; background: #e76811; vertical-align: bottom; margin-right: 10px;}
.hot-goods-box .hot-goods {margin-top: 30px;}
.hot-goods-box .hot-goods li {width: 24%; vertical-align: top; margin-right: 1.33%; border: 1px solid #ddd; display: inline-block; padding: 26px 16px;}
.hot-goods-box .hot-goods li:last-child {margin-right: 0;}
.hot-goods-box .hot-goods li .info {margin-bottom: 110px; font-size: 20px;}
.hot-goods-box .hot-goods li .info h2 {font-size: 24px; margin-bottom: 38px; padding-left: 20px;}
.hot-goods-box .hot-goods li .info .price {display: inline-block; width: 45%; height: 35px; line-height: 35px; background: #35a78e; color: #fff; border-radius: 4px; text-align: center;}
.hot-goods-box .hot-goods li .info .saleNum {display: inline-block; text-align: right; color: #aaa; line-height: 35px;}
.hot-goods-box .hot-goods li .img-box {max-width: 98.16%; height: 270px; -min-height: 273px; text-align: center; background: no-repeat center / cover;}
.hot-goods-box .hot-goods li .img-box > a {display: inline-block; width: 100%; height: 100%;}

.display {margin-bottom: 40px;}
.display .top {height: 426px; margin-top: 44px; position: relative;}
.display .top li {display: inline-block; width: 24%; height: 100%; background: #f3f3f3; margin-right: 1%; vertical-align: top;}
.display .top .item-1 p {text-align: center; font-size: 26px; margin-top: 84px;}
.display .top .item-1 img {max-width: 72%; display: block; margin: 50px auto;}
.display .top .item-2 {width: 50%; background: no-repeat center / cover;}
.display .top .item-2 img {width: 100%; height: 100%;}
.display .top .item-3, 
.display .top .item-4 {display: inline-block; width: 23.6%; height: 208px; margin-right: 0; position: absolute; top: 0;}
.display .top .item-3 p, .display .top .item-4 p {padding: 50px 0 0 30px; font-size: 20px;}
.display .top .item-3 img, .display .top .item-4 img {max-width: 52%; max-height: 100%; position: absolute; bottom: 0; right: 30px;}
.display .top .item-4 {top: auto; bottom: 0;}
.display .bottom li {width: 24.5%; height: 264px; display: inline-block; background: #f3f3f3; margin: 0.8% 0.53% 0 0; position: relative;}
.display .bottom li p {padding: 30px 0 0 38px; font-size: 20px;}
.display .bottom li img {max-width: 75%; position: absolute; bottom: 5px; right: 5px;}
.display .bottom li:last-child {margin-right: 0;}
.hot-goods-box .hot-goods li:hover,
.display-top > li:hover,
.display .top > li:hover,
.display .bottom > li:hover {-webkit-box-shadow: 3px 3px 5px #ddd;box-shadow: 3px 3px 5px #ddd; position: relative; top: -1px;}
.display .top .item-3:hover, .display .top .item-4:hover {position: absolute; top: -1px; -webkit-box-shadow: 3px 3px 5px #ddd; box-shadow: 3px 3px 5px #ddd;}
.display .top .item-4:hover {top: auto; bottom: 1px;}

@media screen and (max-width: 1400px) {
  .hot-goods-box .hot-goods li .info {margin-bottom: 80px;}
  .hot-goods-box .hot-goods li .info h2 {margin-bottom: 30px;}
  .hot-goods-box .hot-goods li .img-box {height: 230px;}
}
@media screen and (max-width: 1200px) {
  .hot-goods-box .hot-goods li .info {margin-bottom: 40px;}
  .hot-goods-box .hot-goods li .info h2 {margin-bottom: 20px; display: inline-block; padding: 0;}
  .hot-goods-box .hot-goods li .info .price {float: right;}
  .hot-goods-box .hot-goods li .info .saleNum {display: none;}
  .hot-goods-box .hot-goods li .img-box {height: 180px;}
}
/* @media screen and (max-width: 800px) {
  .hot-goods-box .hot-goods li {width: 48%; margin-bottom: 10px;}
  .hot-goods-box .hot-goods li:nth-child(2n) {margin-right: 0;}
} */
</style>
