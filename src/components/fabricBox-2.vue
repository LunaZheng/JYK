<template>
  <div class="fabricBox" @dragover="allowDrop" @drop="drop" style="position: relative;">
    <div class="flex-box">
      <canvas :id="idName"></canvas>
      <canvas :id="'cPath_' + idName"></canvas>
    </div>

    <i v-if="isTempDataLoading" class="el-icon-loading fabric-loading" style="font-size: 80px; color: #ddd; position: absolute; top: 50%; left: 50%; margin-top: -40px; margin-left: -40px;"></i>

    <!-- 图片裁剪 -->
    <imgCut v-if="isCutImg" :curCutImg="gobj" @getIsCutImg="getIsCutImg" @clip-save="getClipSave"></imgCut>
    <!-- 图片编辑框 --><!-- 装饰编辑框 -->
    <imgEdit v-if="isEditImg" :curEditImg="gobj" :cStep="fStep" @updateModifications="updateModifications" @close="close" @getIsCutImg="getIsCutImg"></imgEdit>
    <!-- 文字编辑框 v-show(才能触发word编辑框消失改变) -->
    <fontEdit v-show="isEditFont" :curEditFont="gobj" :cStep="fStep" @updateModifications="updateModifications" :deskScale="deskScale" @close="close"></fontEdit>
  </div>
</template>

<script>
import imgEdit from '@/components/imgEdit' // 图片编辑框
import fontEdit from '@/components/fontEdit' // 文字编辑框
import imgCut from '@/components/imgCut' // 图片裁剪框

