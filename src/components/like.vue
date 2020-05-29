<template>
  <div class="like likeList-box">
    <div class="title">你可能还喜欢</div>
    <ul class="likeList">
      <li v-for="(item, idx) in likeList">
        <img v-lazy="'/static/bfl-img/details/' + item.img" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">￥&nbsp;{{item.price}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'like',
  data () {
    return {
      likeList: [
        {
          id: 0,
          name: '儿童相册精选24张',
          img: 'like-1.png',
          price: '48.8'
        },
        {
          id: 1,
          name: '儿童相册精选24张',
          img: 'like-1.png',
          price: '48.8'
        },
        {
          id: 2,
          name: '儿童相册精选24张',
          img: 'like-1.png',
          price: '48.8'
        },
        {
          id: 3,
          name: '儿童相册精选24张',
          img: 'like-1.png',
          price: '48.8'
        },
        {
          id: 4,
          name: '儿童相册精选24张',
          img: 'like-1.png',
          price: '48.8'
        }
      ],
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.likeList-box {width: 25%; position: absolute;}
.likeList-box .title {width: 100%; height: 60px; line-height: 60px; text-align: center; font-size: 22px; background: #34a88e; color: #fff;}
.likeList-box .likeList {border: 1px solid #d2d2d2;}
.likeList-box .likeList li {padding: 50px 30px 0; line-height: 46px; font-size: 18px;}
.likeList-box .likeList li p.price {color: #f4620c; font-size: 20px; border-bottom: 1px solid #b5b5b5; padding-bottom: 10px;}
.likeList-box .likeList li:last-child p.price {border-bottom-color: transparent;}
.likeList-box .likeList li img {width: 100%;}
</style>