<template>
  <div class="toPath">
    <canvas id="canvas"></canvas>
    <span class="btn" @click="toJSON()">toJSON</span>
    <router-link class="btn" to="/HelloWorld">toClip&toPDF</router-link>
  </div>
</template>

<script>
// 在js代码里面写图片路径的时候,使用import引入,
// 否则webpack只会当做字符串处理
import imgSrc from '@/assets/logo.png' // base64

export default {
  name: 'toPath',
  data () {
    return {
      canvas: '',
      points: ''
    }
  },
  computed: {
    ctx() {
      return this.canvas.getContext('2d')
    }
  },
  methods: {
    addimg(src, l, t) {
      var cw = this.canvas.width;
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

        this.canvas.add(namedImg).renderAll()
        
        imgData = this.ctx.getImageData(namedImg.aCoords.tl.x, namedImg.aCoords.tl.y, canvas.width, canvas.height);
        data = imgData.data;

        //获取图像的轮廓路径（轮廓=透明像素的外部路径）
        console.log(this.toPath) // this.toPath --> 全局函数
        points = this.toPath.geom(function(x, y) { //确定非透明的轮廓
          var a = data[(y * cw + x) * 4 + 3];
          return (a > 20);
        })

        var clipPath = new fabric.Polygon(points, {
          left: namedImg.left - 0.5,
          top: namedImg.top - 0.5,
          fill: 'transparent',
          stroke: 'red',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
        this.canvas.remove(namedImg)
        this.canvas.add(clipPath).renderAll()
      }
      img1.src = src;
      // img1.src = "https://avatars3.githubusercontent.com/u/25322441?s=460&v=4";
    },
    toJSON() {
      console.log(JSON.stringify(this.canvas))
      // this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas))
    }
  },
  mounted() {
    this.myFabric.namedImage()
    this.$nextTick(function() { // dom已更新
      var canvas = new fabric.Canvas('canvas');
      canvas.setWidth(500)
      canvas.setHeight(500)

      this.canvas = canvas

      this.addimg("https://avatars3.githubusercontent.com/u/25322441?s=460&v=4", 0, 0)
      this.addimg(imgSrc, 200, 200)
      this.addimg('/static/bfl-img/2.png', 350, 350)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas{border:1px solid red;}
.btn {display: inline-block; padding: 4px 6px; border: 1px solid black; margin-top: 10px; cursor: pointer;}
</style>
