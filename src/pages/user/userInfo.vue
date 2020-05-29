<template>
  <div class="userInfo">
    <h1 class="userTitle">个人中心</h1>
    <ul class="form-box">
      <li>
        <span class="til til-b">基本资料</span>
        <div class="right-box"></div>
      </li>
      <li class="avatar-box">
        <span class="til">头像</span>
        <div class="right-box">
          <p class="addImg-btn" :class="{'img-box': avatarSrc != ''}" :style="'background-image: url('+ avatarSrc + ');'">
            <input type="file" name="upload1" id="upload1" @change="addImg">
          </p>
        </div>
      </li>
      <li>
        <span class="til">手机号</span>
        <div class="right-box">{{userInfo.viptel}}</div>
      </li>
      <li>
        <span class="til">昵称</span>
        <div class="right-box">
          <input type="text" class="inputCSS" v-model.lazy="userInfo.vipnickname">
          <!-- <input type="text" class="inputCSS" v-model.lazy="userInfo.vipnickname" :class="{'input-err': nickErr != ''}">
          <p class="tip-ib tip-box">
            <i :class="{'el-icon-error': (nickErr != '')}">el-icon-success</i><span>{{nickErr}}</span>
          </p> -->
        </div>
      </li>
      <li>
        <span class="til">邮箱</span>
        <div class="right-box">
          <input type="text" class="inputCSS" v-model.lazy="userInfo.vipemail">
        </div>
      </li>
      <li>
        <span class="til"></span>
        <div class="right-box">
          <span href="javascript:" class="next-btn on" @click="toChangeInfo">确定</span>
        </div>
      </li>
      <li>
        <span class="til til-b">修改密码</span>
        <div class="right-box"></div>
      </li>
      <li>
        <span class="til">原密码</span>
        <div class="right-box">
          <input :type="[isPwd ? 'password' : 'text']" class="inputCSS oldPwd" v-model.lazy="passwordOld" :class="{'input-err': passwordOldErr != ''}" @input="oninput">
          <i class="el-icon-view canSee" :class="{'on': !isPwd}" @click="isPwd = !isPwd"></i>
          <p class="tip-ib tip-box">
            <i :class="{'el-icon-error': (passwordOldErr != '')}"></i><span>{{passwordOldErr}}</span>
          </p>
        </div>
      </li>
      <li>
        <span class="til">新密码</span>
        <div class="right-box">
          <input :type="[isPwd2 ? 'password' : 'text']" class="inputCSS newPwd" placeholder="6-20位字母/数字/下划线" v-model.lazy="password" :class="{'input-err': passwordErr != ''}" @input="oninput">
          <i class="el-icon-view canSee" :class="{'on': !isPwd2}" @click="isPwd2 = !isPwd2"></i>
          <p class="tip-ib tip-box">
            <i :class="{'el-icon-error': (passwordErr != ''), 'el-icon-success': (password && passwordErr == '')}"></i><span>{{passwordErr}}</span>
          </p>
        </div>
      </li>
      <li>
        <span class="til"></span>
        <div class="right-box">
          <span href="javascript:" class="next-btn on" @click="changePwd(gotoLogin)">确定</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'userInfo',
  data () {
    return {
      userInfo: JSON.parse(this.getCookie("userInfo")),
      businessErr: '',
      isPwd: true,
      isPwd2: true,
      passwordOld: '',
      passwordOldErr: '',
      password: '',
      passwordErr: '',
      isPWdChange: false,
      isInfoChange: false,
      avatarFile: '', // 头像图片文件
      avatarSrc: '', // 头像图片路径
    }
  },
  watch: {
    'userInfo.vipnickname': function(newVal) {
      if(newVal != '') this.isInfoChange = true
    },
    'userInfo.vipemail': function(newVal) {
      if(newVal != '') this.isInfoChange = true
    },
    avatarFile(newVal) {
      if(newVal != '') this.isInfoChange = true
    },
    passwordOld(newVal) {
      if(newVal == '') {
        this.passwordOldErr = '原密码不能为空'
      } else if(!this.isPasswd(newVal)) {
        this.passwordOldErr = '6-20位字母/数字/下划线'
      } else {
        this.passwordOldErr = ''
      }
    },
    password(newVal) {
      this.isPWdChange = false
      if(this.password == '') {
        this.passwordErr = '新密码不能为空'
      } else if(!this.isPasswd(newVal)) {
        this.passwordErr = '6-20位字母/数字/下划线'
      } else if(this.password == this.passwordOld) {
        this.passwordErr = '新密码不能与原密码重复'
      } else {
        this.isPWdChange = true
        this.passwordErr = ''
      }
    },
    deep: true
  },
  methods: {
    isPasswd(s) { //只能输入6-20个字母、数字、下划线 
      var patrn = /^(\w){6,20}$/
      if (!patrn.test(s)) return false
      return true
    },
    oninput(e) {
      if($(e.target).hasClass('oldPwd')) {
        this.passwordOldErr = ''
      }
      if($(e.target).hasClass('newPwd')) {
        this.passwordErr = ''
      }
      $(e.target).next().css('display', 'inline')
    },
    getJsonLength(jsonData) {
      var jsonLength = 0;
      for (var item in jsonData) {
        jsonLength++;
      }
      return jsonLength;
    },
    changeInfo() {
      var params = {
        vipno: this.userInfo.vipno,
        email: this.userInfo.vipemail,
        name: this.userInfo.vipnickname,
        img: this.userInfo.vipphoto
      }
      this.$axios.post(this.sApi.userinfo + "?t=infoedit", params).then((response)=> {
        var res = response.data
        if(res.type == 1) {
          this.clearCookie("userInfo")
          this.setCookie("userInfo", JSON.stringify(res.data), 7)
          this.checkIsLogin()
          this.isInfoChange = false
          this.$message({
            showClose: true,
            message: '基本资料修改成功! ٩(๑^o^๑)۶ ',
            type: 'success'
          })
        }
      })
    },
    addImg(e) {
      this.avatarFile = e.target.files[0]
      this.avatarSrc = URL.createObjectURL(this.avatarFile)
    },
    toChangeInfo() {
      if(this.isInfoChange) {
        if(this.avatarFile) {
          this.update(this.avatarFile)
        } else {
          this.changeInfo()
        }
      } else {

      }
    },
    changePwd(myCallback) {
      if(this.isPWdChange) {
        // this.$axios.post(this.sApi.userinfo + "?t=pwd&old=" + this.$SHA256(this.passwordOld).toString() + "&new=" + this.$SHA256(this.password).toString() + "&vipno=" + JSON.parse(this.getCookie('userInfo')).vipno).then((response) => {
        this.$axios.post(this.sApi.userinfo + "?t=pwd&old=" + this.passwordOld + "&new=" + this.password + "&vipno=" + JSON.parse(this.getCookie('userInfo')).vipno).then((response) => {
          console.log(response)
          var res = response.data
          if (res.type == 1) {
            this.$alert('密码修改成功! 请重新登录', '提示', {
              confirmButtonText: '确定',
              type: 'success',
              callback: action => {
                this.$store.state.username = ''
                this.clearCookie('token')
                myCallback()
              }
            });
          }
        })
      }
    },
    gotoLogin() { // 回调函数
      this.$router.push({path: "/login"})
    },
    /*handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M
    },*/
    update(file) { // 上传单个图片文件
      let d = new Date();
      let type = file.name.split('.');
      let tokenParem = {
        'putPolicy': '{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
        'key': 'orderReview/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.valueOf() + '.' + type[type.length - 1],
        'bucket': this.sApi.qiniuUrl + '', //七牛的地址(外链)，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      //断点传输
      param.append('chunks', '1');
      param.append('file', file, file.name)
      // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let name = file.name + ''
      let config = {
        onUploadProgress: progressEvent => {
          var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' // multipart/form-data
        }
      };
      //先从自己的服务端拿到token
      this.$axios.get(this.sApi.qiniuToken + '?t=qiniu', this.qs.stringify(tokenParem)).then(response => {
        // console.log(response)
        if(response.status == 200) {
          param.append('token', response.data.data);
          this.uploading(param, config); //然后将参数上传七牛
          return;
        }
      })
    },
    uploading(param, config) { // 七牛处理 & 上传图片到服务器
      this.$axios.post(this.sApi.uploadQiniup, param, config).then(res1 => { // 上传图片到七牛
        if(res1.status == 200) {
          var key = res1.data.key // 上传图片成功后七牛返回的图片key
          this.avatarSrc = this.sApi.qiniuUrl + '/' + key + '?imageView2/2/w/100'
          this.userInfo.vipphoto = this.sApi.qiniuUrl + '/' + key + '?imageView2/2/w/100'
          console.log(this.userInfo.vipphoto)
          this.changeInfo()
        }
      })
    },
  },
  mounted() {
    this.avatarSrc = this.userInfo.vipphoto ? this.userInfo.vipphoto : 'http://www.j-ink.cn/static/bfl-img/avatar.png'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul.form-box {margin: 30px 0 50px 30px;}
.form-box li .right-box .inputCSS {width: 200px;}
.canSee {position: absolute; top: 2px; right: 14px; line-height: 34px; color: #e5e5e5; display: none;}
.canSee.on {color: #111;}
.canSee:hover {color: #b6b6b6;}
.avatar-box {height: 120px;}
.right-box .addImg-btn.img-box:after,
.right-box .addImg-btn.img-box:before {display: none;}
.table {margin-bottom: 0;}
.form-box li .right-box .next-btn {width: 200px; cursor: pointer; user-select: none;}
.tip-box {position: absolute; right: -310px; top: 0; color: red; width: 300px;}
.tip-box .el-icon-success {color: #67c23a;}
</style>