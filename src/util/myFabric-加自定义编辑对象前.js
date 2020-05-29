import $fabric from 'fabric'

// 自定义 fabric 对象
export default {
    namedImage: function() {
      $fabric.fabric.NamedImage = $fabric.fabric.util.createClass(fabric.Image, { // 继承默认类
        type: 'named-image',
        initialize: function(element, options) {
          this.callSuper('initialize', element, options)
          options && this.set('name', options.name)
          // console.log(options)
          options && this.set('clipObj', options.clipObj)
          options && this.set('id', options.id)
        },
        toObject: function() { // 这是fabric中对象序列化的基石
          return fabric.util.object.extend(this.callSuper('toObject'), {
            name: this.name,
            clipObj: this.clipObj,
            id: this.id,
          })
        },
        myClipTo: function(ctx) {
          this.setCoords() // 在对象centering之后调用对象的setCoords来更新控件区域)
          var scaleXTo1 = (1 / this.scaleX);
          var scaleYTo1 = (1 / this.scaleY);
          var ctxWidth = this.clipObj.width - this.clipObj.strokeWidth;
          var ctxHeight = this.clipObj.height - this.clipObj.strokeWidth;
          var ctxLeft = -(this.width / 2) + this.clipObj.strokeWidth;
          var ctxTop = -(this.height / 2) + this.clipObj.strokeWidth;
          ctx.save()
          ctx.translate(ctxLeft, ctxTop)
          ctx.scale(scaleXTo1, scaleYTo1)
          ctx.rotate((this.angle * -1) * (Math.PI / 180))

          // Polygon多边形
          // instanceof --> clipObj在不在 fabric.Polygon 构造函数中, 返回布尔值
          var isPolygon = this.clipObj instanceof fabric.Polygon || this.clipObj.type == 'polygon'; 
          // polygon cliping area
          if (isPolygon) {
            ctx.translate(
              - this.clipObj.left - ctxWidth / 2 - this.clipObj.strokeWidth, 
              - this.clipObj.top - ctxHeight / 2 - this.clipObj.strokeWidth

              /*// originX 改为 center 后
              - this.clipObj.left - ctxWidth - this.clipObj.strokeWidth, 
              - this.clipObj.top - ctxHeight - this.clipObj.strokeWidth*/
            );
            var points = [];
            for (var i in this.clipObj.points) {
              points.push({
                x: (this.clipObj.left + this.clipObj.width / 2) + this.clipObj.points[i].x - this.oCoords.tl.x,
                y: (this.clipObj.top + this.clipObj.height / 2) + this.clipObj.points[i].y - this.oCoords.tl.y
              });
            }
            ctx.beginPath()
            ctx.moveTo(points[0].x + this.clipObj.left, points[0].y+ this.clipObj.top);
            for (i = 1; i < points.length; ++i) {
              ctx.lineTo(points[i].x + this.clipObj.left, points[i].y + this.clipObj.top);
            }
            ctx.lineTo(points[0].x + this.clipObj.left, points[0].y+ this.clipObj.top);
            ctx.closePath();
            ctx.restore();
          }
          else { // rectangle cliping area
            ctx.rect(
              this.clipObj.left - this.oCoords.tl.x,
              this.clipObj.top - this.oCoords.tl.y,
              this.clipObj.width,
              this.clipObj.height
            );
            ctx.closePath();
            ctx.restore();
          }
        },
        // _render: function(e) { // 渲染的时候
        //   console.log(e)
        //   // this.callSuper('_render', e);
        //   // console.log(e)
        //   // console.log(this)
        //   // // console.log(canvas.toDataURL())
        //   // e.fillStyle='yellow';
        //   // e.fillRect(0,0,80,100);
        // }
      })

      // 这样 loadFromJSON 将知道在JSON解析期间调用哪个方法
      $fabric.fabric.NamedImage.fromObject = function(object, callback) {
        // console.log(object)
        $fabric.fabric.util.loadImage(object.src, function(img) {
          callback && callback(new $fabric.fabric.NamedImage(img, object));
        });
      };

      $fabric.fabric.NamedImage.fromURL = function(url, callback, imgOptions) {
        $fabric.fabric.util.loadImage(url, function(img) {
          callback && callback(new $fabric.fabric.NamedImage(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
        // }, null, imgOptions && imgOptions.crossOrigin);
      }

      // 指定LabeledRect是一个异步的'类'，意思是它的fromObject不返回一个实例，而是传递给一个回调
      $fabric.fabric.NamedImage.async = true;
    },
    /*mySetBackgroundImage: function() {
      $fabric.fabric.MySetBackgroundImage = $fabric.fabric.util.createClass(fabric.setBackgroundImage, { // 继承默认类
        type: 'background-image',
        initialize: function(element, options) {
          this.callSuper('initialize', element, options)
          options && this.set('name', options.name)
          options && this.set('id', options.id)
        },
        toObject: function() { // 这是fabric中对象序列化的基石
          return fabric.util.object.extend(this.callSuper('toObject'), {
            name: this.name,
            id: this.id,
          })
        },
      })
      $fabric.fabric.MySetBackgroundImage.fromObject = function(object, callback) {
        $fabric.fabric.util.loadImage(object.src, function(img) {
          callback && callback(new $fabric.fabric.MySetBackgroundImage(img, object));
        });
      };
      $fabric.fabric.MySetBackgroundImage.fromURL = function(url, callback, imgOptions) {
        $fabric.fabric.util.loadImage(url, function(img) {
          callback && callback(new $fabric.fabric.MySetBackgroundImage(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
      }
      $fabric.fabric.MySetBackgroundImage.async = true;
    },*/
}