<template>
  <div class="login">
    <logo></logo>
    <div class="content">
      <div class="wrap">
        <div class="box" v-if="!isForget">
          <div class="close-icon" @click="$router.go(-1)"></div>
          <h2>登录</h2>
          <div class="form">
            <p class="tip-box" v-if="err != ''">
              <i class="el-icon-error"></i>
              <span>{{err}}</span>
            </p>
            <div class="input-box">
              <input type="text" placeholder="手机" v-model.lazy="account" @keyup.enter="nextInput">
            </div>
            <div class="input-box">
              <input type="password" placeholder="密码" v-model.lazy="pwd" @keyup.enter="login"><i v-show="pwd" class="el-icon-view canSee" @click="canSee"></i>
            </div>
            <div v-if="loginFailNum >= 2">
              <div class="input-box input-picCode">
                <input type="text" placeholder="图形验证码" v-model.lazy="picCode" @keyup.enter="login">
              </div>
              <div class="picCode-box" @click="refresh">
                <img id="imgcode" :src="this.sApi.util + '?t=code&amp;m=0.6516263128941158'" style="height: 32px; cursor: pointer" title="点击刷新">
                <span>
                  <i class="el-icon-refresh"></i>刷新
                </span>
              </div>
            </div>
            <div class="checked-box">
              <el-checkbox v-model="checked">记住我</el-checkbox>
              <a href="javascript:" class="forget-btn fr" @click="isForget = true">忘记密码?</a>
            </div>
            <a href="javascript:" class="input-box login-btn" @click="login">登录</a>
            <p class="tag">还没有平台账号 ?
              <router-link to="/register" class="regist-btn">请注册</router-link>
            </p>
          </div>
        </div>
        <div class="box" v-if="isForget">
          <div class="close-icon" @click="$router.go(-1)"></div>
          <h2>找回密码</h2>
          <div class="form">
            <p class="tip-box" v-if="err != ''">
              <i class="el-icon-error"></i>
              <span>{{err}}</span>
            </p>
            <div class="input-box">
              <input type="text" placeholder="手机" v-model.lazy="account" @keyup.enter="nextInput">
            </div>
            <div class="input-box input-phoneCode">
              <input type="text" idx="1" placeholder="手机验证码" v-model="phoneCode" @keyup.enter="nextInput">
            </div><!-- 
             --><div class="phoneCode-btn" :class ="{'loading': isCodelLoading || countDown > -1}" @click="getPhoneCode">{{isCodelLoading ? '正在获取...' : (countDown > -1 ? '重新获取 ' + countDown + 's' : '获取验证码')}}
                <div class="err-box" v-if="phoneCodeErr">
                  <i class="el-icon-warning"></i>
                  <span>{{phoneCodeErr}}</span>
                </div>
            </div>
            <div class="input-box">
              <input type="password" placeholder="密码" v-model.lazy="pwd" @keyup.enter="login"><i v-show="pwd" class="el-icon-view canSee" @click="canSee"></i>
            </div>
            <div v-if="loginFailNum >= 2">
              <div class="input-box input-picCode">
                <input type="text" placeholder="图形验证码" v-model.lazy="picCode" @keyup.enter="login">
              </div>
              <div class="picCode-box" @click="refresh">
                <img id="imgcode" :src="this.sApi.util + '?t=code&amp;m=0.6516263128941158'" style="height: 32px; cursor: pointer" title="点击刷新">
                <span>
                  <i class="el-icon-refresh"></i>刷新
                </span>
              </div>
            </div>
            <div class="checked-box">
              <span style="font-size: 12px; color: #666;">返回<a href="javascript:" class="regist-btn" @click="isForget = false">登录</a></span>
              <span style="font-size: 12px; color: #666;" class="fr">还没有账号<router-link to="/register" class="regist-btn">去注册</router-link></span>
              <!-- <p class="tag">
              </p> -->
            </div>
            <a href="javascript:" class="input-box login-btn" @click="login">确定</a>
          </div>
        </div>
      </div>
      <!-- 正在登录 -->
      <el-dialog class="loadingDialog" :show-close="false" :visible.sync="dialogTableVisible">
        <div class="loading-box">
          <i class="el-icon-loading"></i><br>
          <span>loading...</span>
        </div>
      </el-dialog>
    </div>
    <div class="footerBox">
      <vueFooter></vueFooter>
    </div>
  </div>
