<template>
  <div class="toOrder wrap">
    <h1 class="userTitle">收货人信息</h1>
    <div class="selectAddr">
      <p class="til">
        <span class="left">确认收货地址</span>
        <el-button class="right fr" type="danger" @click="isShowAddBox = true">新增地址</el-button>
      </p>
      <ul class="addrList" v-loading="isLoading">
        <li v-for="(item, idx) in addressList" :class="{'on': curAddrId == item.cid}" @click="curAddrId = item.cid">
          <i class="el-icon-location to-icon" v-if="curAddrId == item.cid">配送至</i>
          <i class="radio" :class="{'on': curAddrId == item.cid}"></i>
          <span class="addrItem">{{item.cprovince}} {{item.ccity}} {{item.cdistrict}} {{item.caddress}} {{'（' + item.cname + ' 收）'}} {{item.phone}} </span>
          <span class="default">{{item.cdefault ? '默认地址' : ''}}</span>
          <span class="edit fr" v-if="curAddrId == item.cid" @click="dialogFormVisible = true">修改</span>
        </li>
      </ul>
      <p class="tip" v-if="addressList.length == 0 && !isLoading">暂无数据</p>
    </div>

    <!-- <h1 class="userTitle">配送方式</h1>
    <div class="freightBox">
      <p>运费：<span class="money">5.00</span> 元 &nbsp;&nbsp;&nbsp; 重量：<span>0.391</span> 千克</p>
      <ul>
        <li v-for="(item, idx) in freightList" @click="curFreightType = idx">
          <i class="radio" :class="{'on': curFreightType == idx}"></i>
          <span>{{item.expname}}</span>
          <span><a :href="item.url" target="_blank">（查看详情）</a></span>
          // <span>{{(item.price).toFixed(2)}}元</span>
          // <span v-if="item.tip">（{{item.tip}}）</span>
        </li>
      </ul>
    </div> -->

    <h1 class="userTitle">购买清单</h1>
    <table>
      <thead>
        <tr>
          <th>商品</th>
          <th>单价(元)</th>
          <th>数量</th>
          <!-- <th>运费</th> -->
          <th>总额(元)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in curCartData">
          <td class="td1">
            <div class="img-box">
              <!-- <img src="/static/bfl-img/orderGoods-01.png" alt=""> -->
              <img :src="sApi.picDomain + item.thumbpic" alt="">
            </div>
            <!-- <div class="text-box">
              <p>哑粉纸横版台历_8寸26页单面</p>
              <p>形状: 横</p>
              <p>印刷: 单面</p>
              <p>纸张类型: 哑粉纸</p>
              <p>底座颜色: 白色</p>
            </div> -->
            <div class="text-box">
              <p>{{item.pcname}}</p>
              <p>印刷: {{item.pagecount}}</p>
              <p>纸张类型: {{item.pcattr.split(',')[0]}}</p>
              <p>底座颜色: {{item.pcattr.split(',')[1]}}</p>
            </div>
          </td>
          <td class="td2">{{item.currprice}}</td>
          <td class="td3">{{item.quantity}}</td>
          <!-- <td class="td4">10</td> -->
          <td class="td5">{{item.quantity * item.currprice}}</td>
        </tr>
      </tbody>
    </table>
    <div class="total-box">
      <p class="total">商品总金额：<span>￥{{goodsTotal}}</span></p>
      <p class="total">运费：<span>￥{{freight}}</span></p>
    </div>
    <div class="btn-box">
      <span class="txt">应付金额：</span>
      <span class="money">￥{{goodsTotal + freight * 1}}</span>
      <a href="javascript:" class="order-btn" @click="toPay">去支付</a>
    </div>
    
    <el-dialog title="编辑收货地址" :visible.sync="dialogFormVisible" width="660px" v-for="(item, idx) in addressList" v-if="curAddrId == item.cid" key="idx">
      <div class="formbox">
        <el-form>
          <el-form-item label="* 所在地区" :label-width="formLabelWidth">
            <el-cascader
              placeholder="试试搜索地址"
              :options="areaData"
              filterable
              @change="areaSelecChange"
              v-model="item.area"
              class="el-inputCSS"
            ></el-cascader>
          </el-form-item>
          <el-form-item class="textarea-box" label="* 详细地址" :label-width="formLabelWidth">
            <el-input
              class="el-inputCSS"
              type="textarea"
              :rows="2"
              placeholder="建议填写详细地址,  街道名称,  门牌号等信息"
              v-model="item.caddress">
            </el-input>
          </el-form-item>
          <el-form-item label="邮编" :label-width="formLabelWidth">
            <el-input class="el-inputCSS" v-model="item.zipcode" placeholder="如不清楚填写000000"></el-input>
          </el-form-item>
          <el-form-item label="* 收货人姓名" :label-width="formLabelWidth">
            <el-input class="el-inputCSS" v-model="item.cname"></el-input>
          </el-form-item>
          <el-form-item label="* 手机号码" :label-width="formLabelWidth">
            <div class="select-box">
              <prePhone :prePhone="'中国大陆+86'" @get-prePhone="dialogMobAreaCode"></prePhone>
            </div>
            <el-input class="el-inputCSS" v-model="item.phone"></el-input>
          </el-form-item>
          <el-form-item label="固定电话" :label-width="formLabelWidth">
            <div class="select-box">
              <prePhone :prePhone="'中国大陆+86'" @get-prePhone="dialogTelAreaCode"></prePhone>
            </div>
            <el-input class="el-inputCSS" v-model="item.mtel"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <input class="checkbox" :class="{'checked': item.cdefault}" id="checkbox" type="checkbox" v-model="item.cdefault"><label id="label" for="checkbox">设为默认收货地址</label>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getEditData(item)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增收货地址" :visible.sync="isShowAddBox" width="660px">
      <div class="formbox">
        <el-form>
          <el-form-item label="* 所在地区" :label-width="formLabelWidth">
            <el-cascader
              class="el-inputCSS"
              placeholder="试试搜索地址"
              :options="areaData"
              filterable
              v-model="addAddr.area"
            ></el-cascader>
          </el-form-item>
          <el-form-item class="textarea-box" label="* 详细地址" :label-width="formLabelWidth">
            <el-input
              class="el-inputCSS"
              type="textarea"
              :rows="2"
              placeholder="建议填写详细地址,  街道名称,  门牌号等信息"
              v-model="addAddr.caddress">
            </el-input>
          </el-form-item>
          <el-form-item label="邮编" :label-width="formLabelWidth">
            <el-input class="el-inputCSS" v-model="addAddr.zipcode" placeholder="如不清楚填写000000"></el-input>
          </el-form-item>
          <el-form-item label="* 收货人姓名" :label-width="formLabelWidth">
            <el-input class="el-inputCSS" v-model="addAddr.cname"></el-input>
          </el-form-item>
          <el-form-item label="* 手机号码" :label-width="formLabelWidth">
            <div class="select-box">
              <prePhone :prePhone="'中国大陆+86'" @get-prePhone="dialogMobAreaCode"></prePhone>
            </div>
            <el-input class="el-inputCSS" v-model="addAddr.phone"></el-input>
          </el-form-item>
          <el-form-item label="固定电话" :label-width="formLabelWidth">
            <div class="select-box">
              <prePhone :prePhone="'中国大陆+86'" @get-prePhone="dialogTelAreaCode"></prePhone>
            </div>
            <el-input class="el-inputCSS" v-model="addAddr.mtel"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <input class="checkbox" :class="{'checked': addAddr.cdefault}" id="checkbox" type="checkbox" v-model="addAddr.cdefault"><label id="label" for="checkbox">设为默认收货地址</label>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddBox = false">取 消</el-button>
        <el-button type="primary" @click="toAddAddr">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import prePhone from '@/components/prePhone'

