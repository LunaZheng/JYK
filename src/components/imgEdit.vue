<template>
  <ul class="imgEdit edit-box img-edit" @mousedown="moveEditDown">
    <span class="close" @click="$emit('close')">x</span>
    <li title="鼠标按住可拖动">
      <span class="img-edit-scale" title="大小">
        <label>大小</label>
        <input type="range" class="img-scale" v-model.lazy="imgEditData.scale" @input="editInput('scale', curEditImg, $event)" @change="editChange('scale', curEditImg, $event)" @mouseup="toSaveCur('scale', $event)">
      </span>
      <span class="img-edit-opacity" title="透明">
        <label>透明</label>
        <input type="range" min="1" max="1000" value="1000" class="img-opacity" v-model.lazy="imgEditData.opacity" @input="editInput('opacity', curEditImg, $event)" @change="editChange('opacity', curEditImg, $event)" @mouseup="toSaveCur('opacity', $event)">
      </span>
      <span class="img-edit-opacity" title="旋转">
        <label>旋转</label>
        <input type="range" min="0" max="360" value="0" class="img-opacity" v-model.lazy="imgEditData.angle" @input="editInput('angle', curEditImg, $event)" @change="editChange('angle', curEditImg, $event)" @mouseup="toSaveCur('angle', $event)">
      </span>
    </li>
    <li class="controls">
     <span title="上移" class="moveup" @mouseenter="hoverInColor" @mouseleave="hoverOutColor" @click="editStyle('top', curEditImg, '-')">
       <img src="/static/bfl-img/edit/up.svg" alt="">上移
     </span>
     <span title="下移" class="movedown" @mouseenter="hoverInColor" @mouseleave="hoverOutColor" @click="editStyle('top', curEditImg, '+')">
       <img src="/static/bfl-img/edit/down.svg" alt="">下移
     </span>
     <!-- <span title="旋转" class="cutImg" @mouseenter="hoverInColor" @mouseleave="hoverOutColor" @click="editStyle('angle', curEditImg)">
       <img src="/static/bfl-img/edit/rotate.svg" alt="">旋转
     </span> -->
     <span title="剪切" class="copy" @mouseenter="hoverInColor" @mouseleave="hoverOutColor" @click="editStyle('clip', curEditImg)" v-if="!isDeco">
       <img src="/static/bfl-img/edit/cut.svg" alt="">剪切
     </span>
     <span title="前置" class="moveup" @mouseenter="hoverInColor" @mouseleave="hoverOutColor" @click="editStyle('bringToFront', curEditImg)">
       <img src="/static/bfl-img/edit/pre.svg" alt="">前置
     </span>
     <span title="删除" class="removeImg" @mouseenter="hoverInColor" @mouseleave="hoverOutColor" @click="removeObj(curEditImg)">
       <img src="/static/bfl-img/edit/remove.svg" alt="">删除
     </span>
    </li>
    <li class="controls fliter" v-if="!isDeco">
       <span>图片调整</span>
       <ul class="img-style">
         <li 
           v-for="(item, idx) in imgAdjustList" 
         >
           <img :src="'/static/bfl-img/edit/' + item.tag + '.png'" :title="item.tag" alt="">
           <!-- <span class="imgFilter" :style="'background-image: url(' + curSrc + ')'"></span> -->
           <p :title="item.tag">{{item.tag}}</p>
           <input v-if="item.isInputShow && item.tag != 'Pixelate'" type="range" min="-300" max="500" value="0" class="Saturate">
           <input v-if="item.tag === 'Pixelate'" type="range" min="0" max="20" value="0">
         </li>
       </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'imgEdit',
  props: ["curEditImg", "cStep", "paga2AddL"],
  data () {
    return {
      imgEditData: {// 图片编辑记录
        opacity: 0,
        scale: 0,
        angle: 0,
      },
      imgAdjustList: [ // 图片编辑框-图片调整内容
        {
          name: '基本调整',
          tag: 'Saturate',
          isInputShow: true,
          filter: {
            name: 'saturate',
            val: 800 // %
          },
        }, {
          name: '黑白',
          tag: 'Grayscale',
          isInputShow: false,
          filter: {
            name: 'grayscale',
            val: 100 // %
          },
        }, {
          name: '旧照片',
          tag: 'Sepia2',
          isInputShow: false,
          filter: {
            name: 'sepia',
            val: 50 // %
          }
        }, {
          name: '素描',
          tag: 'Pixelate',
          isInputShow: true,
          filter: {
            name: 'contrast',
            val: 180 // %
          }
        }, {
          name: '柔化',
          tag: 'Sepia',
          isInputShow: false,
          filter: {
            name: 'sepia',
            val: 20 // %
          }
        }, {
          name: '锐化',
          tag: 'Convolute-sharpen',
          isInputShow: false,
          filter: {
            name: 'sepia',
            val: 20 // %
          }
        }, {
          name: '色彩叠加',
          tag: 'Convolute-blur',
          isInputShow: false,
          filter: 'contrast(200%) brightness(150%)'
        }, {
          name: '色彩优化',
          tag: 'Convolute-Emboss',
          isInputShow: false,
          filter: ''
        }/*, {
          name: '高斯模糊',
          tag: 'blur',
          isInputShow: true,
          filter: {
            name: 'blur',
            val: 5 // px
          }
        }, {
          name: '亮度',
          tag: 'brightness',
          isInputShow: true,
          filter: {
            name: 'brightness',
            val: 200 // %
          }
        }, {
          name: '灰度',
          tag: 'grayscale',
          isInputShow: true,
          filter: {
            name: 'grayscale',
            val: 50 // %
          }
        }, {
          name: '色相旋转',
          tag: 'hue-rotate',
          isInputShow: true,
          filter: {
            name: 'hue-rotate',
            val: 90 // deg
          }
        }, {
          name: '反转',
          tag: 'invert',
          isInputShow: true,
          filter: {
            name: 'invert',
            val: 90 // %
          }
        }*/
        /*BaseFilter
        BlackWhite
        BlendColor
        BlendImage
        Blur
        Brightness
        Brownie
        ColorMatrix
        Composed
        Contrast
        Convolute
        Gamma
        Grayscale
        HueRotation
        Invert
        Kodachrome
        Noise
        Pixelate
        Polaroid
        RemoveColor
        Resize
        Saturation
        Sepia
        Technicolor
        Vintage*/
      ],
      imgEditT: 0,
      imgEditL: 0,
      curSrc: '',
      isDeco: false, // 是否是装饰
      isChange: false, // 是否改变
      isIE: false, // 是否是IE浏览器
    }
  },
  created() {
    var ua = this.BrowserType()
    if(ua.indexOf('IE') > -1) this.isIE = true
  },
  watch: {
    imgEditT(newVal) {
      this.$nextTick(function() {
        if(newVal) {
          $('.img-edit').css('top', newVal + 'px')
        }
      })
    },
    imgEditL(newVal) {
      this.$nextTick(function() {
        if(newVal) {
          $('.img-edit').css('left', newVal + 'px')
        }
      })
    },
    curEditImg(newVal) {
      this.init(newVal)
    },
    'imgEditData.scale': function(newVal) {
      if(this.isChange && !this.isIE) this.$emit('updateModifications') // 添加画布记录
    },
    'imgEditData.opacity': function(newVal) {
      if(this.isChange && !this.isIE) this.$emit('updateModifications') // 添加画布记录
    },
    'imgEditData.angle': function(newVal) {
      if(this.isChange && !this.isIE) this.$emit('updateModifications') // 添加画布记录
    },
    deep: true
  },
  methods: {
    BrowserType() { // 返回浏览器类型
      var userAgent = window.navigator.userAgent
      var uadata = {
        isChrome: userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1,
        isEdge: userAgent.indexOf('Edge') > -1,
        isFirefox: userAgent.indexOf('Firefox') > -1,
        isIE11: userAgent.indexOf('rv:11.0') > -1,
        isIE10: userAgent.indexOf('MSIE 10.0') > -1,
        isIE9: userAgent.indexOf('MSIE 9.0') > -1,
        isIE8: userAgent.indexOf('MSIE 8.0') > -1,
        isIE7: userAgent.indexOf('MSIE 7.0') > -1,
        isIE6: userAgent.indexOf('MSIE 6.0') > -1,
        isOpera: userAgent.indexOf("Opera") > -1,
        isSafari: userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1,
      }

      if(uadata.isFirefox) return "FF";
      if(uadata.isOpera) return "Opera";
      if(uadata.isSafari) return "Safari";
      if(uadata.isChrome) return "Chrome";
      if(uadata.isEdge) return "Edge";
      if(uadata.isIE11) return 'IE11';
      if(uadata.isIE10) return 'IE10';
      if(uadata.isIE9) return 'IE9';
      if(uadata.isIE8) return 'IE8';
      if(uadata.isIE7) return 'IE7';
      if(uadata.isIE6) return 'IE6';
    },
    hoverInColor(e) {
      e.target.children[0].src = e.target.children[0].src.slice(0, -4) + '-hover.svg'
    },
    hoverOutColor(e) {
      e.target.children[0].src = e.target.children[0].src.slice(0, -10) + '.svg'
    },
    moveEditDown(e) { // 编辑框移动
      e.stopPropagation() // 阻止事件冒泡而触发父级的click事件
      // this.isAddtext = true
      if(e.target.tagName === 'UL' || e.target.tagName === 'LI') {
        var ul = $(e.target.closest('.edit-box'))
        var originX = ul.css('left').replace('px', '') * 1
        var originY = ul.css('top').replace('px', '') * 1
        // clientx(相对于浏览器) screenx(用户显示屏) pagex(也相对于浏览器但不会随着滚动条而变动) 
        var x1 = e.clientX 
        var y1 = e.clientY
        $(document).on('mousemove.editBox', function(e) {
          var x2 = e.clientX
          var y2 = e.clientY
          var left = x2 - x1 + originX
          var top = y2 - y1 + originY
          ul.css({
            'top': top + 'px',
            'left': left + 'px'
          })
        })
        $(document).on('mouseup.editBox', function(e) {
          $(document).off('mousemove.editBox mouseup.editBox')
        })
      }
    },
    editInput(name, curEditObj, e) {
      switch(name) {
        case 'scale':
          this.isChange = true
          var val = (e.target.value * 0.01).toFixed(2)*1
          // 算出原始scale
          var scale = this.isDeco ? 1 : 0
          if(curEditObj.clipObj) {
            var isWide = curEditObj.width > curEditObj.height
            if(isWide) {
              scale = Math.ceil(((curEditObj.clipObj.height) / curEditObj.height)*100)/100
            } else {
              scale = Math.ceil((curEditObj.clipObj.width / curEditObj.width)*100)/100
            }
          }
          curEditObj.scale(scale + val)
          break
        case 'opacity':
          this.isChange = true
          curEditObj.set('opacity', (1000 - e.target.value) * 0.001)
          break
        case 'angle':
          this.isChange = true
          curEditObj.set('angle', e.target.value)
          break
      }
      curEditObj.canvas.renderAll()
    },
    editChange(name, curEditObj, e) {
      if(this.isIE) {
        switch(name) {
          case 'scale':
            this.isChange = true
            var val = (e.target.value * 0.01).toFixed(2)*1
            // 算出原始scale
            var scale = this.isDeco ? 1 : 0
            if(curEditObj.clipObj) {
              var isWide = curEditObj.width > curEditObj.height
              if(isWide) {
                scale = Math.ceil(((curEditObj.clipObj.height) / curEditObj.height)*100)/100
              } else {
                scale = Math.ceil((curEditObj.clipObj.width / curEditObj.width)*100)/100
              }
            }
            curEditObj.scale(scale + val)
            break
          case 'opacity':
            this.isChange = true
            curEditObj.set('opacity', (1000 - e.target.value) * 0.001)
            break
          case 'angle':
            this.isChange = true
            curEditObj.set('angle', e.target.value)
            break
        }
        curEditObj.canvas.renderAll()
      }
    },
    toSaveCur(name, e) {
      if(this.isIE && this.isChange) {
        if(name == 'scale' || name == 'opacity' || name == 'angle') this.$emit('updateModifications') // 添加画布记录
      }
    },
    editStyle(name, curEditObj, value) {
      // var vm = this
      if(curEditObj.name === 'fillImg' || curEditObj.name === 'decorate') {
        switch (name) {
          case 'top':
            value === '-' ? curEditObj.set(name, curEditObj.top - 5) : curEditObj.set(name, curEditObj.top + 5)
            this.$emit('updateModifications') // 添加画布记录
            break
          /*case 'angle':
            // curEditObj.set(name, curEditObj.angle + 45)
            curEditObj.hasBorders = true // 取消控件-边
            curEditObj.setControlVisible('mtr', true)
            curEditObj.canvas.renderAll()
            console.log(curEditObj.hasBorders)
            break*/
          case 'clip':
            this.$emit('getIsCutImg', true)
            /*vm.cutImgData.cutImg = curEditObj.canvas.getActiveObject()
            vm.cutImgData.isCutImg = true
            vm.isAddimg = false
            curEditObj.canvas.discardActiveObject()*/
            break
          case 'bringToFront': // 前置
            /*curEditObj.canvas.bringToFront(curEditObj)
            vm.resetZIndex(curEditObj.canvas)
            curEditObj.canvas.forEachObject((item)=> {
              if(item.name == 'text' || item.type == 'polygon' || item.name == 'decorate') {
                curEditObj.canvas.bringToFront(item).renderAll() //置顶
              }
            })*/
            var maxLayerIdx = JSON.parse(JSON.stringify(curEditObj.canvas._objects))[curEditObj.canvas._objects.length-1].layerIdx
            curEditObj.canvas.forEachObject((item)=> {
              if(curEditObj.left > this.paga2AddL) { // 右侧画布
                if(item.left >  this.paga2AddL) {
                  if(item.layerIdx > JSON.parse(JSON.stringify(curEditObj)).layerIdx) item.layerIdx = item.layerIdx-1
                }
              } else { // 单页 / 左侧画布
                if(item.layerIdx > JSON.parse(JSON.stringify(curEditObj)).layerIdx) item.layerIdx = item.layerIdx-1
              }
            })
            curEditObj.layerIdx = maxLayerIdx
            curEditObj.canvas.bringToFront(curEditObj)

            this.$emit('updateModifications') // 添加画布记录
            break
          case 'Saturate': // 饱和度
            var val = value.target.value
            var filter = new fabric.Image.filters.Saturate({
              saturate: parseFloat(val)
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Grayscale': // 黑白
            curEditObj.filters = []
            curEditObj.filters.push(new fabric.Image.filters.Grayscale())
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Sepia2': // 旧照片/棕褐色
            curEditObj.filters.push(new fabric.Image.filters.Sepia2())
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Pixelate': // 像素化-素描
            var val = value.target.value
            // curEditObj.filters.push(new fabric.Image.filters.Brownie())
            curEditObj.filters.push(new fabric.Image.filters.Pixelate({
              blocksize: parseFloat(val, val)
            }))
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Sepia': // 旧照片/棕褐色
            curEditObj.filters.push(new fabric.Image.filters.Sepia())
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Convolute-sharpen': // 
            var filter = new fabric.Image.filters.Convolute({
              matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
            });
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Convolute-blur': // 
            var filter = new fabric.Image.filters.Convolute({ // blur
                matrix: [ 1/9, 1/9, 1/9,
                          1/9, 1/9, 1/9,
                          1/9, 1/9, 1/9 ]
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Convolute-Emboss': // 
            var filter = new fabric.Image.filters.Convolute({ // Emboss 浮雕
                matrix: [ 1,   1,  1,
                          1, 0.7, -1,
                         -1,  -1, -1 ]
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Convolute-EmbossOpaqueness': // 
            var filter = new fabric.Image.filters.Convolute({ // Emboss opaqueness
              opaque: true,                                   // 浮雕过滤器与不透明
              matrix: [ 1,   1,  1,
                        1, 0.7, -1,
                       -1,  -1, -1 ]
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'GradientTransparency': // 渐变透明
            // var val = value.target.value
            var val = value.target.value
            var filter = new fabric.Image.filters.GradientTransparency({
                threshold: parseFloat(val)
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Invert': // 倒置(底片)
            var filter = new fabric.Image.filters.Invert()
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Noise': // 噪声
            var val = value.target.value
            var filter = new fabric.Image.filters.Noise({
                noise: parseFloat(val)
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Contrast': // 对比
            var val = value.target.value
            var filter = new fabric.Image.filters.Contrast({
                contrast: parseFloat(val)
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Brightness': // 亮度
            var val = value.target.value
            var filter = new fabric.Image.filters.Brightness({
                brightness: parseFloat(val)
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'RemoveWhite': // 白色==>变透明
            var filter = new fabric.Image.filters.RemoveWhite({
                threshold: 40,
                distance: 140
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Tint':
            var filter = new fabric.Image.filters.Tint({
                color: 'rgba(53, 21, 176, 0.5)'
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Multiply':
            var filter = new fabric.Image.filters.Multiply({
               color: 'rgb(53, 21, 176)'
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Blend1': // 混合
            var filter = new fabric.Image.filters.Blend({
                image: curEditObj,
                color: '#000',
                mode: 'multiply'
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          case 'Blend2': // 混合
            var filter = new fabric.Image.filters.Blend({
                image: curEditObj,
                mode: 'multiply',
                alpha: 0.5
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
          /*case 'Resize':
            var filter = new fabric.Image.filters.Resize()
            curEditObj.filters.push(filter)
            // curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break*/
          case 'ColorMatrix':
            var filter = new fabric.Image.filters.ColorMatrix({
                matrix: [
                 1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502,
                 -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203,
                 -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946,
                 0, 0, 0, 1, 0
                ]
            })
            curEditObj.filters.push(filter)
            curEditObj.filters = curEditObj.filters.slice(-1)
            curEditObj.applyFilters(curEditObj.canvas.renderAll.bind(curEditObj.canvas))
            break
        }
        curEditObj.canvas.renderAll()
        /*curEditObj.set({
          originX: 'left',
          originY: 'top',
          top: curEditObj.clipObj.top - curEditObj.height * curEditObj.scaleX / 2,
          left: curEditObj.clipObj.left - curEditObj.width * curEditObj.scaleX / 2
        })*/
      }
    },
    removeObj(obj) {  // 编辑文字--删除
      this.isEditImg = false
      this.$emit('close')
      obj.canvas.remove(obj)
      this.$emit('updateModifications') // 添加画布记录
    },
    init(curEditImg) {
      this.isChange = false
      if(curEditImg) {
        this.isDeco = curEditImg.name == 'decorate' ? true : false
        this.curSrc = curEditImg.getSrc().replace('400', '80')
        var scale = this.isDeco ? 1 : 0
        var imgEditW = $('.imgEdit').outerWidth() // outerWidth() --> padding+width+border; innerWidth() --> padding+width; outerWidth(true) --> padding+width+border+margin
        this.imgEditL = curEditImg.left - imgEditW / 2
        if(curEditImg.clipObj) {
          var isWide = curEditImg.width > curEditImg.height
          if(isWide) {
            scale = Math.ceil(((curEditImg.clipObj.height) / curEditImg.height)*100)/100
          } else {
            scale = Math.ceil((curEditImg.clipObj.width / curEditImg.width)*100)/100
          }
          this.imgEditT = curEditImg.clipObj.top + curEditImg.clipObj.height + 20
        } else if(curEditImg.name == "decorate") {
          this.imgEditT = curEditImg.top + curEditImg.height / 2 + 10
        }
        this.imgEditData.scale = (curEditImg.scaleX*1 - scale) / 0.01
        this.imgEditData.opacity = (1 - curEditImg.opacity) * 1000
        this.imgEditData.angle = curEditImg.angle * 1
      }
    },
    resetZIndex(canvas) {
      canvas.forEachObject((item)=> {
        if(item.name == 'bgImg' || item.name == 'text' || item.name == 'decorate' || item.type == 'polygon') {
          canvas.bringToFront(item).renderAll() //置顶
        }
      })
    },
  },
  mounted() {
    this.init(this.curEditImg)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.canvas-box .img-edit { top: 157px; left: 226px;}*/
.canvas-box .img-edit >li span label { vertical-align: middle;}
.canvas-box .img-edit >li.fliter { text-align: left; padding-bottom: 5px;}
.canvas-box .img-edit >li.fliter > span { cursor: text; padding-left: 35px;}
.canvas-box .edit-box >li.controls > span {margin-right: 38px;}
.canvas-box .edit-box >li.controls > span:last-child {margin-right: 0;}
.edit .canvas-box .img-edit >li.fliter > span:hover { color: #111;}
.edit .canvas-box .img-edit >li.fliter .img-style { height: 240px; overflow-y: scroll; margin-top: 20px;}
.canvas-box .img-edit >li.fliter .img-style >li { display: inline-block; position: relative; margin: 20px 0 8px 35px;}
.canvas-box .img-edit >li.fliter .img-style >li:nth-child(1),
.canvas-box .img-edit >li.fliter .img-style >li:nth-child(2),
.canvas-box .img-edit >li.fliter .img-style >li:nth-child(3),
.canvas-box .img-edit >li.fliter .img-style >li:nth-child(4) {margin-top: 0;}
.canvas-box .img-edit >li.fliter .img-style >li:hover { color: #3aaa92;}
.canvas-box .img-edit >li.fliter .img-style >li img { cursor: pointer; -width: 80px; height: 80px;}
.canvas-box .img-edit >li.fliter .img-style >li .imgFilter {display: inline-block; cursor: pointer; width: 80px; height: 80px; background: center / cover no-repeat;}
.canvas-box .img-edit >li.fliter .img-style >li p { cursor: text; text-align: center; font-size: 12px; width: 80px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
.canvas-box .img-edit >li.fliter .img-style >li input { padding-top: 2px; position: absolute; width: 80px;}
.canvas-box .img-edit >li.fliter .img-style >li .pixelate-box { padding-top: 5px; position: absolute; font-size: 12px;}
.canvas-box .img-edit >li.fliter .img-style >li .pixelate-box label { display: inline-block; width: 24px;}
.canvas-box .img-edit >li.fliter .img-style >li .pixelate-box input { width: 12px;}
</style>