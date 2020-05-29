<template>
  <ul class="fontEdit edit-box font-edit" @mousedown="moveEditDown">
    <span class="close" @click="editBoxClose">x</span>
    <li>
      <select class="selectFontFamily" v-model="fontEditData.fontFamily" @change="editInput('fontFamily', $event)">
        <option style="font-family: 'STXingkai'" value="STXingkai">STXingkai 华文行楷</option>
        <option style="font-family: 'STXinwei'" value="STXinwei">STXinwei 华文新魏</option>
        <option style="font-family: 'STLiti'" value="STLiti">STLiti 华文隶书</option>
        <option style="font-family: 'STHupo'" value="STHupo">STHupo 华文琥珀</option>
        <option style="font-family: 'STCaiyun'" value="STCaiyun">STCaiyun 华文彩云</option>
        <option style="font-family: 'FZYaoti'" value="FZYaoti">FZYaoti 方正姚体</option>
        <option style="font-family: 'Delicious'" value="Delicious">Delicious</option>
        <option style="font-family: 'Hoefler Text'" value="Hoefler Text">Hoefler Text</option>
        <option style="font-family: 'STXinwei'" value="STXinwei">STXinwei</option>
      </select>
      <select class="selectFontSize" v-model="fontEditData.fontSize" @change="editInput('fontSize', $event)">
        <option value="8">8px</option>
        <option value="9">9px</option>
        <option value="10">10px</option>
        <option value="11">11px</option>
        <option value="12">12px</option>
        <option value="14">14px</option>
        <option value="16">16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
        <option value="22">22px</option>
        <option value="24">24px</option>
        <option value="26">26px</option>
        <option value="28">28px</option>
        <option value="36">36px</option>
        <option value="48">48px</option>
        <option value="72">72px</option>
      </select>
      <span class="bold" @click="editStyle('fontWeight')"><img src="/static/bfl-img/edit/bold.svg" alt="" :style="fontEditData.fontWeight === 'bold' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="italic" @click="editStyle('fontStyle')"><img src="/static/bfl-img/edit/italic.svg" alt="" :style="fontEditData.fontStyle === 'italic' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="leftAlign" @click="editStyle('textAlign', 'left')"><img src="/static/bfl-img/edit/leftAlign.svg" alt="" :style="fontEditData.textAlign === 'left' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="centerAlign" @click="editStyle('textAlign', 'center')"><img src="/static/bfl-img/edit/centerAlign.svg" alt="" :style="fontEditData.textAlign === 'center' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="rightAlign" @click="editStyle('textAlign', 'right')"><img src="/static/bfl-img/edit/rightAlign.svg" alt="" :style="fontEditData.textAlign === 'right' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
    </li>
    <li>
      <span class="img-edit-scale">
        <label>大小</label>
        <input type="range" min="0" max="500" class="img-scale" v-model="fontEditData.scale" @input="editInput('scale', $event)">
      </span>
      <span class="img-edit-opacity">
        <label>透明</label>
        <input type="range" min="1" max="1000" class="img-opacity" v-model="fontEditData.opacity" @input="editInput('opacity', $event)">
      </span>
      <span class="img-edit-opacity" title="旋转">
        <label>旋转</label>
        <input type="range" min="0" max="360" value="0" class="img-opacity" v-model="fontEditData.angle" @input="editInput('angle', $event)">
      </span>
    </li>
    <li class="controls">
      <span class="moveup" @click="editStyle('top', '-')" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/up.svg" alt="">上移
      </span>
      <span class="movedown" @click="editStyle('top', '+')" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/down.svg" alt="">下移
      </span>
      <!-- <span class="cutImg" @click="editStyle('angle')" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/cut.svg" alt="">旋转
      </span> -->
      <span class="copy" @click="editStyle('flipX')" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/v-erseMirror.svg" alt="">镜像
      </span>
      <span class="copy" @click="editStyle('flipY')" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/v-erseMirror.svg" style="transform:rotate(90deg);-ms-transform:rotate(90deg);-moz-transform:rotate(90deg);-webkit-transform:rotate(90deg);-o-transform:rotate(90deg);" alt="">镜像
      </span>
      <span class="moveup" @click="editStyle('bringToFront', '-')" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/up.svg" alt="">前置
      </span>
      <span class="removeImg" @click="removeObj(curEditFont)" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/remove.svg" alt="">删除
      </span>
    </li>
    <li class="controls">
      <div class="left">
        <div class="top">
          <label>阴影</label>
          <select class="selectFontSize" v-model="fontEditData.shadow.blur" @change="editInput('shadow.blur', $event)">
            <option v-for="(v, i) in 11" :value="i * 1">{{i * 1}}</option>
          </select>
          <input type="color" v-model="fontEditData.shadow.color" @change="editInput('shadow.color', $event)">
          <label>描边</label>
          <select class="selectFontSize" v-model="fontEditData.strokeWidth" @change="editInput('strokeWidth', $event)">
            <option v-for="(v, i) in 31" :value="(i * 0.2).toFixed(1)">{{(i * 0.2).toFixed(1)}}</option>
          </select>
          <input type="color" v-model="fontEditData.stroke" @change="editInput('stroke', $event)">
        </div>
        <div class="bottom">
          <label>边框</label>
          <select class="selectFontFrame" @change="changeBorder($event)" v-model="fontEditData.borderType">
            <option value="无">无</option>
            <optgroup label="方框">
              <option value="方框1">方框1</option>
              <option value="方框2">方框2</option>
              <option value="方框3">方框3</option>
            </optgroup>
            <optgroup label="圆框">
              <option value="圆1">圆1</option>
              <option value="圆2">圆2</option>
              <option value="椭圆1">椭圆1</option>
              <option value="椭圆2">椭圆2</option>
            </optgroup>
            <optgroup label="多边形">
              <option value="三角形">三角形</option>
              <option value="五角形">五角形</option>
              <option value="心形">心形</option>
            </optgroup>
          </select>
          <span class="font-edit-color">
            <label>边距</label>
            <select class="selectFontSize" v-model="borderData.width" @change="curBorder && changeBorderStyle('strokeWidth', $event)">
              <option v-for="(v, i) in 21" :value="i * 1">{{(i + 1) * 1}}</option>
            </select>
            <input type="color" v-model="borderData.color" @change="curBorder && changeBorderStyle('stroke', $event)">
          </span>
        </div>
      </div>
      <div class="bottom">
        <span class="font-edit-content">
          <label>文字</label>
          <textarea name="" id="" cols="39" rows="2" placeholder="点击输入文字" v-model="fontEditData.world" @input="editInput('world', $event)"></textarea>
          <input type="color" v-model="fontEditData.fill" @change="editInput('fill', $event)">
        </span>
        <a class="submit" href="javascript:" @click="editBoxClose">确定</a>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'fontEdit',
  props: ["curEditFont", "curFontBorder", "deskScale"],
  data () {
    return {
      fontEditData: { // 文字编辑记录
        shadow: {
          color: '#cccccc',
          blur: 5
        },
      },
      borderData: {
        width: 1,
        color: '#f9ce4d'
      },
      fontEditT: 0,
      fontEditL: 0,
      curAddText: '',
      curFontObj: '',
      curBorder: '', // 当前文字的框对象
    }
  },
  watch: {
    curEditFont(newVal) {
      this.init(newVal)
    },
    curAddText(newVal) {
      this.init(newVal)
    },
    fontEditT(newVal) {
      this.$nextTick(function() {
        if(newVal) {
          $('.font-edit').css('top', newVal + 'px')
        }
      })
    },
    fontEditL(newVal) {
      this.$nextTick(function() {
        if(newVal) {
          $('.font-edit').css('left', newVal + 'px')
        }
      })
    },
    deep: true
  },
  methods: {
    hoverInColor(e) {
      e.target.children[0].src = e.target.children[0].src.slice(0, -4) + '-hover.svg'
    },
    hoverOutColor(e) {
      e.target.children[0].src = e.target.children[0].src.slice(0, -10) + '.svg'
    },
    moveEditDown(e) { // 编辑框移动
      // var e = e ? e : window.event;
      e.stopPropagation() // 阻止事件冒泡而触发父级的click事件
      e.cancelBubble = true // 兼容ie
      if (e.stopPropagation) { //针对Mozilla和Opera
        e.stopPropagation();
      } else if(window.event) { //针对IE
        window.event.cancelBubble = true;
      }
      // this.isAddtext = true
      if(e.target.tagName === 'UL' || e.target.tagName === 'LI') {
        var ul = $(e.target).closest('.edit-box')
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
    removeObj(obj) {  // 编辑文字--删除
      this.$emit('getIsEditFont', false)
      obj.canvas.remove(obj)
      if(this.curBorder) {
        this.curBorder.canvas.remove(this.curBorder)
      }
      // this.curEditImg = ''
    },
    editStyle(name, value) {
      switch (name) {
        case 'top':
          value === '-' ? this.curFontObj.set(name, this.curFontObj.top - 5) : this.curFontObj.set(name, this.curFontObj.top + 5)
          break
        case 'bringToFront': // 前置
          this.curFontObj.canvas.bringToFront(this.curFontObj)
          break
        case 'flipX':
          this.curFontObj.set('flipX', !this.curFontObj.flipX)
          break
        case 'flipY':
          this.curFontObj.set('flipY', !this.curFontObj.flipY)
          break
        case 'fontWeight':
          this.fontEditData.fontWeight = (this.fontEditData.fontWeight === 'bold' ? 'normal' : 'bold')
          this.curFontObj.set('fontWeight', this.fontEditData.fontWeight)
          break
        case 'fontStyle':
          this.fontEditData.fontStyle = (this.fontEditData.fontStyle === 'italic' ? 'normal' : 'italic')
          this.curFontObj.set('fontStyle', this.fontEditData.fontStyle)
          break
        case 'textAlign':
          this.fontEditData.textAlign = value
          this.curFontObj.set('textAlign', value)
          break
      }
      this.curFontObj.canvas.renderAll()
    },
    addText(text) {
      var text = new fabric.Text(text, { 
        originX: 'center',
        originY: 'center',
        top: this.fontEditData.top,
        left: this.fontEditData.left, 
        fontFamily: this.fontEditData.fontFamily,
        fontSize: this.fontEditData.fontSize,
        strokeWidth: this.fontEditData.strokeWidth,
        padding: this.fontEditData.padding,
        angle: this.fontEditData.angle,
        opacity: (1 - this.fontEditData.opacity * 0.001),
        fontWeight: this.fontEditData.fontWeight,
        fontStyle: this.fontEditData.fontStyle, // 斜体
        stroke: this.fontEditData.stroke, // 描边
        strokeWidth: this.fontEditData.strokeWidth, // 描边宽度
        textAlign: this.fontEditData.textAlign,
        lineHeight: this.fontEditData.lineHeight,
        textDecoration: this.fontEditData.textDecoration, // 下划线'underline'/中划线'line-through'/上划线'overline'
        fill : this.fontEditData.fill,
        flipX : this.fontEditData.flipX,
        flipY : this.fontEditData.flipY,
        // hasBorders: false,
        cornerStyle: 'circle',
      })

      // 台历修改
      if(this.fontEditData.world === '') {
        text.scale(1) // 台历
      } else {
        text.scale(this.fontEditData.scale * 0.01)
      }
      
      text.setShadow({
        color: this.fontEditData.shadow.color, 
        offsetX: this.fontEditData.shadow.blur, 
        offsetY: this.fontEditData.shadow.blur, 
        blur: this.fontEditData.shadow.blur
      })
      text.hasControls = false // 取消控件-角
      text.set('borderColor', 'red');
      
      this.curEditFont.canvas.add(text).renderAll()
      // 台历修改
      this.curEditFont.canvas.bringToFront(text).renderAll() //上移(一直向上)
      this.curAddText = text
    },
    editInput(name, e) {
      switch(name) {
        case 'scale':
          this.curFontObj.scale(this.fontEditData.scale * 0.01)
          break
        case 'opacity':
          this.curFontObj.set('opacity', (1000 - e.target.value) * 0.001)
          break
        case 'strokeWidth':
          this.curFontObj.set(name, e.target.value*1)
          this.curFontObj.set('stroke', this.fontEditData.stroke)
          break
        case 'world':
          if(this.curEditFont.type == 'named-image') {
            if(this.curAddText == '') {
              this.addText(e.target.value)
            } else {
              if(this.curEditFont) {
                this.curAddText.canvas.remove(this.curEditFont)
              }
              this.curAddText.set({
                'text': e.target.value,
              })
            }
          } else {
            if(this.curFontObj) {
              this.curFontObj.set({
                'text': e.target.value,
              })
            } else {
              console.log(this.curFontObj)
            }
          }
          break
        default:
          if(name.indexOf('shadow') > -1) {
            this.fontEditData.shadow[name.slice(6)] = e.target.value
            this.curFontObj.setShadow({
              color: this.fontEditData.shadow.color, 
              offsetX: this.fontEditData.shadow.blur, 
              offsetY: this.fontEditData.shadow.blur, 
              blur: this.fontEditData.shadow.blur
            })
          } else { // 'angle'  'strokeWidth'
            this.curFontObj.set(name, e.target.value)
          }
      }
      this.curFontObj.canvas.renderAll()
      this.curFontObj.canvas.setActiveObject(this.curFontObj) // 选中
    },
    changeBorder(e) {
      this.curFontObj.borderType = e.target.value
      this.addBorder(e.target.value)
    },
    changeBorderStyle(name, e) {
      this.curBorder.set(name, e.target.value)
      this.curBorder.canvas.renderAll()
    },
    addBorder(borderType) {
      if(this.curBorder) {
        this.curFontObj.canvas.remove(this.curBorder)
      }
      var border = ''
      switch (borderType) {
        case '无':
          
          break
        case '方框1':
          border = new fabric.Rect({ // rect
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            width: this.curFontObj.width * this.curFontObj.scaleX + 5,
            height: this.curFontObj.height * this.curFontObj.scaleY * this.curFontObj.scaleY + 5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
          })
          break
        case '方框2':
          border = new fabric.Rect({ // rect
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            width: this.curFontObj.width * this.curFontObj.scaleX + 5,
            height: this.curFontObj.height * this.curFontObj.scaleY + 5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            strokeDashArray: [5, 5],
          })
          break
        case '方框3':
          border = new fabric.Rect({ // rect
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            width: this.curFontObj.width * this.curFontObj.scaleX + 5,
            height: this.curFontObj.height * this.curFontObj.scaleY + 5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            strokeDashArray: [2, 4, 6],
          })
          break
        case '圆1':
          border = new fabric.Circle({ // circle
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            radius: this.curFontObj.width * this.curFontObj.scaleX * 0.5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            // strokeDashArray: [2, 4, 6],
          })
          break
        case '圆2':
          border = new fabric.Circle({ // circle
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            radius: this.curFontObj.width * this.curFontObj.scaleX * 0.5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            strokeDashArray: [2, 4, 6],
          })
          break
        case '椭圆1':
          border = new fabric.Circle({ // circle
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            radius: this.curFontObj.width * this.curFontObj.scaleX * 0.5,
            scaleY: 0.5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
          })
          break
        case '椭圆2':
          border = new fabric.Circle({ // circle
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            radius: this.curFontObj.width * this.curFontObj.scaleX * 0.5,
            scaleY: 0.5,
            fill: 'rgba(0,0,0,0)',
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            strokeDashArray: [2, 4, 6],
          })
          break
        case '三角形':
          border = new fabric.Triangle({ // triangle
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            width: this.curFontObj.width * this.curFontObj.scaleX * 2, 
            height: this.curFontObj.width * this.curFontObj.scaleX * 2, 
            fill: 'rgba(0,0,0,0)', 
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            // strokeDashArray: [2, 4, 6]
          })
          break
        case '五角形':
          var R = this.curFontObj.width * 0.8, r = R / 1.8
          var str = ''
          for (var i = 0; i < 5; i++) {
            if(i == 0) {
              str += 'M ' + Math.cos((18 + 72 * i) / 180 * Math.PI) * R + ' ' + -Math.sin((18 + 72 * i) / 180 * Math.PI) * R + ' L ' + Math.cos((54 + 72 * i) / 180 * Math.PI) * r + ' ' + -Math.sin((54 + 72 * i) / 180 * Math.PI) * r
            } else {
              str += ' L ' + Math.cos((18 + 72 * i) / 180 * Math.PI) * R + ' ' + -Math.sin((18 + 72 * i) / 180 * Math.PI) * R + ' L ' + Math.cos((54 + 72 * i) / 180 * Math.PI) * r + ' ' + -Math.sin((54 + 72 * i) / 180 * Math.PI) * r + ' '
            }
          }
          // M-移动, L-线, z-闭合路径
          border = new fabric.Path(str + 'z');
          border.set({ // 五角形
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            width: this.curFontObj.width * this.curFontObj.scaleX * 2, 
            height: this.curFontObj.width * this.curFontObj.scaleX * 2, 
            fill: 'rgba(0,0,0,0)', 
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            // strokeDashArray: [2, 4, 6]
          });
          break
        case '心形':
          var str = ''
          var R = this.curFontObj.width * 0.08 // size
          for (let i = 0; i < 30; i++) {
            var step = i / 30 * (Math.PI * 2)
            if(i == 0) {
              str = 'M ' + (8*R * Math.pow(Math.sin(step), 3)) + ' ' + (-(7*R * Math.cos(step) - 3*R * Math.cos(2 * step) - 1*R * Math.cos(3 * step) - Math.cos(4 * step)))
            } else {
              str += ' L ' + (8*R * Math.pow(Math.sin(step), 3)) + ' ' + (-(7*R * Math.cos(step) - 3*R * Math.cos(2 * step) - 1*R * Math.cos(3 * step) - Math.cos(4 * step)))
            }
          }

          border = new fabric.Path(str + ' z'); // M-移动, L-线, z-闭合路径
          border.set({ // 心形
            name: '边框',
            originX: this.curFontObj.originX,
            originY: this.curFontObj.originY,
            top: this.curFontObj.top,
            left: this.curFontObj.left,
            angle: this.curFontObj.angle,
            width: this.curFontObj.width * this.curFontObj.scaleX * 2, 
            height: this.curFontObj.width * this.curFontObj.scaleX * 2, 
            fill: 'rgba(0,0,0,0)', 
            stroke: this.borderData.color,
            strokeWidth: this.borderData.width,
            // strokeDashArray: [2, 4, 6]
          });
          break
      }
      border.selectable = false
      this.curFontObj.canvas.add(border)
      this.curBorder = border
      this.curFontObj.canvas.bringToFront(this.curFontObj)
      this.curFontObj.canvas.discardActiveObject() // 不选中
    },
    editBoxClose() {
      this.curFontObj.canvas.discardActiveObject() // 不选中
      this.curFontObj.canvas.renderAll()
      this.$emit('getIsEditFont', false)
    },
    colorToHex(color) {
      let hexcolor = new fabric.Color(color).toHex()
      return ('#' + hexcolor)
    },
    init(curEditFont) {
      this.fontEditData = {
        world: '',
        left: curEditFont.left,
        top: curEditFont.top,
        fontFamily: curEditFont.fontFamily ? curEditFont.fontFamily : 'Hoefler Text',
        fontSize: curEditFont.fontSize ? curEditFont.fontSize : 24,
        angle: curEditFont.angle,
        opacity: (1 - curEditFont.opacity) * 1000,
        shadow: {color: '#cccccc', blur: 0},
        fontWeight: curEditFont.fontWeight ? curEditFont.fontWeight : 'normal',
        fontStyle: curEditFont.fontStyle ? curEditFont.fontStyle : 'normal', // 斜体
        textDecoration: 'none',
        stroke: this.colorToHex(curEditFont.stroke), // 描边
        strokeWidth: (curEditFont.strokeWidth*1).toFixed(1), // 描边宽度
        textAlign: curEditFont.textAlign ? curEditFont.textAlign : 'left',
        lineHeight: curEditFont.lineHeight ? curEditFont.lineHeight : 1,
        textBackgroundColor: curEditFont.textBackgroundColor ? curEditFont.textBackgroundColor : 'transparent', // 背景色
        fill: this.colorToHex(curEditFont.fill),
        flipX: curEditFont.flipX,
        flipY: curEditFont.flipY,
        padding: curEditFont.padding,
        scale: curEditFont.scaleX / 0.01,
        borderType: curEditFont.borderType ? curEditFont.borderType : '无'
      }
      if(curEditFont.type == 'named-image') {
        this.fontEditData.world = ''
        this.fontEditData.strokeWidth = 0
      } else {
        if(curEditFont.shadow) {
          this.fontEditData.shadow = {
            color: this.colorToHex(curEditFont.shadow.color),
            blur: curEditFont.shadow.blur
          }
        }
        this.fontEditData.world = curEditFont.text
      }
      this.curFontObj = curEditFont
      this.curFontObj.canvas.forEachObject((o)=> {
        if(o.name == '边框') {
          this.curBorder = o
        }
      })

      var fabricBox = $(curEditFont.canvas.contextContainer.canvas).closest('.fabricBox')
      var fabricBoxOffs = fabricBox.offset()
      var fabricBoxW = fabricBox.width()
      var W = $('.canvas-box > div').width()
      this.fontEditT = fabricBoxOffs.top + curEditFont.top + curEditFont.height
      if(fabricBoxOffs.left <= W/2) {
        this.fontEditL = fabricBoxOffs.left - fabricBoxW/2 + curEditFont.left + curEditFont.width + 10
      } else {
        this.fontEditL = fabricBoxOffs.left - fabricBoxW/2 - $('.img-edit').width() + curEditFont.left
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      if(this.curEditFont != '') {
        this.init(this.curEditFont)
      }

      this.curFontObj.canvas.on('object:moving', (e)=> {
        var e = e.e
        var x = e.offsetX
        var y = e.offsetY
        if(this.curBorder) {
          this.curBorder.set({
            top: this.curFontObj.top,
            left: this.curFontObj.left,
          })
        }
      })

      /*this.curFontObj.canvas.on('object:added', (e)=> {
        this.curFontObj.canvas.forEachObject((item)=> { // _objects.forEach
          if(item) {
            if(item.name == 'text') {
              this.curFontObj.canvas.bringToFront(item).renderAll() //上移(一直向上)
            }
          }
        })
      })*/
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>