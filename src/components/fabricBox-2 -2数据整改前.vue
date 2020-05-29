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
      curClipPath: '',
      time1: '',
      time2: '',
      time3: '',
      time4: '',
      time5: '',
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
      this.toSaveOldFabric(oldVal)
      this.clipPathData = []
      clearTimeout(this.time1)
      clearTimeout(this.time2)
      clearTimeout(this.time3)
      if(newVal) {
        this.$nextTick(function() {
          this.canvas.setWidth(newVal.pagewidth)
          this.canvas.setHeight(newVal.pageheight)
          this.cPath.setWidth(newVal.pagewidth)
          this.cPath.setHeight(newVal.pageheight)
          this.canvas.clear()
          if(newVal.oldFabric) {
            if(newVal.oldFabric.objects.length == 0) {
              this.addLayer(newVal, this.canvas, this.clipPathData)
            } else {
              var oldJson = JSON.stringify(newVal.oldFabric)
              // this.canvas.loadFromJSON(oldJson, this.canvas.renderAll.bind(this.canvas))
              this.canvas.loadFromJSON(oldJson)
            }
          } else {
            this.addLayer(newVal, this.canvas, this.clipPathData)
          }
        })
      }
    },
    clipPathData(newVal) {
      if(newVal.length == this.pageData.photocount) {
        this.clipHover(this.canvas, this.clipPathData)
      }
    },
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
      fabric.NamedImage.fromURL(src, function(oImg) {
        oImg.scale(scale).set(attrs)
        oImg.centeredRotation = true // 中心旋转
        oImg.hasControls = false // 取消控件-角
        oImg.set({
          borderColor: 'red',
        });
        canvas.add(oImg).renderAll()
      });
    },
    toPathFn(src, l, t, canvas, clipPathData) {
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
        canvas.add(clipPath).renderAll()
        clipPathData.push(clipPath)
      }
      img1.src = src;
    },
    addLayer(newVal, canvas, clipPathData) {
      var vm = this
      this.time1 = setTimeout(()=>{
        if(newVal.layer) {
          newVal.layer.forEach((item)=> {
            if(item.layertype == 3) {
              canvas.setBackgroundImage("/static/bfl-img/" + item.img.url, canvas.renderAll.bind(canvas));
            } else if(item.layertype == 0) {
              var rect = item.rect.split(';')
              var l = rect[0]*1
              var t = rect[1]*1
              vm.addBg("/static/bfl-img/" + item.img.url, canvas, { 
                name: 'bgImg',
                id: item.img.id,
                left: l,
                top: t,
                selectable: false
              }, 1)
            }
          })
        }
      }, 20)
      this.time2 = setTimeout(()=>{
        if(newVal.layer) {
          newVal.layer.forEach((item)=> {
            if(item.layertype == 1) {
              var rect = item.rect.split(';')
              var l = rect[0]*1
              var t = rect[1]*1
              vm.addBg("/static/bfl-img/" + item.mask.url, canvas, { 
                name: 'clipBox',
                id: item.mask.id,
                left: l,
                top: t,
                selectable: false,
                // evented: false, // 事件阻止
              }, 1)
              vm.toPathFn("/static/bfl-img/" + item.mask.url, l, t, canvas, clipPathData)
            }
          })
        }
      }, 200)
      this.time3 = setTimeout(()=>{
        if(newVal.layer) {
          newVal.layer.forEach((item)=> {
            if(item.layertype == 5) {
              var rect = item.rect.split(';')
              var l = rect[0]*1
              var t = rect[1]*1
              var w = rect[2]*1
              var h = rect[3]*1
              vm.addBg("/static/bfl-img/" + item.img.url, canvas, {
                name: 'text',
                id: item.img.id,
                originX: 'center',
                originY: 'center',
                left: l + w/2, // toJson时要减掉
                top: t + h/2,
                // selectable: false,
              }, 1)
            }
          })
        }
      }, 400)
      this.time4 = setTimeout(()=>{
        if(newVal.layer) {
          newVal.layer.forEach((item)=> {
            if(item.layertype == 2) {
              // console.log(item.img.clipObj)
              var rect = item.rect.split(';')
              var l = rect[0]*1
              var t = rect[1]*1
              vm.addImg(item.img.url, {
                name: 'img',
                originX: 'center',
                originY: 'center',
                left: l + item.img.primitiveWidth * item.img.scale / 2, // 导出json时要改回来
                top: t + item.img.primitiveHeight * item.img.scale / 2,
                // hasControls: false,
                clipObj: item.img.clipObj, // 自定义属性--> 裁剪框
                clipTo: 'function(ctx) {this.myClipTo(ctx)}',
                myScale: item.img.scale
              })
            }
          })
        }
      }, 600)

      /*this.time5 = setTimeout(()=>{
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
      }, 800)*/
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
    clipHover(canvas, clipPathData) {
      var vm = this
      // 给对象hover时添加红框
      canvas.on('mouse:move', function(e) {
        var e = e.e
        var x = e.offsetX
        var y = e.offsetY
        clipPathData.forEach((item)=> {
          item.set('strokeWidth', 0)
          canvas.renderAll()
          var l = item.left
          var t = item.top
          var isIn = vm.windingNumber({x: x, y: y}, item.points, l, t)
          if(isIn) {
            item.set({
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
    },
    addImg(src, attrs) {
      var vm = this
      var img = new Image()
      img.src = src
      img.crossOrigin = '';
      
      img.onload = function() {
        var namedImg = new fabric.NamedImage(img, attrs)
        if(namedImg.clipObj) {
          var isWide = namedImg.width > namedImg.height
          if(isWide) {
            var scale = Math.ceil(((namedImg.clipObj.height) / namedImg.height)*100)/100
          } else {
            var scale = Math.ceil((namedImg.clipObj.width / namedImg.width)*100)/100
          }
        }
        
        if(namedImg.myScale != undefined) {
          scale = namedImg.myScale
        }
        scale && namedImg.scale(scale)
        
        namedImg.hasControls = false // 取消控件-角
        vm.canvas.add(namedImg).renderAll()
      }
    },
    allowDrop(e) { // @dragover: 在元素正在拖动到放置目标时触发
      e.preventDefault() // 阻止默认
      var vm = this
      vm.canvas.discardActiveObject() // 不选中
      var x = e.offsetX
      var y = e.offsetY
      vm.clipPathData.forEach((item)=> {
        item.set('strokeWidth', 0)
        vm.canvas.renderAll()
        var l = item.left
        var t = item.top
        var isIn = vm.windingNumber({x: x, y: y}, item.points, l, t)
        if(isIn) {
          item.set({
            'stroke': 'red',
            'strokeWidth': 2,
          });
          vm.canvas.renderAll()
        }
      })
    },
    drop(e) { // @drop: 在元素拖动到放置目标后触发
      var vm = this
      this.canvas.discardActiveObject() // 不选中
      this.$emit('getObj', '')
      var x = e.offsetX
      var y = e.offsetY

      if(this.dragType == '照片') {
        vm.clipPathData.forEach((item)=> {
          item.set('strokeWidth', 0)
          vm.canvas.renderAll()
          var l = item.left
          var t = item.top
          vm.curClipPath = ''

          var isIn = vm.windingNumber({x: x, y: y}, item.points, l, t)
          if(isIn) {
            vm.curClipPath = item
            var l = vm.curClipPath.left
            var t = vm.curClipPath.top
            var w = vm.curClipPath.width
            var h = vm.curClipPath.height
            if(this.curDragImg) {
              vm.addImg(this.curDragImg.src, {
                name: 'img',
                originX: 'center',
                originY: 'center',
                left: l + w/2, // 导出json时要改回来
                top: t + h/2,
                // hasControls: false,
                clipObj: vm.curClipPath, // 自定义属性--> 裁剪框
                clipTo: 'function(ctx) {this.myClipTo(ctx)}',
              })
            }
          }
        })
      } else if(this.dragType == '文字') {
        console.log(x, y)
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
        if(optObj.name == 'img') {
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
        this.clipPathData = []
        this.canvas.forEachObject((item)=> { // _objects.forEach
          if(item) {
            if(item.name == 'bgImg' || item.name == 'clipBox') {
              item.set('selectable', false)
              this.canvas.renderAll()
            }
            if(item.type == 'polygon') {
              item.set('selectable', false)
              this.canvas.renderAll()
              this.clipPathData.push(item)
            }
            if(item.name == 'text') {
              this.canvas.bringToFront(item).renderAll() //上移(一直向上)
            }
          }
        })
      })

      /*this.canvas.on('after:render', (options1)=> {
        this.toSaveOldFabric()
        var gobj = this.canvas.getActiveObject(); //获取当前选中对象
        if(gobj) { 
          this.$emit('getObj', gobj)
        }
      })*/

      this.canvas.on('mouse:down', (options)=> {
        /*this.canvas.forEachObject(function(o){
          if(o.name != 'text' || o.type != 'text') {
            o.hasBorders = o.hasControls = false;
          } else {
            o.hasBorders = o.hasControls = true;
          }
        });*/
        var e = options.e
        var x = e.offsetX
        var y = e.offsetY
        var gobj = this.canvas.getActiveObject(); //获取当前选中对象
        if(gobj && (gobj.name == "text" || gobj.type == 'text' || gobj.name == 'decorate')) {
          this.$emit('getObj', gobj)
        } else if(gobj && gobj.name == "边框") {
          this.$emit('getObj', gobj)
        } else {
          for(var i = 0, len = this.clipPathData.length; i < len; i++) {
            var l = this.clipPathData[i].left
            var t = this.clipPathData[i].top
            var isIn = this.windingNumber({x: x, y: y}, this.clipPathData[i].points, l, t)
            if(isIn) {
              var obj = ''
              if(gobj) {
                this.canvas.forEachObject((item)=> { // _objects.forEach
                  if(item) {
                    if(item.name == 'img') {
                      if(this.clipPathData[i] === item.clipObj) {
                        // console.log('get')
                        obj = gobj.clipObj === this.clipPathData[i] ? gobj : item
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
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fabricBox {display: inline-block;}
</style>