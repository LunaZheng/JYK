<template>
  <div class="album">
    <div class="nemu-box">
      <p class="til">
        <img src="/static/bfl-img/edit/picWall.svg" alt="">
        我的照片
      </p>
      <ul class="nemuList">
        <li v-for="(item, idx) in picFoldersList">
          <img src="/static/bfl-img/edit/file.svg" alt="">
          <span>{{item.value}} (6)</span>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="top-bar">
        <div>
          <span><i class="icon-eye"></i>预览</span>
          <div class="fr" v-if="curPicTab == 1">
            <div class="checkbox-box" @click="checkedAll">
              <i :class="{'el-icon-check': isCheckedAll}"></i>
              <label for="checkbox"><input id="checkbox" type="checkbox" class="checkbox checkedAll">全选</label>
            </div>
            <span @click="del"><i class="el-icon-delete"></i>删除</span>
          </div>
        </div>
      </div>
      <div class="main" v-if="curPicTab == 1">
        <div class="top" v-show="!isPicListLoading">
          <span class="tip">单击选择图片，双击预览</span>
          <a href="javascript:;" class="file btn" @click="curPicTab = 2">上传照片</a>
        </div>
        <div class="isLoading" v-show="isPicListLoading">
          <i class="el-icon-loading"></i>
          <span>加载中</span>
        </div>
        <ul class="picList" v-show="!isPicListLoading" @click="toggleCheck">
          <li v-for="(item, idx) in picListData">
            <div class="pic" v-lazy:background-image="item.imgpath + '?imageView2/2/w/105'" :name="item.filename" :originSrc="item.imgpath" @dblclick="previewPic(item.imgpath)" :upid="item.upid" :filename="item.filename">
              <i class="el-icon-error" @click="deletePic(item.upid, item.filename)"></i>
            </div>
            <p :title="item.filename">{{item.filename}}</p>
          </li>
        </ul>
      </div>
      <div class="main" v-if="curPicTab == 2">
        <div class="top">
          <p class="tip">一共
            <span class="num">{{updatePicsList.length}}</span>
            张照片,已上传
            <span class="num">{{picListData.length}}</span>
            张照片
          </p>
          <a href="javascript:;" class="file btn">选择照片
            <input type="file" name="" id="fileEL" multiple="" @change="updatePics">
          </a>
        </div>
        <div class="table-box">
          <!-- 表头需要固定的地方  -->
          <div class="table-head">
            <table>
              <thead>
                <tr style="background: #ccc;">
                  <th>编号</th>
                  <th>缩略图</th>
                  <th width="250px">名称</th>
                  <th>大小</th>
                  <th width="200px">完成进度</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>
          </div>
          <!-- 表体需要显示滚动条的地方  -->
          <div class="table-body">
            <table>
              <tr v-if="updatePicsList.length <= 0">
                <td colspan="6">
                  <span>暂无照片上传</span>
                </td>
              </tr>
              <tr v-if="updatePicsList.length > 0" v-for="(item, idx) in updatePicsList">
                <td>{{item.code}}</td>
                <td>
                  <img height="40" :src="item.src" alt="">
                </td>
                <td width="250px">
                  <p class="picName ellipsis" :title="item.name">{{item.name}}</p>
                </td>
                <td>{{item.size}}kb</td>
                <td width="200px">
                  <el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" status="success"></el-progress>
                </td>
                <td>
                  <span class="todo btn" v-show="item.progress == 0" @click="updateOne">开始上传</span>
                  <span class="todo" v-show="item.progress < 100 && item.progress > 0">正在上传</span>
                  <span class="todo btn btn-text danger" v-show="item.progress == 100">
                    <i class="el-icon-delete" @click="delUpedPic(item)"></i>
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="footer">
          <div class="saveLocation">
            <p class="til">选择要上传的位置</p>
            <div class="radio-box">
              <span class="name" @click="curSaveFolder = 1">
                <i class="circular" :class="{'on': curSaveFolder == 1}"></i>
                新建文件夹
              </span>
              <div class="el-box">
                <el-input
                  size="small"
                  placeholder="请输入文件夹名称"
                  v-model="newFolderName"
                  clearable>
                </el-input>
              </div>
            </div>
            <div class="radio-box">
              <span class="name" @click="curSaveFolder = 2">
                <i class="circular" :class="{'on': curSaveFolder == 2}"></i>
                现有文件夹
              </span>
              <div class="el-box">
                <el-select v-model="existFolders" clearable placeholder="请选择">
                  <el-option
                    size="small"
                    v-for="item in picFoldersList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <span class="btn" v-if="updatePicsList.length > 1" @click="updateAll">全部上传</span>
          <span class="btn btn-cancel" @click="curPicTab = 1">返回列表</span>
        </div>
      </div>
    </div>
    <!-- 查看大图 -->
    <el-dialog class="bigImgDialog" :visible.sync="innerVisible">
      <div class="loading-box" v-if="isImgLoading">
        <i class="el-icon-loading"></i><br>
        <span>loading...</span>
      </div>
      <img class="maskImg" :src="curViewPicUrl" alt="" @load="isImgLoading = false">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'album',
  data () {
    return {
      picFoldersList: [
        {value: '2018-08-02', label: '2018-08-02'},
        {value: '2018-08-03', label: '2018-08-03'},
        {value: '2018-08-04', label: '2018-08-04'},
      ],
      curPicTab: 1,
      isPicListLoading: false,
      picListData: [],
      innerVisible: false, // 图片预览
      isImgLoading: true, // 图片预览-loading
      curViewPicUrl: '', // 图片预览路径
      isCheckedAll: false,
      updatePicsList: [], // 上传照片的本地数据
      curSaveFolder: 1,
      newFolderName: '',
      existFolders: '',
      choseArr: [], // 选中
      oFileArr: [], // 上传的文件数据
    }
  },
  methods: {
    previewPic(url) { // 查看大图
      this.innerVisible = true
      this.curViewPicUrl = ''
      this.curViewPicUrl = url + '?imageView2/2/h/900'
    },
    toggleCheck(e) { // 单个
      var pic = $(e.target).closest('.pic')
      var pics = $('.picList .pic')
      if(pic.length > 0) {
        pic.toggleClass('on')
      } else {
        pics.removeClass('on')
      }
      this.choseArr = []
      var ckeckNum = 0
      pics.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.choseArr.push($(item))
          ckeckNum++
        }
      })
      this.isCheckedAll = ckeckNum == pics.length ? true : false
    },
    checkedAll(e) { // 全选
      var inputs = $('input.checkbox:not(.checkedAll)')
      var pics = $('.picList li .pic')
      this.isCheckedAll = !this.isCheckedAll
      if(this.isCheckedAll) {
        pics.addClass('on')
      } else {
        pics.removeClass('on')
      }
      this.choseArr = []
      pics.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.choseArr.push($(item))
        }
      })
    },
    updatePics(e) { // 添加照片
      this.curPicTab = 2
      var vm = this
      var target = e.target
      var filesData = target.files
      ;[].slice.call(target.files).forEach((oFile, idx)=> {
        // this.curUploadId = idx
        var src = URL.createObjectURL(oFile)
        var name = oFile.name
        // console.log(oFile)
        var code  = this.updatePicsList.length
        var obj = {
          code: '',
          src: src,
          name: name,
          size: (oFile.size / 1024).toFixed(0) * 1,
          progress: 0,
          upid: -1,
        }
        this.updatePicsList.push(obj)
        this.oFileArr.push({
          oFile: oFile,
          code: code++,
        })
      })
      // console.log(this.oFileArr)
      target.value = ''
    },
    updateOne(e) { // 开始上传(单个)
      var i = $(e.target).closest('tr').index()
      if(this.oFileArr.length > 0) {
        this.oFileArr.forEach((item, idx)=> {
          if(i == item.code) {
            this.update(item.oFile, item.code)
            this.oFileArr.splice(idx, 1)
          }
        })
      }
    },
    updateAll() { // 全部开始上传
      // ...选择文件夹...

      this.oFileArr.forEach((item)=> {
        var file = item.oFile
        var idx = item.code
        this.update(file, idx)
      })
      this.oFileArr = []
    },
    update(file, idx) { // 上传单个图片文件
      let d = new Date();
      let type = file.name.split('.');
      let tokenParem = {
        'putPolicy': '{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
        'key': 'orderReview/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.valueOf() + '.' + type[type.length - 1],
        'bucket': this.sApi.qiniuUrl, //七牛的地址(外链)，这个是你自己配置的（变量）
      };
      this.updatePicsList[idx].code = d.Format('yyMMddhhmmss') + Math.floor(Math.random()*10)
      let param = new FormData(); //创建form对象
       //断点传输
      param.append('chunks', '1');
      param.append('file', file, file.name)
      // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let name = file.name + ''
      let config = {
        onUploadProgress: progressEvent => {
          var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
          this.updatePicsList[idx].progress = complete
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' // multipart/form-data
        }
      };
      //先从自己的服务端拿到token
      /*this.$axios.get('/token', this.qs.stringify(tokenParem))*/
      // this.$axios.get('/api/qiniu.html?t=qiniu', this.qs.stringify(tokenParem))
      this.$axios.get(this.sApi.qiniuToken + '?t=qiniu', this.qs.stringify(tokenParem)).then(response => {
        // console.log(response)
        if(response.status == 200) {
          this.token = response.data.data;
          param.append('token', this.token);
          this.uploading(param, config, idx, this.updatePicsList); //然后将参数上传七牛
          return;
        }
      })
    },
    uploading(param, config, idx, updatePicsList) { // 七牛处理 & 上传图片到服务器
      var name = param.get('file').name
      // this.$axios.post('http://upload.qiniu.com/', param, config)
      this.$axios.post(this.sApi.uploadQiniup, param, config).then(res1 => { // 上传图片到七牛
        if(res1.status == 200) {
          var key = res1.data.key // 上传图片成功后七牛返回的图片key
          var hash = res1.data.hash // 上传图片成功后七牛返回的图片hash
          this.$axios.get(this.sApi.qiniuUrl + '/' + key + '?imageInfo').then(res2 => { // 从七牛获取图片基本信息
            if(res2.status == 200) {
              var imgInfo = res2.data
              let size = (imgInfo.size / 1024).toFixed(0) * 1
              var addParam = {
                'vipno': JSON.parse(this.getCookie('userInfo')).vipno, // 用户编号
                'pgid': 1, //图片分类编号,没有给-1
                'md5co': hash, //图片md5,唯一
                'ImgPath': this.sApi.qiniuUrl + '/' + key,
                'PrimitiveWidth': imgInfo.width, //图片宽度
                'PrimitiveHeight': imgInfo.height, //图片高度
                'FileName': name,
                'filesize': size, //图片大小,单位为kb
              }
              this.$axios.post(this.sApi.userphoto + '?t=add', addParam).then(response => {
                let res3 = response.data
                if(res3.type == 1) {
                  this.getUploadImgList()
                  updatePicsList[idx].upid = res3.data
                }
              })
            }
          })
        }
      })
    },
    getUploadImgList() { // 获取照片列表
      this.isPicListLoading = true
      var pics = $('ul.picList .pic')
      ;[].slice.call(pics).forEach((item, idx)=> {
        $(item).removeClass('on')
      })
      // 获取图片列表
      var params = {
        "vipno": JSON.parse(this.getCookie('userInfo')).vipno, // --用户编号,必须
        "key": "",   // --关键词(文件名/路径),默认为空
        "pageindex": 1, // --当前页码
        "pagesize": 50  // --每页显示数量
      }
      this.$axios.post(this.sApi.userphoto + '?t=search', params).then(response => {
        this.isPicListLoading = false
        let res = response.data
        if(res.type == 1) {
          this.picListData = res.data
        }
      })
    },
    delOnePic(upid) { // 删除单张照片
      this.$axios.get(this.sApi.userphoto + '?t=del&userid=' + JSON.parse(this.getCookie('userInfo')).vipno + '&upid=' + upid).then(response => {
        // console.log(res);
        let res = response.data
        if(res.type == 1) {
          this.updatePicsList.forEach((item, idx)=> {
            if(item.upid == upid) {
              this.updatePicsList.splice(idx, 1)
            }
          })
          this.getUploadImgList()
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
      })
    },
    del() { // 选中单张/多张删除
      if(this.choseArr.length > 0) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.choseArr.forEach((item, idx)=> {
            var upid = item.attr('upid')
            var name = item.attr('filename')
            this.delOnePic(upid, name)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    deletePic(upid) { // 照片列表页面-(小红×)
      this.$confirm('是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delOnePic(upid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    delUpedPic(pic) { // 上传页面列表-(删除icon)
      this.$confirm('是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delOnePic(pic.upid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  mounted() {
    this.getUploadImgList()
    $('.album').css('height', $(window).height() - 50 + 'px')
    $(window).resize(function() {
      console.log($(window).height() - 50 + 'px')
      $('.album').css('height', $(window).height() - 50 + 'px') // 未解决
      $('.nemu-box').css('height', '100%')
      $('.content').css('height', '100%')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.album {position: absolute; top: 50px; left: 0; right: 0;}
.nemu-box {width: 210px; height: 100%; background: #eee; text-align: center; border-radius: 0 6px;}
.nemu-box .til {height: 46px; line-height: 48px; position: relative; padding-left: 20px;}
.nemu-box .til img {position: absolute; top: 15px; left: 28px;}
.nemu-box .nemuList {}
.nemu-box .nemuList li {background: #fff; height: 46px; line-height: 46px; border-radius: 4px; margin: 1px; margin-top: 0; font-size: 14; color: #999;}
.nemu-box .nemuList li > img {vertical-align: middle; margin-right: 10px;}
.nemu-box .nemuList li > span {vertical-align: middle;}

.content {height: 100%; position: absolute; left: 232px; right: 0; top: 0; -bottom: 0;}
.top-bar {height: 46px; line-height: 46px; background: #e5e5e5; border-radius: 6px;}
.top-bar > div {width: 85%;}
.top-bar > div span {cursor: pointer; color: #f75f0e;}
.top-bar > div span > i {font-size: 24px; display: inline-block; margin: 12px 10px 12px 26px; vertical-align: top;}
.top-bar > div span > i.icon-eye {color: #f75f0e;}
.top-bar > div .fr span:hover {color: red;}
.top-bar > div div.checkbox-box {line-height: 46px; height: auto;}
.top-bar > div div.checkbox-box input.checkbox, 
.top-bar > div div.checkbox-box i {top: 14px; -border-color: #999; left: -30px;}

.content .main {padding: 0 26px;}
.content .main .top {-width: 86.39%; width: 100%; padding: 30px 120px 30px 0; font-size: 20px; position: relative;}
.content .main .top .tip {width: 100%; display: inline-block; text-align: center; color: #999; line-height: 34px; -webkit-box-sizing: border-box; box-sizing: border-box;}
.content .main .top p.tip {text-align: right; color: #999; font-size: 16px; padding-right: 10px;}
.content .main .top p.tip .num {color: #f5610c;}
.content .main .footer .btn,
.content .main .top .btn {display: inline-block; padding: 11px 16px; background: #34a88e; color: #fff; border-radius: 4px; float: right; margin-right: 3px; position: absolute; right: 0; top: 24px; right: 0;}
.content .main .top .btn:hover {background: #39bb9e;}
.content .main .picList {overflow-y: auto; padding-top: 8px; position: absolute; top: 132px; left: 0; right: 0; bottom: 0;}
.content .main .picList li {display: inline-block; text-align: center; margin-bottom: 50px; color: #999; padding: 0 7px; margin-top: 1px;}
.content .main .picList li > p {width: 150px; height: 18px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; padding: 0 12px;}
.content .main .picList li .pic {width: 150px; height: 150px; background: center / contain no-repeat; border: 2px solid #eee; margin-bottom: 18px; position: relative;}
.content .main .picList li .pic:hover {box-shadow: 2px 2px 5px #aaa; top: -1px;}
.content .main .picList li .pic.on {border-color: #34a88e; -webkit-box-shadow: 2px 2px 5px #34a88eab; box-shadow: 2px 2px 5px #34a88eab; top: -1px;}
.content .main .picList li .pic > i {color: red; position: absolute; top: -8px; right: -4px; cursor: pointer; background: radial-gradient(#fff, transparent); display: none;}
.content .pic-box .img-list .ul1.pics-box li > i {top: 0;}
.content .pic-box .img-list .ul1.pics-box li > i.on,
.content .main .picList li .pic:hover > i {display: inline-block;}
.content .main .footer {width: 86%; min-height: 88px; padding: 20px 0 30px 0; position: absolute; bottom: 0;}
.content .main .footer .btn {text-align: center; font-size: 18px; padding: 10px 16px; position: absolute; border: 1px solid #34a88e;}
.content .main .footer .btn.btn-cancel {top: 90px; background: #fff; color: #34a88e;}

.content .main .footer .saveLocation {display: inline-block;}
.content .main .footer .saveLocation p.til {line-height: 40px; color: #f5610c;}
.content .main .footer .saveLocation .radio-box {line-height: 40px;}
.content .main .footer .saveLocation .radio-box .el-box {display: inline-block; height: 34px; line-height: 34px; width: 138px; margin-left: 18px; padding: 0 5px;}
.content .main .footer .saveLocation .radio-box .name {cursor: pointer;}
.content .main .footer .saveLocation .radio-box .name i.circular {display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ccc; vertical-align: top; margin-top: 12px; margin-right: 14px;}
.content .main .footer .saveLocation .radio-box .name i.circular.on {border-color: #f5610c;}

.content .main .top .btn.file input {position: absolute; right: 0; top: 0; opacity: 0; width: 100%;}
.content .main .top .btn.file input:hover {background: rgb(43, 155, 131); color: #fff; text-decoration: none;}

/* 纯css实现table的表头固定tbody内容显示垂直滚动条 -- 拼接法 */
.table-box {width: 100%; max-height: 558px; border: 1px solid #e5e5e5;}
/*设置table-layout: fixed固定宽度，表头和表体需要对齐*/
.table-box table {table-layout: fixed; width: 100%; line-height: 40px; text-align: center;}
.table-box .table-body {overflow-y: auto; max-height: 516px;}/*设置表体内容div高*/
.table-box table th {text-align: center; background: #eee;}
.table-box table td {color: #ababab; border-bottom: 1px dashed #e5e5e5;}
.table-box table td .picName {display: inline-block; width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; vertical-align: middle;}
.table-box table td .btn {font-size: 14px; color: #34a88e; line-height: 26px;}
.table-box table td img {vertical-align: top;}
.table-box table td .todo {font-size: 14px; display: inline-block; -width: 56px;}
.table-box table td .todo.btn-text.danger {color: #f56c6c;}

.isLoading {font-size: 18px; color: #999; text-align: center; margin-top: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0;}
</style>