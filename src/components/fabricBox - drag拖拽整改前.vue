<template>
  <div class="fabricBox" @dragover="allowDrop" @drop="drop" style="position: relative;">
    <div class="flex-box">
      <canvas :id="idName"></canvas>
      <canvas :id="'cPath_' + idName" style="display: none;"></canvas>
    </div>

    <i v-if="isTempDataLoading" class="el-icon-loading fabric-loading" style="font-size: 80px; color: #ddd; position: absolute; top: 50%; left: 50%; margin-top: -40px; margin-left: -40px;"></i>

    <!-- 图片裁剪 -->
    <imgCut v-if="isCutImg" :curCutImg="gobj" @getIsCutImg="getIsCutImg" @clip-save="getClipSave"></imgCut>
    <!-- 图片编辑框 --><!-- 装饰编辑框 -->
    <imgEdit v-if="isEditImg" :curEditImg="gobj" :cStep="cStep" :paga2AddL="paga2AddL" @updateModifications="updateModifications" @close="close" @getIsCutImg="getIsCutImg"></imgEdit>
    <!-- 文字编辑框 v-show(才能触发word编辑框消失改变) -->
    <fontEdit v-show="isEditFont" :curEditFont="gobj" :cStep="cStep" :paga2AddL="paga2AddL" @updateModifications="updateModifications" :deskScale="deskScale" @close="close"></fontEdit>
  </div>
</template>

<script>
import imgEdit from '@/components/imgEdit' // 图片编辑框
import fontEdit from '@/components/fontEdit' // 文字编辑框
import imgCut from '@/components/imgCut' // 图片裁剪框

