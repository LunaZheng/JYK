<template>
  <div class="test">
    <a href="javascript:;" class="file">添加照片
      <input type="file" name="" id="fileEL" multiple="" @change="addPics">
    </a>
    <ul id="ul1">
      <li v-for="(img, idx) in filePicData">
        <img height="78" draggable="true" 
          :src="img.src" alt="" :clsaa="'img' + idx" 
          :title="img.name" 
          @mousedown="drag($event)"
        />
      </li>
    </ul>
    <span class="btn" @click="toJSON()">toJSON</span>
    <div class="canvas-box" @dragover="allowDrop" @drop="drop">
      <canvas id="canvas"></canvas>
    </div>
    <canvas id="cPath" style="display: none; position: absolute; top: 0; left: 0;"></canvas>
  </div>
</template>

<script>
export default {
  name: 'test',
  created() {
    // console.log(window.location.origin)
    // console.log(this.$router)
  },
  data () {
    return {
      canvas: '',
      cPath: '',
      points: '',
      curClipPath: '',
      clipPathData: [],
      filePicData: [], // '添加照片'的file数据
      curDragImg: '', // 当前被拖拽的图片 DOM
      page: {
        id: "56a12abf4902d5cbfd86d4b34743feb5",
        pageTempletImageurl: "56a12abf4902d5cbfd86d4b34743feb5.jpg", 
        pagewidth: "450",
        pageheight: "450",
        layer: [
          {
            type: "image",// -- 层类型. image为图片,text为文字.
            isEditable: "false",// -- 是否可编辑.true为可编辑
            alpha: "1",// --透明度
            blendmode: "0",
            layertype: "3",// 3底层背景.5可编辑文字.0不可编辑,1需要填充图片
            rect: "0;0;450;450",// 位置
            img: {
              id: "4989476a97461c6310a60f6f6a0acb9a",//--编号
              url: "/static/bfl-img/bg-1.png",// --路径
              isColorOptimize: "0",
              isSkinColorOptimize: "0",
              imageRotation: "0", // --旋转角度
              primitiveWidth: "3496",// --原始尺寸
              primitiveHeight: "3496",// --原始尺寸
              imageRect: "0;0;450;450"//  --显示尺寸
            }
          },
          {
            type: "image",
            isEditable: "false",
            alpha: "1",
            blendmode: "0",
            layertype: "0",
            rect: "0;0;450;450",
            img: {
              id: "623ccf40fdf519a95cfe368e7d98b4bf",
              url: "/static/bfl-img/bg-2.png",
              isColorOptimize: "0",
              isSkinColorOptimize: "0",
              imageRotation: "0",
              primitiveWidth: "3496",
              primitiveHeight: "3496",
              imageRect: "0;0;450;450"
            }
          },
          {
            type: "image",
            isEditable: "true",
            alpha: "1",
            blendmode: "0",
            layertype: "1",// 1需要填充图片
            rect: "117;220;108;112",
            img: {
              isColorOptimize: "0",
              isSkinColorOptimize: "0",
              imageRotation: "0",
              primitiveWidth: "0",
              primitiveHeight: "0",
              imageRect: "0;0;108;112"
            },
            mask: {
              id: "790ca442f1ba4f060b93744d3e72fc94",
              url: "/static/bfl-img/2.png",
              isrectmask: "false"
            }
          },
          {
            type: "image",
            isEditable: "true",
            alpha: "1",
            blendmode: "0",
            layertype: "1",
            rect: "122;70;220;212",
            img: {
              isColorOptimize: "0",
              isSkinColorOptimize: "0",
              imageRotation: "0",
              primitiveWidth: "0",
              primitiveHeight: "0",
              imageRect: "0;0;220;212"
            },
            mask: {
              id: "3c18bf588604aa0eccb33346168def4b",
              url: "/static/bfl-img/1.png",
              isrectmask: "false"
            }
          },
          {
            type: "image",
            isEditable: "true",
            alpha: "1",
            blendmode: "0",
            layertype: "1",
            rect: "243;265;104;107",
            img: {
              isColorOptimize: "0",
              isSkinColorOptimize: "0",
              imageRotation: "0",
              primitiveWidth: "0",
              primitiveHeight: "0",
              imageRect: "0;0;104;107"
            },
            mask: {
              id: "fb6beac210cf24d26058b3858e5b8b39",
              url: "/static/bfl-img/3.png",
              isrectmask: "false"
            }
          },
          {
            type: "serverText",
            alpha: "1",
            isEditable: "true",
            layertype: "5",
            rect: "77;50;158;85",
            img: {
              id: "5",
              url: "/static/bfl-img/text.png",
              isColorOptimize: "0",
              isSkinColorOptimize: "0",
              imageRotation: "0",
              primitiveWidth: "1231",
              primitiveHeight: "654",
              imageRect: "0;0;158;85"
            },
            format: {
              fontSize: "0",
              fontStyle: "0",
              fontStroke: "0",
              fontShadow: "0",
              fontOpacity: "0",
              fontB: "0",
              fontI: "0",
              fontAlignment: "0",
              fontColor: "0",
              fontShadowColor: "0",
              fontStrokeColor: "0"
            }
          }
        ]
      },
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
  methods: {
    toJSON() {
      this.page.layer.map((item2, idx2)=> {
        if(item2.layertype == 3) {
          item2.img.url = window.location.origin + item2.img.url
        }
      })
      var data = this.canvas.toJSON().objects
      data.forEach((item, idx)=> {
        this.page.layer.map((item2, idx2)=> {
          if(item2.img.id) {
            if(item2.img.id == item.id) {
              item2.img.url = item.src
            }
          } else if(item2.mask.id) {
            if(item2.mask.id == item.id) {
              item2.mask.url = item.src
            }
          }
          return item2
        })
        if(item.name) {
          if(item.name == 'img') {
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
                imageRect: ""//  --显示尺寸
              }
            }
            var moveL = item.left - item.clipObj.left
            var moveT = item.top - item.clipObj.top
            obj.rect = [item.left, item.top, item.clipObj.width, item.clipObj.height].join(';')
            obj.img.id = idx
            obj.img.url = item.src
            obj.img.scale = item.scaleX
            obj.img.imageRotation = item.angle
            obj.img.primitiveWidth = item.width
            obj.img.primitiveHeight = item.height
            obj.img.imageRect = [0, 0, Math.round(item.width*item.scaleX), Math.round(item.height*item.scaleX)].join(';')
            this.page.layer.push(obj)
            // console.log(JSON.stringify(obj))
          }
        }
      })
      // console.log(this.page.layer)
      console.log(JSON.stringify(this.page))
    },
    addPics(e) { // 添加照片
      var vm = this
      var target = e.target
      ;[].slice.call(target.files).forEach(function(oFile, idx) {
        var src = URL.createObjectURL(oFile)
        var name = oFile.name
        var obj = {
          src: src,
          name: name
        }
        vm.filePicData.push(obj)
      })
      target.value = ''
    },
    drag(e) { // @dragstart: 在用户开始拖动元素时执行
      this.curDragImg = e.target
    },
    allowDrop(e) { // @dragover: 在元素正在拖动到放置目标时触发
      var vm = this
      vm.canvas.discardActiveObject() // 不选中
      // e.preventDefault()
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
      // e.preventDefault()
      var vm = this
      var x = e.offsetX
      var y = e.offsetY
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
          if(vm.curDragImg) {
            vm.addImg(vm.curDragImg.src, {
              name: 'img',
              left: l,
              top: t,
              clipObj: vm.curClipPath, // 自定义属性--> 裁剪框
              clipTo: function(ctx) {this.myClipTo(ctx)},
            })
          }
        }
      })
    },
    addImg(src, attrs) {
      var vm = this
      var img = new Image()
      img.src = src
      img.crossOrigin = '';
      img.onload = function() {
        var namedImg = new fabric.NamedImage(img, attrs)
        var isWide = namedImg.width > namedImg.height
        if(isWide) {
          var scale = Math.ceil(((namedImg.clipObj.height) / namedImg.height)*100)/100
        } else {
          var scale = Math.ceil((namedImg.clipObj.width / namedImg.width)*100)/100
        }
        scale && namedImg.scale(scale)
        namedImg.setControlVisible('ml', false)
        namedImg.setControlVisible('mt', false)
        namedImg.setControlVisible('mr', false)
        namedImg.setControlVisible('mb', false)
        namedImg.hasRotatingPoint = false // 取消旋转控件
        namedImg.centeredScaling = true // 中心放大
        vm.canvas.add(namedImg).renderAll()
      }
    },
    addBg(src, attrs) {
      var vm = this
      fabric.NamedImage.fromURL(src, function(oImg) {
        oImg.scale(1).set(attrs)
        vm.canvas.add(oImg).renderAll()
      });
    },
    toPathFn(src, l, t) {
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
        imgData = this.ctxPath.getImageData(namedImg.aCoords.tl.x, namedImg.aCoords.tl.y, cPath.width, cPath.height);
        data = imgData.data;
        //获取图像的轮廓路径（轮廓=透明像素的外部路径）this.toPath --> 全局函数
        points = this.toPath.geom(function(x, y) { //确定非透明的轮廓
          var a = data[(y * cw + x) * 4 + 3];
          return (a > 20);
        })
        var clipPath = new fabric.Polygon(points, {
          left: namedImg.left,
          top: namedImg.top,
          // 'stroke': 'red',
          // 'strokeWidth': 1,
          fill: 'transparent',
          selectable: false,
          // evented: false, // 事件阻止
        })
        this.cPath.remove(namedImg).renderAll()
        // this.canvas.bringToFront(clipPath) //上移(一直向上)
        this.canvas.add(clipPath).renderAll()
        this.clipPathData.push(clipPath)
      }
      img1.src = src;
    },
    windingNumber(p, poly, left, top) {
      /**
       * @description 回转数法判断点是否在多边形内部
       * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
       * @param {Array} poly 多边形顶点，数组成员的格式同 p
       * @return {String} 点 p 和多边形 poly 的几何关系
       */
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
    onChange(options) {
      options.target.setCoords();
      if(options.target.name == 'img') {
        if(options.target.left>options.target.clipObj.left) {
          options.target.set('left', options.target.clipObj.left)
        }
        if(options.target.top>options.target.clipObj.top) {
          options.target.set('top', options.target.clipObj.top)
        }
        if(options.target.oCoords.mr.x<options.target.clipObj.oCoords.mr.x) {
          var w = options.target.oCoords.mr.x - options.target.oCoords.ml.x
          options.target.set('left', options.target.clipObj.oCoords.mr.x-w)
        }
        if(options.target.oCoords.mb.y<options.target.clipObj.oCoords.mb.y) {
          var h = options.target.oCoords.mb.y - options.target.oCoords.mt.y
          options.target.set('top', options.target.clipObj.oCoords.mb.y-h)
        }
      }
    },
  },
  mounted() {
    this.myFabric.namedImage()
    this.$nextTick(function() { // dom已更新
      var canvas = new fabric.Canvas('canvas');
      var cPath = new fabric.Canvas('cPath');
      canvas.setWidth(this.page.pagewidth)
      canvas.setHeight(this.page.pageheight)
      cPath.setWidth(this.page.pagewidth)
      cPath.setHeight(this.page.pageheight)

      this.canvas = canvas
      this.cPath = cPath
      var vm = this

      var time1 = setTimeout(()=>{
        vm.page.layer.forEach((item)=> {
          if(item.layertype == 3) {
            vm.canvas.setBackgroundImage(item.img.url, vm.canvas.renderAll.bind(vm.canvas));
            console.log(vm.canvas)
          } else if(item.layertype == 0) {
            var rect = item.rect.split(';')
            var l = rect[0]*1
            var t = rect[1]*1
            var w = rect[2]*1
            var h = rect[3]*1
            vm.addBg(item.img.url, { 
              name: 'bgImg',
              id: item.img.id,
              left: l,
              top: t,
              selectable: false
            })
          }
        })
      }, 20)
      var time2 = setTimeout(()=>{
        vm.page.layer.forEach((item)=> {
          if(item.layertype == 1) {
            var rect = item.rect.split(';')
            var l = rect[0]*1
            var t = rect[1]*1
            var w = rect[2]*1
            var h = rect[3]*1
            vm.addBg(item.mask.url, { 
              name: 'clipBox',
              id: item.mask.id,
              left: l,
              top: t,
              selectable: false,
              // evented: false, // 事件阻止
            })
            vm.toPathFn(item.mask.url, l, t)
          }
        })
      }, 200)
      var time3 = setTimeout(()=>{
        vm.page.layer.forEach((item)=> {
          if(item.layertype == 5) {
            var rect = item.rect.split(';')
            var l = rect[0]*1
            var t = rect[1]*1
            var w = rect[2]*1
            var h = rect[3]*1
            vm.addBg(item.img.url, { 
              name: 'text',
              id: item.img.id,
              left: l,
              top: t,
              selectable: false,
            })
          }
        })
      }, 400)

      canvas.on('object:added', function(options) {
        vm.canvas._objects.forEach((item)=> {
          if(item.name == 'text') {
            vm.canvas.bringToFront(item).renderAll() //上移(一直向上)
          }
        })
      })

      canvas.on({
        'object:moving': this.onChange,
        'object:scaling': this.onChange,
        'object:rotating': this.onChange,
      });

      // 给对象hover时添加红框
      vm.canvas.on('mouse:move', function(e) {
        var e = e.e
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
      })
        
      vm.canvas.on('mouse:over', function(e) {
        if(e.target) {
          if(e.target.name == 'text') {
            e.target.set({
              'stroke': 'red',
              'strokeWidth': 2,
            });
            vm.canvas.renderAll();
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
      /*vm.canvas.on('mouse:up', function(e) {
        if(e.target) {
          if(e.target.type == 'polygon' || e.target.name == 'text') {
            e.target.set({
              'stroke': 'red',
              'strokeWidth': 2,
              // originX: 'center',
              // originY: 'center',
            });
            vm.canvas.renderAll();
          }
          if(e.target.type == 'polygon') {
            vm.curClipPath = e.target
          }
        }
      });*/

      /*vm.canvas.on('drop', function(e) {
        console.log('drop')
      })
      vm.canvas.on('dragover', function(e) {
        console.log('dragover')
        console.log(e)
      })
      vm.canvas.on('dragenter', function(e) {
        console.log('dragenter')
      })
      vm.canvas.on('dragleave', function(e) {
        console.log('dragleave')
      })*/
      
      


    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {border: 1px solid red;} 
.btn {display: inline-block; border: 1px solid black; margin-top: 10px; margin-left: 10px; cursor: pointer; border: 1px solid black; border-radius:254px 16px 226px 16px/16px 226px 16px 254px; margin-bottom: 20px; padding: 10px 20px; list-style: none;} 
#ul1 li {display: inline-block;} 
</style>
