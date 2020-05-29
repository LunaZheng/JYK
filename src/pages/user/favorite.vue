<template>
  <div class="favorite">
    <h1 class="userTitle">收藏的产品</h1>
    <!-- <ul class="search-box">
      <li>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="proName">
        </el-input>
      </li>
      <li>
        <a href="javascript:" class="btn">搜索</a>
      </li>
    </ul> -->
    <div class="sort-box">
      <span>产品分类：</span>
      <p>
        <span :class="{'on': curSort == item}" v-for="(item, idx) in sortList" @click="curSort = item">{{item}}</span>
      </p>
    </div>
    <div class="btns">
      <div class="checkbox-box" @click="checkedAll">
        <i :class="{'el-icon-check': isCheckedAll}" style="top: -1px;"></i>
        <input id="checkbox" type="checkbox" class="checkbox checkedAll">
        <label id="label" for="checkbox">全选</label>
      </div>
      <span class="btn del" @click="del"><i class="el-icon-delete"></i>删除</span>
      <span class="btn" @click="addCart"><i class="icon-shopping_cart"></i>加入购物车</span>
    </div>
    <ul class="list-box" @click="toggleCheck">
      <li v-for="(product, idx) in productData" title="单击选择" :productId="product.id">
        <img v-lazy="'/static/bfl-img/' + product.img" alt="">
        <p class="priceBox">
          <span class="price">￥ {{product.price}} 元</span>
        </p>
        <p class="name">
          <span class="ellipsis">{{product.name}}</span>
          <span class="fr"><router-link :to="{path: '../edit'/*, query: {'id': product.id }*/}" :key="idx">编辑</router-link></span>
          <!-- <router-link :to="{path: 'productDetail', query: {'id': product.id }}" :key="idx">{{product.name}}</router-link> -->
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
      isCheckedAll: false,
      curSort: '全部',
      sortList: ['全部','相册','影楼册','台历','挂历','马克杯','抱枕','T恤',],
      productData: [
        {
          id: 0,
          name: '我的作品-蝶祈',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 1,
          name: '我的作品-笔记',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 2,
          name: '我的作品-初一',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 3,
          name: '我的作品-戈薇',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 4,
          name: '我的作品-漫步',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 5,
          name: '我的作品-千垛',
          img: 'display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
      ],
      choseArr: [], // 选中
    }
  },
  methods: {
    checkedAll(e) {
      var inputs = $('input.checkbox:not(.checkedAll)')
      this.isCheckedAll = !this.isCheckedAll
      if(this.isCheckedAll) {
        $('.list-box li').addClass('on')
      } else {
        $('.list-box li').removeClass('on')
      }
      this.choseArr = []
      var lis = $('.list-box li')
      lis.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.choseArr.push($(item))
        }
      })
    },
    toggleCheck(e) {
      var li = $(e.target).closest('li')
      var lis = $('.list-box li')
      if(li.length > 0) {
        li.toggleClass('on')
      } else {
        lis.removeClass('on')
      }
      this.choseArr = []
      var ckeckNum = 0
      lis.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.choseArr.push($(item))
          ckeckNum++
        }
      })
      this.isCheckedAll = ckeckNum == lis.length ? true : false
    },
    del() {
      if(this.choseArr.length > 0) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(this.choseArr)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    addCart() {
      if(this.choseArr.length > 0) {
        this.$alert('成功加入购物车!', '提示', {
          type: 'success',
          confirmButtonText: '确定',
          callback: action => {
            // 加入购物车接口
            this.choseArr.forEach((item, idx)=> {
              console.log(item)
              item.removeClass('on')
            })
          }
        });
      } else {
        this.$alert('请先选择产品!', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
        }); 
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-box {margin-bottom: 30px;}
.list-box li {width: 216px; height: 268px; border: 1px solid #d4d4d4; display: inline-block; margin-top: 34px; margin-right: 2.5%; padding: 12px; line-height: 30px; position: relative;}
.list-box li:hover {top: -1px; box-shadow: 3px 3px 5px #ddd;}
.list-box li.on {border-color: #34a88e; top: -1px; box-shadow: 3px 3px 5px #ddd;}
.list-box li:nth-child(5n) {margin-right: 0;}
.list-box li img {max-width: 100%; max-height: 160px; margin-bottom: 8px;}
.list-box li .priceBox {min-height: 30px; color: #b2b2b2;}
.list-box li .priceBox .price {color: #f7600c;}
.list-box li .name > span.ellipsis {display: inline-block; width: 130px; text-align: left;}
.list-box li .name > span.fr {color: #34a88e; cursor: pointer;}
.search-box .btn {display: inline-block; width: 100px; height: 40px; line-height: 40px; margin-left: 18px; background: #33a88e; color: #fff; text-align: center; border-radius: 5px;}
.search-box .btn:hover {background: #39bb9e;}

.search-box {line-height: 46px; position: relative; margin: 20px 0;}
.search-box li {display: inline-block; margin-right: 10px;}

.sort-box {border: 2px solid #e9f7f3; line-height: 24px; margin-top: 20px; padding: 10px;}
.sort-box > span {position: absolute;}
.sort-box p {margin-left: 80px;}
.sort-box p > span {display: inline-block; white-space: nowrap; padding: 0 8px; border-radius: 4px; margin: 0 2px 2px 0;}
.sort-box p > span:hover,
.sort-box p > span.on {background: #34a88e; color: #fff;}

.btns {margin-top: 20px; text-align: right;}
.btns .btn {margin-right: 15px; display: inline-block; padding: 0 10px; background: #f9ac7d; color: #fff; border-radius: 4px; line-height: 28px; border: 1px solid #f9ac7d;}
.btns .btn i {position: relative; top: 2px; margin-right: 5px; font-size: 20px;}
.btns .btn.del {background: #fff; color: #f9ac7d;}
.btns .btn:hover {background: #f79f69;}
.btns .btn.del:hover {background: #f79f69; color: #fff;}
.btns div.checkbox-box {margin-right: 20px;}
.btns div.checkbox-box input#checkbox ~ label {margin-left: 30px;}

@media screen and (min-width: 1440px) and (max-width: 1599px){
  .list-box li:nth-child(5n) {margin-right: 2.5%;}
}
@media screen and (max-width: 1439px){
  .list-box li:nth-child(5n) {margin-right: 2.5%;}
}
</style>