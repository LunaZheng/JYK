function myText() {
  fabric.MyText = fabric.util.createClass(fabric.Text, { // 继承默认类
    type: 'my-text',
    initialize: function(element, options) {
      this.callSuper('initialize', element, options)
      options && this.set('name', options.name)
      options && this.set('layerIdx', options.layerIdx)
    },
    toObject: function() { // 这是fabric中对象序列化的基石
      return fabric.util.object.extend(this.callSuper('toObject'), {
        name: this.name,
        layerIdx: this.layerIdx,
      })
    },
  })

  /*// 这样 loadFromJSON 将知道在JSON解析期间调用哪个方法
  fabric.MyText.fromObject = function(object, callback) {
    // console.log(object)
    fabric.util.loadImage(object.src, function(img) {
      callback && callback(new fabric.MyText(img, object));
    });
  };*/

  // 指定LabeledRect是一个异步的'类'，意思是它的fromObject不返回一个实例，而是传递给一个回调
  fabric.MyText.async = true;
}
    