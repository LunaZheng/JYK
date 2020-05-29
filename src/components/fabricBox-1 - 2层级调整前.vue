<template>
  <div class="fabricBox" @dragover="allowDrop" @drop="drop">
    <canvas :id="idName"></canvas>
    <canvas :id="'cPath_' + idName" style="display: none;"></canvas>
  </div>
</template>

<script>
export default {
  name: 'fabricBox',
  props: ["idName", "pageData", "curDragImg", "lastSave", "isEditImg", "dragType", "fontFamily", "deskScale", "curDragDecorate"],
  data () {
    return {
      canvas: '',
      cPath: '',
      clipPathData: [],
      gobj: '', // fabric 选中的对象
    }
  },
  computed: {
    ctx() {
      return this.canvas.getContext('2d')
    },
    ctxPath() {
      return this.cPath.getContext('2d')
    }
  },
  watch: {
    pageData(newVal, oldVal) {
      // console.log(newVal)
      this.$emit('getOldPageData', oldVal)
      // this.toSaveOldFabric(oldVal)
      this.clipPathData = []
      if(newVal) {
        this.$nextTick(function() {
          this.canvas.setWidth(newVal.pagewidth * this.deskScale)
          this.canvas.setHeight(newVal.pageheight * this.deskScale)
          this.cPath.setWidth(newVal.pagewidth * this.deskScale)
          this.cPath.setHeight(newVal.pageheight * this.deskScale)
          this.canvas.clear()
          if(newVal.oldFabric) {
            /*if(newVal.oldFabric.objects.length == 0) {
              this.addLayer(newVal, this.canvas, this.clipPathData)
            } else {
              var oldJson = JSON.stringify(newVal.oldFabric)
              // this.canvas.loadFromJSON(oldJson, this.canvas.renderAll.bind(this.canvas))
              this.canvas.loadFromJSON(oldJson)
            }*/
          } else {
            this.addLayer(newVal, this.canvas, this.clipPathData)
          }
        })
      }
    },
    /*clipPathData(newVal) {
      if(newVal.length == this.pageData.photocount) {
        this.clipHover(this.canvas, this.clipPathData)
      }
    },*/
    lastSave(newVal) {
      if(newVal) {
        this.toSaveOldFabric(this.pageData)
        // console.log(this.pageData)
      }
    },
    isEditImg(newVal) {
      if(!newVal) {
        this.canvas.discardActiveObject() // 不选中
        this.canvas.renderAll()
      }
    },
    deep: true
  },
  methods: {
    addBg(src, canvas, attrs, scale) {
      fabric.NamedImage.fromURL(src, (oImg)=> {
        // oImg.scale(this.deskScale).set(attrs)
        oImg.scale(scale).set(attrs)
        oImg.centeredRotation = true // 中心旋转
        oImg.hasControls = false // 取消控件-角
        oImg.set({
          borderColor: 'red',
        });
        if(oImg.name == "bgImg") {
          // canvas.bringToFront(oImg) //上移(一直向上)
          canvas.sendBackwards(oImg).renderAll()
        }
        canvas.add(oImg).renderAll()
      });
    },
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
          // evented: false, // 事件阻止
        })
        this.cPath.remove(namedImg).renderAll()
        // this.canvas.bringToFront(clipPath) //上移(一直向上)
        clipPath.set({
          'stroke': 'green',
          'strokeWidth': 2,
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
    /*addLayer(newVal, canvas, clipPathData) {
      this.time5 = setTimeout(()=>{
        var arr1 = []
        var arr2 = []
        for(let i = 0, len = this.testData.length; i < len; i++) {
          if(i%2 == 0) {
            arr2.push(this.testData[i])
            console.log(i)
          } else {
            arr1.push(this.testData[i])
          }
        }
        // Array.prototype.push.apply(arr1.reverse(), arr2)
        var clipPath = new fabric.Polygon(arr2, {
          top: 0,
          left: 0,
          fill: 'transparent',
          'stroke': 'red',
          'strokeWidth': 1,
        })
        clipPath.scale(0.2)
        this.canvas.add(clipPath).renderAll()
      }, 800)
    },*/
    addLayer(newVal, canvas, clipPathData) {
      if(newVal.layer) { // 0 / 1 底层背景,2文字(包括文字图片), 3蒙版和照片
        newVal.layer.forEach((item)=> {
          setTimeout(()=>{
            if(item.layertype == 1) {

            } else if(item.layertype == 0) { // 背景
              if(item.img.url) {
                var l = item.primitiveX * this.deskScale
                var t = item.primitiveY * this.deskScale
                this.addBg("http://pex7ss6vd.bkt.clouddn.com/" + item.img.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', canvas, { 
                  name: 'bgImg',
                  id: item.img.id,
                  left: l,
                  top: t,
                  selectable: false
                }, 1)
              }
            } else if(item.layertype == 2) { // 可编辑文字
              if(item.img.url) {
                var l = item.primitiveX * this.deskScale
                var t = item.primitiveY * this.deskScale
                var w = item.primitiveWidth * this.deskScale
                var h = item.primitiveHeight * this.deskScale
                this.addBg("http://pex7ss6vd.bkt.clouddn.com/" + item.img.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', canvas, {
                  name: 'text',
                  id: item.img.id,
                  originX: 'center',
                  originY: 'center',
                  left: l + w/2, // toJson时要减掉
                  top: t + h/2,
                  // selectable: false,
                }, 1)
              }
            }
          }, item.idx*200)

          if(item.layertype == 3) { // 蒙版和照片
            setTimeout(()=>{
              if(item.img.mask) {
                var l = item.img.mask.rect.x * this.deskScale
                var t = item.img.mask.rect.y * this.deskScale
                this.addBg("http://pex7ss6vd.bkt.clouddn.com/" + item.img.mask.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', canvas, { 
                  name: 'clipBox',
                  id: item.img.mask.id,
                  left: l,
                  top: t,
                  selectable: false,
                  // evented: false, // 事件阻止
                }, 1)
                var layerIdx = item.idx
                this.toPathFn("http://pex7ss6vd.bkt.clouddn.com/" + item.img.mask.url + '?imageView2/2/w/' + (item.primitiveWidth * this.deskScale).toFixed(0) + '/h/' + (item.primitiveHeight * this.deskScale).toFixed(0) +  '/format/png', l, t, canvas, clipPathData, layerIdx)
              }
            }, item.idx*150)
            setTimeout(()=>{
              if(item.img.fillImg) {
                var l = item.img.fillImg.rect.x * this.deskScale
                var t = item.img.fillImg.rect.y * this.deskScale
                this.addImg(item.img.fillImg.url, {
                  name: 'fillImg', // 添加的图片
                  originX: 'center',
                  originY: 'center',
                  left: l,
                  top: t,
                  opacity: item.img.fillImg.opacity,
                  layerIdx: item.img.fillImg.layerIdx,
                  clipObj: item.img.fillImg.clipObj, // 自定义属性--> 裁剪框
                  clipTo: 'function(ctx) {this.myClipTo(ctx)}',
                }, item.img.fillImg.scale)
              }
            }, item.idx*200 + 100)
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
    /*clipHover(canvas, clipPathData) {
      var vm = this
      // 给对象hover时添加红框
      canvas.on('mouse:move', function(e) {
        var e = e.e
        var x = e.offsetX
        var y = e.offsetY
        clipPathData.forEach((item)=> {
          item.clipPath.set('strokeWidth', 0)
          canvas.renderAll()
          var l = item.clipPath.left
          var t = item.clipPath.top
          var isIn = vm.windingNumber({x: x, y: y}, item.clipPath.points, l, t)
          if(isIn) {
            // console.log(isIn)
            item.clipPath.set({
              'stroke': 'red',
              'strokeWidth': 2,
            });
            canvas.renderAll()
          }
        })
      })
        
      // 文字hover效果
      canvas.on('mouse:over', function(e) {
        if(e.target) {
          if(e.target.name == 'text') {
            e.target.set({
              'stroke': 'red',
              'strokeWidth': 1,
            });
            canvas.renderAll();
          }
        }
      });
        
      canvas.on('mouse:out', function(e) {
        if(e.target) {
          if(e.target.name == 'text') {
            e.target.set('strokeWidth', 0);
            canvas.renderAll(); 
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
        /*var scale = 1
        if(namedImg.clipObj) {
          var isWide = namedImg.width > namedImg.height
          if(isWide) {
            scale = Math.ceil(((namedImg.clipObj.height) / namedImg.height)*100)/100
          } else {
            scale = Math.ceil((namedImg.clipObj.width / namedImg.width)*100)/100
          }
        }
        scale &&namedImg.scale(scale) */
        if(scale) {
          namedImg.scale(scale)
        }
        
        namedImg.hasControls = false // 取消控件-角
        
        vm.canvas.add(namedImg).renderAll()
        // vm.canvas.forEachObject(function(o){o.hasBorders = o.hasControls = false;})
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
            'stroke': 'red',
            'strokeWidth': 2,
          });
          vm.canvas.renderAll()
        }
      })
    },
    drop(e) { // @drop: 在元素拖动到放置目标后触发
      this.canvas.discardActiveObject() // 不选中
      this.$emit('getObj', '')
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
                  layerIdx: item.layerIdx,
                  clipObj: item.clipPath, // 自定义属性--> 裁剪框
                  clipTo: 'function(ctx) {this.myClipTo(ctx)}',
                })
              })
            }
          }
        })
      } else if(this.dragType == '文字') {
        console.log('文字')
        var text = new fabric.Text('请点击输入', { 
          originX: 'center',
          originY: 'center',
          left: x, 
          top: y,
          fontSize: 18,
          fontFamily: this.fontFamily
        })
        text.hasControls = false // 取消控件-角
        // text.set('borderColor', 'red');
        this.canvas.add(text).renderAll()
      } else if(this.dragType == '装饰') {
        if(this.curDragDecorate) {
          this.addImg(this.curDragDecorate.src, {
            name: 'decorate',
            originX: 'center',
            originY: 'center',
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
        layerIdx: target.layerIdx,
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
      // console.log(JSON.stringify(this.pageData.layer[target.layerIdx].img.fillImg))
    }
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
        if(target.name == 'bgImg' || target.name == 'clipBox') {
          target.set('selectable', false)
          this.canvas.renderAll()
        }
        if(target.type == 'polygon') {
          target.set('selectable', false)
          this.canvas.renderAll()
          // this.clipPathData.push(target)
        }
        if(target.name == 'fillImg') {
          this.toSaveOldPageData(target)
        }
        // 下移-sendBackwards  上移-bringForward  置顶-bringToFront  置底-sendToBack
        /*this.canvas.forEachObject((item)=> {
          if(item.name == 'bgImg') {
            this.canvas.bringForward(item).renderAll()
          }
        })*/
        this.canvas.forEachObject((item)=> {
          if(item.name == 'text' || item.name == 'decorate') {
            this.canvas.bringForward(item).renderAll()
          }/* else if(item.name == 'bgImg') {
            this.canvas.sendBackwards(item).renderAll()
          }*/
        })
      })

      // object:selected 这个方法v2已经废弃，使用selection:created替代
      this.canvas.on('selection:created', (options)=> {
        this.gobj = options.target
        if(this.gobj.name == "text" || this.gobj.type == 'text' || this.gobj.name == 'decorate' || this.gobj.name == "边框") {
          this.$emit('getObj', this.gobj)
        } else if(this.gobj.name == 'fillImg') {
          var e = options.e
          if(e) {
            var x = e.offsetX
            var y = e.offsetY
            // console.log(this.gobj.clipObj)
            var l = this.gobj.clipObj.left
            var t = this.gobj.clipObj.top
            var isIn = this.windingNumber({x: x, y: y}, this.gobj.clipObj.points, l, t)
            if(isIn) {
              this.$emit('getObj', this.gobj)
            } else {
              this.$emit('getObj', '')
              this.gobj = ''
              this.canvas.discardActiveObject() // 不选中
            }
          }
        } else {
          this.$emit('getObj', '')
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
        var target = this.canvas.getActiveObject()
        if(target) {
          if(target.name == 'fillImg') {
            this.toSaveOldPageData(target)
          }
        }
      })

      this.canvas.on('mouse:up', (options)=> {
        var e = options.e
        var x = e.offsetX
        var y = e.offsetY
        if(this.gobj) {
          if(this.gobj.name == 'fillImg') {
            // console.log(this.gobj.clipObj)
            var l = this.gobj.clipObj.left
            var t = this.gobj.clipObj.top
            var isIn = this.windingNumber({x: x, y: y}, this.gobj.clipObj.points, l, t)
            // console.log(isIn)
            if(isIn) {
              this.$emit('getObj', this.gobj)
            } else {
              this.$emit('getObj', '')
              this.gobj = ''
              this.canvas.discardActiveObject() // 不选中
            }
          }
        } else {
          for(var i = 0, len = this.clipPathData.length; i < len; i++) {
            var l = this.clipPathData[i].clipPath.left
            var t = this.clipPathData[i].clipPath.top
            var isIn = this.windingNumber({x: x, y: y}, this.clipPathData[i].clipPath.points, l, t)
            if(isIn) {
              this.canvas.forEachObject((item)=> { // _objects.forEach
                if(item) {
                  if(item.name == 'img' || item.name == 'fillImg') {
                    if(this.clipPathData[i].clipPath.left == item.clipObj.left && this.clipPathData[i].clipPath.top == item.clipObj.top) {
                      this.$emit('getObj', item)
                      this.canvas.setActiveObject(item)
                    }
                  }
                }
              })
            }
          }
        }
      })

      /*this.canvas.on('mouse:down', (options)=> {
        var e = options.e
        var x = e.offsetX
        var y = e.offsetY
        var gobj = this.canvas.getActiveObject(); //获取当前选中对象
        console.log(gobj)
        if(gobj && (gobj.name == "text" || gobj.type == 'text' || gobj.name == 'decorate')) {
          this.$emit('getObj', gobj)
        } else if(gobj && gobj.name == "边框") {
          this.$emit('getObj', gobj)
        } else {
          for(var i = 0, len = this.clipPathData.length; i < len; i++) {
            var l = this.clipPathData[i].clipPath.left
            var t = this.clipPathData[i].clipPath.top
            var isIn = this.windingNumber({x: x, y: y}, this.clipPathData[i].clipPath.points, l, t)
            if(isIn) {
              var obj = ''
              if(gobj) {
                this.canvas.forEachObject((item)=> { // _objects.forEach
                  if(item) {
                    if(item.name == 'img' || item.name == 'fillImg') {
                      if(this.clipPathData[i].clipPath === item.clipObj) {
                        // console.log('get')
                        obj = gobj.clipObj === this.clipPathData[i].clipPath ? gobj : item
                      } else {
                        this.canvas.discardActiveObject() // 不选中
                      }
                    } else {
                      obj = gobj
                    }
                  }
                })
              } 
              // console.log(obj)
              if(obj) {
                this.$emit('getObj', obj)
                return
              } else {
                // console.log('no')
                this.$emit('getObj', '')
              }
            } else {
              // console.log('out')
              this.$emit('getObj', '')
            }
          }
        }
      })*/
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fabricBox {display: inline-block;}
</style>