</template>

<script>
import logo from '@/components/logo'
import vueFooter from '@/components/vueFooter'

export default {
  name: 'login',
  components: {
    logo,
    vueFooter
  },
  data () {
    return {
      oldRouter: this.$store.state.oldRouter,
      loginFailNum: 0,
      account: '', //  账号12345678910
      pwd: '', // admin123
      checked: true, // 是否 "记住我"(7天免登陆)
      err: '',
      picCode: '',
      dialogTableVisible: false,
      isForget: false, // 忘记密码
      phoneCode: '', // 短信验证码
      phoneCodeErr: '', // 验证码错误
      isCodelLoading: false, // 正在获取短信验证码
      countDown: -1, // 正在倒计时
      timer: '', // 计时器
    }
  },
  created() {
    this.loginFailNum = sessionStorage.getItem("loginFailNum")
    // this.clearCookie('userInfo')
    // this.clearCookie('token')
    this.checkIsLogin()
    // this.$store.state.username = ''
  },
  watch: {
    account(newVal) {
      this.err = ''
    },
    pwd(newVal) {
      this.err = ''
    },
    picCode(newVal) {
      if(this.loginFailNum >= 2 && newVal == '') this.err = ''
    },
    deep: true
  },
  methods: {
    checkNumber(theObj) { //验证字符串是否是数字
      var reg = /^[0-9]+.?[0-9]*$/
      if (reg.test(theObj)) {
        return true
      }
      return false
    },
    isPasswd(s) { //只能输入6-20个字母、数字、下划线 
      var patrn = /^(\w){6,20}$/
      if (!patrn.test(s)) return false
      return true
    },
    login() {
      if(this.checkIsLogin()) {
        this.$confirm(this.$store.state.username + '已登录, 是否退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clearCookie('userInfo')
          this.$store.commit('isLogin', '')
          
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
      } else if(this.account == '') {
        this.err = '账号不能为空'
      } else if(this.pwd == '') {
        this.err = '密码不能为空'
      } else if(this.loginFailNum >= 2 && this.picCode == '') {
        this.err = '验证码不能为空'
      } else {
        this.err = ''
        this.dialogTableVisible = true
        var data = {
          "id": this.account,
          // "pwd": this.pwd,
          "pwd": this.$SHA256(this.pwd).toString(), // 密码加密
          "code": this.picCode
        }
        this.$axios.post(this.sApi.userinfo + '?t=login', data).then((response)=> {
          this.dialogTableVisible = false
          var res = response.data
          if(res.type == 1) {
            // console.log(res.data)
            // 是否 "记住我"(7天免登陆)
            if(this.checked) {
              // console.log("记住我" +this.checked)
              this.setCookie("userInfo", JSON.stringify(res.data), 7)
              this.setCookie("token", JSON.stringify(res.token), 7)
            } else {
              this.setCookie("userInfo", JSON.stringify(res.data))
              this.setCookie("token", JSON.stringify(res.token))
            }
            this.checkIsLogin()
            sessionStorage.removeItem("loginFailNum")

            if(window.history.length <= 1 || !this.oldRouter || this.oldRouter.indexOf('register') > -1 || this.oldRouter.indexOf('login') > -1) {
              this.$router.push({path: '/'})
            } else {
              this.$router.go(-1)
            }
          } else {
            sessionStorage.setItem("loginFailNum", ++this.loginFailNum)
          }
        }).catch((error)=> {
          this.dialogTableVisible = false
        })
      }
    },
    canSee(e) {
      var icon = $(e.target)
      var input = icon.prev()
      if(input.attr('type') == 'password') {
        input.attr('type', 'text')
        icon.addClass('on')
      } else if(input.attr('type') == 'text') {
        input.attr('type', 'password')
        icon.removeClass('on')
      }
    },
    refresh(e) { // 图片验证码刷新
      $('#imgcode').attr('src', this.sApi.util + '?t=code&amp;m='+Math.random())
    },
    nextInput(e) {
      $($('.input-box > input')[$(e.target).closest('.input-box').index() + 1]).focus()
    },
    getPhoneCode() {
      if(this.countDown == -1) {
        if(this.phoneNum) {
          this.isCodelLoading = true
          this.$axios.post(this.sApi.util + '?t=tcode&type=1&tel=' + this.phoneNum).then(response => {
            this.isCodelLoading = false
            let res = response.data
            if(res.type == 1) {
              this.$alert('稍后短信将发送至您手机, 请注意查收!', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                callback: action => {}
              });
              this.countDown = 60
              this.timer = setInterval(() => {
                this.countDown--;
                if (this.countDown <= 0) {
                  this.countDown = -1
                  clearInterval(this.timer); // 清除答题限时定时器
                }
              }, 1000)
            }
          })
        }
      }
    },
  },
  mounted() {
    $('.login').css('min-height', $(window).height() - 262 + 'px')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {height: calc(100% - 30px);}
/*.logoBox {height: 8%;}*/
.footerBox{width: 100%; position: absolute; bottom: 0;}
.login .content {width: 100%; background: url(/static/bfl-img/login-bg.jpg) no-repeat; position: absolute; background-size: contain; top: 100px; bottom: 0;}
.login .content .wrap {margin-top: 70px; text-align: right;}
.login .content .wrap .box {width: 40%; max-width: 578px; display: inline-block; background: #fff; text-align: center; padding: 24px 0 33px; box-shadow: 10px 10px 15px #ccc; position: relative;}
.login .content .wrap .box .close-icon {margin-right: 10px;}
.login .content .wrap .box h2 {font-size: 22px; margin-bottom: 20px;}
.form {width: 61%; margin: 0 auto; position: relative;}
.tip-box {width: 100%; position: absolute; text-align: left; color: red; top: -10px; font-size: 14px;}
.checked-box,
.login .content .wrap .box .select-box,
.login .content .wrap .box .input-box {width: 100%; height: 45px; display: inline-block; }
.login .content .wrap .box .input-box {border: 1px solid #dbdbdb; margin-top: 8px; text-align: left; line-height: 45px; padding: 0 8px; position: relative;}
.login .content .wrap .box .input-box:hover {border-color: #b6b6b6;}
.login .content .wrap .box .input-box .til {vertical-align: top; color: #c0c4cc;}
.login .content .wrap .box .input-box img {vertical-align: top; margin-top: 5px;}
.login .content .wrap .box .input-box input {width: 100%; height: 100%; border: none; float: right; line-height: 45px; background: transparent;}
.login .content .wrap .box .input-box.input-picCode {width: 54%;}
.login .content .wrap .box .picCode-box {display: inline-block; width: 44%; height: 45px; line-height: 45px; vertical-align: top; margin-top: 8px; background: #f5f5f5; text-align: left; padding: 0 4px; position: relative;}
.login .content .wrap .box .picCode-box > img {width: 50%; margin-top: 7px; vertical-align: top;}
.login .content .wrap .box .picCode-box > span {line-height: 45px; -padding-left: 8px; color: #33a890; cursor: pointer; font-size: 14px;}
.login .content .wrap .box .picCode-box > span > i {font-size: 18px; vertical-align: middle;}
.login .content .wrap .box .checked-box {text-align: left; margin-top: 10px;}
.login .content .wrap .box a.login-btn {display: inline-block; text-align: center; background: #34a88e; color: #fff; font-size: 20px; border-color: #34a88e; margin-top: 0;}
.login .content .wrap .box a.login-btn:hover {border-color: #34a88e;}
.login .content .wrap .box > p {font-size: 14px; margin-top: 10px; color: #666;}
.forget-btn {font-size: 14px; color: #666;}
.forget-btn:hover,
.login .content .wrap .box > p .regist-btn {color: #fa821d; }
.login .content .wrap .box .picCode-box > span > i {font-size: 20px; vertical-align: middle;}
.login .content .wrap .box .input-phoneCode {width: 56%; vertical-align: middle; border-right: none;}
.login .content .wrap .box .phoneCode-btn {width: 44%; height: 45px; line-height: 45px; display: inline-block; vertical-align: middle; margin-top: 8px; background: #33a890; color: #fff; font-size: 12px; cursor: pointer; position: relative;}
.login .content .wrap .box .phoneCode-btn:hover {background: #48ad98;}
.login .content .wrap .box .phoneCode-btn.loading {background: #ccc;}

.canSee {position: absolute; right: 14px; line-height: 45px; color: #e5e5e5; -display: none; font-size: 20px;}
.canSee:hover {color: #b6b6b6;}
.canSee.on {color: #33a890;}

.tag {margin-top: 10px; font-size: 14px;}
.regist-btn {color: #f5610c;}
</style>