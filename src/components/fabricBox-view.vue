<template>
  <canvas class="fabricView" :id="idName"></canvas>
</template>

<script>
export default {
  name: 'fabricView',
  props: ["idName", "deskScale", "pageData", "tempURL"],
  data () {
    return {
      canvas: '',
      imgNum: 0,
    }
  },
  watch: {
    pageData(newVal) {
      this.canvas.clear()
      this.addLayer(newVal)
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
      return true
    },
    addLayer(newVal) {
      if(newVal.layer.length > 0) { // 0 / 1 底层背景,2文字(不包括文字图片), 3蒙版和照片
        this.imgNum = 0
        newVal.layer.forEach((item)=> {
          if(item.layertype == 1) { // 1 底层背景
            var color = '#' + item.img.fill.substring(3)
            this.canvas.setBackgroundColor(color).renderAll()
          } else if(item.layertype == 0) { // 背景
            if(item.img.url) {
              var l = item.primitiveX * this.deskScale
              var t = item.primitiveY * this.deskScale
              var w = item.primitiveWidth * this.deskScale
              var h = item.primitiveHeight * this.deskScale
              var url = item.img.url.indexOf('http') > -1 ? item.img.url : this.tempURL + item.img.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png'
              this.addImg(url, { 
                name: 'bgImg',
                id: item.img.id,
                layerIdx: item.idx,
                left: l,
                top: t,
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
                this.addImg(this.tempURL + item.img.url + '?imageView2/2/w/' + w.toFixed(0) + '/h/' + h.toFixed(0) +  '/format/png', {
                  name: 'oText',
                  id: item.img.id,
                  layerIdx: item.idx,
                  originX: 'center',
                  originY: 'center',
                  left: l + w/2,
                  top: t + h/2,
                  opacity: item.img.opacity,
                  angle: item.img.imageRotation,
                  centeredRotation: true, // 中心旋转
                  selectable: false,
                  evented: false, // 事件阻止
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
                left: l + w/2,
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
                selectable: false,
                evented: false, // 事件阻止
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
          } else if(item.layertype == 3) { // 照片
            if(item.img.fillImg) {
              this.imgNum++
              var l = item.img.fillImg.rect.x * this.deskScale
              var t = item.img.fillImg.rect.y * this.deskScale
              var w = item.img.fillImg.rect.w * this.deskScale
              var h = item.img.fillImg.rect.h * this.deskScale
              /*this.addImg(item.img.fillImg.url, {
                name: 'fillImg', // 添加的图片
                originX: 'center',
                originY: 'center',
                left: l + w/2,
                top: t + h/2,
                layerIdx: item.img.fillImg.layerIdx,
                angle: item.img.fillImg.imageRotation,
                opacity: item.img.fillImg.opacity,
                clipObj: item.img.fillImg.clipObj, // 自定义属性--> 裁剪框
                clipTo: 'function(ctx) {this.myClipTo(ctx)}',
                selectable: false,
                evented: false, // 事件阻止
              }, item.img.fillImg.scale)*/
              if(item.img.fillImg.clipObj.left > this.pageData.pagewidth * this.deskScale) {
                item.img.fillImg.clipObj.left = item.img.fillImg.clipObj.left - this.pageData.pagewidth * this.deskScale
              }
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
                  left: l + w/2,
                  top: t + h/2,
                  opacity: item.img.opacity,
                  angle: item.img.imageRotation,
                  centeredRotation: true, // 中心旋转
                  selectable: false,
                  evented: false, // 事件阻止
                }, item.img.scale)
              }
            }
          }
        })
      }
    },
    addImg(src, attrs, scale) {
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
        /*if(namedImg.name == 'fillImg') {
          console.log(namedImg)
        }*/
        vm.sortObjs()
      }
    },
  },
  mounted() {
    this.$nextTick(function() {
      var canvas = new fabric.Canvas(this.idName)
      this.canvas = canvas
      this.canvas.setWidth(this.pageData.pagewidth * this.deskScale)
      this.canvas.setHeight(this.pageData.pageheight * this.deskScale)
      this.addLayer(this.pageData)
    })
  }
}
</script>
