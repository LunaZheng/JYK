<template>
  <div class="favorite">
    <h1 class="userTitle">收藏的产品</h1>
    <ul class="search-box">
      <li>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="proName">
        </el-input>
      </li>
      <li>
        <el-button type="warning" class="btn">搜索</el-button>
      </li>
    </ul>
    <ul class="list-box">
      <li v-for="(product, idx) in productData">
        <router-link :to="{path: 'productDetail', query: {'id': product.id }}" :key="idx">
          <img :src="'/static/zz-img/' + product.img" alt="">
        </router-link>
        <p class="priceBox">
          <!-- <span class="price">￥ {{product.price}} 元</span>
          <span class="fr oldPrice">￥ {{product.oldPrice}} 元</span> -->
        </p>
        <p class="name">
          <router-link :to="{path: 'productDetail', query: {'id': product.id }}" :key="idx">{{product.name}}</router-link>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'favorite',
  data () {
    return {
      proName: '',
      productData: [
        {
          id: 0,
          name: '蝶祈——九件套',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 1,
          name: '笔记——十件套',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 2,
          name: '初一——八件套',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 3,
          name: '戈薇——八件套',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 4,
          name: '漫步——八件套',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 5,
          name: '千垛——八件套',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
      ],
    }
  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-box {margin-bottom: 30px;}
.list-box li {width: 216px; height: 268px; border: 1px solid #d4d4d4; display: inline-block; margin-top: 34px; margin-right: 2.5%; padding: 14px; line-height: 30px; font-size: 12px;}
.list-box li:nth-child(5n) {margin-right: 0;}
.list-box li img {max-width: 100%; max-height: 160px; margin-bottom: 8px;}
.list-box li .priceBox {min-height: 30px; font-size: 14px; color: #b2b2b2;}
.list-box li .priceBox .price {color: #f7600c;}

.search-box {line-height: 46px; position: relative; margin: 20px 0;}
.search-box li {display: inline-block; margin-right: 10px;}

@media screen and (min-width: 1440px) and (max-width: 1599px){
  .list-box li:nth-child(5n) {margin-right: 2.5%;}
}
@media screen and (max-width: 1439px){
  .list-box li:nth-child(5n) {margin-right: 2.5%;}
}
</style>