export default {
  name: 'fabricBox',
  props: ["idName", "pageData", "curDragImg", "dragType", "fontFamily", "curDragDecorate", "deskScale", "fStep", "fState", "loadCanvas"],
  components: {
    imgEdit,
    fontEdit,
    imgCut
  },
  data () {
    return {
      canvas: '',
      cPath: '',
      clipPathData: [],
      gobj: '', // fabric 选中的对象
      maxLayerIdx: 0, // 最大的layerIdx
      isCutImg: false, // 是否裁剪
      isEditImg: false, // 是否图片编辑
      isEditFont: false, // 是否文字编辑
      curImgBox: '', // 图片对象编辑状态的路径框
      curClipPathBox: '', // clipPath hover状态
      curFontBox: '', // 文字对象编辑状态的路径框
      // state: [], // 撤销 恢复 数组
      // cStep: -1, // 撤销 恢复 状态值
      isInitOver: false, // 是否初始完毕
      isTempDataLoading: false, // 正在加载模板数据
      oldCnavasObjs: '', // 上一页canvas数据
      isExistBg: false, // 是否已存在背景图(区分背景图和文字图片)
      fillImgNum: 0, // 当前页面填充照片数
      bgColorNum: 0, // 底色数量
      inItOverObjNum: 0, // 初始后对象应该有的数量
      changeStep: false
    }
  },
  computed: {
    ctx() {
      return this.canvas.getContext('2d')
    },
    ctxPath() {
      return this.cPath.getContext('2d')
    },
  },
  watch: {
    pageData(newVal, oldVal) {
      this.isExistBg = false
      this.isInitOver = false
      /*this.state = []
      this.cStep = -1*/
      this.changeStep = false
      this.fillImgNum = 0
      this.bgColorNum = 0
      this.inItOverObjNum = 0
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      this.clipPathData = []
      this.$nextTick(function() {
        if(newVal) {
          // console.log(newVal)
          // console.log(JSON.stringify(newVal))
          this.canvas.setWidth(newVal.pagewidth * this.deskScale)
          this.canvas.setHeight(newVal.pageheight * this.deskScale)
          /*this.cPath.setWidth(newVal.pagewidth * this.deskScale)
          this.cPath.setHeight(newVal.pageheight * this.deskScale)*/
          this.cPath.setWidth(newVal.pagewidth * 0.25)
          this.cPath.setHeight(newVal.pageheight * 0.25) // ?????????????????????????
          this.canvas.clear()
          this.cPath.clear()
          this.addLayer(newVal, this.canvas, this.clipPathData)

          newVal.layer.forEach((item, idx)=> {
            if(item.layertype == 1) {
              this.bgColorNum++
            } else if(item.layertype == 3) {
              if(item.img.fillImg) {
                this.fillImgNum++
              }
            }
          })
          this.inItOverObjNum = newVal.layer.length - this.bgColorNum + newVal.photocount + this.fillImgNum
        }
        if(oldVal.photocount > 0) {
          this.saveToJson(this.oldCnavasObjs, JSON.stringify(oldVal))
        }
      })
    },
    isEditImg(newVal) {
      if(!newVal) {
        if(this.curImgBox) this.canvas.remove(this.curImgBox).renderAll()
      }
    },
    isInitOver(newVal) {
      // console.log(this.canvas._objects.length, this.pageData.layer.length + this.fillImgNum)
      if(newVal) this.updateModifications() // 添加画布记录
    },
    'canvas._objects': function(newVal, oldVal) {
      if(oldVal) {
        if(this.fState.length > 1) {
          this.oldCnavasObjs = JSON.stringify(oldVal)
          // console.log('1---', this.oldCnavasObjs)
        }
      }
    },
    changeStep(newVal, oldVal) {
      if(newVal) {
        // console.log(newVal)
        // this.$emit('getStep', newVal)
        if(newVal > 0) this.oldCnavasObjs = JSON.stringify(this.canvas._objects)
      } 
      this.changeStep = false
    },
    fStep(newVal) {
      // console.log(this.idName.replace('canvas', '') + '-' + newVal)
    },
    deep: true
  },
  methods: {
    toPathFn(src, l, t, canvas, clipPathData, layerIdx) {
      var cw = this.cPath.width;
      var points; // 定义轮廓路径的点数组
      var imgData, data; // 此图像的像素数据用于定义透明

      var img1 = new Image();
      img1.crossOrigin = "anonymous";
      img1.onload = ()=> {
        var namedImg = new fabric.NamedImage(img1, { 
          name: 'path',
          left: l,
          top: t,
          selectable: false,
          evented: false, // 事件阻止
        });
        // namedImg.scale(this.deskScale)
        this.cPath.add(namedImg).renderAll()
        imgData = this.ctxPath.getImageData(namedImg.aCoords.tl.x, namedImg.aCoords.tl.y, this.cPath.width, this.cPath.height);
        data = imgData.data;
        //获取图像的轮廓路径（轮廓=透明像素的外部路径）this.toPath --> 全局函数
        points = this.toPath.geom(function(x, y) { //确定非透明的轮廓
          var a = data[(y * cw + x) * 4 + 3];
          return (a > 20);
        })
        var clipPath = new fabric.Polygon(points, {
          left: namedImg.left,
          top: namedImg.top,
          fill: 'transparent',
          selectable: false,
          evented: false, // 事件阻止
        })
        // this.cPath.remove(namedImg).renderAll()
        // this.canvas.bringToFront(clipPath) //上移(一直向上)
        clipPath.set({
          left: clipPath.left * 1 - 1,
          top: clipPath.top * 1 - 1,
          /*stroke: 'red',
          strokeWidth: 2,*/
        })
        canvas.add(clipPath).renderAll()
        var obj = {
          layerIdx: layerIdx,
          clipPath: clipPath
        }
        clipPathData.push(obj)
      }
      img1.src = src;
    },
    addLayer(newVal, canvas, clipPathData) {
      this.isTempDataLoading = true
      if(newVal.layer) { // 0 / 1 底层背景,2文字(不包括文字图片), 3蒙版和照片
        this.maxLayerIdx = newVal.layer.length
        newVal.layer.forEach((item)=> {
          if(item.layertype == 0) { // 背景 + 文字图片
            if(!this.isExistBg) { // 背景
              this.isExistBg = true
              if(item.img.url) {
                var l = item.primitiveX * this.deskScale
                var t = item.primitiveY * this.deskScale
                var w = item.primitiveWidth * this.deskScale
                var h = item.primitiveHeight * this.deskScale
                this.addImg("http://img.res.excelll.org/" + item.img.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', { 
                  name: 'bgImg',
                  id: item.img.id,
                  layerIdx: item.idx,
                  left: l,
                  top: t,
                  width: w,
                  height: h,
                  centeredRotation: true, // 中心旋转
                  selectable: false,
                  evented: false, // 事件阻止
                }, 1)
              }
            } else { // 文字图片
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              if(item.img.url) {
                this.addImg("http://img.res.excelll.org/" + item.img.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', {
                  name: 'oText',
                  id: item.img.id,
                  layerIdx: item.idx,
                  originX: 'center',
                  originY: 'center',
                  left: l + w/2, // toJson时要减掉
                  top: t + h/2,
                  width: w,
                  height: h,
                  centeredRotation: true, // 中心旋转
                  // selectable: false,
                }, 1)
              }
            }
          } else if(item.layertype == 2) { // 文本文字 + 文字图片
            if(item.img) { // 文字图片
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              if(item.img.url) {
                this.addImg("http://img.res.excelll.org/" + item.img.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', {
                  name: 'oText',
                  id: item.img.id,
                  layerIdx: item.idx,
                  originX: 'center',
                  originY: 'center',
                  left: l + w/2, // toJson时要减掉
                  top: t + h/2,
                  width: w,
                  height: h,
                  opacity: item.img.opacity,
                  angle: item.img.imageRotation,
                  centeredRotation: true, // 中心旋转
                  // selectable: false,
                }, item.img.scale)
              }
            } else {
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              var attrs = {
                name: item.name,
                originX: 'center',
                originY: 'center',
                left: l + w/2, // toJson时要减掉
                top: t + h/2,
                layerIdx: item.idx,
                fontFamily: item.format.fontFamily,
                fontSize: item.format.fontSize * 1,
                strokeWidth: item.format.strokeWidth,
                angle: item.format.angle,
                opacity: item.format.opacity * 1,
                fontWeight: item.format.fontWeight,
                fontStyle: item.format.fontStyle, // 斜体
                stroke: item.format.stroke, // 描边
                strokeWidth: item.format.strokeWidth, // 描边宽度
                textAlign: item.format.textAlign,
                fill : item.format.fill,
                flipX : item.format.flipX,
                flipY : item.format.flipY,
                // lineHeight: item.format.lineHeight,
                // textDecoration: item.format.textDecoration, // 下划线'underline'/中划线'line-through'/上划线'overline'
              }
              var text = new fabric.MyText(item.text, attrs)
              text.scale(item.format.scale)
              if(item.format.shadow) {
                text.setShadow({
                  color: item.format.shadow.color, 
                  offsetX: item.format.shadow.blur, 
                  offsetY: item.format.shadow.blur, 
                  blur: item.format.shadow.blur
                })
              }
              this.canvas.add(text).renderAll()
              this.canvas.bringToFront(text).renderAll() // 置顶
            }
          } else if(item.layertype == 3) { // 蒙版和照片
            if(item.img.mask) {
              var l = item.img.mask.rect.x * this.deskScale
              var t = item.img.mask.rect.y * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              this.addImg("http://img.res.excelll.org/" + item.img.mask.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', { 
                name: 'clipBox',
                id: item.img.mask.id,
                layerIdx: item.idx / 2,
                left: l,
                top: t,
                width: w,
                height: h,
                selectable: false,
                centeredRotation: true, // 中心旋转
                evented: false, // 事件阻止
              }, 1)
              var layerIdx = item.idx
              this.toPathFn("http://img.res.excelll.org/" + item.img.mask.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', l, t, canvas, clipPathData, layerIdx)
            }
            if(item.img.fillImg) {
              var l = item.img.fillImg.rect.x * this.deskScale
              var t = item.img.fillImg.rect.y * this.deskScale
              var w = item.img.fillImg.rect.w * this.deskScale
              var h = item.img.fillImg.rect.h * this.deskScale
              this.addImg(item.img.fillImg.url, {
                name: 'fillImg', // 添加的图片
                originX: 'center',
                originY: 'center',
                left: l + w/2,
                top: t + h/2,
                angle: item.img.fillImg.imageRotation,
                opacity: item.img.fillImg.opacity,
                layerIdx: item.img.fillImg.layerIdx,
                clipObj: item.img.fillImg.clipObj, // 自定义属性--> 裁剪框
                clipTo: 'function(ctx) {this.myClipTo(ctx)}',
              }, item.img.fillImg.scale)
            }
          } else if(item.layertype == 4) { // 装饰
            if(item.img) {
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              if(item.img.url) {
                this.addImg(item.img.url, {
                  name: 'decorate',
                  id: item.img.id,
                  layerIdx: item.idx,
                  originX: 'center',
                  originY: 'center',
                  left: l + w/2, // toJson时要减掉
                  top: t + h/2,
                  width: w,
                  height: h,
                  opacity: item.img.opacity,
                  angle: item.img.imageRotation,
                  centeredRotation: true, // 中心旋转
                }, item.img.scale)
              }
            }
          }
        })
      }
    },
    windingNumber(p, poly, left, top) {
      var px = p.x,
        py = p.y,
        sum = 0
      for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
        var sx = poly[i].x + left,
          sy = poly[i].y + top,
          tx = poly[j].x + left,
          ty = poly[j].y + top
        // 点与多边形顶点重合或在多边形的边上
        var isOn = (sx - px) * (px - tx) >= 0 && (sy - py) * (py - ty) >= 0 && (px - sx) * (ty - sy) === (py - sy) * (tx - sx)
        // 点与相邻顶点连线的夹角
        var angle = Math.atan2(sy - py, sx - px) - Math.atan2(ty - py, tx - px)
        // 确保夹角不超出取值范围（-π 到 π）
        if (angle >= Math.PI) {
          angle = angle - Math.PI * 2
        } else if (angle <= -Math.PI) {
          angle = angle + Math.PI * 2
        }
        sum += angle
        var isIn = Math.round(sum / Math.PI) === 0 ? false : true
      }
      // 计算回转数并判断点和多边形的几何关系
      return (isOn || isIn)
    },
    addImg(src, attrs, scale) {
      var vm = this
      vm.isTempDataLoading = true
      var img = new Image()
      img.src = src
      img.crossOrigin = '';
      img.onload = function() { // 加载完成  
        vm.isTempDataLoading = false
        var namedImg = new fabric.NamedImage(img, attrs)
        if(scale) {
          namedImg.scale(scale)
        }
        // namedImg.hasControls = false // 取消控件-角
        vm.canvas.add(namedImg).renderAll()
        vm.gobj = namedImg
        
        vm.resetZIndex()
        if(namedImg.name == 'bgImg') {
          vm.canvas.forEachObject((item)=> {
            if(item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate' || item.name == 'textBox') {
              vm.canvas.bringToFront(item).renderAll() //置顶
              if(item.name == 'textBox') {
                item.selectable = false
                item.evented = false
                vm.canvas.bringToFront(item).renderAll() //置顶
              }
            }
          })
        } else if(namedImg.name == 'fillImg' || namedImg.name == 'decorate') { 
          if(vm.isInitOver) vm.updateModifications() // 添加画布记录
        }
      }
    },
    allowDrop(e) { // @dragover: 在元素正在拖动到放置目标时触发
      e.preventDefault() // 阻止默认
      var vm = this
      vm.canvas.discardActiveObject() // 不选中
      var x = e.offsetX
      var y = e.offsetY
      vm.clipPathData.forEach((item)=> {
        item.clipPath.set('strokeWidth', 0)
        vm.canvas.renderAll()
        var l = item.clipPath.left
        var t = item.clipPath.top
        var isIn = vm.windingNumber({x: x, y: y}, item.clipPath.points, l, t)
        if(isIn) {
          item.clipPath.set({
            'stroke': '#f7600c',
            'strokeWidth': 2,
          });
          vm.canvas.renderAll()
        }
      })
    },
    drop(e) { // @drop: 在元素拖动到放置目标后触发
              console.log(this.curDragImg.src, e)
      this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()
      var x = e.offsetX
      var y = e.offsetY

      if(this.dragType == '照片') {
        this.clipPathData.forEach((item)=> {
          item.clipPath.set('strokeWidth', 0)
          this.canvas.renderAll()
          var l = item.clipPath.left
          var t = item.clipPath.top

          var isIn = this.windingNumber({x: x, y: y}, item.clipPath.points, l, t)
          if(isIn) {
            var l = item.clipPath.left
            var t = item.clipPath.top
            var w = item.clipPath.width
            var h = item.clipPath.height
            if(this.curDragImg) {
              this.$axios.get(this.curDragImg.src.split('?')[0] +  '?imageInfo')
                .then(response => {
                var res = response.data
                var isWide = res.width > res.height
                if(isWide) {
                  var imgSrc = this.curDragImg.src.split('?')[0] +  '?imageView2/2/h/' + h
                  if(res.height < h) {
                    imgSrc = this.curDragImg.src.split('?')[0] +  '?imageMogr2/thumbnail/x' + h
                    this.$alert('您的照片像素太低，可能影响印刷质量!', '警告', {
                      type: 'warning',
                      showClose: false,
                      confirmButtonText: '确定',
                    });
                  }
                } else {
                  var imgSrc = this.curDragImg.src.split('?')[0] +  '?imageView2/2/w/' + w
                  if(res.width < w) {
                    imgSrc = this.curDragImg.src.split('?')[0] +  '?imageMogr2/thumbnail/' + w + 'x'
                    this.$alert('您的照片像素太低，可能影响印刷质量!', '警告', {
                      type: 'warning',
                      showClose: false,
                      confirmButtonText: '确定',
                    });
                  }
                }
                this.addImg(imgSrc, {
                  // name: 'img',
                  name: 'fillImg',
                  originX: 'center',
                  originY: 'center',
                  left: l + w/2, // 导出json时要改回来
                  top: t + h/2,
                  layerIdx: item.layerIdx, // 保存蒙版在layer数组里的idx
                  clipObj: item.clipPath, // 自定义属性--> 裁剪框
                  clipTo: 'function(ctx) {this.myClipTo(ctx)}',
                })
                // this.canvas.sendBackwards(target).renderAll() // 下移
              })
            }
          }
        })
      } else if(this.dragType == '文字') {
        this.maxLayerIdx += 1
        var text = new fabric.MyText('请点击输入', {
          name: 'text',
          originX: 'center',
          originY: 'center',
          layerIdx: this.maxLayerIdx,
          left: x, 
          top: y,
          fontSize: 18,
          fontFamily: this.fontFamily,
          perPixelTargetFind: false,
        })
        this.canvas.add(text).renderAll()
        this.updateModifications() // 添加画布记录
        this.gobj = text
        this.canvas.setActiveObject(text)
        this.isEditFont = true
      } else if(this.dragType == '装饰') {
        if(this.curDragDecorate) {
          this.maxLayerIdx += 1
          this.addImg(this.curDragDecorate.src, {
            name: 'decorate',
            originX: 'center',
            originY: 'center',
            layerIdx: this.maxLayerIdx,
            left: x, 
            top: y,
          })
        }
      }
    },
    onChange(options) {
      let optObj = options.target
      optObj.setCoords();
      // if(optObj.angle == 0) {
        if(optObj.name == 'img' || optObj.name == 'fillImg') {
          let clipObjT = optObj.clipObj.top
          let clipObjL = optObj.clipObj.left
          let clipObjW = optObj.clipObj.width
          let clipObjH = optObj.clipObj.height
          let optL = optObj.left
          let optT = optObj.top
          let optW = optObj.width*optObj.scaleX
          let optH = optObj.height*optObj.scaleX
          if((optL-optW/2)>clipObjL) {
            optObj.set('left', clipObjL + optW/2)
          }
          if((optT-optH/2)>clipObjT) {
            optObj.set('top', clipObjT + optH/2)
          }
          if((optL + optW/2)<(clipObjL + clipObjW)) {
            optObj.set('left', (clipObjL + clipObjW)-optW/2)
          }
          if((optT + optH/2)<(clipObjT + clipObjH)) {
            optObj.set('top', (clipObjT + clipObjH)-optH/2)
          }
        } else if(optObj.name == 'text' || optObj.name == 'oText') {
          if(this.curFontBox) {
            this.curFontBox.set({
              top: optObj.top,
              left: optObj.left,
            })
          }
        }
      // } else if(optObj.angle == 45) {
      //   console.log(optObj.angle)
      // }
    },
    /*toSaveOldFabric(pageData) {
      if(pageData && pageData.layer) {
        var canvas = JSON.parse(JSON.stringify(this.canvas))
        pageData.oldFabric = canvas
        this.$emit('getJson', pageData)
      }
    },*/
    saveToJson(objs, oldPageData) {
      if(objs) {
        var objs = JSON.parse(objs)
        var oldPageData = JSON.parse(oldPageData)
        // console.log('saveToJson')
        // console.log(JSON.stringify(oldPageData))
        oldPageData.layer.forEach((item)=> {
          if(item.layertype == 3) { // push 入蒙版
            item.img.fillImg = ''
          }
        })
        var arr = []
        objs.forEach((item)=> {
          if(item.name == 'bgImg') {
            oldPageData.layer.forEach((pageItem)=> {
              if(pageItem.layertype == 0) { // push 入蒙版|背景
                var id = pageItem.img.url.split('/')[1]
                if(item.src.indexOf(id) > -1) arr.push(pageItem)
              }
            })
          } else if(item.name == 'fillImg') {
            var x = (item.left - item.width / 2) / this.deskScale
            var y = (item.top - item.height / 2) / this.deskScale
            var w = item.width / this.deskScale
            var h = item.height / this.deskScale
            for(let i = 0, len = oldPageData.layer.length; i < len; i++) {
              if(oldPageData.layer[i].idx == item.layerIdx) { // push 入蒙版|背景
                if(oldPageData.layer[i].img.mask) {
                  oldPageData.layer[i].img.fillImg = {
                    url: item.src,
                    clipObj: item.clipObj, // 裁剪框
                    opacity: item.opacity, // --透明度
                    layerIdx: item.layerIdx, // 保存蒙版在layer数组里的idx
                    scale: item.scaleX,
                    imageRotation: item.angle, // --旋转角度
                    rect: {// 位置
                      x: x,
                      y: y,
                      w: w,
                      h: h
                    },
                    filter: '', // 滤镜
                  }
                }
              }
            }
          } else if(item.name == 'oText') {
            var x = (item.left - item.width / 2) / this.deskScale
            var y = (item.top - item.height / 2) / this.deskScale
            var w = item.width / this.deskScale
            var h = item.height / this.deskScale
            var src = item.src.replace("http://img.res.excelll.org/", '').split('?')[0]
            var obj = {
              layertype: 2,
              primitiveX: x,
              primitiveY: y,
              primitiveWidth: w,
              primitiveHeight: h,
              img: {
                  id: item.id,
                  url: src,
                  imageRotation: item.angle,
                  scale: item.scaleX,
                  opacity: item.opacity == null ? 1 : item.opacity, // 透明度
                  originRect: "",
                  rectangleImg: false
              },
              idx: item.layerIdx
            }
            arr.push(obj)
          } else if(item.name == 'text') {
            var x = (item.left - item.width / 2) / this.deskScale
            var y = (item.top - item.height / 2) / this.deskScale
            var w = item.width / this.deskScale
            var h = item.height / this.deskScale
            var text = {
              layertype: 2, // 2文字(包括文字图片)
              idx: item.layerIdx,
              name: item.name,
              primitiveX: x,
              primitiveY: y,
              primitiveWidth: w,
              primitiveHeight: h,
              text: item.text, // 文本(文字图片时为空) (+)
              format: { // 文字格式 (+)
                fontFamily: item.fontFamily, // 字体
                fontSize: item.fontSize, // 大小
                scale: item.scaleX, // 缩放
                angle: item.angle, // 旋转角度
                opacity: item.opacity, // 透明度
                fontWeight: item.fontWeight, // 文字加粗
                fontStyle: item.fontStyle, // 斜体
                stroke: item.stroke == null ? '' : item.stroke, // 描边颜色
                strokeWidth: item.strokeWidth, // 描边宽度
                textAlign: item.textAlign, // 对齐方式
                lineHeight: item.lineHeight, 
                // textDecoration: item.linethrough, // 下划线'underline'/中划线'line-through'/上划线'overline'
                fill: item.fill, // 文字颜色
                flipX: item.flipX, // 水平镜像
                flipY: item.flipY, // 垂直镜像
                border: "", // 边框
                rect: {
                  x: x,
                  y: y,
                  w: w,
                  h: h
                },
                shadow: ''
              }
            }
            if(item.shadow) {
              text.format.shadow = { // 阴影
                color: item.shadow.color,
                blur: item.shadow.blur // 模糊宽度
              }
            }
            arr.push(text)
          } else if(item.name == 'decorate') {
            var x = (item.left - item.width / 2) / this.deskScale
            var y = (item.top - item.height / 2) / this.deskScale
            var w = item.width / this.deskScale
            var h = item.height / this.deskScale
            var obj = {
              layertype: 4,
              idx: item.layerIdx,
              primitiveX: x,
              primitiveY: y,
              primitiveWidth: w,
              primitiveHeight: h,
              img: {
                  url: item.src,
                  imageRotation: item.angle,
                  scale: item.scaleX,
                  opacity: item.opacity, // 透明度
              },
            }
            arr.push(obj)
          }
        })
        oldPageData.layer.forEach((item)=> {
          if(item.layertype == 3) { // push 入蒙版
            arr.push(item)
          }
        })
        /*oldPageData.layer = []
        oldPageData.layer = arr*/
        // Array.prototype.push.apply(oldPageData.layer, arr)
        // console.log(JSON.stringify(oldPageData))
        var page = {
          name: oldPageData.name,
          idx: oldPageData.idx,
          photocount: oldPageData.photocount,
          pagewidth: oldPageData.pagewidth,
          pageheight: oldPageData.pageheight,
          thumb: oldPageData.thumb,
          thumbed: oldPageData.thumbed,
          layer: arr
        }
        if(this.idName == 'canvasSingle') {
          this.$emit('getOldPageData', page)
        } else if(this.idName == 'canvasPrev') {
          this.$emit('getJson', page)
        } else if(this.idName == 'canvasNext') {
          this.$emit('getJson', page)
        }
        this.oldCnavasObjs = ''
      }
    },
    resetZIndex() {
      this.canvas.forEachObject((item)=> {
        if(item.name == 'clipBox') {
          this.canvas.sendToBack(item).renderAll() // 置底
        } else if(item.name == 'bgImg' || item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate' || item.name == 'textBox') {
          this.canvas.bringToFront(item).renderAll() //置顶
          if(item.name == 'textBox') {
            item.selectable = false
            item.evented = false
            this.canvas.bringToFront(item).renderAll() //置顶
          }
        }
      })
    },
    close() {
      this.gobj = ''
      this.isCutImg = false
      this.isEditImg = false
      this.isEditFont = false
    },
    getIsCutImg(val) {
      this.isCutImg = val
      this.curCutImg = this.gobj
    },
    getClipSave(val) {
      console.log(val)
    },
    setFillImg(options) {
      var e = options.e
      var target = options.target
      if(e) {
        var x = e.offsetX
        var y = e.offsetY
        var l = target.clipObj.left
        var t = target.clipObj.top
        var isIn = this.windingNumber({x: x, y: y}, target.clipObj.points, l, t)
        if(isIn) {
          this.gobj = target
          this.editCSS(target)
          this.isEditImg = true
        } else {
          // this.gobj = ''
          this.isEditImg = false
          this.isEditFont = false
          this.canvas.discardActiveObject() // 不选中
          this.canvas.forEachObject((item)=> {
            if(item.name == 'fillImg') {
              l = item.clipObj.left
              t = item.clipObj.top
              isIn = this.windingNumber({x: x, y: y}, item.clipObj.points, l, t)
              if(isIn) {
                this.gobj = item
                this.editCSS(item)
                this.isEditImg = true
              }
            }
          })
        }
      }
    },
    editCSS(target) { // 编辑状态显边框
      if(target.name == 'decorate' || target.name == 'text' || target.name == 'oText') {
        target.set({
          borderColor: '#f7600c',
          borderScaleFactor: 1,
          borderDashArray: [4, 3],
        });
      } else if(target.name == 'fillImg') {
        this.clipPathData.forEach((item)=> {
          if(item.clipPath.left == target.clipObj.left && item.clipPath.top == target.clipObj.top) {
            if(this.curImgBox) this.canvas.remove(this.curImgBox)
            item.clipPath.clone((c)=> {
              this.curImgBox = c.set({
                selectable: false,
                evented: false, // 事件阻止
                stroke: '#f7600c',
                strokeWidth: 1,
                strokeDashArray: [5, 3],
              })
              this.canvas.add(this.curImgBox)
            })
          }
        })
      }
    },
    // 撤销 恢复 处理
    updateModifications(val) { // 每当画布更新存储history
      if(this.curImgBox) this.canvas.remove(this.curImgBox).renderAll()
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()
      if(this.curClipPathBox) this.curClipPathBox.set('strokeWidth', 0);

      this.changeStep = true
      // this.$emit('getStep', this.cStep)
      this.$emit('getStep', this.changeStep)
      // if (this.cStep < this.state.length) { this.state.length = this.cStep;}
      var myjson = JSON.stringify(this.canvas.toJSON())
      /*this.state.push({
        name: this.idName,
        data: myjson
      })*/
      var stateData = {
        name: this.idName,
        data: myjson
      }
      // console.log(this.idName.replace('canvas', '') + '- ' + this.fStep)
      this.$emit('getState', stateData)
      // console.log(this.cStep, 'state: ' + this.state.length)
    },
    undo(data, step) { // 撤销
      // console.log(this.cStep, step)
      // this.cStep = step
      this.canvas.clear().renderAll();
      this.canvas.loadFromJSON(data)
      this.canvas.renderAll();
      /*this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()

      if(this.isInitOver) {
        if(this.cStep > 0) {
          this.cStep--
          this.canvas.clear().renderAll();
          this.canvas.loadFromJSON(this.state[this.cStep])
          this.canvas.renderAll();
          // console.log('state[' + this.cStep + ']')
        }
      }*/
    },
    redo(data, step) { // 恢复
      // console.log(this.cStep, step)
      // this.cStep = step
      this.canvas.clear().renderAll();
      this.canvas.loadFromJSON(data)
      this.canvas.renderAll();
      /*this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()

      if(this.isInitOver) {
        if(this.cStep < this.state.length-1) {
          this.cStep++
          this.canvas.clear().renderAll();
          this.canvas.loadFromJSON(this.state[this.cStep])
          this.canvas.renderAll();
          // console.log('state[' + this.cStep + ']')
        }
      }*/
    },
  },
  mounted() {
    this.$nextTick(function() {
      var canvas = new fabric.Canvas(this.idName)
      var cPath = new fabric.Canvas('cPath_' + this.idName);
      this.canvas = canvas
      this.cPath = cPath

      /*this.cStep = this.fStep
      this.state = this.fState
      console.log(this.cStep)*/

      canvas.on({
        'object:moving': this.onChange,
        'object:scaling': this.onChange,
        'object:rotating': this.onChange,
      });

      this.canvas.on('object:added', (options)=> {
        var target = options.target
        this.resetZIndex()
        /*this.canvas.forEachObject((item)=> {
          item.hasControls = false // 取消角控件
          if(item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate' || item.name == 'textBox') {
            this.canvas.bringToFront(item).renderAll() //置顶
            if(item.name == 'textBox') {
              item.selectable = false
              item.evented = false
              this.canvas.bringToFront(item).renderAll() //置顶
            }
          }
        })*/
        
        if(this.canvas._objects.length == this.inItOverObjNum) { // 画布初始
          this.isInitOver = true
        }
        if(target.name) {
          if(target.name == 'bgImg' || target.name == 'clipBox') {
            target.set({
              selectable: false,
              evented: false, // 事件阻止
            })
            this.canvas.renderAll();
          }
        } else if(target.type == 'polygon') {
          target.set({
            selectable: false,
            evented: false, // 事件阻止
          })
          this.canvas.renderAll();
        }
      })

      this.canvas.on('selection:created', (options)=> { // evented:false(事件阻止)不选中bgImg,clipBox,polygon
        this.gobj = ''
        this.isEditImg = false
        this.isEditFont = false
        var target = options.target
        if(target.name == 'decorate') {
          this.gobj = target
          this.editCSS(target)
          this.isEditImg = true
        } else if(target.name == "text" || target.name == 'oText') {
          this.gobj = target
          this.editCSS(target)
        } else if(target.name == 'fillImg') {
          this.setFillImg(options)
        } else {
          this.gobj = ''
          this.isEditImg = false
          this.isEditFont = false
        }
      })

      this.canvas.on('mouse:down', (options)=> {
        this.isEditImg = false
        this.isEditFont = false
        var target = options.target
        if(target) {
          // console.log('gobj: ' + this.gobj.name)
          if(target.name) {
            // console.log('target: ' + target.name)
            if(target.name == 'text' || target.name == 'oText') {
              this.canvas.setActiveObject(target)
              this.gobj = target
              this.editCSS(target)
              this.isEditFont = true
            } else if(target.name == 'fillImg') {
              this.canvas.discardActiveObject().renderAll() // 不选中
              this.setFillImg(options)
            } else if(target.name == 'decorate') {
              this.gobj = target
              this.editCSS(target)
              this.isEditImg = true
            } else {
              this.gobj = ''
              this.isEditImg = false
              this.isEditFont = false
            }
          } else { // evented:false(事件阻止)不选中bgImg,clipBox,polygon
            console.log(target.type)
          }
        } else {
          this.gobj = ''
          this.isEditImg = false
          this.isEditFont = false
        }

        $('.edit-content').onmouseup = (e)=> {
          $('.edit-content').onmousemove = $('.edit-content').onmouseup = null
        }
      })

      this.canvas.on('after:render', (options)=> { // 阻止多选
        if(this.canvas.getActiveObject()) {
          if(this.canvas.getActiveObject()._objects) {
            if(this.canvas.getActiveObject()._objects.length > 1) {
              this.canvas.discardActiveObject().renderAll() // 不选中
            }
          }
        }
      })


      this.canvas.on('mouse:move', (e)=> {
        var e = e.e
        var x = e.offsetX
        var y = e.offsetY
        this.clipPathData.forEach((item)=> {
          item.clipPath.set('strokeWidth', 0)
          this.canvas.renderAll()
          var l = item.clipPath.left
          var t = item.clipPath.top
          var isIn = this.windingNumber({x: x, y: y}, item.clipPath.points, l, t)
          // console.log(x, y, l, t)
          if(isIn) {
            this.canvas.bringToFront(item.clipPath) //置顶 
            this.curClipPathBox = item.clipPath
            item.clipPath.set({
              stroke: '#f7600c',
              strokeWidth: 2,
              strokeDashArray: 0,
            });
            this.canvas.renderAll()
          }
        })
      })
        
      // 文字 / 装饰 hover效果
      this.canvas.on('mouse:over', (e)=> {
        if(e.target) {
          if(e.target.name == 'text' || e.target.name == 'oText') {
            this.curFontBox = new fabric.Rect({ // rect
              name: '边框',
              originX: e.target.originX,
              originY: e.target.originY,
              top: e.target.top,
              left: e.target.left,
              angle: e.target.angle,
              width: e.target.width * e.target.scaleX + 5,
              height: e.target.height * e.target.scaleY + 5,
              fill: 'rgba(0,0,0,0)',
              stroke: '#f7600c',
              strokeWidth: 2,
              selectable: false,
              evented: false, // 事件阻止
            })
            this.canvas.add(this.curFontBox)
            this.canvas.bringToFront(this.curFontBox).renderAll() //置顶
          } else if(e.target.name == 'decorate') {
            e.target.set({
              stroke: '#f7600c',
              strokeWidth: 2,
            });
            this.canvas.renderAll();
          }
        }
      });
        
      this.canvas.on('mouse:out', (e)=> {
        if(e.target) {
          if(e.target.name == 'text' || e.target.name == 'oText') {
            if(this.curFontBox) this.canvas.remove(this.curFontBox)
          } else if(e.target.name == 'decorate') {
            e.target.set('strokeWidth', 0);
          }
        }
      });

      this.canvas.on('object:modified', (options)=> { // 监听自带控件所产生的变化
        this.updateModifications() // 添加画布记录
      })
    })
  }
}
</script>
