<template>
  <div class="orderDetail">
    <h1 class="userTitle">订单详情</h1>
    <p class="til">物流信息</p>
    <ul class="form-box" v-if="logisticsData.length <= 0">
      <li>
        <span class="til">暂无物流信息</span>
      </li>
    </ul>
    <ul class="form-box" v-if="logisticsData.length > 0">
      <li>
        <span class="til">物流公司：</span>
        <div class="right-box"><span>{{data.ShippingCompanyName}}</span></div>
      </li>
      <li>
        <span class="til">物流运单：</span>
        <div class="right-box"><span>{{data.ShippingNo}}</span></div>
      </li>
      <li>
        <span class="til">物流跟踪：</span>
        <div class="right-box">
          <ul class="list" :class="{'on': isMore}">
            <li v-for="(item, idx) in logisticsData">{{new Date(item.acceptTime).Format("yyyy-MM-dd hh:mm:ss")}} &nbsp;&nbsp;&nbsp;{{item.remark}}</li>
          </ul>
          <div class="more">
            <span @click="isMore = !isMore">
              <i class="el-icon-d-arrow-right" :class="{'on': isMore}"></i><br>
              <a>{{isMore ? '收起' : '更多'}}</a>
            </span>
          </div>
        </div>
      </li>
    </ul>
    <p class="til">订单信息</p>
    <ul class="form-box">
      <li>
        <span class="til">客户名称：</span>
        <div class="right-box"><span>{{data.ordname}}</span></div>
      </li>
      <li>
        <span class="til">收货地址：</span>
        <div class="right-box"><span>{{data.ordname ? data.ordname + '，' : ''}}{{data.ordtel ? data.ordtel + '，' : ''}}{{data.ordaddress}}</span></div>
      </li>
      <li class="ib">
        <span class="til">运送方式：</span>
        <div class="right-box"><span>快递</span></div>
      </li>
      <li class="ib">
        <span class="til">运费：</span>
        <div class="right-box"><span>{{data.expressprice}}元</span></div>
      </li><br>
      <li class="ib">
        <span class="til">订单编号：</span>
        <div class="right-box"><span>{{data.ordid}}</span></div>
      </li>
      <li class="ib">
        <span class="til">订单状态：</span>
        <div class="right-box"><span>{{data.statename}}</span></div>
      </li>
      <li class="ib" v-if="data.orderdate">
        <span class="til">创建时间：</span>
        <div class="right-box"><span>{{new Date(data.orderdate).Format('yyyy-MM-dd HH:mm:ss')}}</span></div>
      </li>
      <li class="ib" v-if="data.state > 1">
        <span class="til">发货时间：</span>
        <div class="right-box"><span>{{data.FetchTimeStr}}</span></div>
      </li>
      <li class="ib">
        <span class="til" v-if="data.state > 1">付款时间：</span>
        <div class="right-box"><span>{{data.OrderTimeStr}}</span></div>
      </li>
    </ul>
    <table>
      <thead>
        <tr>
          <th>商品</th>
          <th>单价(元)</th>
          <th>数量</th>
          <th>总额(元)</th>
          <th>评论</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in data.listdetail">
          <td class="td1 HVcenter">
            <p v-if="data.Name" style="{width: 100%;}">{{data.Name}}({{data.Spec}})</p>
            <div v-if="!data.Name">
              <div class="img-box">
                <img :src="sApi.picDomain + item.thumbpic" alt="">
              </div>
              <div class="text-box">
                <p>{{item.proname}}</p>
                <!-- <p>形状: 横</p>
                <p>印刷: 单面</p>
                <p>纸张类型: 哑粉纸</p>
                <p>底座颜色: 白色</p> -->
              </div>
            </div>
          </td>
          <td class="td3">{{item.unitprice}}</td>
          <td class="td3">{{item.quantity}}</td>
          <td class="td3">{{item.unitprice * item.quantity}}</td>
          <td class="td5">暂无评论,<a href="javascript:" class="evaluate">去评论</a></td>
        </tr>
      </tbody>
    </table>
    <div class="toBack">
      <span class="btn-main fr" @click="toPay" v-if="data.state == 1">去支付</span>
      <span class="btn-main back fr" @click="$router.go(-1)">返回</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderDetail',
  data () {
    return {
      // state: this._routerRoot._route.query.state,
      data: {},
      logisticsData: [],
      isMore: false,
    }
  },
  methods: {
    search(code) { // 查询
      
    },
    toPay() {
      if(this.data.ordid) {
        let routeData = this.$router.resolve({path: '/pay', query: {ordcode: this.data.ordid}})
        window.open(routeData.href, '_blank')
      }
    }
  },
  watch: {
    data(newVal) {
      if(newVal.ShippingNo != '') {
        this.search(newVal.ShippingNo)
      }
    },
    deep: true
  },
  mounted() {
    this.data = JSON.parse(sessionStorage.getItem('curOrderData'))
    // var data = JSON.parse(decodeURI(this._routerRoot._route.query.row))
    // console.log(data)
    // if(data.CreateTimeStr != undefined) {
    //   data.CreateTimeStr = data.CreateTimeStr.replace(/\.\d*/g, '')
    //   data.FetchTimeStr = data.FetchTimeStr.replace(/\.\d*/g, '')
    //   data.OrderTimeStr = data.OrderTimeStr.replace(/\.\d*/g, '')
    // }
    // this.data = data
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul.form-box {color: #898989; margin-bottom: 40px;}
p.til {font-size: 22px; line-height: 64px; border-bottom: 1px solid #bfbfbf; margin-bottom: 18px; color: #34a88e;}
.form-box li {line-height: 44px; margin-bottom: 0;}
.form-box li .right-box {margin-left: 0;}
.form-box li .til {width: auto;}
.form-box li.ib {display: inline-block; min-width: 200px; margin-right: 70px;}
.form-box li.ib:last-child {margin-right: 0; min-width: auto;}
.form-box li .right-box {min-width: auto;}
.form-box li .right-box ul.list {height: 88px; overflow: hidden;}
.form-box li .right-box ul.list.on {height: auto; overflow: visible;}

.orderDetail table {width: 100%; text-align: center; border: 1px solid #e5e5e5; margin: 60px 0 40px; border-bottom: none; -min-width: 1200px; font-size: 18px;}
.orderDetail table th {text-align: center; height: 54px; min-width: 108px; background: #e5e5e5; border-right: 1px solid #c2c2c2;}
.orderDetail table tbody tr {border-bottom: 1px solid #c2c2c2;}
.orderDetail table td {border-right: 1px solid #c2c2c2; color: #ababab; height: 238px;}
.orderDetail table td > p {padding: 20px 0; }
.orderDetail table td.td1 {-min-width: 530px;}
.orderDetail table td.td5 {width: 150px;}
.orderDetail table td.td5 .evaluate {color: #eea236;}
.orderDetail table th.td6 {border-right: 1px solid #e5e5e5;}
.orderDetail table td.td6 {border-right: none; color: #eea236;}
.orderDetail table td > div > div {display: inline-block; vertical-align: middle; text-align: left;} 
 .orderDetail table td > div > div.img-box {padding-right: 38px;}
.orderDetail table td > div > div.text-box {-padding: 60px 20px 0 0; min-width: 260px; max-width: 300px;} 
.orderDetail table td > div > div.text-box p {line-height: 26px;}

.toBack {height: 60px;}
.toBack .btn-main {width: 100px; height: 40px; line-height: 40px; border-radius: 4px; margin-left: 20px;}
.toBack .btn-main.back {background: #fff; color: #34a88e; border: 1px solid #34a88e;}
div.more {text-align: center;}
div.more span {cursor: pointer;}
div.more span > a {font-size: 14px; position: relative; top: -28px;}
div.more span > i {
  transform:rotate(90deg);
  -ms-transform:rotate(90deg);   /* IE 9 */
  -moz-transform:rotate(90deg);  /* Firefox */
  -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
  -o-transform:rotate(90deg); 
}
div.more span > i.on {
  transform:rotate(-90deg);
  -ms-transform:rotate(-90deg);   /* IE 9 */
  -moz-transform:rotate(-90deg);  /* Firefox */
  -webkit-transform:rotate(-90deg); /* Safari 和 Chrome */
  -o-transform:rotate(-90deg); 
}
div.more span:hover {
  color: #dd3629;
}
</style>