<template>
  <div class="hello">
    <canvas id="canvas"></canvas>
    <span class="btn" @click="addImg()">addImg</span>
    <span class="btn" @click="toPDF()">toPDF</span>
    <router-link class="btn" to="/toPath">toPath</router-link>
  </div>
</template>

<script>
// 在js代码里面写图片路径的时候,使用import引入,
// 否则webpack只会当做字符串处理
import imgSrc from '@/assets/logo.png' // base64

export default {
  name: 'HelloWorld',
  data () {
    return {
      canvas: '',
    }
  },
  methods: {
    addImg() {
      var vm = this

      var clipPath = new fabric.Polygon([
        {x: 185, y: 0},
        {x: 250, y: 100},
        {x: 385, y: 170},
        {x: 200, y: 300},
        {x: 0, y: 245}
      ], {
        left: 0,
        top: 200,
        angle: -30,
        fill: 'pink',
        objectCaching: false
      })

      var clipRect2 = new fabric.Rect({ // 方形框
        originX: 'left',
        originY: 'top',
        left: 10,
        top: 10,
        width: 180,
        height: 180,
        fill: '#DDD',
        strokeWidth: 0,
        selectable: false
      });
      // this.canvas.add(clipRect2);

      var img = new Image()
      // img.src = 'https://avatars2.githubusercontent.com/u/25322441?s=400&u=a3e28139ddee0a85e5894e96c1e28d7c7786040d&v=4' // (可以返序列化)
      // img.src = imgSrc // base64数据(可以返序列化)
      img.src = '/static/bfl-img/2.png' // (可以返序列化)
      img.crossOrigin = '';

      img.onload = function() {
        var namedImg = new fabric.NamedImage(img, { 
          name: 'foobar',
          left: 50,
          top: 50,
          clipObj: clipPath, // 自定义属性--> 裁剪框
          clipTo: function(ctx) {this.myClipTo(ctx)},
        });

        vm.canvas.add(namedImg);
        vm.canvas.renderAll();

        vm.$nextTick(function() { // dom已更新  或
          var json = JSON.stringify(vm.canvas);
          vm.canvas.clear();
          console.log(json.replace(/\\n/g, ''))
          vm.canvas.loadFromJSON(json, vm.canvas.renderAll.bind(vm.canvas))
          // vm.canvas.discardActiveObject(); // 不选中
        })
      }
    },
    toPDF() {
      // console.log(JSON.stringify(this.canvas))
      var dataURL = this.canvas.toDataURL({
        format: 'png',
        quality: 0.8
      });

      var pdf = new this.jspdf('', 'pt', 'a4');
      pdf.addImage(dataURL, 'PNG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );
      pdf.save('content.pdf');
    }
  },
  mounted() {
    this.myFabric.namedImage()
    this.$nextTick(function() { // dom已更新
      var canvas = new fabric.Canvas('canvas');
      canvas.setWidth(500)
      canvas.setHeight(500)

      this.canvas = canvas
      
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas{border:1px solid red;}
.btn {display: inline-block; padding: 4px 6px; border: 1px solid black; margin-top: 10px; cursor: pointer;}
</style>
