<template>
  <div class="pay wrap">
    <h1 class="userTitle">支付详情</h1>
    <ul class="form-box">
      <li>
        <span class="til">订单编号：</span>
        <div class="right-box">{{$route.query.ordcode}}</div>
      </li>
      <li class="avatar-box">
        <span class="til">收件人：</span>
        <div class="right-box" v-if="orderData">{{orderData.ordname}}</div>
      </li>
      <li>
        <span class="til">电话：</span>
        <div class="right-box" v-if="orderData">{{orderData.ordtel}}</div>
      </li>
      <li>
        <span class="til">地址：</span>
        <div class="right-box" v-if="orderData">{{orderData.ordaddress}}</div>
      </li>
      <li>
        <span class="til">应付金额：</span>
        <div class="right-box"><span class="moneyColor" v-if="orderData">￥{{orderData.totalprice/100.0}}</span></div>
      </li>
    </ul>
    <h1 class="userTitle">付款方式</h1>
    <el-tabs class="pay-tab" v-model="payWayId" type="card" @tab-click="handleClick">
      <el-tab-pane label="支付宝" name="1">
        <div class="tab-item" @click="payWayId = '1'">
          <i class="radio" :class="{'on': payWayId == '1'}"></i>
          <!-- <img src="/static/bfl-img/erweima.png" alt=""> -->
          <img src="/static/bfl-img/zhifubao.png" alt="">
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="微信" name="2">
        <div class="tab-item" @click="payWayId = '2'">
          <i class="radio" :class="{'on': payWayId == '2'}"></i>
          <img src="/static/bfl-img/erweima.png" alt="">
        </div>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="账户余额" name="3">
        <div class="tab-item" @click="payWayId = '4'">
          <p>您当前账户余额： <span class="moneyColor">999元</span></p>
        </div>
      </el-tab-pane> -->
    </el-tabs>
    <div class="pay-btn-box fr">
      <p>应付金额
        <span class="moneyColor" v-if="orderData">{{orderData.totalprice/100.0}}元</span>
        <span class="pay-btn" @click="pay"><i class="el-icon-loading" v-if='isPaying'></i>{{isPaying ? '正在跳转...' : '确认支付'}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pay',
  created() {
    this.search()
  },
  data () {
    return {
      payWayId: '1',
      orderData: '',
      isPaying: false,
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    search() { // 查询
      var data = {
        "vipno": JSON.parse(this.getCookie('userInfo')).vipno, //--用户编号
        "pagesize": 8,
        "pageindex": 0,
        "key": this.$route.query.ordcode, // 订单号
        "begin": '', // 开始时间
        "end": '', // 结束时间
        "OrderState": -1, // 订单状态
      }

      this.$axios.post(this.sApi.orders + '?t=orders', data).then((response)=> {
        this.dialogTableVisible = false
        var res = response.data
        if(res.type == 1) {
          this.orderData = res.data[0]
        }
      })
    },
    pay() {
      if(!this.isPaying && this.$route.query.ordcode) {
        this.isPaying = true
        this.$axios.post(this.sApi.orders + '?t=pay&ordid=' + this.$route.query.ordcode + '&type=1').then(response => {
          let res = response.data
          if(res.type == 1) {
            const div = document.createElement('div')        
            $(div).css('display', 'none')      
            div.innerHTML = res.data      
            document.body.appendChild(div)
            document.forms[0].submit();
          }
        }).catch(err=> {
          this.isPaying = false
        })
      }
    }
  },
  mounted() {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pay {font-size: 18px; color: #666;}
.userTitle {margin-bottom: 30px;}
.pay-tab,
.form-box {margin-bottom: 30px;}
.form-box li {margin-bottom: 10px;}
.moneyColor {color: #fa821d;}
.form-box li .right-box {margin-left: 0;}
/*.tab-item {height: 160px;}*/
.tab-item img {vertical-align: middle;}
.pay-btn-box .pay-btn {display: inline-block; width: 160px; height: 60px; line-height: 60px; background: #fa821d; text-align: center; color: #fff; font-size: 22px; margin: 20px 0 80px 30px; cursor: pointer;}

.radio {display: inline-block; width: 12px; height: 12px; border: 1px solid #aaa; border-radius: 50%; background: #ddd;}
.radio.on {background: radial-gradient(#666 2px, #ddd 3px, #ddd 12px);}
</style>