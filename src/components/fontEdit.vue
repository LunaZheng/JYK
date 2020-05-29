<template>
  <ul class="fontEdit edit-box font-edit" @mousedown="moveEditDown">
    <span class="close" @click="editBoxClose">x</span>
    <li v-if="curFontObj.name != 'oText'">
      <select class="selectFontFamily disableCSS-1" v-model="fontEditData.fontFamily" @change="editInput('fontFamily', $event)" :style="{'font-family': fontEditData.fontFamily}">
        <option v-for="(item, idx) in fontFamily" :style="{'font-family': item.font}" :value="item.font">{{item.font}}</option>
      </select>
      <select class="selectFontSize disableCSS-1" v-model="fontEditData.fontSize" @change="editInput('fontSize', $event)">
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
      <span class="disableCSS-2 bold" @click="editStyle('fontWeight')"><img src="/static/bfl-img/edit/bold.svg" alt="" :style="curFontObj.name != 'oText' && fontEditData.fontWeight === 'bold' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="disableCSS-2 italic" @click="editStyle('fontStyle')"><img src="/static/bfl-img/edit/italic.svg" alt="" :style="curFontObj.name != 'oText' && fontEditData.fontStyle === 'italic' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="disableCSS-2 textAlign leftAlign" @click="editStyle('textAlign', 'left')"><img src="/static/bfl-img/edit/leftAlign.svg" alt="" :style="curFontObj.name != 'oText' && fontEditData.textAlign === 'left' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="disableCSS-2 textAlign centerAlign" @click="editStyle('textAlign', 'center')"><img src="/static/bfl-img/edit/centerAlign.svg" alt="" :style="curFontObj.name != 'oText' && fontEditData.textAlign === 'center' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
      <span class="disableCSS-2 textAlign rightAlign" @click="editStyle('textAlign', 'right')"><img src="/static/bfl-img/edit/rightAlign.svg" alt="" :style="curFontObj.name != 'oText' && fontEditData.textAlign === 'right' ? 'border: 1px solid rgb(98, 162, 228); background: rgb(201, 224, 247)' : 'border: 1px solid transparent'"></span>
    </li>
    <li>
      <span class="img-edit-scale">
        <label>大小</label>
        <input type="range" min="0" max="500" class="img-scale" v-model.lazy="fontEditData.scale" @input="editInput('scale', $event)" @change="editChange('scale', $event)" @mouseup="toSaveCur('scale', $event)">
        <!-- @input 实时触发, @change 失去焦点触发 -->
        <!-- IE环境下 @input无效, 改用 @change (IE下实时触发, 解决→→在IE环境下用 @mouseup 代替 @burl) -->
      </span>
      <span class="img-edit-opacity">
        <label>透明</label>
        <input type="range" min="1" max="1000" class="img-opacity" v-model.lazy="fontEditData.opacity" @input="editInput('opacity', $event)" @change="editChange('opacity', $event)" @mouseup="toSaveCur('opacity', $event)">
      </span>
      <span class="img-edit-opacity" title="旋转">
        <label>旋转</label>
        <input type="range" min="0" max="360" value="0" class="img-opacity" v-model.lazy="fontEditData.angle" @input="editInput('angle', $event)" @change="editChange('angle', $event)" @mouseup="toSaveCur('angle', $event)">
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
        <img src="/static/bfl-img/edit/pre.svg" alt="">前置
      </span>
      <span class="removeImg" @click="removeObj(curFontObj)" @mouseenter="hoverInColor" @mouseleave="hoverOutColor">
        <img src="/static/bfl-img/edit/remove.svg" alt="">删除
      </span>
    </li>
    <li class="controls">
      <div class="left">
        <div class="top">
          <label>阴影:</label>
          <select v-model="fontEditData.shadow.blur" @change="editInput('shadow.blur', $event)">
            <option v-for="(v, i) in 11" :value="i * 1">{{i * 1}}</option>
          </select>
          <input type="color" v-model="fontEditData.shadow.color" @change="editInput('shadow.color', $event)">
          <label v-if="curFontObj.name != 'oText'">描边:</label>
          <select v-if="curFontObj.name != 'oText'" class="disableCSS-1" v-model="fontEditData.strokeWidth" @change="editInput('strokeWidth', $event)">
            <option v-for="(v, i) in 31" :value="(i * 0.2).toFixed(1)">{{(i * 0.2).toFixed(1)}}</option>
          </select>
          <input v-if="curFontObj.name != 'oText'" class="disableCSS-1" type="color" v-model="fontEditData.stroke" @change="editInput('stroke', $event)">
        </div>
        <div class="bottom">
          <label>边框:</label>
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
            <select v-model="borderData.width" @change="curBorder && changeBorderStyle('strokeWidth', $event)">
              <option v-for="(v, i) in 21" :value="i * 1">{{(i + 1) * 1}}</option>
            </select>
            <input type="color" v-model="borderData.color" @change="curBorder && changeBorderStyle('stroke', $event)">
          </span>
        </div>
      </div>
      <div class="bottom" v-if="curFontObj.name != 'oText'">
        <span class="font-edit-content">
          <label>文字:</label>
          <textarea name="" id="" cols="39" rows="2" placeholder="点击输入文字" v-model.lazy="fontEditData.world" @input="editInput('world', $event)" @change="editChange('world', $event)" @mouseup="toSaveCur('world', $event)"></textarea>
          <input class="disableCSS-1" type="color" v-model="fontEditData.fill" @change="editInput('fill', $event)">
        </span>
        <a class="submit" href="javascript:" @click="editBoxClose">确定</a>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'fontEdit',
  props: ["fontData", "curEditFont", "curFontBorder", "deskScale", "paga2AddL"],
  created() {
    var ua = this.BrowserType()
    if(ua.indexOf('IE') > -1) this.isIE = true
  },
  data () {
    return {
      fontFamily: [],
      fontEditData: { // 文字编辑记录
        shadow: {
          color: '#cccccc',
          blur: 0
        },
        scale: 100,
        opacity: 0,
        angle: 0,
        textAlign: 'left',
      },
      borderData: {
        width: 1,
        color: '#f9ce4d'
      },
      fontEditT: 0,
      fontEditL: 0,
      curFontObj: '',
      curBorder: '', // 当前文字的框对象
      isChange: false,
      isIE: false, // 是否是IE浏览器
    }
  },
  watch: {
    curEditFont(newVal) {
      if(newVal) this.init(newVal)
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
    curBorder(newVal) {
      if(newVal) {
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
      }
    },
    'fontEditData.scale': function(newVal) {
      if(this.isChange && !this.isIE) this.$emit('updateModifications') // 添加画布记录
    },
    'fontEditData.opacity': function(newVal) {
      if(this.isChange && !this.isIE) this.$emit('updateModifications') // 添加画布记录
    },
    'fontEditData.angle': function(newVal) {
      if(this.isChange && !this.isIE) this.$emit('updateModifications') // 添加画布记录
    },
    'fontEditData.textAlign': function(newVal) {
      if(this.isChange && !this.isIE && this.curFontObj.name != 'oText') this.$emit('updateModifications') // 添加画布记录
    },
    'fontEditData.world': function(newVal) {
      if(this.isChange && !this.isIE && newVal != '' && newVal != '请点击输入') this.$emit('updateModifications') // 添加画布记录
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
      if(this.curBorder) {
        this.curFontObj.canvas.remove(this.curBorder)
      }
      this.$emit('close')
      obj.canvas.remove(obj)
      this.$emit('updateModifications') // 添加画布记录
      // this.curEditImg = ''
    },
    editStyle(name, value) {
      switch (name) {
        case 'top':
          value === '-' ? this.curFontObj.set(name, this.curFontObj.top - 5) : this.curFontObj.set(name, this.curFontObj.top + 5)
          break
        case 'bringToFront': // 前置
          var maxLayerIdx = JSON.parse(JSON.stringify(this.curFontObj.canvas._objects))[this.curFontObj.canvas._objects.length-1].layerIdx
          this.curFontObj.canvas.forEachObject((item)=> {
            if(this.curFontObj.left > this.paga2AddL) { // 右侧画布
              if(item.left >  this.paga2AddL) {
                if(item.layerIdx > JSON.parse(JSON.stringify(this.curFontObj)).layerIdx) item.layerIdx = item.layerIdx-1
              }
            } else { // 单页 / 左侧画布
              if(item.layerIdx > JSON.parse(JSON.stringify(this.curFontObj)).layerIdx) item.layerIdx = item.layerIdx-1
            }
          })
          this.curFontObj.layerIdx = maxLayerIdx
          this.curFontObj.canvas.bringToFront(this.curFontObj)
          break
        case 'flipX': // 镜像(横)
          this.curFontObj.set('flipX', !this.curFontObj.flipX)
          break
        case 'flipY': // 镜像(纵)
          this.curFontObj.set('flipY', !this.curFontObj.flipY)
          break
        case 'fontWeight': // B
          this.fontEditData.fontWeight = (this.fontEditData.fontWeight === 'bold' ? 'normal' : 'bold')
          this.curFontObj.set('fontWeight', this.fontEditData.fontWeight)
          break
        case 'fontStyle': // I
          this.fontEditData.fontStyle = (this.fontEditData.fontStyle === 'italic' ? 'normal' : 'italic')
          this.curFontObj.set('fontStyle', this.fontEditData.fontStyle)
          break
        case 'textAlign': // 对齐
          this.fontEditData.textAlign = value
          this.curFontObj.set('textAlign', value)
          break
      }
      this.curFontObj.canvas.renderAll()
      this.$emit('updateModifications') // 添加画布记录
      /*if(name != 'textAlign') {
        if(name == 'fontWeight' || name == 'fontStyle') {
          if(this.curFontObj.name != 'oText') this.$emit('updateModifications') // 添加画布记录
        } else {
          this.$emit('updateModifications') // 添加画布记录
        }
      }*/
    },
    editInput(name, e) {
      switch(name) {
        case 'scale':
          this.isChange = true
          this.curFontObj.scale(e.target.value * 0.01)
          break
        case 'opacity':
          this.isChange = true
          this.curFontObj.set('opacity', (1000 - e.target.value) * 0.001)
          break
        case 'angle':
          this.isChange = true
          this.curFontObj.set(name, e.target.value)
          break
        case 'world':
          this.isChange = true
          var word = ''
          word = $.trim(e.target.value)
          if(this.curFontObj) {
            this.curFontObj.set('text', word)
          }
          break
        case 'strokeWidth':
          this.curFontObj.set(name, e.target.value*1)
          this.curFontObj.set('stroke', this.fontEditData.stroke)
          if(this.curFontObj.name != 'oText') this.$emit('updateModifications') // 添加画布记录
          break
        case 'shadow.blur':
          this.curFontObj.setShadow({
            color: this.fontEditData.shadow.color,
            offsetX: this.fontEditData.shadow.blur, 
            offsetY: this.fontEditData.shadow.blur, 
            blur: this.fontEditData.shadow.blur
          })
          this.$emit('updateModifications') // 添加画布记录
          break
        case 'shadow.color':
          if(this.fontEditData.shadow.blur > 0) {
            this.curFontObj.setShadow({
              color: this.fontEditData.shadow.color,
              offsetX: this.fontEditData.shadow.blur, 
              offsetY: this.fontEditData.shadow.blur, 
              blur: this.fontEditData.shadow.blur
            })
            this.$emit('updateModifications') // 添加画布记录
          }
          break
        default: // fontFamily fontSize stroke fill
          this.curFontObj.set(name, e.target.value)
          if(this.curFontObj.name != 'oText') this.$emit('updateModifications') // 添加画布记录
      }
      if(this.curFontObj) this.curFontObj.canvas.setActiveObject(this.curFontObj).renderAll() // 选中
    },
    editChange(name, e) {
      if(this.isIE) {
        switch(name) {
          case 'scale':
            this.isChange = true
            this.curFontObj.scale(e.target.value * 0.01)
            break
          case 'opacity':
            this.isChange = true
            this.curFontObj.set('opacity', (1000 - e.target.value) * 0.001)
            break
          case 'angle':
            this.isChange = true
            this.curFontObj.set(name, e.target.value)
            break
          case 'world':
            this.isChange = true
            var word = ''
            word = $.trim(e.target.value)
            if(this.curFontObj) {
              this.curFontObj.set('text', word)
            }
            break
          case 'strokeWidth':
            this.curFontObj.set(name, e.target.value*1)
            this.curFontObj.set('stroke', this.fontEditData.stroke)
            if(this.curFontObj.name != 'oText') this.$emit('updateModifications') // 添加画布记录
            break
          case 'shadow.blur':
            this.curFontObj.setShadow({
              color: this.fontEditData.shadow.color,
              offsetX: this.fontEditData.shadow.blur, 
              offsetY: this.fontEditData.shadow.blur, 
              blur: this.fontEditData.shadow.blur
            })
            this.$emit('updateModifications') // 添加画布记录
            break
          case 'shadow.color':
            if(this.fontEditData.shadow.blur > 0) {
              this.curFontObj.setShadow({
                color: this.fontEditData.shadow.color,
                offsetX: this.fontEditData.shadow.blur, 
                offsetY: this.fontEditData.shadow.blur, 
                blur: this.fontEditData.shadow.blur
              })
              this.$emit('updateModifications') // 添加画布记录
            }
            break
          default: // fontFamily fontSize stroke fill
            this.curFontObj.set(name, e.target.value)
            if(this.curFontObj.name != 'oText') this.$emit('updateModifications') // 添加画布记录
        }
        if(this.curFontObj) this.curFontObj.canvas.setActiveObject(this.curFontObj).renderAll() // 选中
      }
    },
    toSaveCur(name, e) {
      if(this.isIE && this.isChange) {
        if(name == 'scale' || name == 'opacity' || name == 'angle' || (name == 'textAlign' && this.curFontObj.name != 'oText') || (name == 'world' && this.fontEditData.world != '' && this.fontEditData.world != '请点击输入')) this.$emit('updateModifications') // 添加画布记录
      }
    },
    changeBorder(e) {
      this.curFontObj.borderType = e.target.value
      this.addBorder(e.target.value)
    },
    changeBorderStyle(name, e) {
      this.curBorder.set(name, e.target.value)
      this.curBorder.canvas.renderAll()
      this.$emit('updateModifications') // 添加画布记录
    },
    curTextBox() {
      this.curBorder = ''
      this.curFontObj.canvas.forEachObject((item)=> {
        if(item.name == 'textBox') {
          if(item.left == this.curFontObj.left && item.top == this.curFontObj.top) this.curBorder = item
        }
      })
    },
    addBorder(borderType) {
      // this.curTextBox()
      if(this.curBorder) {
        this.curFontObj.canvas.remove(this.curBorder)
      }
      var border = ''
      switch (borderType) {
        case '无':
          /*console.log(this.curBorder)
          if(this.curBorder) {
            this.curFontObj.canvas.remove(this.curBorder)
          }*/
          break
        case '方框1':
          border = new fabric.MyRect({ // rect
            name: 'textBox',
            boxName: '方框1',
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
          border = new fabric.MyRect({ // rect
            name: 'textBox',
            boxName: '方框2',
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
          border = new fabric.MyRect({ // rect
            name: 'textBox',
            boxName: '方框3',
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
          border = new fabric.MyCircle({ // circle
            name: 'textBox',
            boxName: '圆1',
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
          border = new fabric.MyCircle({ // circle
            name: 'textBox',
            boxName: '圆2',
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
          border = new fabric.MyCircle({ // circle
            name: 'textBox',
            boxName: '椭圆1',
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
          border = new fabric.MyCircle({ // circle
            name: 'textBox',
            boxName: '椭圆2',
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
          border = new fabric.MyTriangle({ // triangle
            name: 'textBox',
            boxName: '三角形',
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
          border = new fabric.MyPath(str + 'z');
          border.set({ // 五角形
            name: 'textBox',
            boxName: '五角形',
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

          border = new fabric.MyPath(str + ' z'); // M-移动, L-线, z-闭合路径
          border.set({ // 心形
            name: 'textBox',
            boxName: '心形',
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
      // border.selectable = false
      if(border) {
        border.evented = false
        this.curFontObj.canvas.add(border)
        this.curBorder = border
        this.curFontObj.canvas.bringToFront(border).renderAll()
        this.curFontObj.canvas.discardActiveObject() // 不选中
        this.$emit('updateModifications', true) // 添加画布记录
      }
    },
    editBoxClose() {
      this.curFontObj.canvas.discardActiveObject() // 不选中
      this.curFontObj.canvas.renderAll()
      this.$emit('close')
    },
    colorToHex(color) {
      let hexcolor = new fabric.Color(color).toHex()
      return ('#' + hexcolor)
    },
    init(curEditFont) {
      this.isChange = false
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
      this.curTextBox()
      if(this.curBorder) this.fontEditData.borderType = this.curBorder.boxName

      var fontEditW = $('.fontEdit').outerWidth()
      this.fontEditT = curEditFont.top + curEditFont.height / 2 + 20
      this.fontEditL = curEditFont.left - fontEditW / 2
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.fontFamily = this.fontData
      if(this.curEditFont) {
        this.init(this.curEditFont)
      }

      if(this.curFontObj) {
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
      }
    })
  }
}
</script>
