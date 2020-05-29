<template>
  <div class="orderList">
    <h1 class="userTitle">订单查询</h1>
    <div class="search-box">
      <div class="inputCSS-box">
        <span class="til">订单号：</span><!-- 
         --><el-input class="inputCSS" style="width: 150px;" v-model="orderCode"></el-input>
      </div>
      <div class="inputCSS-box">
        <span class="til">订单状态：</span><!-- 
         --><el-select class="orderstate" v-model="orderstate" placeholder="请选择" size="medium">
          <el-option
            v-for="item in orderstateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="inputCSS-box">
        <span class="til">日期：</span><!-- 
         --><el-date-picker
          class="inputCSS orderTime"
          v-model="begintime"
          type="date"
          placeholder="选择日期"
          style="width: 150px;"
          :picker-options="pickerOptions1">
        </el-date-picker>
        至
        <el-date-picker
          class="inputCSS orderTime"
          v-model="endtime"
          type="date"
          placeholder="选择日期"
          style="width: 150px;"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <span class="btn" @click="search">查询</span>
    </div>
    <div class="tag">
      <!-- <img src="/static/zz-img/icon/tip.svg" alt="">
      <span>小贴士： 双击某行进入订单详情</span> -->
      <p class="fr">
        设置：每页显示&nbsp;
        <input type="text" v-model="pageSize">
        &nbsp;条数据
      </p>
    </div>
    <table class="orderListTable">
      <thead>
        <tr>
          <th></th>
          <th style="text-align: left; padding-left: 50px;">商品名</th>
          <th>价钱</th>
          <th>数量</th>
          <th>订单状态</th>
          <!-- <th>收件人</th> -->
          <th>操作</th>
        </tr>
      </thead>
      <!-- <tr class="top">
        <td colspan="7" style="background: #fff;">
          <div class="checkbox-box" @click="checkedAll">
            <i :class="{'el-icon-check': isCheckedAll}" style="top: -1px;"></i>
            <input id="checkbox" type="checkbox" class="checkbox checkedAll">
            <label id="label" for="checkbox">全选</label>
          </div>
        </td>
      </tr> -->
      <tbody v-if="orderList.length" v-for="(item, idx) in orderList">
        <tr class="top">
          <td colspan="7">
            <div class="checkbox-box" @click="toggleCheck">
              <i></i>
              <input type="checkbox" class="checkbox">
            </div>
            <span class="time">{{new Date(item.orderdate).Format('yyyy-MM-dd HH:mm:ss')}}</span>
            <span>订单号：{{item.ordid}}</span>
            <!-- 删除订单 -->
            <!-- <span class="del fr"><i class="el-icon-delete"></i></span> -->
          </td>
        </tr>
        <tr v-if="item.listdetail.length" class="btm" v-for="pitem in item.listdetail">
          <td></td>
          <td style="text-align: left;">
            <div class="img-box" :style="'background-image: url(' + sApi.picDomain + pitem.thumbpic + ')'"></div>
            <span>{{pitem.proname}}</span>
          </td>
          <td>￥{{pitem.unitprice}}</td>
          <td>{{pitem.quantity}}</td>
          <td>{{item.statename}}</td>
          <!-- <td>{{item.ordname}}</td> -->
          <td>
            <!-- <router-link to="/user/orderDetail" class="btn-red">查看</router-link> -->
            <a href="javascript:" class="btn-red" @click="toDetail(item)">查看</a>
          </td>
        </tr>
        <tr class="line" v-if="idx < 2">
          <td colspan="7"></td>
        </tr>
      </tbody>
    </table>
    <p class="tip" v-if="!orderList.length && !dialogTableVisible">无数据</p>

    <!-- <p class="moreData" v-if="isMore" @click="dataPageSize+=50" title="加载更多">
      <i class="el-icon-arrow-down"></i>
      <i class="el-icon-arrow-down"></i>
    </p> -->
    <!-- 分页栏 -->
    <div class="paging-box fr" v-if="orderList.length">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :total="orderList[0].totalcount">
        <!-- :total="total"> -->
      </el-pagination>
    </div>
    <!-- 正在加载 -->
    <el-dialog class="loadingDialog" :show-close='false' :visible.sync="dialogTableVisible">
      <div class="loading-box">
        <i class="el-icon-loading"></i><br>
        <span>loading...</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'orderList',
  /*created() {
    // this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"))
    this.userInfo = JSON.parse(this.getCookie("userInfo"))
    // console.log(JSON.stringify(this.userInfo))
    this.orderstateOptions = this.userInfo.ShopList.map(item => {
      return {value: item.factoryShopId, label: item.name}
    })
  },*/
  created() {
    this.getState()
  },
  data () {
    return {
      pageSize: 8,
      pageIndex: 1,
      userInfo: '',
      begintime: new Date().getTime() - 3600 * 1000 * 24 * 6,
      endtime: new Date(), // 下单时间 (默认一周)
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      orderCode: '', // 订单号
      orderstate: '', // 生产状态
      orderstateOptions: [],
      orderList: [],
      // token: window.sessionStorage.getItem("token"),
      // token: this.getCookie("zzToken"),
      token: '',
      dialogTableVisible: false,
      oldpageIndex: 1,
      isCheckedAll: false, // 是否全选
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    total() {
      return this.orderList.length
    },
    isMore() {
      var result = (this.pageIndex == Math.ceil(this.orderList.length / this.pageSize) && this.orderList.length >= this.pageSize)
      if(this.orderList.length < this.dataPageSize) {
        result = false
      }
      return result
    }
  },
  watch: {
    dataPageSize(newVal) {
      if(newVal > 50) {
        this.search()
      }
    },
    pageSize(newVal) {
      this.pageSize = newVal*1
    },
    pageIndex(newVal, oldVal) {
      this.oldpageIndex = oldVal
    },
    orderstate(newVal) {
      if(newVal) this.search()
    },
    deep: true
  },
  methods: {
    handleCurrentChange(val) { // 当前页
      this.pageIndex = val
      this.search()
    },
    tableRowClassName({row, rowIndex}) { // 添加行颜色
      /*if (row.CurrTechName == '已发货') {
        return 'success-row';
      }
      return '';*/
    },
    indexMethod(idx) { // 序号
      return idx+1 + ((this.pageIndex - 1) * this.pageSize)
    },
    checkedAll(e) {
      var inputs = $('input.checkbox:not(.checkedAll)')
      this.isCheckedAll = !this.isCheckedAll
      if(this.isCheckedAll) {
        inputs.addClass('checked')
        inputs.prev().addClass('el-icon-check')
      } else {
        inputs.removeClass('checked')
        inputs.prev().removeClass('el-icon-check')
      }
    },
    toggleCheck(e) {
      var input = $(e.target)
      var inputs = $('input.checkbox:not(.checkedAll)')
      var ckeckNum = 0
      input.toggleClass('checked')
      input.prev().toggleClass('el-icon-check')
      inputs.each((idx, item)=> {
        if($(item).hasClass('checked')) ckeckNum++
      })
      this.isCheckedAll = ckeckNum == inputs.length ? true : false
    },
    getState() {
      this.orderstateOptions = []
      this.$axios.get(this.sApi.orders + '?t=ostate').then((response)=> {
        var res = response.data
        if(res.type == 1) {
          res.data.forEach((i, v)=> {
            var o = {
              value: i.staid,
              label: i.ordstate
            }
            this.orderstateOptions.push(o)
          })
          this.orderstate = this.orderstateOptions[0].value // value
        }
      })
    },
    search() { // 查询
      if(this.orderstate != '') {
        this.dialogTableVisible = true
        var data = {
          "vipno": JSON.parse(this.getCookie('userInfo')).vipno, //--用户编号
          "pagesize": this.pageSize,
          "pageindex": this.pageIndex,
          "key": this.orderCode, // 订单号
          "begin": new Date(this.begintime).Format("yyyy-MM-dd") + 'T00:00:00', // 开始时间
          "end": new Date(this.endtime).Format("yyyy-MM-dd") + 'T00:00:00', // 结束时间
          "OrderState": this.orderstate + '', // 订单状态
        }
        // console.log(data)
        this.$axios.post(this.sApi.orders + '?t=orders', data).then((response)=> {
          this.dialogTableVisible = false
          var res = response.data
          if(res.type == 1) {
            this.orderList = res.data
          }
        }).catch((error)=> {
          this.dialogTableVisible = false
        })
      }
    },
    filterState(value, row) { // 筛选
      return row.CurrTechName === value;
    },
    toDetail(row) {
      sessionStorage.setItem('curOrderData', JSON.stringify(row))
      // this.$router.push({path: '/user/orderDetail', query: {row: encodeURI(JSON.stringify(row))}})
      let routeData = this.$router.resolve({path: '/user/orderDetail'})
      window.open(routeData.href, '_blank')
    },
  },
  mounted() {
    /*if(this.orderList.length<=0) {
      this.search()
    }*/
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.orderList {color: #666; font-size: 18px; margin-bottom: 130px;}
.userTitle {margin-bottom: 30px;}
.search-box {line-height: 46px; position: relative; margin-bottom: 20px;}
div.tag {font-size: 14px; line-height: 35px;}
div.tag img {font-size: 14px; vertical-align: middle;}
div.tag input {width: 50px; line-height: 14px; text-align: center; border: 1px solid #888;}
.inputCSS-box {display: inline-block; margin-right: 15px;}
.inputCSS {width: 200px; padding: 0;}
.btn {display: inline-block; background: #34a88e; color: #fff; width: 100px; height: 36px; line-height: 36px; text-align: center; border-radius: 4px;}
.orderstate {width: 120px; min-height: 38px; line-height: 38px;}
.tip {text-align: center;}

.orderListTable {width: 100%; text-align: center; margin-bottom: 100px;}
.orderListTable tr th {background: #f6f6f6; line-height: 50px;}
.orderListTable tr td {line-height: 130px; height: 134px;}
.orderListTable tr td .img-box {width: 116px; height: 104px; display: inline-block; margin-left: 15px; vertical-align: top; background: no-repeat center / cover; vertical-align: middle;}
.orderListTable tr.top td {height: 60px; line-height: 60px; text-align: left; background: #e9f7f3; padding: 0 30px 0 12px;}
.orderListTable tr.top td div.checkbox-box input.checkbox, 
.orderListTable tr.top td div.checkbox-box i {top: 3px;}
.orderListTable tr.top td > span {margin-left: 20px;}
.orderListTable tr.top td > span.time {margin-left: 30px;}
.orderListTable tr.top td > span.del {font-size: 22px; cursor: pointer;}
.btn-red,
.orderListTable tr.top td > span.del:hover {color: #f9ac7d;}
.orderListTable tr.line td {height: 28px; border-top: 1px solid #d8d8d8;}
/*.orderListTable tr.btm td {border-bottom: 1px solid #d8d8d8;}*/
</style>