export default {
  name: 'toOrder',
  components: {
    prePhone
  },
  created() {
    this.getAddr()
    this.getExp()
    this.curCartData = JSON.parse(sessionStorage.getItem('curCartData'))
  },
  data () {
    return {
      isLoading: false,
      addressList: [], // 收货地址
      curAddrId: 0,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // placeholders: ['请选择省份', '请选择城市', '请选择地区', '请选择街道'],
      curFreightType: 0, // 运费种类
      freightList: [
        {
          name: '韵达',
          price: 5,
          tip: '性价比高, 送货速度较快',
        }, {
          name: 'EMS',
          price: 20,
          tip: '如果地址中涉及村、乡、镇可选此快递, 由于是工厂转发, 速度会有所延迟',
        }, {
          name: '顺丰',
          price: 12,
          tip: '',
        }, 
      ],
      isShowAddBox: false, // 是否显示新增地址
      addAddr: {
        area: [],
        caddress: '',
        zipcode: '',
        cname: '',
        phone: '',
        mtel: '',
        cdefault: '',
      },
      curCartData: '', // 购买清单
      // freight: 10, // 运费
      areaData: [],
      curExpId: 0, // 快递编号
    }
  },
  computed: {
    goodsTotal() {
      let m = 0
      this.curCartData.forEach(item=> {
        m += item.quantity * item.currprice
      })
      return m
    },
    freight() {
      let n = 0
      // console.log(this.curAddrId ,this.curExpId)
      if(this.curAddrId && this.curExpId) {
        this.$axios.get(this.sApi.userworks + '?t=exp&cid=' + this.curAddrId + '&expid=' + this.curExpId + '&weight=0').then(response => {
          let res = response.data
          // console.log(res)
        })
      }
      return n
    }
  },
  watch: {
    isShowAddBox(newVal) {
      if(newVal) this.getQCDA()
    },
    'addAddr.area': function(newVal) {
      console.log(newVal)
    },
    dialogFormVisible(newVal) {
      if(newVal) this.getQCDA()
    }
  },
  methods: {
    areaSelecChange(data) {
      $('.area-select .area-selected-trigger').css('color', '#333')
      // console.log(data)
    },
    dialogMobAreaCode(val) {
      // this.addressList.phone.mobile.areaCode = val
    },
    dialogTelAreaCode(val) {
      // this.addressList.phone.tel.areaCode = val
    },
    getAddr() {
      this.isLoading = true
      this.$axios.get(this.sApi.userinfo + '?t=address&vipno=' + JSON.parse(this.getCookie('userInfo')).vipno).then((response)=> {
        this.isLoading = false
        let res = response.data
        if(res.type == 1) {
          this.addressList = res.data
          let arr = this.addressList.map((item, idx)=> {
            item.area = [item.cprovince, item.ccity, item.cdistrict]
            return item
          })
          this.addressList = arr
          this.curAddrId = this.addressList[0].cid
        }
      }).catch(err=> {
        this.isLoading = false
      })
    },
    getExp() {
      this.$axios.get(this.sApi.userworks + '?t=exp').then(response => {
        let res = response.data
        this.freightList = res.data
        this.curExpId = this.freightList[0].id
      })
    },
    getEditData(data) {
      this.dialogFormVisible = false
      console.log(data)
      // 默认地址遍历....
    },
    toAddAddr() {
      console.log(this.addAddr)
      if(this.addressList.length > 20) {
        this.$alert('添加地址不能超过20条哦, 请先清理地址!', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
        })
      } else {
        if(this.addAddr.area.length > 0 && this.addAddr.caddress && this.addAddr.cname != '' && (this.addAddr.phone || this.addAddr.mtel)) {
          var data = {
            "VIPNO": JSON.parse(this.getCookie('userInfo')).vipno,
            "CName": this.addAddr.cname, 
            "CProvince": this.addAddr.area[0], // 省
            "CCity": this.addAddr.area[1], // 市
            "CDistrict": this.addAddr.area[2], // 县区
            "CAddress": this.addAddr.caddress, // 详细信息 
            "ZipCode": this.addAddr.zipcode, // 邮编,可为空
            "Phone": this.addAddr.phone, // 手机 
            "CRemark": "", // 备注 
            "CDefault": this.addAddr.cdefault * 1, // 1默认地址/0否, 
            "MTel": this.addAddr.mtel, // 固话
          }
          this.$axios.post(this.sApi.userinfo + '?t=addressadd', data).then((response)=> {
            let res = response.data
            if(res.type == 1) {
              this.isShowAddBox = false
              this.$message({
                type: 'success',
                message: '地址添加成功'
              });  
              this.getAddr()
            }
          })
        } else {
          this.toSaveErr = '带 * 的为必填项'
        }
      }
    },
    getQCDA() {
      this.$axios.get(this.sApi.util + '?t=city').then(response => {
        let res = response.data
        if(res.type == 1) this.areaData = res.data
      })
    },
    toPay(e) {
      let curAdd = {}
      this.addressList.forEach(item=> {
        if(item.cid == this.curAddrId) curAdd = item
      })
      var data = {
        "exptype": '1', // 快递方式编号 
        "expprice": (this.freight + 10) + '', // 运费(>0)
        "oprice": this.goodsTotal + '', // 所有产品金额,不包含运费 
        "addressid": this.curAddrId + '', // 地址编号 
        "desc": '', // 备注 
        "invoice": '', // 有抬头则认为需要开票 
        "uwids": [], // 
        "coupon": [{code: ''}], // 优惠券编号,暂不使用
      }
      this.curCartData.forEach(item=> {
        data.uwids.push({
          cartid: item.cdid + '', //--购物车作品编号
          num: item.quantity + '' //--订购数量
        })
      })
      this.$axios.post(this.sApi.orders + '?t=create&c=' + curAdd.ccity + '&p=' + curAdd.cprovince + '&expid=1&weight=0', data).then(response => {
        // console.log(response)
        let res = response.data
        if(res.type == 1) {
          let routeData = this.$router.resolve({path: '/pay', query: {ordcode: res.data}})
          window.open(routeData.href, '_blank')
        }
      })
    }
  },
  mounted() {
    /*this.$axios.get(this.sApi.userworks + '?t=exp&c=' + this.addressList[this.curAddrId].ccity + '&p=' + this.addressList[this.curAddrId].cprovince + '&expid=快递编号&weight=产品重量').then(response => {
      console.log(response)
      let res = response.data
    })*/
    
    // console.log(this.addrList[0].area.join(' '))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.userTitle {margin-bottom: 30px;}
.selectAddr {margin-bottom: 90px;}
.selectAddr .til {-border-bottom: 1px solid #eee; font-size: 18px; line-height: 60px; position: relative;}
.selectAddr .addrList {margin: 16px 0; min-height: 30px;}
.selectAddr .addrList li {height: 40px; line-height: 40px; padding: 0 10px 0 90px; border: 1px solid transparent; color: #666; position: relative;}
.selectAddr .addrList li.on {border-color: #e5e5e5; background: #e5e5e5; font-weight: bold;}
.radio {display: inline-block; width: 12px; height: 12px; border: 1px solid #aaa; border-radius: 50%; background: #ddd;}
.radio.on {background: radial-gradient(#666 2px, #ddd 3px, #ddd 12px);}
.selectAddr .addrList li .default {color: #dd3629; margin-left: 10px;}
.selectAddr .addrList li .edit {color: #fa821d; cursor: pointer; border: }
.selectAddr .addrList li .to-icon {position: absolute; left: 8px; line-height: 40px; color: #ff4001; font-weight: bold;}

.toOrder table {width: 100%; text-align: center; border: 1px solid #e5e5e5; margin: 60px 0 40px; border-bottom-color: transparent;;}
.toOrder table tbody tr {border-bottom: 1px solid #e5e5e5;}
.toOrder table th {text-align: center; height: 54px; min-width: 108px; background: #e5e5e5; border-right: 1px solid #c2c2c2;}
.toOrder table td.td1 {min-width: 500px;}
.toOrder table td.td5 {width: 150px;}
.toOrder table td.td5 .evaluate {color: #eea236;}
.toOrder table th.td6 {border-right: 1px solid #e5e5e5;}
.toOrder table td {border-right: 1px solid #c2c2c2; color: #ababab;}
.toOrder table td.td6 {border-right: none; color: #eea236;}
.toOrder table td > div {display: inline-block; vertical-align: top; text-align: left;} 
.toOrder table td > div.img-box {padding: 15px 18px 6px 13px;}
.toOrder table td > div.text-box {padding: 30px 0 0 0; min-width: 260px; max-width: 300px;} 
.toOrder table td > div.text-box p {line-height: 26px;}

.total-box {text-align: right; margin: 60px 0;}
.total-box p {font-size: 18px; line-height: 36px;}
.total-box p span {color: #fa821d;}
.btn-box {height: 80px; line-height: 80px; background: #e5e5e5; text-align: right; margin-bottom: 22px;}
.btn-box span {font-size: 18px;}
.money {color: #fa821d;}
.btn-box .order-btn {display: inline-block; width: 170px; background: #fa821d; color: #fff; text-align: center; font-size: 24px; margin-left: 40px; cursor: pointer;}

.freightBox {margin: 20px 0 40px; line-height: 40px; color: #666;}
.freightBox i {margin-right: 10px;}
.freightBox li {cursor: pointer;}
.freightBox li:hover {font-weight: bold;}
.freightBox li a:hover {color: #fa821d;}

.tip {text-align: center;}
.formbox {padding-top: 20px;}
.select-box {height: 42px; width: 167px;}
.textarea-box {width: 606px;}
.el-inputCSS {width: 220px; vertical-align: top;}
</style>