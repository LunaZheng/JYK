function myText() {

  function parseDecoration(object) {
    if (object.textDecoration) {
      object.textDecoration.indexOf('underline') > -1 && (object.underline = true);
      object.textDecoration.indexOf('line-through') > -1 && (object.linethrough = true);
      object.textDecoration.indexOf('overline') > -1 && (object.overline = true);
      delete object.textDecoration;
    }
  }

  fabric.myText = fabric.util.createClass(fabric.Text, fabric.Observable, {
    type: 'my-text',
    initialize: function(text, options) {
      this.callSuper('initialize', text, options);
      options && this.set('name', options.name)
      options && this.set('layerIdx', options.layerIdx)
    },
    toObject: function() { // 这是fabric中对象序列化的基石
      return fabric.util.object.extend(this.callSuper('toObject'), {
        name: this.name,
        layerIdx: this.layerIdx,
      })
    },
    _render: function(ctx) {
      this.callSuper('_render', ctx);
    },
  });

  /* 从对象表示返回 fabric.myText 实例 */
  fabric.myText.fromObject = function(object, callback) {
    parseDecoration(object);
    if (object.styles) {
      for (var i in object.styles) {
        for (var j in object.styles[i]) {
          parseDecoration(object.styles[i][j]);
        }
      }
    }
    fabric.Object._fromObject('myText', object, callback, 'text');
  };
}
    