<template>
  <div class="addAddress">
    <h1 class="userTitle">收货地址</h1>
    <p>新增收货地址</p>
    <ul class="addrForm">
      <li>
        <span><i style="color: red">* </i>所在地区</span>
        <el-cascader
          class="inputCSS"
          placeholder="试试搜索地址"
          :options="areaData"
          filterable
          v-model="areaSelected"
          style="width: 276px"
        ></el-cascader>
      </li>
      <li>
        <span><i style="color: red">* </i>详细地址</span>
        <textarea name="addressDetail" class="addressDetail" id="" rows="2" placeholder="建议填写详细地址,  街道名称,  门牌号等信息" v-model="addressDetail"></textarea>
      </li>
      <li>
        <span>邮编</span>
        <input type="num" class="inputCSS" placeholder="如不清楚填写000000" v-model="postcode">
      </li>
      <li>
        <span><i style="color: red">* </i>收货人姓名</span>
        <input type="text" class="inputCSS" v-model="consigneeName">
      </li>
      <li>
        <span><i style="color: red">* </i>手机号码</span>
        <div class="select-box">
          <div class="select-box">
            <prePhone :prePhone="mobile.areaCode" @get-prePhone="mobileAreaCode"></prePhone>
          </div>
        </div>
        <input type="text" class="inputCSS" v-model="mobile.num">
      </li>
      <li>
        <span>固定电话</span>
        <div class="select-box">
          <div class="select-box">
            <prePhone :prePhone="tel.areaCode" @get-prePhone="telAreaCode"></prePhone>
          </div>
        </div>
        <input type="text" class="inputCSS" v-model="tel.num">
      </li>
      <li>
        <input class="checkbox" :class="{'checked': isDefaultAddr}" id="checkbox" type="checkbox" v-model="isDefaultAddr"><label id="label" for="checkbox">设为默认收货地址</label>
        <span class="toSave-box">
          <a href="javascript:" class="toSave" @click="toSave">保存</a>
        </span>
        <span class="tip" v-if="toSaveErr">提示：{{toSaveErr}}</span>
      </li>
    </ul>
    <table class="addressList">
      <thead>
        <tr>
          <th>收货人</th>
          <th class="area">所在地区</th>
          <th>详情</th>
          <th>邮编</th>
          <th>电话/手机</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="nuData" v-if="addressList.length <= 0">
          <td colspan="6">暂无数据</td>
        </tr>
        <tr v-for="(item, idx) in addressList">
          <td>{{item.cname}}</td>
          <td class="area">{{item.cprovince + item.ccity + item.cdistrict}}</td>
          <td>{{item.caddress}}</td>
          <td>{{item.zipcode}}</td>
          <td>
            <p>{{item.phone}}</p>
            <p>{{item.mtel}}</p>
          </td>
          <td class="btns" @click="curAddressId = idx">
            <!-- <el-button type="text" ></el-button> -->
            <span @click="deleteAddr(item.cid)" class="toDelete">删除</span>
            <i>/</i>
            <span class="toEdit" @click="dialogFormVisible = true">编辑</span>
            <!-- <a href="javascript:">编辑</a> -->
            <!-- <el-button type="text">编辑</el-button> -->
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="addAddress">
      <el-dialog title="编辑收货地址" :visible.sync="dialogFormVisible" width="660px" v-for="(item, idx) in addressList" v-if="dialogFormVisible && curAddressId == idx" key="idx">
        <div class="formbox">
          <el-form>
            <el-form-item label="* 所在地区" :label-width="formLabelWidth">
              <el-cascader
                placeholder="试试搜索地址"
                :options="areaData"
                filterable
                @change="areaSelecChange"
                v-model="item.area"
                style="width: 276px"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="textarea-box" label="* 详细地址" :label-width="formLabelWidth">
              <el-input
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
    </div>
  </div>
</template>

<script>
import prePhone from '@/components/prePhone'