export default {
  name: 'fabricBox',
  props: ["idName", "isSingle", "deskScale", "pageData", "curDragImg", "dragType", "fontFamily", "curDragDecorate", "filePicData"],
  components: {
    imgEdit,
    fontEdit,
    imgCut
  },
  data () {
    return {
      canvas: '',
      cPath: '',
      gobj: '', // fabric 选中的对象
      maxLayerIdx: 0, // 左边最大的layerIdx (单/双)
      maxLayerIdx_R: 0, // 右边最大的layerIdx
      maskIdx: 0, // 左边蒙板的layerIdx (单/双)
      maskIdx_R: 0, // 右边蒙板的layerIdx
      isCutImg: false, // 是否裁剪
      isEditImg: false, // 是否图片编辑
      isEditFont: false, // 是否文字编辑
      curImgBox: '', // 图片对象编辑状态的路径框
      curClipPathBox: '', // clipPath hover状态
      curFontBox: '', // 文字对象编辑状态的路径框
      state: [], // 撤销 恢复 数组
      cStep: -1, // 撤销 恢复 状态值
      isInitOver: false, // 是否初始完毕
      isTempDataLoading: false, // 正在加载模板数据
      fillImgNum: 0, // 当前页面填充照片数
      bgColorNum: 0, // 底色数量
      inItOverObjNum: 0, // 初始后应有的对象数量
      paga2AddL: 0, // 右页加的 left (左页的宽度)
      filledNum: '', // 页面填充完毕后应有的对象数量
      wantPicNum: 0, // 当前页面需要填充的照片数
      isWatchFilled: false, // 当整本填充时监听
      curEditData: '', // 当前编辑后的页面数据
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
      this.curEditData = newVal
      this.init(newVal)
    },
    deskScale(newVal) {
      if(this.isInitOver) this.init(this.pageData)
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
      if(newVal.length > 0) {
        // console.log(newVal.length, this.inItOverObjNum)
        if(!this.isInitOver && newVal.length == this.inItOverObjNum) { // 画布初始
          this.isInitOver = this.sortObjs()
          this.$emit('getIsInitOver', this.isInitOver)
        }

        if(this.isWatchFilled) {
          this.$emit('getIsFilled', false)
          let fillPicNum = 0
          newVal.forEach((item)=> {
            if(item.name == 'fillImg') fillPicNum++
          })
          if(fillPicNum == this.wantPicNum) {
            setTimeout(()=> {
              this.$emit('getIsFilled', true)
            }, 200);
          }
        }
      }
    },
    cStep(newVal, oldVal) {
      if(newVal <= 0) {
        $('li.undo a').css({
          'color': '#aaa',
          'cursor': 'not-allowed'
        }).hover(function(e) {
          $(e.target).closest('a').css('color', '#aaa')
        })
      } else { // cStep > 0 
        this.saveToJson(JSON.stringify(this.canvas._objects), JSON.stringify(this.pageData))
        $('li.undo a').css({
          'color': '#333',
          'cursor': 'pointer'
        }).hover(function(e) {
          $(e.target).closest('a').css('color', '#3aaa92')
        }, function(e) {
          $(e.target).closest('a').css('color', '#333')
        })
      }
      if(newVal === (this.state.length - 1)) {
        $('li.redo a').css({
          'color': '#aaa',
          'cursor': 'not-allowed'
        }).hover(function(e) {
          $(e.target).closest('a').css('color', '#aaa')
        })
      } else {
        $('li.redo a').css({
          'color': '#333',
          'cursor': 'pointer'
        }).hover(function(e) {
          $(e.target).closest('a').css('color', '#3aaa92')
        }, function(e) {
          $(e.target).closest('a').css('color', '#333')
        })
      }
    },
    deep: true
  },
  methods: {
    sortObjs() {
      var hasIdxArr = []
      this.canvas.forEachObject((item)=> {
        item.hasControls = false // 取消角控件
        if(item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate' || item.name == 'textBox') this.canvas.bringToFront(item).renderAll() //置顶
        if(item.name) {
          hasIdxArr.push(item)
        }
      })
      hasIdxArr.sort((a, b)=> {
        return a.layerIdx - b.layerIdx
      })
      this.canvas._objects = hasIdxArr
      this.canvas.requestRenderAll();
      this.isTempDataLoading = false
      return true
    },
    init(newVal) {
      this.isInitOver = false
      this.state = []
      this.cStep = -1
      this.fillImgNum = 0
      this.bgColorNum = 0
      this.inItOverObjNum = 0
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      this.maskIdx = 0
      this.maskIdx_R = 0
      this.$nextTick(function() {
        if(this.isSingle) {
          if(newVal) {
            this.canvas.setWidth((newVal.pagewidth * this.deskScale).toFixed(0))
            this.canvas.setHeight((newVal.pageheight * this.deskScale).toFixed(0))
            this.cPath.setWidth((newVal.pagewidth * this.deskScale).toFixed(0))
            this.cPath.setHeight((newVal.pageheight * this.deskScale).toFixed(0))
            this.canvas.clear()
            var bgNum = 0
            console.log(newVal.layer)
            this.maxLayerIdx = newVal.layer.length
            this.paga2AddL = newVal.pagewidth * this.deskScale
            var data = newVal.layer.map((item, idx)=> {
              if(item.layertype == 0) {
                if(bgNum < 1) { // 背景
                  bgNum++
                  this.maskIdx++
                } else {
                  item.layertype = 2
                }
              } else if(item.layertype == 1) {
                this.bgColorNum++
                this.maxLayerIdx-- // 有背景色 maxLayerIdx--
              } else if(item.layertype == 3) {
                item.picCount = newVal.photocount // 该页的蒙版数量
                this.wantPicNum = newVal.photocount // 该页的蒙版数量
                if(item.img.mask) {
                  this.maskIdx++ // 有蒙版
                }
                if(item.img.fillImg) {
                  this.fillImgNum++
                  this.maxLayerIdx++ // 有照片 maxLayerIdx++
                  this.maskIdx++
                }
              }
              return item
            })
            newVal.layer = data
            this.addLayer(newVal)

            this.inItOverObjNum = newVal.layer.length - this.bgColorNum + newVal.photocount + this.fillImgNum
          }
        } else {
          if(newVal) {
            newVal = JSON.parse(JSON.stringify(newVal))
            let pW = (newVal[0].pagewidth * 1 + newVal[1].pagewidth * 1)
            let pH = newVal[0].pageheight
            this.canvas.setWidth((pW * this.deskScale).toFixed(0))
            this.canvas.setHeight((pH * this.deskScale).toFixed(0))
            this.cPath.setWidth((pW * this.deskScale).toFixed(0))
            this.cPath.setHeight((pH * this.deskScale).toFixed(0))
            this.canvas.clear()
            newVal[0].photocount = newVal[0].photocount * 1 + newVal[1].photocount * 1
            this.wantPicNum = newVal[0].photocount // 该页的蒙版数量
            var bgNum1 = 0
            this.maxLayerIdx = newVal[0].layer.length
            var data1 = newVal[0].layer.map((item)=> {
              if(item.layertype == 0) {
                if(bgNum1 < 1) { // 背景
                  bgNum1++
                  this.maskIdx++
                } else {
                  item.layertype = 2
                }
              } else if(item.layertype == 1) { // 有背景色
                this.bgColorNum++
                this.maxLayerIdx--
              } else if(item.layertype == 3) { // 蒙版 / 照片
                item.picCount = newVal[1].photocount // 该页的蒙版数量
                if(item.img.mask) {
                  this.maskIdx++ // 有蒙版
                }
                if(item.img.fillImg) {
                  this.fillImgNum++
                  this.maxLayerIdx++ // 有照片 maxLayerIdx++
                  this.maskIdx++
                }
              }
              return item
            })
            newVal[0].layer = data1
            var bgNum2 = 0
            this.maxLayerIdx_R = newVal[1].layer.length
            var data2 = newVal[1].layer.map((item)=> {
              if(item.layertype == 0) {
                if(bgNum2 < 1) { // 背景
                  bgNum2++
                  this.maskIdx_R++
                } else {
                  item.layertype = 2
                }
              } else if(item.layertype == 1) { // 有背景色
                this.bgColorNum++
                this.maxLayerIdx_R--
              } else if(item.layertype == 3) {
                item.picCount = newVal[1].photocount // 该页的蒙版数量
                if(item.img.mask) { 
                  this.maskIdx_R++ // 有蒙版
                }
                if(item.img.fillImg) {
                  this.fillImgNum++
                  this.maxLayerIdx_R++
                  this.maskIdx_R++
                }
              }
              this.paga2AddL = newVal[0].pagewidth * this.deskScale
              item.primitiveX += (newVal[0].pagewidth * 1 + 1) // +1 区分前后页
              if(item.img) {
                if(item.img.mask != undefined) {
                  item.img.mask.rect.x += (newVal[0].pagewidth * 1 + 1)
                  if(item.img.fillImg) {
                    item.img.fillImg.rect.x += (newVal[0].pagewidth * 1 + 1)
                  }
                }
              }
              return item
            })
            Array.prototype.push.apply(newVal[0].layer, data2)
            this.addLayer(newVal[0])

            this.inItOverObjNum = newVal[0].layer.length - this.bgColorNum + newVal[0].photocount + this.fillImgNum 
          }
        }
      })
    },
    toPathFn(src, l, t, layerIdx) {
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
        var clipPath = new fabric.MyPolygon(points, {
          name: 'clipPath',
          left: namedImg.left,
          top: namedImg.top,
          layerIdx: layerIdx,
          fill: 'transparent',
          selectable: false,
          evented: false, // 事件阻止
        })
        this.cPath.remove(namedImg).renderAll()
        clipPath.set({
          left: clipPath.left * 1 - 1,
          top: clipPath.top * 1 - 1,
        })
        this.canvas.add(clipPath).renderAll()
      }
      img1.src = src;
    },
    addLayer(newVal) {
      if(newVal.layer.length > 0) { // 0 / 1 底层背景,2文字(不包括文字图片), 3蒙版和照片
        // console.log(newVal)
        newVal.layer.forEach((item)=> {
          this.isTempDataLoading = true
          if(item.layertype == 1) { // 1 底层背景
            this.canvas.set('backgroundColor', item.img.fill)
          } else if(item.layertype == 0) { // 背景
            if(item.img.url) {
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              var url = ''
              if(item.img.url.indexOf('bfl-img') > -1) {
                url = item.img.url
              } else {
                url = "http://img.res.excelll.org/" + item.img.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png'
              }
              this.addImg(url, { 
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
                  opacity: item.img.opacity == null ? 1 : item.img.opacity,
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
              var layerIdx = l > this.paga2AddL ? ++this.maskIdx_R : ++this.maskIdx
              this.toPathFn("http://img.res.excelll.org/" + item.img.mask.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', l, t, layerIdx)
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
              }, item.img.fillImg.scale, item.picCount)
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
    addImg(src, attrs, scale, picCount, changeBg) {
      var vm = this
      var img = new Image()
      img.src = src
      img.crossOrigin = '';
      img.onload = function() { // 加载完成  
        var namedImg = new fabric.NamedImage(img, attrs)
        if(scale) {
          namedImg.scale(scale)
        }
        vm.canvas.add(namedImg).renderAll()
        vm.gobj = namedImg
        
        if(namedImg.name == 'bgImg') {
          if(changeBg) {
            vm.sortObjs()
            vm.updateModifications() // 添加画布记录
          }
        } else if(namedImg.name == 'fillImg') { 
          if(vm.isInitOver) {
            // if(picCount > 1) vm.fillImgZIndex(picCount)
            if(picCount > 1) vm.sortObjs()
            vm.updateModifications() // 添加画布记录
          }
        } if(namedImg.name == 'decorate') {
          if(vm.isInitOver) vm.updateModifications() // 添加画布记录
        }
      }
    },
    allowDrop(e) { // @dragover: 在元素正在拖动到放置目标时触发
      e.preventDefault() // 阻止默认(必须阻止 dragover 的默认行为，才能使 drop 执行)
      this.canvas.discardActiveObject() // 不选中
      var x = e.offsetX
      var y = e.offsetY
      this.canvas.forEachObject((item)=> {
        if(item.name == 'clipPath') {
          item.set('strokeWidth', 0)
          this.canvas.renderAll()
          var l = item.left
          var t = item.top
          var isIn = this.windingNumber({x: x, y: y}, item.points, l, t)
          if(isIn) {
            item.set({
              'stroke': '#f7600c',
              'strokeWidth': 2,
            });
            this.canvas.renderAll()
          }
        }
      })
    },
    drop(e) { // @drop: 在元素拖动到放置目标后触发
      this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()
      var x = e.offsetX
      var y = e.offsetY

      var maxLayerIdx = x > this.paga2AddL ? this.maxLayerIdx_R : this.maxLayerIdx

      if(this.dragType == '照片') {
        this.canvas.forEachObject((item)=> {
          if(item.name == 'clipPath') {
            item.set('strokeWidth', 0)
            this.canvas.renderAll()
            var l = item.left
            var t = item.top

            var isIn = this.windingNumber({x: x, y: y}, item.points, l, t)
            if(isIn) {
              this.addFillImg(item, this.curDragImg, true)
            }
          }
        })
      } else if(this.dragType == '文字') {
        maxLayerIdx += 1
        if(x > this.paga2AddL) {
          this.maxLayerIdx_R++
        } else {
          this.maxLayerIdx++
        }
        var text = new fabric.MyText('请点击输入', {
          name: 'text',
          originX: 'center',
          originY: 'center',
          layerIdx: maxLayerIdx,
          left: x, 
          top: y,
          fontSize: 24,
          fontFamily: this.fontFamily,
          perPixelTargetFind: false,
          hasControls: false, // 取消角控件
        })
        this.canvas.add(text).renderAll()
        this.updateModifications() // 添加画布记录
        this.gobj = text
        this.canvas.setActiveObject(text)
        this.isEditFont = true
      } else if(this.dragType == '装饰' || this.dragType == '图片') {
        if(this.curDragImg) {
          maxLayerIdx += 1
          if(x > this.paga2AddL) {
            this.maxLayerIdx_R++
          } else {
            this.maxLayerIdx++
          }
          this.addImg(this.curDragImg.src, {
            name: 'decorate',
            originX: 'center',
            originY: 'center',
            layerIdx: maxLayerIdx,
            left: x, 
            top: y,
            hasControls: false, // 取消角控件
          })
        }
      } else if(this.dragType == '模板') {
        if(x > this.paga2AddL) {
          this.$emit('changeTemp', 1)
        } else {
          this.$emit('changeTemp', 0)
        }
      } else if(this.dragType == '背景') {
        var bgObj = ''
        this.canvas.forEachObject((item)=> {
          if(item.name == 'bgImg') { // 将 canvas对象 分组
            if(x > this.paga2AddL && item.left > this.paga2AddL) {
              bgObj = JSON.parse(JSON.stringify(item))
              this.canvas.remove(item).renderAll()
            } else if(x < this.paga2AddL && item.left < this.paga2AddL) {
              bgObj = JSON.parse(JSON.stringify(item))
              this.canvas.remove(item).renderAll()
            }
          }
        })
        this.addImg(this.curDragImg.src, { 
          name: 'bgImg',
          id: bgObj.id,
          layerIdx: bgObj.layerIdx,
          left: bgObj.left,
          top: bgObj.top,
          width: bgObj.width,
          height: bgObj.height,
          centeredRotation: true, // 中心旋转
          selectable: false,
          evented: false, // 事件阻止
        }, 1, 0, true)
      } else if(this.dragType == '布局') {
        console.log('布局')
      }
    },
    drop(e) {
      var dragData = JSON.parse(e.dataTransfer.getData('dragObj'))
      this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()
      var x = e.offsetX
      var y = e.offsetY

      var maxLayerIdx = x > this.paga2AddL ? this.maxLayerIdx_R : this.maxLayerIdx

      if(dragData.name == '照片') {
        this.canvas.forEachObject((item)=> {
          if(item.name == 'clipPath') {
            item.set('strokeWidth', 0)
            this.canvas.renderAll()
            var l = item.left
            var t = item.top

            var isIn = this.windingNumber({x: x, y: y}, item.points, l, t)
            if(isIn) {
              this.addFillImg(item, dragData.data, true)
            }
          }
        })
      } else if(dragData.name == '文字') {
        maxLayerIdx += 1
        if(x > this.paga2AddL) {
          this.maxLayerIdx_R++
        } else {
          this.maxLayerIdx++
        }
        var text = new fabric.MyText('请点击输入', {
          name: 'text',
          originX: 'center',
          originY: 'center',
          layerIdx: maxLayerIdx,
          left: x, 
          top: y,
          fontSize: 24,
          fontFamily: dragData.data, // this.fontFamily
          perPixelTargetFind: false,
          hasControls: false, // 取消角控件
        })
        this.canvas.add(text).renderAll()
        this.updateModifications() // 添加画布记录
        this.gobj = text
        this.canvas.setActiveObject(text)
        this.isEditFont = true
      } else if(dragData.name == '装饰' || dragData.name == '图片') {
        maxLayerIdx += 1
        if(x > this.paga2AddL) {
          this.maxLayerIdx_R++
        } else {
          this.maxLayerIdx++
        }
        this.addImg(dragData.data, { // this.curDragImg
          name: 'decorate',
          originX: 'center',
          originY: 'center',
          layerIdx: maxLayerIdx,
          left: x, 
          top: y,
          hasControls: false, // 取消角控件
        })
      } else if(dragData.name == '模板') {
        if(x > this.paga2AddL) {
          this.$emit('changeTemp', 1)
        } else {
          this.$emit('changeTemp', 0)
        }
      } else if(dragData.name == '背景') {
        var bgObj = ''
        this.canvas.forEachObject((item)=> {
          if(item.name == 'bgImg') { // 将 canvas对象 分组
            if(x > this.paga2AddL && item.left > this.paga2AddL) {
              bgObj = JSON.parse(JSON.stringify(item))
              this.canvas.remove(item).renderAll()
            } else if(x < this.paga2AddL && item.left < this.paga2AddL) {
              bgObj = JSON.parse(JSON.stringify(item))
              this.canvas.remove(item).renderAll()
            }
          }
        })
        this.addImg(dragData.data, { 
          name: 'bgImg',
          id: bgObj.id,
          layerIdx: bgObj.layerIdx,
          left: bgObj.left,
          top: bgObj.top,
          width: bgObj.width,
          height: bgObj.height,
          centeredRotation: true, // 中心旋转
          selectable: false,
          evented: false, // 事件阻止
        }, 1, 0, true)
      } else if(dragData.name == '布局') {
        console.log('布局')
      }
    },
    addFillImg(clipObj, picSrc, alertTip) {
      var l = clipObj.left
      var t = clipObj.top
      var w = clipObj.width
      var h = clipObj.height
      if(picSrc) {
        this.$axios.get(picSrc.split('?')[0] +  '?imageInfo')
          .then(response => {
          var pic = response.data
          var isWide = pic.width > pic.height
          if(isWide) { // 宽图
            var imgSrc = picSrc.split('?')[0] +  '?imageView2/2/h/' + h
            if(pic.height < h) { // 照片小于框
              imgSrc = picSrc.split('?')[0] +  '?imageMogr2/thumbnail/x' + h
              if(w / h > pic.width / pic.height) {
                imgSrc = picSrc.split('?')[0] +  '?imageMogr2/thumbnail/' + w + 'x'
              }
              if(alertTip) {
                this.$alert('您的照片像素太低，可能影响印刷质量!', '警告', {
                  type: 'warning',
                  showClose: false,
                  confirmButtonText: '确定',
                });
              }
            } else {
              if(w / h > pic.width / pic.height) {
                imgSrc = picSrc.split('?')[0] +  '?imageView2/2/w/' + w
              }
            }
          } else { // 长图
            var imgSrc = picSrc.split('?')[0] +  '?imageView2/2/w/' + w
            if(pic.width < w) { // 照片小于框
              imgSrc = picSrc.split('?')[0] +  '?imageMogr2/thumbnail/' + w + 'x'
              if(w / h < pic.width / pic.height) {
                imgSrc = picSrc.split('?')[0] +  '?imageMogr2/thumbnail/x' + h
              }
              if(alertTip) {
                this.$alert('您的照片像素太低，可能影响印刷质量!', '警告', {
                  type: 'warning',
                  showClose: false,
                  confirmButtonText: '确定',
                });
              }
            } else {
              if(w / h < pic.width / pic.height) {
                imgSrc = picSrc.split('?')[0] +  '?imageView2/2/h/' + h
              }
            }
          }
          console.log(imgSrc)
          this.addImg(imgSrc, {
            // name: 'img',
            name: 'fillImg',
            originX: 'center',
            originY: 'center',
            left: l + w/2, // 导出json时要改回来
            top: t + h/2,
            layerIdx: clipObj.layerIdx, // 保存蒙版在layer数组里的idx
            clipObj: clipObj, // 自定义属性--> 裁剪框
            clipTo: 'function(ctx) {this.myClipTo(ctx)}',
          })
        })
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
    saveToJson(objs, oldPageData) {
      if(objs) {
        var objs = JSON.parse(objs)
        var oldPageData = JSON.parse(oldPageData)
        if(this.isSingle) {
          var arr = this.saveData(objs, oldPageData)
          this.$emit('getSaveData', arr)
          this.curEditData = arr
        } else {
          var arr1 = this.saveData(objs, oldPageData[0], 1)
          var arr2 = this.saveData(objs, oldPageData[1], 2)
          this.$emit('getSaveData', [arr1, arr2])
          this.curEditData = [arr1, arr2]
        }
        this.$emit('hiddenPic')
      }
    },
    saveData(objs, oldPageData, pageIdx) {
      oldPageData.layer.forEach((item)=> {
        if(item.layertype == 3) { // push 入蒙版
          item.img.fillImg = ''
        }
      })
      if(!this.isSingle) {
        var newObjs = []
        if(pageIdx == 1) { // 将 canvas对象 分组
          objs.forEach((item)=> {
            if(item.left <= this.paga2AddL) {
              newObjs.push(item)
            }
          })
        } else if(pageIdx == 2) {
          objs.forEach((item)=> {
            if(item.left > this.paga2AddL) {
              item.left -= (this.paga2AddL / this.deskScale + 1) * this.deskScale
              newObjs.push(item)
            }
          })
        }
        objs = newObjs
      }
      var arr = []
      objs.forEach((item, itemIdx)=> {
        // console.log(item.name, item.layerIdx, itemIdx)
        if(item.name == 'bgImg') {
          oldPageData.layer.forEach((pageItem)=> {
            if(pageItem.layertype == 0) { // push 入蒙版|背景
              if((item.src.indexOf('bfl-img') > -1) && item.layerIdx == pageItem.idx) {
                // console.log(item, pageItem)
                pageItem.img.url = item.src
                arr.push(pageItem)
              } else {
                var id = pageItem.img.url.split('/')[1]
                if(item.src.indexOf(id) > -1) arr.push(pageItem)
              }
            }
          })
        } else if(item.name == 'fillImg') {
          var x = (item.left - item.width / 2) / this.deskScale
          var y = (item.top - item.height / 2) / this.deskScale
          var w = item.width / this.deskScale
          var h = item.height / this.deskScale
          // console.log(item.name, item)
          for(let i = 0, len = oldPageData.layer.length; i < len; i++) {
            // console.log(oldPageData.layer[i].idx, item.layerIdx)
            if(oldPageData.layer[i].idx == item.layerIdx) { // push 入蒙版|背景
              // console.log(oldPageData.layer, item)
              if(oldPageData.layer[i].img.mask) {
                oldPageData.layer[i].img.fillImg = {
                  url: item.src,
                  clipObj: item.clipObj, // 裁剪框
                  opacity: item.opacity, // --透明度
                  layerIdx: oldPageData.layer[i].idx, // 保存蒙版在layer数组里的idx
                  scale: item.scaleX,
                  imageRotation: item.angle, // --旋转角度
                  rect: {// 位置
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  },
                  filter: '', // 滤镜
                  // 镜像(横|纵) 阴影(宽度|颜色) 边框(形状|宽度|颜色)
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
                rectangleImg: false,
                // 镜像(横|纵) 阴影(宽度|颜色) 边框(形状|宽度|颜色)
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
        if(item.layertype == 1 || item.layertype == 3) { // push 入蒙版/和底色
          arr.push(item)
        }
      })
      var pageJson = {
        name: oldPageData.name,
        idx: oldPageData.idx,
        photocount: oldPageData.photocount,
        pagewidth: oldPageData.pagewidth,
        pageheight: oldPageData.pageheight,
        thumb: oldPageData.thumb,
        thumbed: oldPageData.thumbed,
        layer: arr
      }
      return pageJson
    },
    fillImgZIndex(pageIdx) {
      var arr = []
      this.canvas.forEachObject((item)=> {
        if(pageIdx == 1 && item.name == 'fillImg') { // 将 canvas对象 分组
          arr.push(item)
        } else if(pageIdx == 2 && item.name == 'fillImg') {
          arr.push(item)
        }
      })
      if(arr.length > 1) {
        for(let i = 0, len = arr.length; i < len - 1; i++) {
          for(let j = 0, len = arr.length; j < len - 1; j++) {
            if(arr[i].layerIdx > arr[j].layerIdx) {
              this.canvas.sendToBack(arr[i]).renderAll() // 置底
            }
          }
        }
      }
      this.canvas.forEachObject((item)=> {
        if(item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate' || item.name == 'textBox') {
          this.canvas.bringToFront(item).renderAll() //置顶
          if(item.name == 'textBox') {
            item.selectable = false
            item.evented = false
            this.canvas.bringToFront(item).renderAll() //置顶
          }
        }
      })
    },
    resetZIndex() {
      this.canvas.forEachObject((item)=> {
        if(item.name == 'clipBox') {
          this.canvas.sendToBack(item).renderAll() // 置底
        }
      })
      this.canvas.forEachObject((item)=> {
        if(item.name == 'bgImg' || item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate' || item.name == 'textBox') {
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
        this.canvas.forEachObject((item)=> {
          if(item.name == 'clipPath') {
            if(item.left == target.clipObj.left && item.top == target.clipObj.top) {
              if(this.curImgBox) this.canvas.remove(this.curImgBox)
              item.clone((c)=> {
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
          }
        })
      }
    },
    // 撤销 恢复 处理
    updateModifications(val) { // 每当画布更新存储history
      if(this.curImgBox) this.canvas.remove(this.curImgBox).renderAll()
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()
      if(this.curClipPathBox) this.curClipPathBox.set('strokeWidth', 0);

      this.cStep++
      if (this.cStep < this.state.length) { this.state.length = this.cStep; }
      var myjson = JSON.stringify(this.canvas.toJSON())
      this.state.push(myjson)
      // console.log(this.cStep, 'state: ' + this.state.length)
    },
    undo() { // 撤销
      this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()

      if(this.isInitOver) {
        if(this.cStep > 0) {
          this.cStep--
          this.canvas.clear().renderAll();
          this.canvas.loadFromJSON(this.state[this.cStep], ()=> { // 加载执行
            this.saveToJson(JSON.stringify(this.canvas._objects), JSON.stringify(this.pageData))
          })
          this.canvas.renderAll();
          // console.log('state[' + this.cStep + ']')
        }
      }
    },
    redo() { // 恢复
      this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()

      if(this.isInitOver) {
        if(this.cStep < this.state.length-1) {
          this.cStep++
          this.canvas.clear().renderAll();
          this.canvas.loadFromJSON(this.state[this.cStep], ()=> {
            this.saveToJson(JSON.stringify(this.canvas._objects), JSON.stringify(this.pageData))
          })
          this.canvas.renderAll();
          // console.log('state[' + this.cStep + ']')
        }
      }
    },
  },
  mounted() {
    this.$nextTick(function() {
      var canvas = new fabric.Canvas(this.idName)
      var cPath = new fabric.Canvas('cPath_' + this.idName);
      this.canvas = canvas
      this.cPath = cPath

      this.canvas.preserveObjectStacking = true; // 当选择对象时，不出现在顶层。❤❤❤

      canvas.on({
        'object:moving': this.onChange,
        'object:scaling': this.onChange,
        'object:rotating': this.onChange,
      });

      this.canvas.on('object:added', (options)=> {
        var target = options.target
        target.hasControls = false // 取消角控件
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
        this.canvas.forEachObject((item)=> {
          if(item.name == 'clipPath') {
            item.set('strokeWidth', 0)
            this.canvas.renderAll()
            var l = item.left
            var t = item.top
            var isIn = this.windingNumber({x: x, y: y}, item.points, l, t)
            if(isIn) {
              item.set({
                stroke: '#f7600c',
                strokeWidth: 2,
                strokeDashArray: 0,
              })
              this.canvas.renderAll()
            }
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
