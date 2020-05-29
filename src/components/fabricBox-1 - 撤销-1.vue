<template>
  <div class="fabricBox" @dragover="allowDrop" @drop="drop">
    <div class="flex-box">
      <canvas :id="idName"></canvas>
      <canvas :id="'cPath_' + idName" style="display: none;"></canvas>
    </div>
    <!-- 图片裁剪 -->
    <imgCut v-if="isCutImg" :curCutImg="gobj" @getIsCutImg="getIsCutImg" @clip-save="getClipSave"></imgCut>
    <!-- 图片编辑框 --><!-- 装饰编辑框 -->
    <imgEdit v-if="isEditImg" :curEditImg="gobj" @close="close" @getIsCutImg="getIsCutImg"></imgEdit>
    <!-- 文字编辑框 -->
    <fontEdit v-if="isEditFont" :curEditFont="gobj" :deskScale="deskScale" @close="close"></fontEdit>
  </div>
</template>

<script>
import imgEdit from '@/components/imgEdit' // 图片编辑框
import fontEdit from '@/components/fontEdit' // 文字编辑框
import imgCut from '@/components/imgCut' // 图片裁剪框

export default {
  name: 'fabricBox',
  props: ["idName", "pageData", "curDragImg", "dragType", "fontFamily", "curDragDecorate"/*, "lastSave"*/],
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
      state: [], // 撤销 恢复 状态值
      mods: 0,
      isUndoRedo: false, // 是否撤销/恢复
    }
  },
  computed: {
    ctx() {
      return this.canvas.getContext('2d')
    },
    ctxPath() {
      return this.cPath.getContext('2d')
    },
    deskScale() {
      return 0.25 // 台历页面缩放
    },
    /*curState() { // 撤销/恢复当前状态值
      return this.state.length - 1 - this.mods - 1
    }*/
  },
  watch: {
    pageData(newVal, oldVal) {
      if(oldVal.layer) {
        // console.log(oldVal)
        this.$emit('getOldPageData', oldVal)
      }
      // this.toSaveOldFabric(oldVal)
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      this.clipPathData = []
      if(newVal) {
        this.$nextTick(function() {
          this.canvas.setWidth(newVal.pagewidth * this.deskScale)
          this.canvas.setHeight(newVal.pageheight * this.deskScale)
          this.cPath.setWidth(newVal.pagewidth * this.deskScale)
          this.cPath.setHeight(newVal.pageheight * this.deskScale)
          this.canvas.clear()
          this.addLayer(newVal, this.canvas, this.clipPathData)
        })
      }
    },
    /*clipPathData(newVal) {
      if(newVal.length > 0) {
        if(newVal.length == this.pageData.photocount) {
          this.clipHover()
          // this.updateModifications(true) // 添加画布记录
        }
      }
    },*/
    /*lastSave(newVal) {
      if(newVal) {
        this.toSaveOldFabric(this.pageData)
        // console.log(this.pageData)
      }
    },*/
    isEditImg(newVal) {
      if(!newVal) {
        if(this.curImgBox) this.canvas.remove(this.curImgBox).renderAll()
      }
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
        this.cPath.remove(namedImg).renderAll()
        // this.canvas.bringToFront(clipPath) //上移(一直向上)
        clipPath.set({
          left: clipPath.left * 1 - 1,
          top: clipPath.top * 1 - 1,
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
      if(newVal.layer) { // 0 / 1 底层背景,2文字(包括文字图片), 3蒙版和照片
        this.maxLayerIdx = newVal.layer.length
        newVal.layer.forEach((item)=> {
          if(item.layertype == 1) {
          } else if(item.layertype == 0) { // 背景
            if(item.img.url) {
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              this.addImg("http://pex7ss6vd.bkt.clouddn.com/" + item.img.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', { 
                name: 'bgImg',
                id: item.img.id,
                layerIdx: item.idx,
                left: l,
                top: t,
                centeredRotation: true, // 中心旋转
                hasControls: false, // 取消控件=-角
                selectable: false,
                evented: false, // 事件阻止
              }, 1)
            }
          } else if(item.layertype == 2) { // 可编辑文字
            if(item.img.url) {
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              this.addImg("http://pex7ss6vd.bkt.clouddn.com/" + item.img.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', {
                name: 'oText',
                id: item.img.id,
                layerIdx: item.idx,
                originX: 'center',
                originY: 'center',
                left: l + w/2, // toJson时要减掉
                top: t + h/2,
                centeredRotation: true, // 中心旋转
                hasControls: false, // 取消控件=-角
                // selectable: false,
              }, 1)
            }
          } else if(item.layertype == 3) { // 蒙版和照片
            if(item.img.mask) {
              var l = item.img.mask.rect.x * this.deskScale
              var t = item.img.mask.rect.y * this.deskScale
              this.addImg("http://pex7ss6vd.bkt.clouddn.com/" + item.img.mask.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', { 
                name: 'clipBox',
                id: item.img.mask.id,
                layerIdx: item.idx / 2,
                left: l,
                top: t,
                selectable: false,
                centeredRotation: true, // 中心旋转
                hasControls: false, // 取消控件=-角
                evented: false, // 事件阻止
              }, 1)
              var layerIdx = item.idx
              this.toPathFn("http://pex7ss6vd.bkt.clouddn.com/" + item.img.mask.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', l, t, canvas, clipPathData, layerIdx)
            }
            if(item.img.fillImg) {
              var l = item.img.fillImg.rect.x * this.deskScale
              var t = item.img.fillImg.rect.y * this.deskScale
              this.addImg(item.img.fillImg.url, {
                name: 'fillImg', // 添加的图片
                originX: 'center',
                originY: 'center',
                left: l,
                top: t,
                angle: item.img.fillImg.imageRotation,
                opacity: item.img.fillImg.opacity,
                layerIdx: item.img.fillImg.layerIdx,
                clipObj: item.img.fillImg.clipObj, // 自定义属性--> 裁剪框
                clipTo: 'function(ctx) {this.myClipTo(ctx)}',
              }, item.img.fillImg.scale)
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
    /*clipHover() {
      console.log('this')
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
          if(isIn) {
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
    },*/
    addImg(src, attrs, scale) {
      var vm = this
      var img = new Image()
      img.src = src
      img.crossOrigin = '';
      img.onload = function() {
        var namedImg = new fabric.NamedImage(img, attrs)
        if(scale) {
          namedImg.scale(scale)
        }
        namedImg.hasControls = false // 取消控件-角
        vm.canvas.add(namedImg).renderAll()
        // vm.canvas.forEachObject(function(o){o.hasBorders = o.hasControls = false;})
        vm.resetZIndex()
        if(namedImg.name == 'bgImg') {
          vm.canvas.forEachObject((item)=> {
            if(item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate') {
              vm.canvas.bringToFront(item).renderAll() //置顶
            }
          })
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
      this.canvas.discardActiveObject() // 不选中
      this.gobj = ''
      this.isEditImg = false
      this.isEditFont = false
      if(this.curImgBox) this.canvas.remove(this.curImgBox)
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
                } else {
                  var imgSrc = this.curDragImg.src.split('?')[0] +  '?imageView2/2/w/' + w
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
        var text = new fabric.myText('请点击输入', {
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
        text.hasControls = false // 取消控件-角
        // text.set('borderColor', '#f7600c');
        this.canvas.add(text).renderAll()
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
    toSaveOldFabric(pageData) {
      if(pageData && pageData.layer) {
        var canvas = JSON.parse(JSON.stringify(this.canvas))
        pageData.oldFabric = canvas
        this.$emit('getJson', pageData)
      }
    },
    toSaveOldPageData(target) {
      // console.log(target.opacity)
      this.pageData.layer[target.layerIdx].img.fillImg = {
        url: target.getSrc(),
        clipObj: target.clipObj, // 裁剪框
        opacity: target.opacity, // --透明度
        layerIdx: target.layerIdx, // 保存蒙版在layer数组里的idx
        scale: target.scaleX,
        imageRotation: target.angle, // --旋转角度
        rect: {// 位置
          x: target.left / this.deskScale,
          y: target.top / this.deskScale,
          w: target.width / this.deskScale,
          h: target.height / this.deskScale
        },
        filter: '', // 滤镜
      }
      // console.log(JSON.stringify(this.pageData))
      // console.log(JSON.stringify(this.pageData.layer[target.layerIdx]))
    },
    saveToJson(options) {
      var target = options.target
      if(target) { // 只有鼠标移动
        if(target.name == 'fillImg') {
          this.canvas.setActiveObject(target)
          console.log(options.e.type)
          this.toSaveOldPageData(target)
        }
      }
    },
    resetZIndex() {
      this.canvas.forEachObject((item)=> {
        if(item.name == 'clipBox') {
          this.canvas.sendToBack(item).renderAll() // 置底
        }
      })
      this.canvas.forEachObject((item)=> {
        if(item.name == 'bgImg' || item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate') {
          this.canvas.bringToFront(item).renderAll() //置顶
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
          borderDashArray: [4, 3]
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
    updateModifications(savehistory) { // 每当画布更新存储history
      /*if(this.curImgBox) this.canvas.remove(this.curImgBox).renderAll()
      if(this.curFontBox) this.canvas.remove(this.curFontBox).renderAll()
      if(this.curClipPathBox) this.curClipPathBox.set('strokeWidth', 0);*/
      if (savehistory === true) {
        var myjson = JSON.stringify(this.canvas.toJSON())
        this.state.push(myjson)
        console.log('state数量' + this.state.length)
      }
    },
    undo() { // 撤销
          console.log('子级-撤销: ' + (this.state.length - 1 - this.mods - 1), this.mods)
      if((this.state.length - 1 - this.mods - 1) > -1) {
        if (this.mods < this.state.length) {
          this.canvas.clear().renderAll();
          this.isUndoRedo = true
          this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.mods - 1])
          this.canvas.renderAll();
          // console.log(this.clipPathData[0].clipPath.type)
          this.mods += 1;
        }
      }
    },
    redo() { // 恢复
      console.log(this.state.length - 1 - this.mods + 1)
      if (this.mods > 0) {
        console.log('子级-恢复: ' + (this.state.length - 1 - this.mods + 1), this.mods)
        this.canvas.clear().renderAll();
        this.isUndoRedo = true
        this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.mods + 1])
        this.canvas.renderAll();
        this.mods -= 1;
      }
      /*if((this.state.length - 1 - this.mods + 1) > -1) {
      }*/
    },
  },
  mounted() {
    this.$nextTick(function() {
      var canvas = new fabric.Canvas(this.idName)
      var cPath = new fabric.Canvas('cPath_' + this.idName);
      this.canvas = canvas
      this.cPath = cPath

      canvas.on({
        'object:moving': this.onChange,
        'object:scaling': this.onChange,
        'object:rotating': this.onChange,
      });

      this.canvas.on('object:added', (options)=> {
        var target = options.target
        this.resetZIndex()
        this.canvas.forEachObject((item)=> {
          if(item.name == 'text' || item.name == 'oText' || item.type == 'polygon' || item.name == 'decorate') {
            this.canvas.bringToFront(item).renderAll() //置顶
          }
        })
        
        // console.log(this.canvas._objects.length, this.pageData.layer.length)
        if(this.canvas._objects.length == this.pageData.layer.length) {
          if(!this.isUndoRedo) this.updateModifications(true) // 添加画布记录
          this.isUndoRedo = false
        }
        if(target.name) {
          if(target.name == 'fillImg') {
            this.toSaveOldPageData(target)
            if(!this.isUndoRedo) {
              // console.log('this')
              this.updateModifications(true) // 添加画布记录
            }
            this.isUndoRedo = false
          } else if(target.name == 'text' || target.name == 'decorate') {
            if(!this.isUndoRedo) this.updateModifications(true) // 添加画布记录
            this.isUndoRedo = false
          } else if(target.name == 'bgImg' || target.name == 'clipBox') {
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

      // object:selected 这个方法v2已经废弃，使用selection:created替代
      this.canvas.on('selection:created', (options)=> { // evented:false(事件阻止)不选中bgImg,clipBox,polygon
        this.gobj = ''
        this.isEditImg = false
        this.isEditFont = false
        var target = options.target
        if(target.name == 'decorate') {
          this.gobj = target
          this.editCSS(target)
          this.isEditImg = true
        } else if(target.name == "text" || target.type == "text") {
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
        if(this.gobj) { // 只有鼠标移动
          if(this.gobj.name == 'fillImg') {
            this.toSaveOldPageData(this.gobj)
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

      /*this.canvas.on('object:modified', (options)=> { // 监听自带控件所产生的变化
        console.log('modified: ' + options.e.type)
      })*/
    })
  }
}
</script>