export default {
  name: 'addAddress',
  components: {
    prePhone
  },
  data () {
    return {
      // placeholders: ['请选择省份', '请选择城市', '请选择地区', '请选择街道'],
      areaSelected: [], // 所在地区
      addressDetail: '', // 详细地址
      postcode: '', // 邮编
      consigneeName: '', // 收货人姓名
      mobile: { // 手机号码
        areaCode: '86', 
        num: ''
      },
      tel: { // 电话号码
        areaCode: '86',
        num: ''
      },
      prePhone: {
        options: [{
          value: '86',
          label: '中国大陆+86'
        },{
          value: '82',
          label: '韩国+0082'
        },{
          value: '001',
          label: '美国+001'
        }]
      },
      isDefaultAddr: false, // 是否设为默认地址
      addressList: [
        {
          id: 0,
          consigneeName: '咕咕咕',
          // area: ["上海市","市辖区","闵行区","古美街道"],
          area: ["上海市","市辖区","闵行区"],
          areaDetail: '逸仙路1234号',
          postcode: '000000',
          phone: {
            mobile: { // 手机号码
              areaCode: '86',
              num: '12345678910'
            },
            tel: { // 电话号码
              areaCode: '86',
              num: '01987654321'
            },
          },
          isDefaultAddr: true
        }
      ],
      curAddressId: -1,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      toSaveErr: '', // 错误提示
      areaData: [],
    }
  },
  watch: {
    /*areaSelected(newVal) {
      console.log(newVal)
    },
    addressDetail(newVal) {
      console.log(newVal)
    },*/
    deep: true
  },
  methods: {
    getQCDA() {
      this.$axios.get(this.sApi.util + '?t=city').then(response => {
        let res = response.data
        if(res.type == 1) this.areaData = res.data
      })
    },
    areaSelecChange(data) {
      $('.area-select .area-selected-trigger').css('color', '#333')
      // console.log(data)
    },
    deleteAddr(id) {
      this.$confirm('是否删除该地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(this.sApi.userinfo + '?t=addressdel&vipno=' + JSON.parse(this.getCookie('userInfo')).vipno + '&id=' + id).then((response)=> {
          console.log(response)
          let res = response.data
          if(res.type == 1) {
            this.getAddr()
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
    },
    getEditData(data) {
      this.dialogFormVisible = false
      console.log(data)
      // 默认地址遍历....
    },
    mobileAreaCode(val) {
      this.mobile.areaCode = val
    },
    telAreaCode(val) {
      this.tel.areaCode = val
    },
    dialogMobAreaCode(val) {
      this.addressList.phone.mobile.areaCode = val
    },
    dialogTelAreaCode(val) {
      this.addressList.phone.tel.areaCode = val
    },
    toSave() {
      this.toSaveErr = ''
      if(this.addressList.length > 20) {
        this.$alert('添加地址不能超过20条哦, 请先清理地址!', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
        })
      } else {
        if(this.areaSelected.length > 0 && this.addressDetail && this.consigneeName != '' && this.mobile.num) {
          var data = {
            "VIPNO": JSON.parse(this.getCookie('userInfo')).vipno,
            "CName": this.consigneeName, 
            "CProvince": this.areaSelected[0], // 省
            "CCity": this.areaSelected[1], // 市
            "CDistrict": this.areaSelected[2], // 县区
            "CAddress": /*this.areaSelected[3] + */this.addressDetail, // 详细信息 
            "ZipCode": this.postcode, // 邮编,可为空
            "Phone": this.mobile.num, // 手机 
            "CRemark": "", // 备注 
            "CDefault": this.isDefaultAddr * 1, // 1默认地址/0否, 
            "MTel": this.tel.num, // 固话
          }
          this.$axios.post(this.sApi.userinfo + '?t=addressadd', data).then((response)=> {
            let res = response.data
            if(res.type == 1) {
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
    getAddr() {
      this.$axios.get(this.sApi.userinfo + '?t=address&vipno=' + JSON.parse(this.getCookie('userInfo')).vipno).then((response)=> {
        let res = response.data
        if(res.type == 1) {
          this.addressList = res.data
          let arr = this.addressList.map((item, idx)=> {
            item.area = [item.cprovince, item.ccity, item.cdistrict]
            return item
          })
          this.addressList = arr
        }
      })
    }
  },
  mounted() {
    this.getAddr()
    this.getQCDA()
    // 省市区
    /*this.$axios.get(this.sApi.orders + '?t=city').then(response => {
        console.log(response)
      })
    this.$axios.post(this.sApi.orders + '?t=city').then(response => {
        console.log(response)
      })*/
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addAddress {}
.addAddress > p {line-height: 66px; font-size: 22px; color: #33a88e; font-family: 'SimHei'; padding-left: 10px;}
ul.addrForm {line-height: 42px; padding-left: 10px; margin-bottom: 40px; color: #666;}
ul.addrForm > li {margin-bottom: 10px;}
ul.addrForm > li > span {display: inline-block; width: 110px; vertical-align: middle; text-align: right; margin-right: 20px;}
ul.addrForm > li > .addressDetail {width: 506px; border-color: #e5e5e5; vertical-align: top; padding: 0 10px;}
ul.addrForm > li > input.inputCSS {padding: 0 10px; height: 42px; width: 276px; vertical-align: top;}
ul.addrForm > li > .addressDetail:hover {border-color: #b1b4bd;}
ul.addrForm > li .tip,
ul.addrForm > li .toSave-box {width: auto;}
ul.addrForm > li .toSave-box .toSave {display: inline-block; width: 100px; margin-left: 118px; background: #33a88e; color: #fff; text-align: center; border-radius: 5px;}
ul.addrForm > li .toSave-box .toSave:hover {background: #3bc1a4;}
ul.addrForm > li .tip {font-size: 12px; color: red;}


table.addressList {width: 100%; border: 1px solid #e5e5e5; text-align: center;}
table.addressList thead {background: #e5e5e5; line-height: 46px;}
table.addressList tbody {color: #aeaeae; font-size: 16px; line-height: 24px;}
table.addressList tbody tr {height: 46px;}
table.addressList tbody td.btns {color: #f8631a;}
table.addressList tbody td.btns span {cursor: pointer;}
table.addressList tbody td.btns span:hover {color: #F56C6C;}
table.addressList thead th.area {width: 300px; word-break: break-all;}
table.addressList thead td.area {}

.formbox {padding-top: 10px;}
.dialog-footer {padding: 0 20px 20px;}
.select-box {height: 42px; width: 167px;}
.textarea-box {width: 606px;}
.el-inputCSS {width: 276px; vertical-align: top;}
</style>