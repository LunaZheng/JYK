<template>
  <div class="cart wrap">
    <logo></logo>
    <h1 class="til"><span>所有商品</span></h1>
    <el-row class="ul til">
      <el-col :span="4">
        <div class="li li-left">
          <div class="checkbox-box" @click="checkedAll">
            <i :class="{'el-icon-check': isCheckedAll}"></i>
            <input id="checkbox" type="checkbox" class="checkbox checkedAll">
            <label id="label" for="checkbox">全选</label>
          </div>
        </div>
      </el-col>
      <el-col :span="9"><div class="li li-left">商品信息</div></el-col>
      <el-col :span="3"><div class="li">价格</div></el-col>
      <el-col :span="3"><div class="li">数量</div></el-col>
      <el-col :span="3"><div class="li">金额</div></el-col>
      <el-col :span="2"><div class="li">操作</div></el-col>
    </el-row>
    <ul class="table-box">
      <li v-for="(item, idx) in cartList">
        <el-row class="ul cartList">
          <el-col :span="4">
            <div class="li li-left li-1">
              <div class="select-box">
                <div class="checkbox-box" @click="toggleCheck">
                  <i></i>
                  <input type="checkbox" class="checkbox">
                </div>
                <div v-if="item.thumbpic" class="img-box" :style="'background-image: url(' + sApi.picDomain + item.thumbpic + ')'"></div>
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="li li-left">
              <div class="info-box">
                <p>{{item.pcname}}</p>
                <span class="tag">7寸</span>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="li">
              <div>
                <p class="oldPrice" v-if="item.oriprice < item.currprice">原价￥{{item.oriprice}}</p>
                <p class="newPrice">
                  <span v-if="item.oriprice < item.currprice">现价</span><span>￥{{item.currprice}}</span>
                </p>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="li">
              <div class="num-box" @click="numEdit(idx, $event)">
                <div class="btn-minus">-</div>
                <input type="text" name="" id="" class="num" v-model="item.quantity">
                <div class="btn-add">+</div>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="li">
              <div class="user-box">
                <span class="priceColor">￥{{item.quantity * item.currprice}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="li">
              <i class="el-icon-delete btn-do" @click="toDel(item.cdid)"></i>
            </div>
          </el-col>
        </el-row>
      </li>
    </ul>
    <div class="toOrder-box">
      <div class="checkbox-box" @click="checkedAll">
        <i :class="{'el-icon-check': isCheckedAll}"></i>
        <input id="checkbox2" type="checkbox" class="checkbox checkedAll">
        <label id="label" for="checkbox2">全选</label>
      </div>
      <a href="javascript:" class="delelet" @click="toDel('all')">删除</a>
      <div class="fr">
        已选商品 <span class="totalPrice">{{totalNum}}</span> 件
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        合计 : <span class="totalPrice">{{totalPrice}}</span>
        <!-- <router-link to="/toOrder" class="toOrder">结算</router-link> -->
        <span class="toOrder" :class="{'on': toOrderList.length}" @click="toOrder">结算</span>
      </div>
    </div>

    <vueFooter>
      <div slot="medal" class="medal">
        <div class="wrap">
          <img src="/static/bfl-img/footer.png" alt="">
        </div>
      </div>
    </vueFooter>
    
    <!-- <el-dialog class="myDialog" :show-close='false' :visible.sync="dialogTableVisible">
      <img class="maskImg" :src="maskImg" alt="">
    </el-dialog> -->

    <!-- 正在加载 -->
    <el-dialog class="loadingDialog" :show-close='false' :visible.sync="isLoading">
      <div class="loading-box">
        <i class="el-icon-loading"></i><br>
        <span>loading...</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logo from '@/components/logo'
import vueFooter from '@/components/vueFooter'

export default {
  name: 'cart',
  components: {
    logo,
    vueFooter,
  },
  computed: {
    username() {
      return this.$store.state.user
    },
    totalNum() {
      let num = 0
      if(this.toOrderList.length) {
        this.toOrderList.forEach(item=> num+=item.quantity)
      }
      return num
    },
    totalPrice() {
      let num = 0
      if(this.toOrderList.length) {
        this.toOrderList.forEach(item=> num+=(item.currprice * item.quantity))
      }
      return num
    }
  },
  data () {
    return {
      isCheckedAll: false,
      cartList: [],
      isLoading: false,
      toOrderList: [], // 当前要结算的数据
      curIdxs: [],
    }
  },
  /*watch: {
    deep: true
  },*/
  methods: {
    getCartData() {
      this.isLoading = true
      this.$axios.get(this.sApi.userworks + '?t=cart&vipno=' + JSON.parse(this.getCookie('userInfo')).vipno).then(response => {
        this.isLoading = false
        let res = response.data
        if(res.type == 1) {
          this.cartList = res.data
        }
      }).catch(err=> {
        this.isLoading = false
      })
    },
    toFavorite(id) {
      this.$message({
        showClose: true,
        message: id + '成功移入收藏夹！',
        type: 'success'
      })
    },
    toDel(id) {
      // console.log(id)
      if(id == 'all') {

      } else if(id == '') {
        this.$alert('请选择宝贝', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            })
          }
        })
      } else {
        this.$confirm('确认要删除该宝贝吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(this.sApi.userworks + '?t=cartdel&vipno=' + JSON.parse(this.getCookie('userInfo')).vipno + '&cdid=' + id).then(response => {
            // console.log(response)
            let res = response.data
            if(res.type == 1) {
              this.getCartData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })          
        })
      }
    },
    checkedAll(e) {
      var inputs = $('input.checkbox:not(.checkedAll)')
      this.isCheckedAll = !this.isCheckedAll
      if(this.isCheckedAll) {
        inputs.addClass('checked')
        inputs.prev().addClass('el-icon-check')
        this.toOrderList = this.cartList
      } else {
        inputs.removeClass('checked')
        inputs.prev().removeClass('el-icon-check')
        this.toOrderList = []
      }
    },
    toggleCheck(e) {
      var input = $(e.target)
      var inputs = $('input.checkbox:not(.checkedAll)')
      var ckeckNum = 0
      input.toggleClass('checked')
      input.prev().toggleClass('el-icon-check')
      this.toOrderList = []
      inputs.each((idx, item)=> {
        if($(item).hasClass('checked')) {
          ckeckNum++
          this.toOrderList.push(this.cartList[$(item).closest('li').index()])
        }
      })
      this.isCheckedAll = ckeckNum == inputs.length ? true : false
      // console.log(inputs)
    },
    getCheckedItem() {
      var inputs = $('input.checkbox:not(.checkedAll)')
      var ckeckNum = 0
      this.toOrderList = []
      inputs.each((idx, item)=> {
        if($(item).hasClass('checked')) {
          ckeckNum++
          this.toOrderList.push(this.cartList[$(item).closest('li').index()])
        }
      })
    },
    numEdit(idx, e) {
      var text = e.target.innerText
      let item = this.cartList[idx]
      if(item.quantity < 1 ) {
        item.quantity = 1
      } else {
        if(text == '+') {
          item.quantity = item.quantity*1+1
        } else if(text == '-') {
          if(item.quantity <= 1) {
            return
          }
          item.quantity -= 1
        }
      }
    },
    toOrder() {
      /*this.toOrderList = []
      let inputs = $('input.checkbox.checked:not(.checkedAll)')
      ;[].slice.call(inputs).forEach(item=> {
        let idx = $(item).closest('li').index()
        this.toOrderList.push(this.cartList[idx])
      })*/
      sessionStorage.setItem('curCartData', JSON.stringify(this.toOrderList))
      if(this.toOrderList.length) this.$router.push({path: '/toOrder'})
    }
  },
  mounted() {
    this.getCartData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cart {font-size: 18px;}
h1.til {border-bottom: 1px solid #c2c2c2;}
h1.til span {display: inline-block; font-size: 22px; padding: 12px 20px 14px 5px; color: #34a88e; border-bottom: 1px solid #34a88e; margin-bottom: -1px;}

.ul .li {text-align: center;}
.ul .li-left {text-align: left;}
.til .li {height: 80px; line-height: 80px;}
.table-box {margin-bottom: 60px;}
.table-box > li {background: #fafafa; margin-bottom: 30px;}
.cartList {height: 132px;}
.cartList .li {height: 132px; display: flex; align-items: center; justify-content: center;}
.cartList .li .oldPrice {text-decoration: line-through; color: #a5a8a7;}
.cartList .li .newPrice > span {color: #fb811f;}
.cartList .li-1 {padding-left: 10px;}
.cartList .li.li-left {justify-content: left;}
.cartList .li .img-box {width: 116px; height: 104px; display: inline-block; margin-left: 30px; vertical-align: top; background: no-repeat center / cover;}
.cartList .li .info-box {text-align: left; color: #9da09f; font-size: 16px;}
.cartList .li .info-box p { width: 400px; white-space: pre-wrap;}
.cartList .li .info-box span {display: inline-block; margin-top: 10px; color: #999;}
.cartList .li .num-box {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.cartList .li .num-box > input {display: inline-block; width: 46px; height: 28px; vertical-align: top; background: #fff; border: none; text-align: center; font-size: 14px;}
.cartList .li .num-box > div {-width: 31px; -line-height: 38px; width: 24px; line-height: 28px; background: #f0f0f0; display: inline-block; height: 28px; cursor: pointer;}
.cartList .li .num-box > div:hover {background: #d0d0d0;}
.cartList .li .num-box > div.btn-minus {margin-right: -5px; border-right: 2px solid #b4b4b4;}
.cartList .li .num-box > div.btn-add {margin-left: -5px; border-left: 2px solid #b4b4b4;}
.cartList .li .btn-do {display: inline-block; font-size: 26px; color: #989b9a;}
.cartList .li .btn-do:hover {color: red;}
.cartList .li .btn-do.on {color: red;} 


.priceColor {color: #fb811f;}

.toOrder-box {height: 80px; line-height: 80px; background: #e5e5e5; font-size: 18px; padding-left: 22px;}
.toOrder-box .delelet {padding-left: 22px;}
.toOrder-box .delelet:hover {color: red;}
.toOrder-box .totalPrice {color: #fa821d;}
.toOrder-box .toOrder {display: inline-block; width: 170px; background: #c9c9c9; color: #fff; text-align: center; font-size: 24px; margin-left: 60px;}
.toOrder-box .toOrder.on {background: #34a88e;}
.toOrder-box input.checkbox:before {background-color: #e5e5e5; border: 1px solid #999;}
.toOrder-box input.checkbox.checked:before {background-color: #e5e5e5; border-color: transparent;}

/*.cartList .li input.checkbox {left: 20px;}*/
.cartList .li input.checkbox:before {top: 0;}
/* input.checkbox:before {height: 20px; width: 20px;} */
input.checkbox.checked ~ label {color: #000;}


</style>