<template>
  <div class="finished">
    <h1 class="userTitle">已完成的作品</h1>
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
      <span class="btn" @click="toAddCart"><i class="icon-shopping_cart"></i>加入购物车</span>
    </div>
    <ul class="list-box" @click="toggleCheck">
      <li v-for="(product, idx) in productData" title="单击选择" :pcid="product.pcid" :uwid="product.uwid">
        <img v-if="product.thumbpic" v-lazy="sApi.picDomain + product.thumbpic" alt="">
        <!-- <div class="img" v-lazy:background-image="'/static/bfl-img/' + product.img"></div> -->
        <p class="priceBox">
          <span class="price">￥ {{product.price}} 元</span>
          <!-- <span class="fr oldPrice">￥ {{product.oldPrice}} 元</span> -->
        </p>
        <p class="name">
          <span class="ellipsis">{{product.caption}}</span>
          <span class="fr"><router-link :to="{path: '../edit', query: {'pid': product.pcid }}" :key="idx">编辑</router-link></span>
        </p>
      </li>
    </ul>

    <!-- 加入购物车前 类型选择 -->
    <el-dialog class="addAddress" width="30%" title="请选择产品属性" :visible.sync="isShowType">
      <ul class="typeBox">
        <li v-for="item in typeData">
          <p class="til">{{item.key}}</p>
          <p class="items">
            <span v-for="(value, idx) in (item.value.split(','))" :class="{'on': idx == 0}" @click="changeType">{{value}}</span>
          </p>
        </li>
      </ul>
      <!-- <p class="priceBox" v-for="(item, idx) in typeArr" v-if="idx == 0">
        <span class="currprice">￥{{item.currprice}}元</span>
        <span class="oriprice">￥{{item.oriprice}}元</span>
      </p> -->
      <p class="priceBox">
        <span class="currprice">￥{{curPcid.currprice}}元</span>
        <span class="oriprice">￥{{curPcid.oriprice}}元</span>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShowType = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addCart">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'finished',
  data () {
    return {
      isCheckedAll: false,
      curSort: '全部',
      sortList: ['全部','相册','影楼册','台历','挂历','马克杯','抱枕','T恤',],
      productData: [
        {
          id: 0,
          name: '我的作品-蝶祈',
          img: '/static/bfl-img/display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 1,
          name: '我的作品-笔记',
          img: '/static/bfl-img/display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 2,
          name: '我的作品-初一',
          img: '/static/bfl-img/display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 3,
          name: '我的作品-戈薇',
          img: '/static/bfl-img/display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 4,
          name: '我的作品-漫步',
          img: '/static/bfl-img/display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
        ,{
          id: 5,
          name: '我的作品-千垛',
          img: '/static/bfl-img/display-top-03.gif',
          price: '28.8',
          oldPrice: '58'
        }
      ],
      uwidArr: [], // 选中
      pcidArr: [], // 选中
      isShowType: false, // 是否显示类型
      typeData: [], // 类型数据
      typeArr: [], // 所有类型匹配数据
      curPcid: '',
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
      this.uwidArr = []
      this.pcidArr = []
      var lis = $('.list-box li')
      lis.each((idx, item)=> {
        if($(item).hasClass('on')) {
          // this.uwidArr.push($(item))
          this.uwidArr.push($(item).attr('uwid'))
          this.pcidArr.push($(item).attr('pcid'))
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
      this.uwidArr = []
      this.pcidArr = []
      var ckeckNum = 0
      lis.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.uwidArr.push($(item).attr('uwid'))
          this.pcidArr.push($(item).attr('pcid'))
          ckeckNum++
        }
      })
      this.isCheckedAll = ckeckNum == lis.length ? true : false
    },
    del() {
      if(this.uwidArr.length > 0) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // uwid:待删除的作品编号.逗号分隔
          this.$axios.post(this.sApi.userworks + '?t=del&uwid=' + this.uwidArr.join(',')).then((response)=> {
            let res = response.data
            if(res.type == 1) {
              console.log(res)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      } else {
        this.$alert('请先单击选择!', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
        });
      }
    },
    addCart() {
      this.isShowType = false
      this.$axios.post(this.sApi.userworks + '?t=cartadd&uwid=' + this.uwidArr.join(',') + '&pcid=' + this.curPcid.pcid + '&num=1').then((response)=> {
        console.log(response)
        let res = response.data
        if(res.type == 1) {
          this.$alert('成功加入购物车!', '提示', {
            type: 'success',
            confirmButtonText: '确定',
            callback: action => {
              // 加入购物车接口
              $('.list-box > li').removeClass('on')
            }
          });
        }
      })
    },
    toAddCart() {
      if(this.uwidArr.length == 1) {
        this.$axios.post(this.sApi.userworks + '?t=uwattr&uwid=' + this.uwidArr.join(',')).then((response)=> {
          console.log(JSON.parse(JSON.stringify(response)))
          let res = response.data
          if(res.type == 1) {
            this.typeData = res.data.attr
            this.typeArr = res.data.pcid
            this.curPcid = this.typeArr[0]
            this.isShowType = true
            // this.addCart(this.uwidArr.join(','))
          }
        })
      } else if(this.uwidArr.length <= 0) {
        this.$alert('请先选择产品!', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
        }); 
      } else if(this.uwidArr.length > 1) {
        this.$alert('只能一个一个地加入购物车哦!', '提示', {
          type: 'warning',
          confirmButtonText: '朕知道了',
          callback: action => {}
        }); 
      }
    },
    getList() {
      var param = {
        "protype": "", // 产品分类编号,查询所有给空值
        "pagesize": 50, // --每页数量
        "pageindex": 1, // --当前页码
        "state": 1 // 或者 2.--1: 已完成作品;2 未完成作品
      }
      this.$axios.post(this.sApi.userworks + '?t=search', param).then((response)=> {
        let res = response.data
        if(res.type == 1) {
          console.log(res)
          this.productData = res.data
        }
      })
    },
    getType() {
      /*let spans = $('.typeBox li .items span.on')
      let type = []
      ;[].slice.call(spans).forEach(item=> {
        type.push($(item).text())
      })
      this.typeArr.forEach(item=> {
        if(item.attrvalue == type.join(',')) {
          this.curPcid = item
        }
      })*/
    },
    changeType(e) {
      let index = $(e.target).index()
      let spans = $(e.target).closest('p.items').children()
      spans.removeClass('on').eq(index).addClass('on')

      let allOn = $('.typeBox li .items span.on')
      let type = []
      ;[].slice.call(allOn).forEach(item=> {
        type.push($(item).text())
      })
      this.typeArr.forEach(item=> {
        if(item.attrvalue == type.join(',')) {
          console.log(item)
          this.curPcid = item
        }
      })
    },
  },
  mounted() {
    this.getList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-box {margin-bottom: 30px;}
.list-box li {width: 216px; height: 268px; border: 1px solid #d4d4d4; display: inline-block; margin-top: 34px; margin-right: 2.5%; padding: 12px; line-height: 30px; position: relative; vertical-align: top; text-align: center;}
.list-box li > p {text-align: left;}
.list-box li:hover {top: -1px; box-shadow: 3px 3px 5px #ddd;}
.list-box li.on {border-color: #34a88e; top: -1px; box-shadow: 3px 3px 5px #ddd;}
.list-box li:nth-child(5n) {margin-right: 0;}
.list-box li img {max-width: 100%; max-height: 160px; margin-bottom: 8px;}
.list-box li div.img {width: 100%; height: 160px; background: center / contain no-repeat;}
.list-box li .priceBox {min-height: 30px; color: #b2b2b2;}
.list-box li .priceBox .price {color: #f7600c;}
.list-box li .name > span.ellipsis {display: inline-block; width: 130px; text-align: left;}
.list-box li .name > span.fr {color: #34a88e; cursor: pointer;}

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

.typeBox {padding: 0 20px; line-height: 32px;}
.typeBox li {margin-bottom: 10px;}
.typeBox li .til {color: #333; font-size: 16px; line-height: 34px;}
.typeBox li .items span {display: inline-block; padding: 0 8px; border: 2px solid #eee; margin-right: 10px; cursor: pointer;}
.typeBox li .items span.on,
.typeBox li .items span:hover {border-color: #2ad0ab;}
.priceBox {padding: 0 20px;}
.priceBox .currprice {color: #f79f69; margin-right: 20px;}
.priceBox .oriprice {text-decoration: line-through;}

.dialog-footer {padding: 0 10px 10px 0;}

@media screen and (min-width: 1440px) and (max-width: 1599px){
  .list-box li:nth-child(5n) {margin-right: 2.5%;}
}
@media screen and (max-width: 1439px){
  .list-box li:nth-child(5n) {margin-right: 2.5%;}
}
</style>