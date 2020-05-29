export default {
  geom(grid, start) {
    var d3_geom_contourDx = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN],
        d3_geom_contourDy = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN];
    var s = start || this.d3_geom_contourStart(grid), // 起点
        pathData = [], // 轮廓路径
        x = s[0],  // 当前x位置
        y = s[1],  // 当前y位置 
        dx = 0,    // 下一个x方向 
        dy = 0,    // 接下来的y方向 
        pdx = NaN, // 先前的x方向 
        pdy = NaN, // 先前的y方向 
        i = 0; 

    do { 
      // 进行最小二乘法确定指标 
      i = 0; 
      if (grid(x-1, y-1)) i += 1; 
      if (grid(x,   y-1)) i += 2; 
      if (grid(x-1, y  )) i += 4; 
      if (grid(x,   y  )) i += 8; 
      // 确定下一个方向
      if (i === 6) { 
        dx = pdy === -1 ? -1 : 1; 
        dy = 0; 
      } else if (i === 9) { 
        dx = 0; 
        dy = pdx === 1 ? -1 : 1; 
      } else { 
        dx = d3_geom_contourDx[i]; 
        dy = d3_geom_contourDy[i]; 
      } 
      // 更新轮廓多边形
      if (dx != pdx && dy != pdy) { 
        pathData.push({
          "x": x, 
          "y": y
        })
        pdx = dx; 
        pdy = dy; 
      } 
      x += dx; 
      y += dy; 
    } while (s[0] != x || s[1] != y); 

    return pathData 
  },
  d3_geom_contourStart(grid) { // 搜索起点
    var x = 0,
        y = 0;
    // 沿着向外扩展的对角线继续 
    while (true) {
      if (grid(x, y)) {
        return [x, y]
      }
      if (x === 0) {
        x = y + 1
        y = 0
      } else {
        x = x - 1
        y = y + 1
      }
    }
  },
}
