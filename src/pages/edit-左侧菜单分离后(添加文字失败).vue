<template>
  <div class="edit">
    <editMenu :isShowAddPicsDialog="isShowAddPicsDialog" @getShowAddPicsDialog="getShowAddPicsDialog" @getFontFamily="getFontFamily" @getCurDragDecorate="getCurDragDecorate" @getCurDragImg="getCurDragImg"></editMenu>

    <div class="edit-content">
      <div class="edit-top-bor">
        <ul class="edit-left">
          <li class="undo">
            <a href="javascript:"><i class="icon-undo"></i>撤销</a>
          </li>
          <li class="redo">
            <a href="javascript:"><i class="icon-redo"></i>恢复</a>
          </li>
          <li>
            <a href="javascript:"><i class="icon-eye"></i>预览</a>
          </li>
          <li>
            <span class="btn" @click="lastSave = true">先保存</span>
          </li>
          <li>
            <span class="btn" @click="toJson">后toJSON</span>
          </li>
          <li>
            <span class="btn" @click="isDesk = true">单页编辑</span>
          </li>
          <li>
            <span class="btn" @click="isDesk = false">双页编辑</span>
          </li>
        </ul>
        <ul class="edit-right">
          <li @click="isShowPrice = true">
            <a href="javascript:"><i class="icon-cion"></i>了解价格</a>
          </li>
          <li>
            <a href="javascript:"><i class="icon-save"></i>保存</a>
          </li>
          <li @click="addCart">
            <a href="javascript:"><i class="icon-shopping_cart"></i>加入购物车</a>
          </li>
        </ul>
      </div>
      <i class="btn-icon icon-prev" @click="toPrevPage"></i>
      <i class="btn-icon icon-next" @click="toNextPage"></i>
      <div class="canvas-box">
        <div @dragover="allowDrop">
          <fabricBox1 idName="canvasPrev" :pageData="pageDataSingle" :curDragImg="curDragImg" :lastSave="lastSave" @getObj="getObj" :isEditImg="isEditImg" :dragType="dragType" :fontFamily="fontFamily" :deskScale="deskScale" v-if="isDesk" :curDragDecorate="curDragDecorate" @getOldPageData="getOldPageData"></fabricBox1>
          <!-- <fabricBox2 idName="canvasPrev" :pageData="pagePrevData" :curDragImg="curDragImg" @getJson="getPagePrevData" :lastSave="lastSave" @getObj="getObj" :isEditImg="isEditImg" :dragType="dragType" :fontFamily="fontFamily" :deskScale="deskScale" v-if="!isDesk" :curDragDecorate="curDragDecorate"></fabricBox2><fabricBox2 idName="canvasNext" :pageData="pageNextData" :curDragImg="curDragImg" @getJson="getPageNextData" :lastSave="lastSave" @getObj="getObj" :isEditImg="isEditImg" :dragType="dragType" :fontFamily="fontFamily" :deskScale="deskScale" v-if="!isDesk" :curDragDecorate="curDragDecorate"></fabricBox2> -->
        </div>

        <!-- 图片编辑框 --><!-- 装饰编辑框 -->
        <imgEdit v-if="isEditImg" :curEditImg="curEditImg" @getIsEditImg="getIsEditImg" @getIsCutImg="getIsCutImg"></imgEdit>
        <!-- 文字编辑框 -->
        <fontEdit v-if="isEditFont" :curEditFont="curEditFont" @getIsEditFont="getIsEditFont" :deskScale="deskScale"></fontEdit>
        <!-- 图片裁剪 -->
        <imgCut v-if="isCutImg" :curCutImg="curCutImg" @clip-save="getClipSave" @getIsCutImg="getIsCutImg"></imgCut>
      </div>
      
      <div class="edit-bottom">
        <div class="btn-box">
          <div class="btn-left">
            <a class="pic-btn" :class="{'on': !isShowPage}" @click="isShowPage = !isShowPage">照片</a>
            <a class="page-btn" :class="{'on': isShowPage}" @click="isShowPage = !isShowPage">页面</a>
            <span class="totalPage">共计{{isShowPage ? filePageData.length : filePicData.length}} 张{{isShowPage ? '页面' : '图片'}}</span>
          </div>
          <ul class="btn-right">
            <li href="javascript:"><img src="/static/bfl-img/edit/delTemp.svg" alt="">删除模板</li>
            <li href="javascript:" @click="isAllFill = true"><img src="/static/bfl-img/edit/allFill.svg" alt="">整本填充</li>
            <li href="javascript:"><img src="/static/bfl-img/edit/singleFill.svg" alt="">单页填充</li>
            <li href="javascript:" @click="isShowAddPicsDialog = true"><img src="/static/bfl-img/edit/addPic.svg" alt="">添加照片</li>
            <li href="javascript:" @click="isDelPic = !isDelPic"><img src="/static/bfl-img/edit/delPic.svg" alt="">删除照片</li>
            <li href="javascript:"><input type="checkbox">隐藏已用照片</li>
          </ul>
        </div>
        <div class="btn-list">
           
        </div>
        <div class="pic-box">
          <i class="btn-icon icon-prev" v-show="isShowPage" @click="prevPic"></i>
          <i class="btn-icon icon-next" v-show="isShowPage" @click="nextPic"></i>
          <div class="img-list">
            <ul class="ul1 pics-box" v-show="!isShowPage">
              <li class="pics" v-for="(img, idx) in filePicData">
                <img height="78" draggable="true" 
                  :src="img.src + '?imageView2/2/w/400'" alt="" :clsaa="'img' + idx" 
                  :title="img.name" 
                  @mousedown="drag('照片', 0, $event)"
                />
                <h1 class="ellipsis" :title="img.name">{{img.name}}</h1>
                <i class="el-icon-error" :class="{'on': isDelPic}" @click="delPic(idx)"></i>
              </li>
            </ul>
            <ul class="ul1 pages-box" v-show="isShowPage">
              <li class="pages" v-for="(page, idx) in filePageData">
                <ul class="pageBox" v-if="idx % 2 == 0 && !isDesk" @click="curPages = idx" :class="{'on': curPages == idx}">
                  <li class="item" style="display: inline-block;">
                    <img height="60" :src="'/static/bfl-img/' + filePageData[idx].images" alt="" :class="'page' + idx" style="background: #fff;"/>
                    <p v-if="filePageData[idx].index == 0">封底(1)</p>
                    <p v-if="filePageData[idx].index == 1">封面(2)</p>
                    <p v-if="filePageData[idx].index == 2">扉页</p>
                    <p v-if="filePageData[idx].index > 2">{{filePageData[idx].index}}页</p>
                  </li><!-- 
                   --><li class="item" style="display: inline-block;">
                    <img height="60" :src="'/static/bfl-img/' + filePageData[idx + 1].images" alt="" :class="'page' + idx" style="background: #fff;"/>
                    <p v-if="filePageData[idx + 1].index == 0">封底(1)</p>
                    <p v-if="filePageData[idx + 1].index == 1">封面(2)</p>
                    <p v-if="filePageData[idx + 1].index == 2">扉页</p>
                    <p v-if="filePageData[idx + 1].index > 2">{{filePageData[idx + 1].index}}页</p>
                  </li>
                </ul>
                <div v-if="isDesk" class="pageBox" @click="curPages = idx" :class="{'on': curPages == idx}">
                  <img height="60" :src="'http://pex7ss6vd.bkt.clouddn.com/' + filePageData[idx].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
                  <p>{{filePageData[idx].name}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 了解价格 -->
    <el-dialog class="priceDialog dialogCSS" :visible.sync="isShowPrice">
      <h1><img src="/static/bfl-img/edit/price.png" alt="">了解价格</h1>
      <p class="price-box">
        当前作品金额为：<span class="money">￥58.00元</span>
      </p>
      <p>
        <span class="btn" @click="isShowPrice = false">确 定</span>
      </p>
    </el-dialog>

    <!-- 加入购物车 -->
    <el-dialog class="addCartDialog dialogCSS" :visible.sync="isShowAddCart">
      <div class="unfinished" v-if="!isFinished">
        <h1>
          <img src="/static/bfl-img/common/write.png" alt="">
          未编辑页面列表
        </h1>
        <p class="tip">
          以下页面未编完成！请完成后,再放入购物车！
        </p>
        <ul class="box">
          <li v-for="itemList in unfinishedList">
            <span v-for="(item, idx) in itemList">{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="finished" v-if="isFinished">
        <p class="price-box">
          <i class="el-icon-success"></i>成功加入购物车！
        </p>
        <p>
          <span class="btn" @click="isShowAddCart = false">确 定</span>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editMenu from '@/components/editMenu' // 左侧菜单栏
import tempData2 from '@/data/data.json'
// import tempData1 from '@/data/deskData.json' // 台历
import tempData1 from '@/data/deskData-2.json' // 台历
import fabricBox1 from '@/components/fabricBox-1' // 台历-canvas组件
import fabricBox2 from '@/components/fabricBox-2' // 相册-canvas组件
import imgEdit from '@/components/imgEdit' // 图片编辑框
import fontEdit from '@/components/fontEdit' // 文字编辑框
import imgCut from '@/components/imgCut' // 图片裁剪框

export default {
  name: 'edit',
  components: {
    editMenu,
    fabricBox1,
    fabricBox2,
    imgEdit,
    fontEdit,
    imgCut
  },
  data () {
    return {
      isShowPage: false, // 是否显示-页面
      filePicData: [], // '添加照片'的file数据
      isShowAddPicsDialog: false, // 模态框是否显示-添加照片
      filePageData: [], // 页面内容
      isShowPrice: false, // 了解价格
      isShowAddCart: false, // 加入购物车
      isFinished: false, // 是否编辑完成
      unfinishedList: [
        ['封底(1)', '封面(2)'],
        ['封底(1)', '封面(2)'],
        ['封底(1)', '封面(2)'],
      ],
      pageDataSingle: [], // 单页编辑数据
      curDragImg: '', // 当前拖拽的照片
      lastSave: false,
      isEditImg: false, // 是否编辑图片
      isDisable: false, // 防止重复点击
      curEditImg: '', // 当前图片编辑对象
      isCutImg: false, // 是否裁剪图片
      curCutImg: '', // 剪切图片的数据true
      isEditFont: false, // 是否编辑文字
      curEditFont: '', // 当前编辑的文字对象
      dragType: '', // 拖拽类型
      fontFamily: '', // 字体
      isDelPic: false, // 删除照片按钮
      canvasPrev: '',
      canvasNext: '',
      pagePrevData: '',
      pageNextData: '',
      cPath: '',
      tempData1: tempData1, // 单页
      tempData2: tempData2, // 双页
      curPages: 20,
      clipPrevPathData: [],
      clipNextPathData: [],
      curDragDecorate: '', // 当前拖拽的装饰图片
      curFabricBox: '',
      imgListScrollLeft: 0,
      token: '',
      dialogFormVisible: false, // 添加照片
      isDesk: true, // 台历编辑
      choseArr: [], // 选中
      isAllFill: false, // 整本填充
      isSaveFinished: false, // 已完成保存
      isSaveUnfinished: false, // 未完成保存
      layerLen: 0, // 数据最多layer数-->用于防止点击过快
      oldCurPages: 0, // 上一页
    }
  },
  computed: {
    deskScale() {
      if(this.isDesk) {
        return 0.25 // 台历页面缩放
      }  else {
        return 1 // 相册页面缩放
      }
    }
  },
  watch: {
    /*$route(){
      this.curPages = this.$route.query.curPages
    },*/
    curPages(newVal, oldVal) {
      this.$router.push({path: '/edit', query: {'curPages': newVal}})
      if(oldVal) {
        this.oldCurPages = oldVal
      }
      this.isEditImg = false
      if(this.isDesk) { // 单页编辑
        this.filePageData = JSON.parse(JSON.stringify(this.tempData1.tplInfos.page)) // 台历
        this.pageDataSingle = this.filePageData[newVal]

        // this.pageOnCss(1, newVal, oldVal)
      } else { // 双页编辑
        this.pagePrevData = this.filePageData[newVal]
        this.pageNextData = this.filePageData[newVal + 1]

        // this.pageOnCss(2, newVal, oldVal)
      }
    },
    curTempListidx(newVal, oldVal) {
      var ul = $('.tempList')
      var pages = ul.children()
      var curPage = $(pages[newVal + 1])
      if(newVal > oldVal) {
        if(newVal < (pages.length - 1)) {
          newVal += 1
          var curPageOffW = curPage.offset().left - ul.offset().left + curPage.width()
          if(curPageOffW > ul.width()) {
            var scrollLeft = ul.scrollLeft()
            ul.scrollLeft(scrollLeft + curPage.width() + 20)
          }
        }
      } else {
        if(newVal > 0) {
          newVal -= 1
          var curPageOffW = curPage.offset().left - ul.offset().left - curPage.width()
          if(curPageOffW <= curPage.width()) {
            var scrollLeft = ul.scrollLeft()
            ul.scrollLeft(scrollLeft - curPage.width() - 20)
          }
        }
      }
    },
    isShowPage(newVal) {
      this.$nextTick(function() {
        if(newVal) {
          $('.img-list').scrollLeft(this.imgListScrollLeft)
        }
      })
    },
    isAllFill(newVal) { // 整本填充
      this.$confirm('您确定要自动填充整本页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$alert('填充成功', '提示', {
          type: 'success',
          confirmButtonText: '确定',
        }); 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消整本填充'
        });          
      });
      this.isAllFill = false
    },
    isSaveFinished() {
      const h = this.$createElement;
      this.$msgbox({
        title: '已完成该相册作品，放入已完成作品列表',
        message: h('p', null, [
          h('span', {style: 'font-size: 16px; line-height: 110px; display: inline-block; padding-left: 100px;'}, '我的相册'),
          h('input', {style: 'width: 280px; border: 1px solid #bbb; line-height: 38px; margin-left: 12px; margin-right: 100px; padding: 0 10px;'}, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        });
      });
    },
    isSaveUnfinished() {
      const h = this.$createElement;
      this.$msgbox({
        title: '未完成该相册作品，放入未完成作品列表',
        message: h('p', null, [
          h('span', {style: 'font-size: 16px; line-height: 110px; display: inline-block; padding-left: 100px;'}, '我的相册'),
          h('input', {style: 'width: 280px; border: 1px solid #bbb; line-height: 38px; margin-left: 12px; margin-right: 100px; padding: 0 10px;'}, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        });
      });
    },
    deep: true
  },
  methods: {
    toJson() {
      if(this.lastSave) {
        var finalData = JSON.parse(JSON.stringify(tempData2))
        var finalPageData = finalData.pages.page
        var filePageData = JSON.parse(JSON.stringify(this.filePageData))
        filePageData.forEach((item1, idx1)=> {
          if(item1.index == 2) {
            filePageData.splice(idx1, 1)
          }
        })
        // console.log(finalPageData, filePageData)
        filePageData.forEach((item1, idx1)=> {
          if(item1.oldFabric) {
            finalPageData[idx1].layer.map((item3, idx3)=> {
              if(item3.img.url) {
                if(item3.img.url.indexOf('http://zhengrongrong') == -1) {
                  item3.img.url = 'http://zhengrongrong.top/static/bfl-img/' + item3.img.url
                }
                // console.log(item3.img.url)
              } else if(item3.mask.url) {
                if(item3.mask.url.indexOf('http://zhengrongrong') == -1) {
                  item3.mask.url = 'http://zhengrongrong.top/static/bfl-img/' + item3.mask.url
                }
              }
              return item3
            })
            var canvas = JSON.parse(JSON.stringify(item1.oldFabric))
            var data = canvas.objects
            data.forEach((item2, idx2)=> {
              if(item2.name) {
                if(item2.name == 'img') {
                  var obj = {
                    type: "image",// -- 层类型. image为图片,text为文字.
                    isEditable: "true",// -- 是否可编辑.true为可编辑
                    alpha: "1",// --透明度
                    blendmode: "0",
                    layertype: "2",// 2填充的图片
                    rect: "",// 位置
                    img: {
                      id: "",//--编号
                      url: "",// --路径
                      isColorOptimize: "0",
                      isSkinColorOptimize: "0",
                      imageRotation: "", // --旋转角度
                      primitiveWidth: "",// --原始尺寸
                      primitiveHeight: "",// --原始尺寸
                      imageRect: "",//  --显示尺寸
                    }
                  }
                  // var moveL = item2.left - item2.clipObj.left
                  // var moveT = item2.top - item2.clipObj.top
                  // obj.rect = [item2.left, item2.top, item2.clipObj.width, item2.clipObj.height].join(';') // otiginX - center 前
                  obj.rect = [item2.left - item2.width * item2.scaleX / 2, item2.top - item2.height * item2.scaleX / 2, item2.clipObj.width, item2.clipObj.height].join(';') // otiginX - center 后
                  obj.img.originLeft = item2.left - item2.width * item2.scaleX / 2
                  obj.img.originTop = item2.top - item2.height * item2.scaleX / 2
                  obj.img.id = idx2
                  obj.img.url = item2.src
                  obj.img.scale = item2.scaleX
                  obj.img.imageRotation = item2.angle
                  obj.img.primitiveWidth = item2.width
                  obj.img.primitiveHeight = item2.height
                  obj.img.imageRect = [0, 0, Math.round(item2.width*item2.scaleX), Math.round(item2.height*item2.scaleX)].join(';')
                  finalPageData[idx1].layer.push(obj)
                  // obj.img.clipObj = item2.clipObj
                  // console.log(JSON.stringify(obj))
                }
              }
            })
            // console.log(finalPageData[idx1].layer)
          }
        })
        console.log(finalData)
        console.log(JSON.stringify(finalData))
      } else {
        alert('请先保存!')
      }
    },
    addCart() {
      this.isShowAddCart = true
    },
    prevPic(e) {
      if(this.isShowPage) {
        this.toPrevPage()
      }
    },
    nextPic(e) {
      if(this.isShowPage) {
        this.toNextPage()
      }
    },
    getShowAddPicsDialog(val) {
      this.isShowAddPicsDialog = val
    },
    pageOnCss(num, newVal, oldVal) {
      this.imgListScrollLeft = $('.img-list').scrollLeft()
      var ul = $('.pages-box')
      var pages = ul.children()
      var curPage = $(pages[newVal + num])
      if(newVal > oldVal) {
        if(newVal < (pages.length - num)) {
          var imgList = $('.img-list')
          var curPageOffW = curPage.offset().left - imgList.offset().left + curPage.width()
          if(curPageOffW > imgList.width()) {
            var scrollLeft = imgList.scrollLeft()
            imgList.scrollLeft(scrollLeft + curPage.width())
            this.imgListScrollLeft = imgList.scrollLeft()
          }
        }
      } else {
        if(newVal > 0) {
          var imgList = $('.img-list')
          var curPageOffW = curPage.offset().left - imgList.offset().left - curPage.width()
          if(curPageOffW <= curPage.width()) {
            var scrollLeft = imgList.scrollLeft()
            imgList.scrollLeft(scrollLeft - curPage.width())
            this.imgListScrollLeft = imgList.scrollLeft()
          }
        }
      }
    },
    allowDrop(e) {
      // this.curFabricBox = e.target
      // console.log(this.curFabricBox)
    },
    drag(name, idx, e) { // @dragstart: 在用户开始拖动元素时执行
      $(e.target.closest('li')).siblings().removeClass('on')
      $(e.target.closest('li')).addClass('on')
      this.dragType = name
      switch (name) {
        case '文字': // 文字
          this.fontFamily = this.editList[1].item[idx].title.split(' ')[0]
          // console.log(idx, fontFamily)
          // this.curEditFont = ''
          // this.isEditFont = true
          // console.log(this.curEditFont)
          break
        case '图片': // 图片
          console.log('图片', idx)          
          break
        case '装饰': // 装饰
          this.curDragDecorate = e.target        
          break
        case '背景': // 背景
          console.log('背景', idx)    
          break
        default:
          this.curDragImg = e.target
      }
    },
    toPrevPage() {
      this.curPages *= 1
      if(this.isDisable) { // 防止重复点击
        return
      } else {
        this.isDisable = true
        var ul = $('.pages-box')
        var pages = ul.children()
        var curPage = $(pages[this.curPages])
        if(this.curPages > 0) {
          if(this.isDesk) {
            this.curPages -= 1
          } else {
            this.curPages -= 2
          }
          var imgList = $('.img-list')
          var curPageOffW = curPage.offset().left - imgList.offset().left - curPage.width()
          if(curPageOffW <= curPage.width()) {
            var scrollLeft = imgList.scrollLeft()
            imgList.scrollLeft(scrollLeft - curPage.width())
            this.imgListScrollLeft = imgList.scrollLeft()
          }
        }
        setTimeout(() => {
          this.isDisable = false
        }, (this.layerLen + 1) * 100)
      }
    },
    toNextPage() {
      this.curPages *= 1
      if(this.isDisable) { // 防止重复点击
        return
      } else {
        this.isDisable = true
        var ul = $('.pages-box')
        var pages = ul.children()
        if(this.isDesk) {
          var curPage = $(pages[this.curPages + 1])
          if(this.curPages < (pages.length - 1)) {
            this.curPages += 1
            var imgList = $('.img-list')
            var curPageOffW = curPage.offset().left - imgList.offset().left + curPage.width()
            if(curPageOffW > imgList.width()) {
              var scrollLeft = imgList.scrollLeft()
              imgList.scrollLeft(scrollLeft + curPage.width())
              this.imgListScrollLeft = imgList.scrollLeft()
            }
          }
        } else {
          var curPage = $(pages[this.curPages + 2])
          if(this.curPages < (pages.length - 2)) {
            this.curPages += 2
            var imgList = $('.img-list')
            var curPageOffW = curPage.offset().left - imgList.offset().left + curPage.width()
            if(curPageOffW > imgList.width()) {
              var scrollLeft = imgList.scrollLeft()
              imgList.scrollLeft(scrollLeft + curPage.width())
              this.imgListScrollLeft = imgList.scrollLeft()
            }
          }
        }
        setTimeout(() => {
          this.isDisable = false
        }, (this.layerLen + 1) * 100)
      }
    },
    getObj(obj) {
      if(obj) { 
        if(obj.name == "img" || obj.name == 'decorate' || obj.name == "fillImg") {
          this.isEditImg = true
          this.curEditImg = obj
        } else if(obj.name == "text" || obj.type == "text") {
          // console.log(obj)
          this.isEditFont = true
          this.curEditFont = obj
        } else {
          this.isEditImg = false
          this.isEditFont = false
        }
      } else {
        if(!obj) {
          this.isEditImg = false
          this.isEditFont = false
        }
      }
    },
    getIsEditImg(val) {
      this.isEditImg = val
    },
    getIsEditFont(val) {
      this.isEditFont = val
    },
    getIsCutImg(val) {
      this.isCutImg = val
      this.curCutImg = this.curEditImg
    },
    getClipSave(val) {
      console.log(val)
    },
    getOldPageData(val) {
      if(this.oldCurPages == val.name) {
        
      }
      // console.log(JSON.stringify(val))
    },
    getFontFamily(val) {
      this.fontFamily = val
    },
    getCurDragDecorate(val) {
      this.curDragDecorate = val
    },
    getCurDragImg(val) {
      this.curDragImg = val
    },
    /*getPagePrevData(val) {
      // console.log('prev', val)
      // console.log(this.filePageData)
    },
    getPageNextData(val) {
      // console.log('next',val)
    },*/
  },
  mounted() { 
    this.myFabric.namedImage()
    this.isSaveFinished = false // 已完成保存-测试
    this.isSaveUnfinished = false // 未完成完成保存-测试

    if(this.$route.query.curPages) {
      this.curPages = this.$route.query.curPages
    }
    
    if(this.isDesk) { // 单页编辑
      var data = this.tempData1.tplInfos.page
      for(var i = 0, len = data.length; i < len; i++) {
        this.layerLen = data[i].layer.length > this.layerLen ? data[i].layer.length : this.layerLen
      }
      this.filePageData = JSON.parse(JSON.stringify(data)) // 台历
      this.pageDataSingle = this.filePageData[this.curPages]

      // this.pageOnCss(1, this.curPages, this.curPages)
    } else { // 双页编辑
      this.filePageData = JSON.parse(JSON.stringify(tempData2.pages.page))
      // 加上扉页
      this.filePageData.splice(2, 0, {
        text: '扉页,缤纷乐相册书从这里开始',
        index: '2',
        images: 'Templatethumb/feiYe.jpg'
      })
      // 相册数据
      this.pagePrevData = this.filePageData[this.curPages]
      this.pageNextData = this.filePageData[this.curPages + 1]
    }


    var obj = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/FnnADUOMXNcdkqyRrDeccej8HlFr',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj)
    var obj1 = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/FlP3HMDAv4nuh5DJIeLn-fz0kyZS',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj1)
    var obj2 = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/Fj9kgD7FEdIEmCxN6d7S8Nv4XaIj',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj2)

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit-content {min-width: 1010px; position: absolute; top: 40px; bottom: 0px; right: 0px; left: 200px; min-height: 688px;}

.edit .edit-content .edit-top-bor {position: absolute; z-index: 10; width: 100%;background: #eee; border-radius: 4px;}
.edit .edit-content .edit-top-bor ul {display: inline-block; font-size: 14px; color: #999;}
.edit .edit-content .edit-top-bor ul.edit-right {float: right;}
.edit .edit-content .edit-top-bor ul.edit-right i {color: #ff7800;}
.edit .edit-content .edit-top-bor ul li {display: inline-block; height: 40px; line-height: 40px; margin: 0 10px 0 2px;}
.edit .edit-content .edit-top-bor ul li > .btn {display: inline-block; border: 1px solid black; margin-left: 10px; cursor: pointer; border: 1px solid black; border-radius: 254px 16px 226px 16px/16px 226px 16px 254px; padding: 0 18px; background: #fff; color: #ff7800; font-size: 20px; vertical-align: middle;}
.edit .edit-content .edit-top-bor ul li.undo > a {color: #aaa; cursor: not-allowed;}
.edit .edit-content .edit-top-bor ul li.redo > a {color: #aaa; cursor: not-allowed;}
.edit .edit-content .edit-top-bor ul li i {margin: 0 10px; color: #aaa;}
.edit .edit-content .edit-top-bor ul li i.icon-eye {color: #ff7800;}

.edit .edit-bottom {width: 100%; height: 146px; position: absolute; bottom: 0px; background: #eee; border-radius: 4px; font-size: 12px;}
.edit .edit-bottom .btn-box >div { display: inline-block;}
.edit .edit-bottom .btn-box >div a { display: inline-block; padding: 8px 18px;}
.edit .edit-bottom .btn-box .btn-left { margin-left: 60px;}
.edit .edit-bottom .btn-box .btn-left a { border: 1px solid transparent;}
.edit .edit-bottom .btn-box .btn-left a.on,
.edit .edit-bottom .btn-box .btn-left a:hover { background: #fff; border: 1px solid #ccc;}
.edit .edit-bottom .btn-box .btn-left span { color: #aaa; margin-left: 20px;}
.edit .edit-bottom .btn-box .btn-right {float: right; margin-right: 60px;}
.edit .edit-bottom .btn-box .btn-right li {display: inline-block;  padding: 8px 18px; cursor: pointer; position: relative; overflow: hidden;}
.edit .edit-bottom .btn-box .btn-right li .addPics {position: absolute; width: 66%; z-index: 10; opacity: 0;}
.edit .edit-bottom .btn-box .btn-right img,
.edit .edit-bottom .btn-box .btn-right input { vertical-align: middle; margin-right: 5px;}
.edit .edit-bottom .pic-box { position: relative; height: 110px; top: 5px;}
.edit i.btn-icon {z-index: 10; top: 43%; margin-top: -33px; padding-top: 5px;}
.edit .edit-bottom .pic-box i.btn-icon:before {color: #eee;}
.edit .edit-bottom .pic-box .img-list { position: absolute; top: 0px; bottom: 0px; left: 60px; right: 60px; overflow-x: auto; overflow-y: hidden; white-space: nowrap;}
.edit .edit-bottom .pic-box .img-list .ul1 { height: 105px; white-space: nowrap; position: relative; left: 0px;}
.edit .edit-bottom .pic-box .img-list .ul1 li {display: inline-block; text-align: center;}
.edit .edit-bottom .pic-box .img-list .ul1 li.pics {margin: 0 10px 0 0; position: relative; min-width: 90px; user-select: none;}
.edit .edit-bottom .pic-box .img-list .ul1 li h1 {position: absolute; width: 90px; height: 20px; left: 50%; line-height: 20px; margin-left: -45px;}

.canvas-box {width: 100%; position: absolute; top: 0; bottom: 140px; display: flex; justify-content: center; align-items: center; margin-top: 44px;}
.edit .edit-bottom .pic-box .img-list::-webkit-scrollbar {height: 10px;}

.addCartDialog h1 > img {margin-right: 0;}
.addCartDialog p.tip {padding: 16px 0 30px 33px; font-size: 12px; text-align: left; color: #999;}
.addCartDialog .box {width: 365px; height: 480px; border: 1px solid #aaa; margin-left: 8px; overflow-y: auto;}
.addCartDialog .box li {line-height: 40px; padding-left: 38px;}
.addCartDialog .box li span {margin-right: 12px;}
.addCartDialog .box li:nth-child(2n-1) {background: #f4fcf9;}

.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i,
.pics-box .main .picList li .pic > i {color: red; position: absolute; top: -8px; right: -4px; cursor: pointer; background: radial-gradient(#fff, transparent); display: none;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i {top: 0;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i.on,
.pics-box .main .picList li .pic:hover > i {display: inline-block;}

/*@media screen and (min-width: 1440px) and (max-width: 1599px) {}*/
@media screen and (max-width: 1213px) {
  .edit .edit-bottom .btn-box .btn-right {margin-right: 20px;}
}
</style>