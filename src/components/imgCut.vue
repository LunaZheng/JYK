<template>
  <div class="imgCut cutMask">
  <!-- <el-dialog class="dialogCSS imgCut cutMask" :visible="isCutImg" @close="closeCut"> -->
    <div class="cut-bok">
      <div class="cut-left">
        <p><i class="icon-cut"></i>照片剪切</p>
        <div class="cut-content">
          <div class="clip-outBox" :title="cutImg.width + 'x' + cutImg.height"
            @mousedown="clipImgDown"
          >
            <canvas id="clipCanvas"></canvas>
            <div class="clip-box" v-show="isShowClipBox">
              <div class="clip-content"></div>
              <div class="resize">
                <div class="line drag">
                  <div class="l"></div>
                  <div class="t"></div>
                  <div class="r"></div>
                  <div class="b"></div>
                </div>
                <div class="corner"> 
                  <div class="lt"></div>
                  <div class="rt"></div>
                  <div class="rb"></div>
                  <div class="lb"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="zoom">
            <span>{{(scale*0.1).toFixed(1)}} &nbsp;&nbsp; </span>
            <i class="icon-search-minus" @click="imgScale"></i>
            <input type="range" min="0" max="30" v-model="scale" class="canvasSize">
            <i class="icon-search-plus" @click="imgScale"></i>
          </div> -->
        </div>
      </div>
      <div class="cut-right">
        <i class="icon-close" @click="closeCut"></i>
        <ul class="cut-edit">
          <li class="num">
            <i class="icon-circle-left"></i>
            <span>1 / 1</span>
            <i class="icon-circle-right"></i>
          </li>
          <li class="size">
            <p>可选尺寸:</p>
            <label for="6寸" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="imgSize" id="6寸">
              <span>6寸</span>
            </label>
            <label for="全景6寸" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="imgSize" id="全景6寸">
              <span>全景6寸</span>
            </label>
            <label for="7寸" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="imgSize" id="7寸">
              <span>7寸</span>
            </label>
            <label for="8寸" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="imgSize" id="8寸">
              <span>8寸</span>
            </label>
            <label for="10寸" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="imgSize" id="10寸">
              <span>10寸</span>
            </label>
          </li>
          <li class="shape">
            <p>裁剪形状:</p>
            <label for="vertical" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="shape" id="vertical">
              <i class="vertical"></i>
            </label>
            <label for="horizontal" class="radio" @click="editImg('radio', $event)">
              <input type="radio" name="shape" id="horizontal">
              <i class="horizontal"></i>
            </label>
          </li>
          <li class="info">
            <p>裁剪形状: <span> {{(imgSize.w*1).toFixed(0)}} * {{(imgSize.h*1).toFixed(0)}} pixel</span></p>
            <p>最佳冲印尺寸: {{imgSize.cun}}</p>
          </li>
          <li class="filters">
            <label for="增加白边框" class="checkbox" @click="editImg('checkbox', $event)">
              <input type="checkbox" name="filters" id="增加白边框">
              <span>增加白边框</span>
            </label>
            <label for="自动色彩调整" class="checkbox" @click="editImg('checkbox', $event)">
              <input type="checkbox" name="filters" id="自动色彩调整">
              <span>自动色彩调整</span>
            </label>
            <label for="自动肤色调整" class="checkbox" @click="editImg('checkbox', $event)">
              <input type="checkbox" name="filters" id="自动肤色调整">
              <span>自动肤色调整</span>
            </label>
            <label for="光面" class="checkbox" @click="editImg('checkbox', $event)">
              <input type="checkbox" name="filters" id="光面">
              <span>光面</span>
            </label>
            <label for="绒面" class="checkbox" @click="editImg('checkbox', $event)">
              <input type="checkbox" name="filters" id="绒面">
              <span>绒面</span>
            </label>
          </li>
          <li class="btns">
            <div class="btn-cut" @click="imgToClip">预览</div>
            <div class="btn-remove" @click="resetImg">重置</div>
            <div class="btn-save on" @click="toSave">确定</div>
          </li>
        </ul>
      </div>
    </div>
  <!-- </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: 'imgCut',
  props: ["curCutImg", "isCutImg"],
  data () {
    return {
      curCutCanvas: '',
      curWhiteRect: '',
      cutImg: '',
      isShowClipBox: true,
      isClip: false,
      isSave: true,
      originImg: '',
      scale: 0,
      imgSize: {
        w: 800,
        h: 1200,
        cun: '6寸',
        size: '800x1200'
      },
      ComposedFilter: '', // 过滤容器
      addWhiteRectData: '',
      clipRect: ''
    }
  },
  watch: {
    /*scale(newVal) {
      var scale = (this.originImg.scaleX + newVal*0.1).toFixed(2)
      this.cutImg.scale(scale)
      this.curCutCanvas.renderAll()
    }*/
  },
  methods: {
    resetImg() { // 重置
      this.isShowClipBox = true
      this.isClip = false
      this.curCutCanvas.clear()
      $('.size label').siblings().removeClass("on")
      $('.shape label').siblings().removeClass("on")
      $('.filters label').siblings().removeClass("on")
      let clipBox = $('.clip-outBox')
      let clipBoxW = clipBox.width()
      let clipBoxH = clipBox.height()
      this.originImg = fabric.util.object.clone(this.curCutImg)
      let src = this.originImg.getSrc()
      let scale = this.originImg.scaleX
      let clipObj = this.originImg.clipObj
      let imgW = (this.originImg.width * scale).toFixed(2)*1
      let imgH = (this.originImg.height * scale).toFixed(2)*1

      fabric.NamedImage.fromURL(src, (img)=> {
        img.scale(scale)
        img.set({
          left: clipBoxW/2 - imgW/2,
          top: clipBoxH/2 - imgH/2,
          clipObj: clipObj,
          selectable: false,
        })
        this.curCutCanvas.add(img).renderAll()
        this.curCutCanvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });
        this.cutImg = img
        $('.clip-box').css({
          'left': clipBoxW/2 - clipObj.width/2,
          'top': clipBoxH/2 - clipObj.height/2,
          'width': clipObj.width,
          'height': clipObj.height,
        })

        // 过滤容器
        this.ComposedFilter = new fabric.Image.filters.Composed({
          subFilters: []
        })
       },{crossOrigin: 'anonymous'}
      );
    },
    closeCut(e) { // 关闭
      if(e) {
        e.preventDefault()
        e.stopPropagation()
      }
      this.$emit('getIsCutImg', false)
    },
    clipImgDown(e) { // 裁剪框拖拽
      var x1 = e.clientX
      var y1 = e.clientY
      var target = e.target
      var box = target.closest('.clip-box')
      var clipContent = target.closest('.clip-content')
      var resize = target.closest('.resize')
      var sClass = target.className

      if (!box) {
        return
      }

      e.preventDefault && e.preventDefault()
      //当捕捉到事件(event)时，判断为false，则阻止当前事件继续运行
      e.returnValue = false

      var originX = box.offsetLeft
      var originY = box.offsetTop
      var originW = box.offsetWidth
      var originH = box.offsetHeight

      if (clipContent) {
        // 拖拽，改变位置
        target.onmousemove = function(e) {
          var x2 = e.clientX
          var y2 = e.clientY
          var x = x2 - x1 + originX
          var y = y2 - y1 + originY
          box.style.left = x + 'px'
          box.style.top = y + 'px'
        }
        target.onmouseup = function() {
          target.onmousemove = target.onmouseup = null
        }
      }

      if (resize) {
        // 拖拽，改变尺寸
        document.onmousemove = function(e) {
          var x2 = e.clientX
          var y2 = e.clientY
          var l, t, w, h
          var isL = sClass.indexOf('l') > -1
          var isT = sClass.indexOf('t') > -1
          var o = {}
          if (isL) {
            o.left = x2 - x1 + originX
          }
          if (isT) {
            o.top = y2 - y1 + originY
          }
          o.width = (isL ? x1 - x2 : x2 - x1) + originW
          o.height = (isT ? y1 - y2 : y2 - y1) + originH

          var iMin = 80
          if (o.width < iMin) {
            o.width = iMin
            if (isL) {
              o.left = originX + originW - iMin
            }
          }
          if (o.height < iMin) {
            o.height = iMin
            if (isT) {
              o.top = originY + originH - iMin
            }
          }
          var json = {
            'l': ['left', 'width'],
            't': ['top', 'height'],
            'r': ['width'],
            'b': ['height'],
            'lt': ['left', 'width', 'top', 'height'],
            'rt': ['top', 'width', 'height'],
            'rb': ['width', 'height'],
            'lb': ['left', 'width', 'height'],
          }
          json[sClass].forEach(function(attr, idx) {
            box.style[attr] = o[attr] + 'px'
          })
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
        }
      }
    },
    editImg(type, e) {
      e.preventDefault()
      var vm = this
      var target = e.target
      var ratio = vm.cutImg.height / vm.cutImg.width
      var w
      var h
      
      let clipBox = $('.clip-outBox')
      let clipBoxW = clipBox.width()
      let clipBoxH = clipBox.height()
      let clipW = vm.originImg.clipObj.width
      let clipH = vm.originImg.clipObj.height
      let imgW = this.originImg.width*this.originImg.scaleX
      let imgH = this.originImg.height*this.originImg.scaleX
      if(type === 'radio') {
        vm.isShowClipBox = true
        var radio = target.closest('.radio')
        $(radio).addClass("on").siblings().removeClass("on")
        switch (radio.htmlFor) {
          case '6寸': // 800×1200 (4 x 6)
            vm.imgSize.cun = '6寸' 
            vm.imgSize.size = '800×1200'
            if(ratio >= 1) {
              w = clipW
              h = clipW / (4 / 6)
            } else {
              h = clipH
              w = clipH * (4 / 6)
            }
            break
          case '全景6寸': // 1800x1350 (6 x 4.5)
            vm.imgSize.cun = '全景6寸' 
            vm.imgSize.size = '1800x1350'
            if(ratio >= 1) {
              w = clipW
              h = clipW / (4.5 / 6)
            } else {
              h = clipH
              w = clipH * (4.5 / 6)
            }
            break
          case '7寸': // 1000×1400 (5 x 7)
            vm.imgSize.cun = '7寸' 
            vm.imgSize.size = '1000×1400'
            if(ratio >= 1) {
              w = clipW
              h = clipW / (5 / 7)
            } else {
              h = clipH
              w = clipH * (5 / 7)
            }
            break
          case '8寸': // 1200×1600 (6 x 8)
            vm.imgSize.cun = '8寸' 
            vm.imgSize.size = '1200×1600'
            if(ratio >= 1) {
              w = clipW
              h = clipW / (6 / 8)
            } else {
              h = clipH
              w = clipH * (6 / 8)
            }
            break
          case '10寸': // 1600×2000 (8 x 10)
            vm.imgSize.cun = '10寸' 
            vm.imgSize.size = '1600×2000'
            if(ratio >= 1) {
              w = clipW
              h = clipW / (8 / 10)
            } else {
              h = clipH
              w = clipH * (8 / 10)
            }
            break
          case 'vertical': // 纵向
            vm.imgSize.size = '800×1200'
            vm.imgSize.cun = '6寸' 
            if(ratio >= 1) {
              w = clipW
              h = clipW / (4 / 6)
            } else {
              h = clipH
              w = clipH * (4 / 6)
            }
            break
          case 'horizontal': // 横向
            vm.imgSize.size = '1800x1350'
            vm.imgSize.cun = '全景6寸' 
            if(ratio >= 1) {
              w = clipW
              h = clipW / (6 / 4.5)
            } else {
              h = clipH
              w = clipH * (6 / 4.5)
            }
            break
        }
        $('.clip-box').css({
          'left': clipBoxW/2 - imgW/2,
          'top': clipBoxH/2 - imgH/2,
          'width': w,
          'height': h,
        })
      } else if(type === 'checkbox') {
        var checkbox = target.closest('.checkbox')
        $(checkbox).toggleClass('on')
        vm.cutImg.applyFilters();
        vm.curCutCanvas.requestRenderAll();
        switch (checkbox.htmlFor) {
          case '增加白边框':
            if($(checkbox).hasClass('on')) {
              vm.addWhiteRect()
            } else {
              vm.removeWhiteRect(vm.curWhiteRect)
            }
            break
          case '自动色彩调整':
            if($(checkbox).hasClass('on')) {
              vm.ComposedFilter.subFilters.push(new fabric.Image.filters.Convolute({
                matrix: [ 1/8, 1/8, 1/8,
                        1/8, 1/8, 1/8,
                        1/8, 1/8, 1/8 ]
              }))
            } else {
              let filter = new fabric.Image.filters.Convolute({
                matrix: [ 1/8, 1/8, 1/8,
                        1/8, 1/8, 1/8,
                        1/8, 1/8, 1/8 ]
              })
              vm.ComposedFilter.subFilters.forEach((item, idx)=> {
                if(JSON.stringify(item.matrix) === JSON.stringify(filter.matrix)) {
                  vm.ComposedFilter.subFilters.splice(idx, 1)
                }
              })
            }
            break
          case '自动肤色调整':
            if($(checkbox).hasClass('on')) {
              vm.ComposedFilter.subFilters.push(new fabric.Image.filters.HueRotation({
                rotation: -0.5
              }))
            } else {
              let filter = new fabric.Image.filters.HueRotation({
                rotation: -0.5
              })
              vm.ComposedFilter.subFilters.forEach((item, idx)=> {
                if(item.rotation === filter.rotation) {
                  vm.ComposedFilter.subFilters.splice(idx, 1)
                }
              })
            }
            break
          case '光面':
            if($(checkbox).hasClass('on')) {
              vm.ComposedFilter.subFilters.push(new fabric.Image.filters.Sepia())
            } else {
              let filter = new fabric.Image.filters.Sepia()
              vm.ComposedFilter.subFilters.forEach((item, idx)=> {
                if(JSON.stringify(item.matrix) === JSON.stringify(filter.matrix)) {
                  vm.ComposedFilter.subFilters.splice(idx, 1)
                }
              })
            }
            // vm.cutImg.applyFilters([new fabric.Image.filters.Sepia()]);
            break
          case '绒面':
            if($(checkbox).hasClass('on')) {
              vm.ComposedFilter.subFilters.push(new fabric.Image.filters.Convolute({
                matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
              }))
            } else {
              let filter = new fabric.Image.filters.Convolute({
                matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
              })
              vm.ComposedFilter.subFilters.forEach((item, idx)=> {
                if(JSON.stringify(item.matrix) === JSON.stringify(filter.matrix)) {
                  vm.ComposedFilter.subFilters.splice(idx, 1)
                }
              })
            }
            break
        }
        vm.cutImg.applyFilters([vm.ComposedFilter]);
        // console.log(vm.cutImg.applyFilters())
      }
      vm.curCutCanvas.requestRenderAll();
    },
    /*imgScale(e) {
      e.preventDefault()
      switch (e.target.className) {
        case 'icon-search-minus':
          this.scale <= 0 ? this.scale = 0 : this.scale -= 3
          break
        case 'icon-search-plus':
          this.scale >= 30 ? this.scale = 30 :  this.scale += 3
          break
      }
    },*/
    addWhiteRect() {
      this.imgToClip()
      this.isShowClipBox = true
      var rect = new fabric.Rect({
        left: this.addWhiteRectData.l,
        top: this.addWhiteRectData.t,
        width: this.addWhiteRectData.w - 6,
        height: this.addWhiteRectData.h - 6,
        fill: 'transparent',
        strokeWidth: 6,
        stroke: '#fff',
        selectable: false,
      })
      this.curCutCanvas.add(rect)
      this.curWhiteRect = rect
      this.curCutCanvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });
      // this.curCutCanvas.discardActiveObject()
      this.curCutCanvas.renderAll()
    },
    removeWhiteRect(obj) {
      var vm = this
      if(obj) {
        $($('#增加白边框')[0].closest('label')).removeClass("on")
        vm.curCutCanvas.remove(obj)
        vm.curWhiteRect = ''
        vm.curCutCanvas.renderAll()
      }
    },
    degToRad(degrees) {
      return degrees * (Math.PI / 180);
    },
    imgToClip() {
      var vm = this
      vm.isSave = false
      if(vm.isShowClipBox === true) {
        var clipBox = $('.clip-box')
        var l = clipBox.position().left
        var t = clipBox.position().top
        var w = (clipBox.width()*1/vm.cutImg.scaleX).toFixed(2)*1
        var h = (clipBox.height()*1/vm.cutImg.scaleX).toFixed(2)*1
        let disL = ((l - vm.cutImg.left)/vm.cutImg.scaleX).toFixed(2)*1
        let disT = ((t - vm.cutImg.top)/vm.cutImg.scaleX).toFixed(2)*1
        let clipRectL = -(vm.cutImg.width/2).toFixed(2)
        let clipRectT = -(vm.cutImg.height/2).toFixed(2)
        
        vm.clipRect = {
          l: clipRectL+disL, 
          t: clipRectT+disT, 
          w: w, 
          h: h
        }
        vm.cutImg.set({
          clipTo: function(ctx) {
            ctx.rect(clipRectL+disL, clipRectT+disT, w, h);
          }
        })
        vm.addWhiteRectData = {l: l, t: t, w: clipBox.width()*1, h: clipBox.height()*1}
        vm.curCutCanvas.renderAll()

        vm.isClip = true
        vm.isShowClipBox = !vm.isShowClipBox
      }
    },
    toSave() {
      if(this.isClip) {
      } else {
        this.imgToClip()
      }
      let clipImgSaveData = {
        clipImgObj: this.cutImg,
        clipRect: this.clipRect
      }
      // this.$emit('clip-save', clipImgSaveData)
      this.$emit('clip-save', this.cutImg)
      this.$emit('getIsCutImg', false)
    }
  },
  mounted() {
    this.$nextTick(function() { // dom已更新
      this.curCutCanvas = new fabric.Canvas('clipCanvas')
      let clipBox = $('.clip-outBox')
      let clipBoxW = clipBox.width()
      let clipBoxH = clipBox.height()
      this.curCutCanvas.setWidth(clipBoxW)
      this.curCutCanvas.setHeight(clipBoxH)

      this.resetImg()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cutMask {position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000;}
.cutMask .cut-bok {position: absolute; top: 50%; left: 50%; margin-top: -260px; margin-left: -490px; height: 520px; background: #fff;}
.cutMask .cut-bok .cut-left {float: left; width: 50%; height: 100%;}
.cutMask .cut-bok .cut-left p {padding: 8px 30px;}
.cutMask .cut-bok .cut-left p .icon-cut {position: relative; margin-right: 10px; top: 4px; font-size: 24px; color: #ff7800;}
.cutMask .cut-bok .cut-left .cut-content {width: 410px; height: 453px; position: relative; margin: 10px auto; top: 0px; left: 0; overflow: hidden; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center;     -ms-flex-pack: center;         justify-content: center; -webkit-box-align: center;     -ms-flex-align: center;         align-items: center; overflow: hidden; background: #666;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox {width: 410px; height: 453px; position: relative; top: 0px; left: 0; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center;     -ms-flex-pack: center;         justify-content: center; -webkit-box-align: center;     -ms-flex-align: center;         align-items: center; background: #666;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox #clipCanvas {border: 1px solid #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box {width: 200px; height: 150px; position: absolute; -webkit-box-shadow: 0 0 0 50000px rgba(0,0,0,0.3);         box-shadow: 0 0 0 50000px rgba(0,0,0,0.3);}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .clip-content {width: 100%; height: 100%; cursor: move; background: linear-gradient(rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30%) 0 0/34% 34%, linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 34%) 0 0/34% 34%; border: none; border-right: 1px solid rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.3);}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize >div >div {position: absolute; left: -1px; top: -1px;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line >div {width: 1px; height: 1px; -background: #f00;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .l {height: 100%;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .l:after {content: ''; position: absolute; top: 50%; margin-top: -6px; width: 3px; height: 12px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .t {width: 100%;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .t:after {content: ''; position: absolute; left: 50%; margin-left: -6px; width: 12px; height: 3px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .r {height: 100%; left: auto; right: 0px;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .r:after {content: ''; position: absolute; top: 50%; left: auto; right: -1px; margin-top: -6px; width: 3px; height: 12px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .b {width: 100%; top: auto; bottom: -1px;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .line .b:after {content: ''; position: absolute; top: auto; bottom: -0.5px; left: 50%; margin-left: -6px; width: 12px; height: 3px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .drag .l {width: 6px; cursor: w-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .drag .t {height: 6px; cursor: n-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .drag .r {width: 6px; cursor: e-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .drag .b {height: 6px; cursor: s-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner >div {width: 12px; height: 3px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .lt {cursor: nw-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .lt:after {content: ''; position: absolute; width: 3px; height: 12px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .rt {left: auto; right: 0.5px; cursor: ne-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .rt:after {content: ''; position: absolute; left: auto; right: -1px; width: 3px; height: 12px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .rb {left: auto; right: 0.5px; top: auto; bottom: -1px; cursor: se-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .rb:after {content: ''; position: absolute; left: auto; right: 0px; top: auto; bottom: 0; right: -1px; width: 3px; height: 12px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .lb {top: auto; bottom: -1px; cursor: sw-resize;}
.cutMask .cut-bok .cut-left .cut-content .clip-outBox .clip-box .resize .corner .lb:after {content: ''; position: absolute; top: auto; bottom: 0px; width: 3px; height: 12px; background: #fff;}
.cutMask .cut-bok .cut-left .cut-content .zoom {position: absolute; bottom: 0px; right: 0px; -webkit-user-select: none;    -moz-user-select: none;     -ms-user-select: none;         user-select: none;}
.cutMask .cut-bok .cut-left .cut-content .zoom span {color: #aaa;}
.cutMask .cut-bok .cut-left .cut-content .zoom .canvasSize {vertical-align: middle;}
.cutMask .cut-bok .cut-left .cut-content .zoom i {color: #aaa;}
.cutMask .cut-bok .cut-left .cut-content .zoom i:hover {color: #333;}
.cutMask .cut-bok .cut-right {float: right; width: 50%; height: 100%; text-align: left; -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;}
.cutMask .cut-bok .cut-right .icon-close {font-size: 30px; display: inline-block; margin: 10px 10px 0 86%;}
.cutMask .cut-bok .cut-right .icon-close:hover {color: #f00;}
.cutMask .cut-bok .cut-right .cut-edit {width: 93%; height: 87%; margin: 10px auto;}
.cutMask .cut-bok .cut-right .cut-edit li {font-size: 14px; border-bottom: 1px solid #ddd; padding: 10px 10px 10px 2px; line-height: 32px;}
.cutMask .cut-bok .cut-right .cut-edit li label {cursor: pointer; margin-right: 25px;}
.cutMask .cut-bok .cut-right .cut-edit li label span {padding: 0 0px 0 8px;}
.cutMask .cut-bok .cut-right .cut-edit li label input {position: relative;}
.cutMask .cut-bok .cut-right .cut-edit li label input[type="radio"]:after {content: ''; position: absolute; top: -1px; left: 0; display: inline-block; width: 12px; height: 12px; background: #fff; border: 1px solid #ddd; border-radius: 50%;}
.cutMask .cut-bok .cut-right .cut-edit li label.on input[type="radio"]:before {content: ''; display: inline-block; position: absolute; width: 4px; height: 4px; left: 33%; top: 33%; border-radius: 50%; z-index: 10; background: #3aaa92;}
.cutMask .cut-bok .cut-right .cut-edit li label.on input[type="radio"]:after {border: 1px solid #3aaa92;}
.cutMask .cut-bok .cut-right .cut-edit li.num {padding: 0px 10px 5px 2px;}
.cutMask .cut-bok .cut-right .cut-edit li.num i {color: #999;}
.cutMask .cut-bok .cut-right .cut-edit li.num i:hover {color: #000;}
.cutMask .cut-bok .cut-right .cut-edit li.shape {padding-bottom: 0px;}
.cutMask .cut-bok .cut-right .cut-edit li.shape label input {position: relative; bottom: 15px;}
.cutMask .cut-bok .cut-right .cut-edit li.shape label i {display: inline-block; width: 35px; height: 45px; background: #ddd; margin-left: 8px;}
.cutMask .cut-bok .cut-right .cut-edit li.shape label i.horizontal {width: 40px; height: 30px; margin-bottom: 8px;}
.cutMask .cut-bok .cut-right .cut-edit li.info span {color: #999; padding-left: 5px;}
.cutMask .cut-bok .cut-right .cut-edit li.filters label input {position: relative;}
.cutMask .cut-bok .cut-right .cut-edit li.filters label input[type="checkbox"]:after {content: ''; position: absolute; top: -1px; left: -1px; display: inline-block; width: 13px; height: 13px; background: #fff; border: 1px solid #ddd;}
.cutMask .cut-bok .cut-right .cut-edit li.filters label.on input[type="checkbox"]:before {content: ''; display: inline-block; position: absolute; top: -1px; left: -1px; width: 12px; height: 12px; z-index: 10; background-image: url("/static/bfl-img/edit/clecked.svg");}
.cutMask .cut-bok .cut-right .cut-edit li.filters label.on input[type="checkbox"]:after {border: 1px solid #3aaa92;}
.cutMask .cut-bok .cut-right .cut-edit li.btns {border-bottom: none;}
.cutMask .cut-bok .cut-right .cut-edit li.btns >div {display: inline-block; width: 80px; text-align: center; background: #fff; color: #3aaa92; border: 1px solid #3aaa92; border-radius: 4px; margin: 10px 30px 0 10px; cursor: pointer;}
/*.cutMask .cut-bok .cut-right .cut-edit li.btns >div:last-child {float: right;}*/
.cutMask .cut-bok .cut-right .cut-edit li.btns >div:hover,
.cutMask .cut-bok .cut-right .cut-edit li.btns >div.on {background: #3aaa92; color: #fff;}

</style>