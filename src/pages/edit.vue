<template>
  <div class="edit">
    <ul class="edit-list">
      <li class="edit-list-item" 
        v-for="(item, idx) in editList" 
        @mouseenter="hoverIn(idx)" 
        @mouseleave="hoverOut(idx)"
        @click="showList(idx, $event)"
        :class="{'on': idx === curShowListIdx}" 
      >
        <img :src="(idx === curChangeIconIdx || idx === curShowListIdx) ? ('/static/bfl-img/edit/' + item.tag + '-hover.svg') : ('/static/bfl-img/edit/' + item.tag + '.svg')" alt="" class="edit-list-icon">
        <span>{{item.name}}</span>
        <i class="icon-more"></i>
        <ul :class="'edit-' + item.tag + '-list item-list'" v-if="idx === curShowListIdx" :style="{'top': 40 * (idx + 1) + 'px', 'padding-top': '2px'}" @click="stopBubble">
          <li v-for="(v, i) in item.item" :class="{'on': i === 0}">
            <img draggable="true"
              :src="v.img" alt="" :title="i" 
              v-if="item.name != '文字' && item.name != '模板'"
              @dragstart="dragstart(item.name, $event)"
            >
            <div class="font-box" :title="v.font" 
              v-if="item.name === '文字'"
              draggable="true"
              @dragstart="dragstart(item.name, $event)"
              :style="{'font-family': v.font}"
            >
              <span>{{v.font}}</span>
              <span>English</span>
              <span>123456789</span>
            </div>
            <img draggable="true"
              :src="tempURL + v.thumb + '?imageView2/2/h/150'" alt="" :title="i" 
              v-if="item.name === '模板'"
              @dragstart="dragstart(item.name, $event)"
            >
            <h1 v-if="item.name === '模板'" style="margin-top: -12px; line-height: 20px">{{v.name}}</h1>
          </li>
          <li class="more" @click="isShowMore = true" style="padding-bottom: 0;">
            更多{{item.name}}
            <i class="el-icon-d-arrow-right"></i>
          </li>
        </ul>

        <!-- 更多 -->
        <el-dialog class="moreDialog dialogCSS" :visible="isShowMore && (idx === curShowListIdx)" width="73%" @closed="closeMore(idx)">
          <!--  :class="{'on': item.name == '模板'}" -->
          <div class="dialog-box" @click="stopBubble" :style="{'min-height': item.name == '模板' ? '760px' : '700px'}">
            <h1>
              <img :src="'/static/bfl-img/edit/' + curShowListIdx + '.png'" alt="">
              <span>选择{{item.name}}</span>
            </h1>
            <div class="box" v-if="item.name != '文字' && item.name != '装饰' && item.name != '模板'">
              <p class="select">
                请选择：
                <span>全选</span>&nbsp;&nbsp;
                <span>反选</span>&nbsp;&nbsp;
                <span class="on">无</span>
              </p>
              <ul class="main">
                <li v-for="(v, i) in item.item" :style="{'background-image': 'url(' + v.img + ')'}"></li><!-- 
                 --><li v-for="(v, i) in item.item" :style="{'background-image': 'url(' + v.img + ')'}"></li>
              </ul>
            </div>
            <div class="box" v-if="item.name == '文字'" style="border: none; padding: 0;">
              <ul class="main" style="height: 560px;">
                <li v-for="(v, i) in item.item" style="width: 15%; height: 90px;">
                  <div class="font-box" :title="v.font" :style="{'font-family': v.font}">
                    <span>{{v.font}}</span>
                    <span>English</span>
                    <span>123456789</span>
                  </div>
                </li>
              </ul>
              <div class="btn">
                <span>确定</span>
              </div>
            </div>
            <div v-if="item.name == '装饰'">
              <ul class="decorateMenu">
                <li v-for="(v, i) in decorateMenu" :class="{'on': i == curDecorateMenuIdx}" @click="curDecorateMenuIdx = i">{{v.name}}</li>
              </ul>
              <div class="box" style="width: auto; position: absolute; top: 66px; bottom: 20px; left: 279px; right: 50px;">
                <p class="select">
                  请选择：
                  <span>全选</span>&nbsp;&nbsp;
                  <span>反选</span>&nbsp;&nbsp;
                  <span class="on">无</span>
                </p>
                <ul class="main">
                  <li v-for="(v, i) in decorateMenu[curDecorateMenuIdx].list" :style="'background-image: url(' + v.img + ');'" style="width: 140px; height: 140px; margin: 0 30px 20px 0;"></li>
                </ul>
                <div class="btn">
                  <span style="margin-top: 0; position: relative; top: -10px;">确定</span>
                </div>
              </div>
            </div>
            <div class="box" v-if="item.name == '模板'" style="width: auto; position: absolute; left: 12px; right: 12px; bottom: 12px; top: 70px; padding: 0;">
              <ul class="filterList">
                <li>
                  <span class="type">主题：</span>
                  <ul class="item">
                    <li v-for="(v, i) in filterThemeList" :class="{'on': curFilterTheme == v}" @click="curFilterTheme = v">{{v}}</li>
                  </ul>
                </li>
                <li>
                  <span class="type">排序：</span>
                  <ul class="item">
                    <li v-for="(v, i) in filterSortList" :class="{'on': curFilterSort == v}" @click="curFilterSort = v">{{v}}</li>
                  </ul>
                </li>
              </ul>
              <div class="display-box">
                <i class="btn-icon icon-prev" @click="toPrevTemp"></i>
                <i class="btn-icon icon-next" @click="toNextTemp"></i>
                <div class="display">
                  <div class="left" :style="'background-image: url(' + tempList[curTempListidx].img + ');'"></div>
                  <div class="right">
                    <h1>{{tempList[curTempListidx].name}}</h1>
                    <p>本模板已累计下载<span>{{tempList[curTempListidx].downloadNum}}</span>次</p>
                    <div class="btn-box">
                      <span class="on">选择模板</span>
                      <span>作品预览</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="temp-box">
                <i class="btn-icon icon-prev" @click="toPrevTemp"></i>
                <i class="btn-icon icon-next" @click="toNextTemp"></i>
                <div class="tempList-box">
                  <ul class="tempList">
                    <li v-for="(v, i) in tempList">
                      <div class="imgBox" :class="{'on': curTempListidx == i}" :style="'background-image: url(' + v.img + ');'" @click="curTempListidx = i"></div>
                      <p class="ellipsis">{{v.name}}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </li>
      <a href="javascript:;" class="file" @click="openAddPics">添加照片</a>
    </ul>

    <div class="edit-content">
      <div class="edit-top-bor">
        <ul class="edit-left">
          <li class="undo" @click="undo">
            <a href="javascript:"><i class="icon-undo"></i>撤销</a>
          </li>
          <li class="redo" @click="redo">
            <a href="javascript:"><i class="icon-redo"></i>恢复</a>
          </li>
          <li @click="toView">
            <a href="javascript:"><i class="icon-eye"></i>预览</a>
          </li>
          <!-- <li>
            <span class="btn" @click="lastSave = true">先保存</span>
          </li> -->
          <li>
            <span class="btn" @click="isSingle = true">单页编辑</span>
          </li>
          <li>
            <span class="btn" @click="isSingle = false">双页编辑</span>
          </li>
          <li>
            <span class="btn" @click="toJson">toJSON</span>
          </li>
        </ul>
        <ul class="edit-right">
          <li @click="toKnowPrice">
            <a href="javascript:"><i class="icon-cion"></i>了解价格</a>
          </li>
          <li @click="toSave">
            <a href="javascript:"><i class="icon-save"></i>保存</a>
          </li>
          <li @click="addCart">
            <a href="javascript:"><i class="icon-shopping_cart"></i>加入购物车</a>
          </li>
        </ul>
      </div>

      <i class="btn-icon icon-prev" @click="toPrevPage"></i>
      <i class="btn-icon icon-next" @click="toNextPage"></i>
      <div class="canvas-box">
        <div>
          <!-- <fabricBox v-show="isSingle" :curDragDecorate="curDragDecorate"></fabricBox> -->
          <fabricBox v-if="isSingle" idName="canvasSingle" ref="fabricBox1" :isSingle="isSingle" :deskScale="deskScale" :tempURL="tempURL" :pageData="pageJsonData" :filePicData="filePicData" :dragData="dragData" :fontData="fontData" @getIsInitOver="getIsInitOver" @getSaveData="getSaveData" @hiddenPic="hiddenPic" @getIsFilled="getIsFilled" @changeTemp="changeTemp"></fabricBox>
          <fabricBox v-if="!isSingle" idName="fabricBoxDouble" ref="fabricBox2" :isSingle="isSingle" :deskScale="deskScale" :tempURL="tempURL" :pageData="pageJsonData" :filePicData="filePicData" :dragData="dragData" :fontData="fontData" @getIsInitOver="getIsInitOver" @getSaveData="getSaveData" @hiddenPic="hiddenPic" @getIsFilled="getIsFilled" @changeTemp="changeTemp"></fabricBox>
        </div>
      </div>
      <div class="edit-bottom">
        <div class="btn-box">
          <div class="btn-left">
            <a class="pic-btn" :class="{'on': !isShowPage}" @click="isShowPage = false">照片</a>
            <a class="page-btn" :class="{'on': isShowPage}" @click="isShowPage = true">页面</a>
            <span class="totalPage">共计{{isShowPage ? filePageData.length : filePicData.length}} 张{{isShowPage ? '页面' : '图片'}}</span>
          </div>
          <ul class="btn-right">
            <li href="javascript:"><img src="/static/bfl-img/edit/delTemp.svg" alt="">删除模板</li>
            <!-- <li href="javascript:" @click="isAllFill = true"><img src="/static/bfl-img/edit/allFill.svg" alt="">整本填充</li> -->
            <li href="javascript:" @click="allPageFill"><img src="/static/bfl-img/edit/allFill.svg" alt="">整本填充</li>
            <li href="javascript:" @click="onePageFill"><img src="/static/bfl-img/edit/singleFill.svg" alt="">单页填充</li>
            <li href="javascript:" @click="openAddPics"><img src="/static/bfl-img/edit/addPic.svg" alt="">添加照片</li>
            <li href="javascript:" @click="delPic"><img src="/static/bfl-img/edit/delPic.svg" alt="">删除照片</li>
            <li href="javascript:"><input type="checkbox" id="hiddenPic" @input="hiddenPicClick"><label for="hiddenPic">隐藏已用照片</label></li>
          </ul>
        </div>
        <div class="btn-list">
           
        </div>
        <div class="pic-box">
          <i class="btn-icon icon-prev" v-show="isShowPage" @click="prevPic"></i>
          <i class="btn-icon icon-next" v-show="isShowPage" @click="nextPic"></i>
          <div class="img-list">
            <ul class="ul1 pics-box" v-show="!isShowPage">
              <li class="pics" v-for="(img, idx) in filePicData" v-show="!(isHiddenPics && img.isUsed)">
                <img height="78" draggable="true" 
                  :src="img.src + '?imageView2/2/w/400'" alt="" :clsaa="'img' + idx" 
                  :title="img.name" 
                  @dragstart="dragstart('照片', $event)"
                  @click="chosePic"
                />
                <h1 class="ellipsis" :title="img.name">{{img.name}}</h1>
                <i class="el-icon-success" :class="{'on': img.isUsed}"></i>
              </li>
            </ul>
            <ul class="ul1 pages-box" v-show="isShowPage">
              <li class="pages" v-for="(page, idx) in filePageData">
                <ul class="pageBox" v-if="idx % 2 == 0 && !isSingle" @click="curPages = idx" :class="{'on': curPages == idx}">
                  <li class="item" style="display: inline-block;">
                    <img height="60" :src="tempURL + filePageData[idx].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
                    <!-- <p v-if="filePageData[idx].index == 0">封底(1)</p>
                    <p v-if="filePageData[idx].index == 1">封面(2)</p>
                    <p v-if="filePageData[idx].index == 2">扉页</p>
                    <p v-if="filePageData[idx].index > 2">{{filePageData[idx].index}}页</p> -->
                    <p>{{filePageData[idx].name}}</p>
                  </li><!-- 
                   --><li class="item" style="display: inline-block;">
                    <img height="60" :src="tempURL + filePageData[idx + 1].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
                    <!-- [idx + 1] -->
                    <p>{{filePageData[idx + 1].name}}</p>
                  </li>
                </ul>
                <div v-if="isSingle" class="pageBox" @click="curPages = idx" :class="{'on': curPages == idx}">
                  <img height="60" :src="tempURL + filePageData[idx].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
                  <p>{{filePageData[idx].name}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 了解价格 -->
    <el-dialog class="priceDialog dialogCSS" :visible.sync="isShowPrice">
      <div class="konwPrice">
        <h1><img src="/static/bfl-img/edit/price.png" alt="">了解价格</h1>
        <p class="price-box">
          当前作品现价为：<span class="money">￥{{newPrice}}元</span>
        </p>
        <p class="price-box old">
          原价为：<span class="money">￥{{oldPrice}}元</span>
        </p>
        <p>
          <span class="btn" @click="isShowPrice = false">确 定</span>
        </p>
      </div>
    </el-dialog>
    <!-- 加入购物车 -->
    <el-dialog class="addCartDialog dialogCSS" :visible.sync="isShowAddCart">
      <div class="unfinished" v-if="unfinishedList.length > 0">
        <h1>
          <img src="/static/bfl-img/common/write.png" alt="">
          未编辑页面列表
        </h1>
        <p class="tip">
          以下页面未编完成！请完成后,再放入购物车！
        </p>
        <ul class="box">
          <li v-for="itemList in unfinishedList">
            <span v-for="(item, idx) in itemList">{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="finished" v-if="unfinishedList.length == 0">
        <p class="price-box">
          <i class="el-icon-success"></i>成功加入购物车！
        </p>
        <p>
          <span class="btn" @click="isShowAddCart = false">确 定</span>
        </p>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog class="bigImgDialog" :visible.sync="innerVisible">
      <div class="loading-box" v-if="isImgLoading">
        <i class="el-icon-loading"></i><br>
        <span>loading...</span>
      </div>
      <img class="maskImg" :src="curViewPicUrl" alt="" @load="isImgLoading = false">
    </el-dialog>
    <!-- 添加图片 - 模态框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="74%">
      <div class="nemu-box">
        <p class="til">
          <img src="/static/bfl-img/edit/picWall.svg" alt="">
          我的照片
        </p>
        <ul class="nemuList">
          <li v-for="(item, idx) in picFoldersList">
            <img src="/static/bfl-img/edit/file.svg" alt="">
            <span>{{item.value}} (6)</span>
          </li>
        </ul>
      </div>
      <div class="pics-box">
        <div class="tab-box">
          <span class="tab" :class="{'on': curPicTab == 1}" @click="curPicTab = 1">我的照片</span>
          <span class="tab" :class="{'on': curPicTab == 2}" @click="curPicTab = 2">上传照片</span>
        </div>
        <div class="main" v-if="curPicTab == 1">
          <div class="top" style="position: relative; padding: 20px 0 12px;" v-show="!isPicListLoading">
            <span class="tip" style="width: 90%;" v-show="picListData.length > 0">单击选择图片，双击预览</span>
            <span class="tip" style="width: 100%;" v-show="picListData.length < 1">
              暂无照片，去上传 
              <h1 style="display: inline-block; font-size: 36px; vertical-align: top;">☞</h1>
              <a href="javascript:;" class="file btn" style="float: none; line-height: 18px;" @click="curPicTab = 2">上传照片</a>
            </span>
            <div style="position: absolute; right: 10px; top: 26px;" v-show="picListData.length > 0">
              <div class="checkbox-box" @click="checkedAll">
                <i :class="{'el-icon-check': isCheckedAll}" style="top: -1px;"></i>
                <input id="checkbox" type="checkbox" class="checkbox checkedAll">
                <label id="label" for="checkbox" style="margin-left: 30px;">全选</label>
              </div>
              <span class="btn del" @click="del"><i class="el-icon-delete"></i>删除</span>
            </div>
          </div>
          <div class="isLoading" v-show="isPicListLoading">
            <i class="el-icon-loading"></i>
            <span>加载中</span>
          </div>
          <ul class="picList" v-show="!isPicListLoading" @click="toggleCheck">
            <li v-for="(item, idx) in picListData">
              <div class="pic" :style="'background-image: url(' + item.imgpath + '?imageView2/2/w/105)'" :upid="item.upid" :filename="item.filename" :originSrc="item.imgpath" @dblclick="previewPic(item.imgpath)">
                <i class="el-icon-error" @click="deletePic(item.upid, item.filename)"></i>
              </div>
              <p class="ellipsis" :title="item.filename">{{item.filename}}</p>
            </li>
          </ul>
          <div class="footer">
            <span class="btn" @click="addPics">确定</span>
          </div>
        </div>
        <div class="main" v-if="curPicTab == 2">
          <div class="top">
            <p class="tip">一共
              <span class="num">{{updatePicsList.length}}</span>
              张照片,已上传
              <span class="num">{{picListData.length}}</span>
              张照片
            </p>
            <a href="javascript:;" class="file btn">上传照片
              <input type="file" name="" id="fileEL" multiple="" @change="updatePics">
            </a>
          </div>
          <div class="table-box">
            <!-- 表头需要固定的地方  -->
            <div class="table-head">
              <table>
                <thead>
                  <tr style="background: #ccc;">
                    <th>编号</th>
                    <th>缩略图</th>
                    <th width="200px">名称</th>
                    <th>大小</th>
                    <th width="150px">完成进度</th>
                    <th>操作</th>
                  </tr>
                </thead>
              </table>
            </div>
            <!-- 表体需要显示滚动条的地方  -->
            <div class="table-body">
              <table>
                <tr v-if="updatePicsList.length <= 0">
                  <td colspan="6">
                    <span>暂无照片上传</span>
                  </td>
                </tr>
                <tr v-if="updatePicsList.length > 0" v-for="(item, idx) in updatePicsList">
                  <td>{{item.code}}</td>
                  <td>
                    <img height="40" :src="item.src" alt="">
                  </td>
                  <td width="200px">
                    <p class="picName ellipsis" :title="item.name">{{item.name}}</p>
                  </td>
                  <td>{{item.size}}kb</td>
                  <td width="150px">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" status="success"></el-progress>
                  </td>
                  <td>
                    <span class="todo btn" v-show="item.progress == 0" @click="updateOne">开始上传</span>
                    <span class="todo" v-show="item.progress < 100 && item.progress > 0">正在上传</span>
                    <span class="todo btn btn-text danger" v-show="item.progress == 100">
                      <i class="el-icon-delete" @click="delUpedPic(item)"></i>
                    </span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            <div class="saveLocation">
              <p class="til">选择要上传的位置</p>
              <div class="radio-box">
                <span class="name" @click="curSaveFolder = 1">
                  <i class="circular" :class="{'on': curSaveFolder == 1}"></i>
                  新建文件夹
                </span>
                <div class="el-box">
                  <el-input
                    size="small"
                    placeholder="请输入文件夹名称"
                    v-model="newFolderName"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="radio-box">
                <span class="name" @click="curSaveFolder = 2">
                  <i class="circular" :class="{'on': curSaveFolder == 2}"></i>
                  现有文件夹
                </span>
                <div class="el-box">
                  <el-select v-model="existFolders" clearable placeholder="请选择">
                    <el-option
                      size="small"
                      v-for="item in picFoldersList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <span class="btn" @click="updateAll">全部上传</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog class="viewDialog dialogCSS" :closeOnClickModal="false" :visible.sync="isShowView">
      <div class="viewBox" style="min-width: 800px;">
        <p class="tip" v-if="isShowTip">按【ESC】键退出预览
          <span @click="isShowTip = !isShowTip">朕知道了</span>
        </p>
        <i class="btn-icon btn-prev" @click="toPrevView"></i>
        <i class="btn-icon btn-next" @click="toNextView"></i>
        <div class="flipbook-viewport">
          <div class="container">
            <div class="flipbook" style="font-size: 0px;">
              <div v-for="(page, idx) in editedPageData">
                <fabricView :idName="'view' + idx" :deskScale="deskScale" :pageData="page" :tempURL="tempURL"></fabricView>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import tempData2 from '@/data/data.json'
import tempData1 from '@/data/deskData-2.json' // 单页编辑
import tempData2 from '@/data/deskData.json' // 双页编辑
// import tempData1 from '@/data/deskData.json' // 台历
import fabricBox from '@/components/fabricBox' // 相册-canvas组件
import fabricView from '@/components/fabricBox-view' // 相册-canvas组件

export default {
  name: 'edit',
  components: {
    fabricBox,
    fabricView
  },
  created() {
    // ******还原静态数据前*******
    /*this.$axios.get(this.sApi.template + '?t=font').then(response => {
      let res = response.data
      if(res.type == 1) {
        var data = res.data
        this.editList.forEach((itemList)=> {
          if(itemList.tag == 'template') {
            itemList.item = this.isSingle ? JSON.parse(JSON.stringify(tempData1.tplInfos.page)) : JSON.parse(JSON.stringify(tempData2.tplInfos.page))
            this.curTempData = itemList.item
          } else if(itemList.tag == 'font') {
            itemList.item = data
            this.fontData = data
          }
        })
      }
    })*/
    $(document.body).on('drop', (e)=> {
      e.preventDefault();
      this.stopBubble(e) // e.stopPropagation();
    })
  },
  data () {
    return {
      editList: [ // 左侧编辑列表内容
        {
          tag: 'template',
          name: '模板',
          item: [{
            img: '/static/bfl-img/edit/temp/temp01.png',
            title: '封面'
          }, {
            img: '/static/bfl-img/edit/temp/temp02.png',
            title: '1页'
          }, {
            img: '/static/bfl-img/edit/temp/temp03.png',
            title: '2页'
          }, {
            img: '/static/bfl-img/edit/temp/temp02.png',
            title: '3页'
          }, {
            img: '/static/bfl-img/edit/temp/temp03.png',
            title: '4页'
          }]
        }, {
          tag: 'font',
          name: '文字',
          item: [{
            img: '/static/bfl-img/edit/font01.png',
            title: 'STXingkai 华文行楷'
          }, {
            img: '/static/bfl-img/edit/font02.png',
            title: 'STXinwei 华文新魏'
          }, {
            img: '/static/bfl-img/edit/font03.png',
            title: 'STLiti 华文隶书'
          }, {
            img: '/static/bfl-img/edit/font01.png',
            title: 'STHupo 华文琥珀'
          }, {
            img: '/static/bfl-img/edit/font02.png',
            title: 'STCaiyun 华文彩云'
          }, {
            img: '/static/bfl-img/edit/font03.png',
            title: 'FZYaoti 方正姚体'
          }, {
            img: '/static/bfl-img/edit/font01.png',
            title: 'Delicious'
          }, {
            img: '/static/bfl-img/edit/font02.png',
            title: 'Hoefler Text'
          }, {
            img: '/static/bfl-img/edit/font03.png',
            title: 'STXinwei'
          }]
        }, {
          tag: 'bg',
          name: '背景',
          item: [{
            img: '/static/bfl-img/edit/bg/bg-null.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg01.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg02.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg03.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg01.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg02.png'
          }]
        }, {
          tag: 'pic',
          name: '图片',
          item: [{
            img: '/static/bfl-img/edit/bg/bg01.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg02.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg03.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg01.png'
          }, {
            img: '/static/bfl-img/edit/bg/bg02.png'
          }]
        }, {
          tag: 'decorate',
          name: '装饰',
          item: [{
            img: '/static/bfl-img/edit/decorate/decorate01.png'
          }, {
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          }, {
            img: '/static/bfl-img/edit/decorate/decorate03.png'
          }, {
            img: '/static/bfl-img/edit/decorate/decorate04.png'
          }, {
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          }]
        }, {
          tag: 'layout',
          name: '布局',
          item: [{
            img: '/static/bfl-img/edit/layout/layout01.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout02.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout03.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout04.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout05.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout06.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout01.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout02.png'
          }, {
            img: '/static/bfl-img/edit/layout/layout03.png'
          }]
        }
      ],
      fontData: '', // 字体数据
      isShowMore: false, // 跟多
      /*canvasPrev: '',
      canvasNext: '',*/
      /*pagePrevData: '',
      pageNextData: '',*/
      cPath: '',
      filePageData: [], // 页面内容
      filePicData: [], // '添加照片'的file数据
      curShowListIdx: -1, // 当前左侧列展开的项 idx
      curChangeIconIdx: -1, // 当前左侧列 icon 触发的 idx
      isShowPage: false,
      tempData1: tempData1, // 单页
      tempData2: tempData2, // 双页
      curPages: 0,
      clipPrevPathData: [],
      clipNextPathData: [],
      // curDragDecorate: '', // 当前拖拽的装饰图片
      curFabricBox: '',
      isDisable: false, // 防止重复点击
      imgListScrollLeft: 0,
      // lastSave: false,
      token: '',
      dialogFormVisible: false, // 添加照片
      picFoldersList: [
        {value: '2018-08-02', label: '2018-08-02'},
        {value: '2018-08-03', label: '2018-08-03'},
        {value: '2018-08-04', label: '2018-08-04'},
      ],
      curPicTab: 1,
      curSaveFolder: 1,
      newFolderName: '',
      existFolders: '',
      picListData: '',
      innerVisible: false, // 图片预览
      isImgLoading: true, // 图片预览-loading
      curViewPicUrl: '', // 图片预览路径
      isPicListLoading: true,
      updatePicsList: [], // 上传照片的本地数据
      isCutImg: false, // 是否裁剪图片
      curCutImg: '', // 剪切图片的数据true
      isShowPrice: false, // 了解价格
      newPrice: 58.00, // 现价
      oldPrice: 88.00, // 原价
      isShowAddCart: false, // 加入购物车
      unfinishedList: [
        ['封底(1)', '封面(2)'],
      ],
      decorateMenu: [
        {
          name: '卡通',
          list: [{
            img: '/static/bfl-img/edit/decorate/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          }]
        }, {
          name: '可爱',
          list: [{
            img: '/static/bfl-img/edit/decorate/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate03.png'
          }]
        }, {
          name: '爱心',
          list: [{
            img: '/static/bfl-img/edit/decorate/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          }]
        }, {
          name: '花纹',
          list: [{
            img: '/static/bfl-img/edit/decorate/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate/decorate02.png'
          }]
        }
      ], // 更多装饰
      curDecorateMenuIdx: 3, // 更多装饰-菜单
      filterThemeList: ['全部', '时尚', '旅途有你', '亲亲宝贝', '浪漫婚纱', '时尚美眉'],
      filterSortList: ['时间', '浏览', '下载量'],
      curFilterTheme: '全部', // 更多模板-主题
      curFilterSort: '时间', // 更多模板-排序
      tempList: [
        {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-00.png'
        }, {
          name: '育儿家园',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-01.png'
        }, {
          name: '聪明宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-02.png'
        }, {
          name: '漂亮宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-03.png'
        }, {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-04.png'
        }, {
          name: '婚礼杂志册',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-03.png'
        },{
          name: '育儿家园',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-01.png'
        }, {
          name: '聪明宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-02.png'
        }, {
          name: '漂亮宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-03.png'
        }, {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-04.png'
        }, {
          name: '婚礼杂志册',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-03.png'
        },{
          name: '育儿家园',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-01.png'
        }, {
          name: '聪明宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-02.png'
        }, {
          name: '漂亮宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-03.png'
        }, {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-04.png'
        }, {
          name: '婚礼杂志册',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/more/temp-03.png'
        }
      ],
      curTempListidx: 0, // 更多模板-list
      isSingle: false, // 单页编辑
      isCheckedAll: false, // 添加照片-是否全选
      choseArr: [], // 选中
      oFileArr: [], // 上传的文件数据
      pageJsonData: [], // 单&双页编辑数据
      isAllFill: false, // 整本填充
      isSaveFinished: false, // 已完成保存
      isSaveUnfinished: false, // 未完成保存
      layerLen: 0, // 数据最多layer数-->用于防止点击过快
      oldPagesIdx: -1, // curPages 上一页 idx
      deskScale: 0,
      loadCanvas: '', // 撤销恢复后的数据
      isInitOver: false, // fabric 初始加载完成 - 防止未加载完毕点击下一页
      isShowView: false, // 预览
      isShowTip: true,
      editedPageData: '', // 编辑后的str数据
      isHiddenPics: false, // 是否隐藏已用照片
      saveData: '',
      isFilled: false, // 页面是否填充完毕
      changeTempIdx: -1, // 替换模板idx
      changeBgIdx: -1, // 替换背景idx
      curTempData: '', // 原始左侧menu模板数据
      dragData: '', // 拖拽数据
      tempURL: "http://img.res.j-ink.cn/", // 模板里素材的url
    }
  },
  watch: {
    curPages(newVal, oldVal) {
      this.isInitOver = false
      this.oldPagesIdx = oldVal
      this.$router.push({path: '/edit', query: {'curPages': newVal}})
      if(this.isSingle) { // 单页编辑
        this.layerLen = this.filePageData[this.curPages].layer.length > this.layerLen ? this.filePageData[this.curPages].layer.length : this.layerLen
        this.pageJsonData = this.filePageData[newVal]
      } else { // 双页编辑
        let len = this.filePageData[this.curPages].layer.length + this.filePageData[this.curPages * 1 + 1].layer.length
        this.layerLen = len > this.layerLen ? len : this.layerLen
        // console.log(this.layerLen)
        this.pageJsonData = []
        this.pageJsonData = [this.filePageData[this.curPages], this.filePageData[this.curPages * 1 + 1]]
      }
    },
    curTempListidx(newVal, oldVal) {
      var ul = $('.tempList')
      var pages = ul.children()
      var curPage = $(pages[newVal + 1])
      if(newVal > oldVal) {
        if(newVal < (pages.length - 1)) {
          newVal += 1
          var curPageOffW = curPage.offset().left - ul.offset().left + curPage.width()
          if(curPageOffW > ul.width()) {
            var scrollLeft = ul.scrollLeft()
            ul.scrollLeft(scrollLeft + curPage.width() + 20)
          }
        }
      } else {
        if(newVal > 0) {
          newVal -= 1
          var curPageOffW = curPage.offset().left - ul.offset().left - curPage.width()
          if(curPageOffW <= curPage.width()) {
            var scrollLeft = ul.scrollLeft()
            ul.scrollLeft(scrollLeft - curPage.width() - 20)
          }
        }
      }
    },
    isShowPage(newVal) {
      this.$nextTick(function() {
        if(newVal) {
          var ulW = $('.ul1.pages-box').width()
          var liW = $('.ul1.pages-box li.pages').width()
          var curLiW = liW * (this.curPages*1 + 1)
          if(curLiW > ulW) {
            this.imgListScrollLeft = curLiW - liW * 2
          }
          $('.img-list').scrollLeft(this.imgListScrollLeft)
        }
      })
    },
    isSaveFinished() {
      const h = this.$createElement;
      this.$msgbox({
        title: '已完成该相册作品，放入已完成作品列表',
        message: h('p', null, [
          h('span', {style: 'font-size: 16px; line-height: 110px; display: inline-block; padding-left: 100px;'}, '我的相册'),
          h('input', {style: 'width: 280px; border: 1px solid #bbb; line-height: 38px; margin-left: 12px; margin-right: 100px; padding: 0 10px;'}, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        });
      });
    },
    isSaveUnfinished() {
      const h = this.$createElement;
      this.$msgbox({
        title: '未完成该相册作品，放入未完成作品列表',
        message: h('p', null, [
          h('span', {style: 'font-size: 16px; line-height: 110px; display: inline-block; padding-left: 100px;'}, '我的相册'),
          h('input', {style: 'width: 280px; border: 1px solid #bbb; line-height: 38px; margin-left: 12px; margin-right: 100px; padding: 0 10px;'}, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        });
      });
    },
    isSingle(newVal) {
      // ----------------------------
      this.editList.forEach((itemList)=> {
        if(itemList.tag == 'template') {
          itemList.item = this.isSingle ? JSON.parse(JSON.stringify(tempData1.tplInfos.page)) : JSON.parse(JSON.stringify(tempData2.tplInfos.page))
          this.curTempData = itemList.item
        }
      })
      // ----------------------------
      this.deskScale = ($('.canvas-box').height() / this.filePageData[0].pageheight * 0.88).toFixed(2)
      let deskScaleW = ($('.canvas-box').width() / this.filePageData[0].pagewidth / 2 * 0.88).toFixed(2)
      this.deskScale = this.deskScale > deskScaleW ? deskScaleW : this.deskScale 
      /*if(newVal) {
        this.deskScale = 0.25
      } else {
        // this.deskScale = ($('.canvas-box').width() / this.filePageData[0].pagewidth / 2 * 0.88).toFixed(2)
        this.deskScale = ($('.canvas-box').height() / this.filePageData[0].pageheight * 0.88).toFixed(2)
        // console.log(this.deskScale)
      }*/
      this.curPages = 0
      this.changeData()
    },
    $route(to, from){
      // console.log(to, from);
      if(to.query.curPages) this.curPages = to.query.curPages
    },
    isAllFill(newVal) { // 整本填充
      if(this.isSingle) {
        this.$refs.fabricBox1.isWatchFilled = newVal ? true : false
        this.$refs.fabricBox1.sortObjs()
      } else {
        this.$refs.fabricBox2.isWatchFilled = newVal ? true : false
        this.$refs.fabricBox2.sortObjs()
      }
    },
    isInitOver(newVal) {
      if(this.isAllFill && newVal) {
        this.onePageFill()
      }
    },
    isFilled(newVal) {
      if(newVal && this.isAllFill) {
        if(this.curPages >= (this.filePageData.length - 2)) {
          this.isAllFill = false
          this.$alert('填充成功', '提示', {
            type: 'success',
            confirmButtonText: '确定',
            callback: action => {}
          })
        } else {
          console.log('isFill-next')
          this.curPages = this.isSingle ? this.curPages*1 + 1 : this.curPages*1 + 2
        }
      }
    },
    deep: true 
  },
  methods: {
    stopBubble(e) { // 禁止事件冒泡
      if ( e && e.stopPropagation ) {
        e.stopPropagation();  // 非IE浏览器
      } else {
        window.event.cancelBubble = true;  // IE取消事件冒泡 
      }
    },
    hoverIn(idx) {
      this.curChangeIconIdx = idx
    },
    hoverOut(idx) {
      this.curChangeIconIdx = -1
    },
    showList(idx, e) {
      if(this.curShowListIdx != idx) {
        this.curShowListIdx = idx
        this.curChangeIconIdx = idx
      } else {
        this.curShowListIdx = -1
        this.curChangeIconIdx > 0 ? idx : -1
      }
      if(this.curShowListIdx != 1) {
        // this.isAddtext = false
      }
    },
    closeMore(idx) {
      this.isShowMore = false
      this.curShowListIdx = idx
    },
    // allowDrop(e) {},
    dragstart(name, e) { // @dragstart: 在用户开始拖动元素时执行
      this.stopBubble(e)
      var dragData = ''
      if(name != '照片') {
        var li = $(e.target).closest('li')
        li.siblings().removeClass('on')
        li.addClass('on')
        switch (name) {
          case '模板': // 模板
            this.changeTempIdx = $(e.target).attr('title')
            dragData = {name: name}
            break
          case '文字': // 文字
            dragData = {
              name: name,
              data: $(e.target).attr('title')
            }
            break
          default: // 背景 图片 装饰 布局
            dragData = {
              name: name,
              data: $(e.target).attr('src')
            }
        }
      } else {
        dragData = {
          name: name,
          data: $(e.target).attr('src')
        }
      }
      if(dragData) {
        var bt = this.BrowserType()
        if(bt == 'FF') e.dataTransfer.setData('dragObj', JSON.stringify(dragData));
        this.dragData = dragData
      }
    },
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
    toPrevPage() {
      this.isAllFill = false
      this.curPages *= 1
      if(this.isDisable) { // 防止重复点击
        return
      } else {
        this.isDisable = true
        var ul = $('.pages-box')
        var pages = ul.children()
        var curPage = $(pages[this.curPages])
        if(this.curPages > 0) {
          if(this.isSingle) {
            this.curPages -= 1
          } else {
            this.curPages -= 2
          }
          var imgList = $('.img-list')
          var curPageOffW = curPage.offset().left - imgList.offset().left - curPage.width()
          if(curPageOffW <= curPage.width()) {
            var scrollLeft = imgList.scrollLeft()
            imgList.scrollLeft(scrollLeft - curPage.width())
            this.imgListScrollLeft = imgList.scrollLeft()
          }
        }
        setTimeout(() => {
          this.isDisable = false
        }, (this.layerLen + 1) * 16)
      }
    },
    toNextPage() {
      this.isAllFill = false
      if(this.isInitOver) {
        this.curPages *= 1
        if(this.isDisable) { // 防止重复点击
          return
        } else {
          this.isDisable = true
          var ul = $('.pages-box')
          var pages = ul.children()
          if(this.isSingle) {
            var curPage = $(pages[this.curPages * 1 + 1])
            if(this.curPages < (pages.length - 1)) {
              this.curPages += 1
              var imgList = $('.img-list')
              var curPageOffW = curPage.offset().left - imgList.offset().left + curPage.width()
              if(curPageOffW > imgList.width()) {
                var scrollLeft = imgList.scrollLeft()
                imgList.scrollLeft(scrollLeft + curPage.width())
                this.imgListScrollLeft = imgList.scrollLeft()
              }
            }
          } else {
            var curPage = $(pages[this.curPages + 2])
            if(this.curPages < (pages.length - 2)) {
              this.curPages += 2
              var imgList = $('.img-list')
              var curPageOffW = curPage.offset().left - imgList.offset().left + curPage.width()
              if(curPageOffW > imgList.width()) {
                var scrollLeft = imgList.scrollLeft()
                imgList.scrollLeft(scrollLeft + curPage.width())
                this.imgListScrollLeft = imgList.scrollLeft()
              }
            }
          }
          setTimeout(() => {
            this.isDisable = false
          }, (this.layerLen + 1) * 16)
        }
      }
    },
    toPrevTemp() {
      this.isAllFill = false
      if(this.isInitOver) {
        if(this.isDisable) { // 防止重复点击
          return
        } else {
          this.isDisable = true
          var ul = $('.tempList')
          var pages = ul.children()
          var curPage = $(pages[this.curTempListidx])
          if(this.curTempListidx > 0) {
            this.curTempListidx -= 1
            var curPageOffW = curPage.offset().left - ul.offset().left - curPage.width()
            if(curPageOffW <= curPage.width()) {
              var scrollLeft = ul.scrollLeft()
              ul.scrollLeft(scrollLeft - curPage.width() - 20)
            }
          }
          setTimeout(() => {
            this.isDisable = false
          }, (this.layerLen + 1) * 16)
        }
      }
    },
    toNextTemp() {
      this.isAllFill = false
      if(this.isDisable) { // 防止重复点击
        return
      } else {
        this.isDisable = true
        var ul = $('.tempList')
        var pages = ul.children()
        var curPage = $(pages[this.curTempListidx + 1])
        if(this.curTempListidx < (pages.length - 1)) {
          this.curTempListidx += 1
          var curPageOffW = curPage.offset().left - ul.offset().left + curPage.width()
          if(curPageOffW > ul.width()) {
            var scrollLeft = ul.scrollLeft()
            ul.scrollLeft(scrollLeft + curPage.width() + 20)
          }
        }
        setTimeout(() => {
          this.isDisable = false
        }, (this.layerLen + 1) * 16)
      }
    },
    prevPic(e) {
      if(this.isShowPage) {
        this.toPrevPage()
      }
    },
    nextPic(e) {
      if(this.isShowPage) {
        this.toNextPage()
      }
    },
    previewPic(url) { // 查看大图
      this.innerVisible = true
      this.curViewPicUrl = ''
      this.curViewPicUrl = url + '?imageView2/2/h/760'
    },
    toggleCheck(e) { // 单个
      var pic = $(e.target).closest('.pic')
      var pics = $('.picList .pic')
      if(pic.length > 0) {
        pic.toggleClass('on')
      } else {
        pics.removeClass('on')
      }
      this.choseArr = []
      var ckeckNum = 0
      pics.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.choseArr.push($(item))
          ckeckNum++
        }
      })
      this.isCheckedAll = ckeckNum == pics.length ? true : false
    },
    checkedAll(e) { // 全选
      var inputs = $('input.checkbox:not(.checkedAll)')
      var pics = $('.picList li .pic')
      this.isCheckedAll = !this.isCheckedAll
      if(this.isCheckedAll) {
        pics.addClass('on')
      } else {
        pics.removeClass('on')
      }
      this.choseArr = []
      pics.each((idx, item)=> {
        if($(item).hasClass('on')) {
          this.choseArr.push($(item))
        }
      })
    },
    updatePics(e) { // 添加照片
      this.curPicTab = 2
      var vm = this
      var target = e.target
      var filesData = target.files
      ;[].slice.call(target.files).forEach((oFile, idx)=> {
        // this.curUploadId = idx
        var src = URL.createObjectURL(oFile)
        var name = oFile.name
        // console.log(oFile)
        var code  = this.updatePicsList.length
        var obj = {
          code: '',
          src: src,
          name: name,
          size: (oFile.size / 1024).toFixed(0) * 1,
          progress: 0,
          upid: -1,
        }
        this.updatePicsList.push(obj)
        this.oFileArr.push({
          oFile: oFile,
          code: code++,
        })
      })
      // console.log(this.oFileArr)
      target.value = ''
    },
    updateOne(e) { // 开始上传(单个)
      var tr = $(e.target).closest('tr')
      var i = tr.index()
      if(this.oFileArr.length > 0) {
        this.oFileArr.forEach((item, idx)=> {
          if(i == item.code) {
            this.update(item.oFile, item.code)
            this.oFileArr.splice(idx, 1)
          }
        })
      }
    },
    updateAll() { // 全部开始上传
      // ...选择文件夹...

      this.oFileArr.forEach((item)=> {
        var file = item.oFile
        var idx = item.code
        this.update(file, idx)
      })
      this.oFileArr = []
    },
    update(file, idx) { // 上传单个图片文件
      let d = new Date();
      let type = file.name.split('.');
      let tokenParem = {
        'putPolicy': '{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
        'key': 'orderReview/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.valueOf() + '.' + type[type.length - 1],
        'bucket': this.sApi.qiniuUrl + '', //七牛的地址(外链)，这个是你自己配置的（变量）
      };
      this.updatePicsList[idx].code = d.Format('yyMMddhhmmss') + Math.floor(Math.random()*10)
      let param = new FormData(); //创建form对象
       //断点传输
      param.append('chunks', '1');
      param.append('file', file, file.name)
      // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let name = file.name + ''
      let config = {
        onUploadProgress: progressEvent => {
          var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
          this.updatePicsList[idx].progress = complete
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' // multipart/form-data
        }
      };
      //先从自己的服务端拿到token
      /*this.$axios.get('/token', this.qs.stringify(tokenParem))*/
      // this.$axios.get('/api/qiniu.html?t=qiniu', this.qs.stringify(tokenParem))
      this.$axios.get(this.sApi.qiniuToken + '?t=qiniu', this.qs.stringify(tokenParem)).then(response => {
        // console.log(response)
        if(response.status == 200) {
          this.token = response.data.data;
          param.append('token', this.token);
          this.uploading(param, config, idx, this.updatePicsList); //然后将参数上传七牛
          return;
        }
      })
    },
    uploading(param, config, idx, updatePicsList) { // 七牛处理 & 上传图片到服务器
      var name = param.get('file').name
      
      this.$axios.post(this.sApi.uploadQiniup, param, config).then(res1 => { // 上传图片到七牛
        if(res1.status == 200) {
          var key = res1.data.key // 上传图片成功后七牛返回的图片key
          var hash = res1.data.hash // 上传图片成功后七牛返回的图片hash\
          this.$axios.get(this.sApi.qiniuUrl + '/' + key + '?imageInfo').then(res2 => { // 从七牛获取图片基本信息
            if(res2.status == 200) {
              var imgInfo = res2.data
              let size = (imgInfo.size / 1024).toFixed(0) * 1
              var addParam = {
                'vipno': JSON.parse(this.getCookie('userInfo')).vipno, // 用户编号
                // 'vipno': 4, // 用户编号
                'pgid': 1, //图片分类编号,没有给-1
                // 'title': '', //图片分类编号,没有给-1
                'md5co': hash, //图片md5,唯一
                'ImgPath': this.sApi.qiniuUrl + '/' + key,
                'PrimitiveWidth': imgInfo.width, //图片宽度
                'PrimitiveHeight': imgInfo.height, //图片高度
                'FileName': name,
                'filesize': size, //图片大小,单位为kb
              }
              this.$axios.post(this.sApi.userphoto + '?t=add', addParam).then(response => {
                let res3 = response.data
                if(res3.type == 1) {
                  this.getUploadImgList()
                  updatePicsList[idx].upid = res3.data
                }
              })
            }
          })
        }
      })
    },
    getUploadImgList() {
      // ******还原静态数据前*******
      /*// this.dialogFormVisible = !this.dialogFormVisible
      var pics = $('ul.picList .pic')
      ;[].slice.call(pics).forEach((item, idx)=> {
        $(item).removeClass('on')
      })
      // 获取图片列表
      var params = {
        "vipno": JSON.parse(this.getCookie('userInfo')).vipno, // --用户编号,必须
        // "vipno": 4, // --用户编号,必须
        "key": "",   // --关键词(文件名/路径),默认为空
        "pageindex": 1, // --当前页码
        "pagesize": 50  // --每页显示数量
      }
      this.$axios.post(this.sApi.userphoto + '?t=search', params).then(response => {
        this.isPicListLoading = false
        let res = response.data
        if(res.type == 1) {
          this.picListData = res.data
        }
      })*/
      this.isPicListLoading = false
      this.picListData = [
        {
          "upid": 0,
          "imgpath": "http://use.photo.j-ink.cn/lhz7MMMTKwbh9zC9JdD0fZEOhPij",
          "filename": "40.4X65.4照片墙2.JPG"
        }, {
          "upid": 1,
          "imgpath": "http://use.photo.j-ink.cn/FmBogpun0Tx_jiOW-zqOy5XgfNSC",
          "filename": "不负如来不负卿2.png"
        }, {
          "upid": 2,
          "imgpath": "http://use.photo.j-ink.cn/FlP3HMDAv4nuh5DJIeLn-fz0kyZS",
          "filename": "cbed4ad9eb8d59235aa7fbd49b29bc9c37ce031fd5ede-LCQrip_fw658.png"
        }, {
          "upid": 3,
          "imgpath": "http://use.photo.j-ink.cn/FkmKkDzJUINDQthrgLkY8CQSXDHf",
          "filename": "timg2.jpg"
        }, {
          "upid": 4,
          "imgpath": "http://use.photo.j-ink.cn/FrnxDcTX69NlN8yu1RxuKVJKDRtl",
          "filename": "不负如来不负卿.png"
        }, {
          "upid": 5,
          "imgpath": "http://use.photo.j-ink.cn/FvACkvVCJzhP5AukQmmv9uymKTd_",
          "filename": "e411f7689b86d847408e8753323af39c8b710d3097a24-rd0Ilk_fw658.jpg"
        }, {
          "upid": 6,
          "imgpath": "http://use.photo.j-ink.cn/Fvs0mZc6XxCWI49SjnLouLyWLGmD",
          "filename": "萤火虫洞.jpg"
        }, {
          "upid": 7,
          "imgpath": "http://use.photo.j-ink.cn/FvzjTGhI9-FYD1NcQk7AhLq_BQMO",
          "filename": "a195890b5e82f3b7f321f667944495ddb9b650a9ba0af-fymFV7_fw658.jpg"
        }, {
          "upid": 8,
          "imgpath": "http://use.photo.j-ink.cn/Fj9kgD7FEdIEmCxN6d7S8Nv4XaIj",
          "filename": "test.jpg"
        }
      ]
    },
    delOnePic(upid) { // 删除单张照片
      this.$axios.get(this.sApi.userphoto + '?t=del&userid=' + JSON.parse(this.getCookie('userInfo')).vipno + '&upid=' + upid).then(response => {
        let res = response.data
        if(res.type == 1) {
          this.updatePicsList.forEach((item, idx)=> {
            if(item.upid == upid) {
              this.updatePicsList.splice(idx, 1)
            }
          })
          this.getUploadImgList()
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
      })
    },
    del() { // 选中单张/多张删除
      if(this.choseArr.length > 0) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.choseArr.forEach((item, idx)=> {
            var upid = item.attr('upid')
            var name = item.attr('filename')
            this.delOnePic(upid, name)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    deletePic(upid) { // 照片列表页面-(小红×)
      this.$confirm('是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delOnePic(upid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    delUpedPic(pic) { // 上传页面列表-(删除icon)
      this.$confirm('是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delOnePic(pic.upid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    openAddPics() { // 添加照片
      this.dialogFormVisible = !this.dialogFormVisible
      this.getUploadImgList()
    },
    addPics() { // 添加照片到底部拖拽栏
      var pics = $('ul.picList .pic')
      ;[].slice.call(pics).forEach((item, idx)=> {
        var pic = $(item)
        if(pic.hasClass("on")) {
          // console.log(pic)
          var src = pic.attr('originSrc')
          var name = pic.attr('filename')
          var obj = {
            src: src,
            name: name 
          }
          this.filePicData.unshift(obj)
        }
      })
      this.isCheckedAll = false
      this.dialogFormVisible = false
    },
    delPic(idx) {
      let chosePics = [].slice.call($('.ul1 li.pics.on'))
      if(chosePics.length > 0) {
        for (let i = chosePics.length - 1; i >= 0; i--) { // 逆向循环 --> 一次性删除数组中的多个元素
          this.filePicData.splice($(chosePics[i]).index(), 1);
        }
        $('.ul1 li.pics').removeClass('on')
      } else {
        this.$alert('请点击选择您要删除的照片', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
        });
      }
    },
    chosePic(e) {
      // $(e.target).closest('li').siblings().removeClass('on')
      var li = $(e.target).closest('li')
      li.toggleClass('on')
    },
    getSaveData(val) {
      this.saveData = val
      if(this.isSingle) {
        if(this.filePageData[this.curPages].name == val.name) this.filePageData[this.curPages] = val
      } else {
        // console.log(val[0].layer, val[1].layer)
        if(this.filePageData[this.curPages].name == val[0].name) this.filePageData[this.curPages] = val[0]
        if(this.filePageData[this.curPages * 1 + 1].name == val[1].name) this.filePageData[this.curPages * 1 + 1] = val[1]
      }
      this.editedPageData = JSON.parse(JSON.stringify(this.filePageData))
    },
    undo() { // 撤销
      if(this.isSingle) {
        this.$refs.fabricBox1.undo()
      } else {
        this.$refs.fabricBox2.undo()
      }
    },
    redo() { // 恢复
      if(this.isSingle) {
        this.$refs.fabricBox1.redo()
      } else {
        this.$refs.fabricBox2.redo()
      }
    },
    changeData() {
      if(this.isSingle) { // 单页编辑
        var data = this.tempData1.tplInfos.page
        this.filePageData = JSON.parse(JSON.stringify(data)) // 台历
        this.layerLen = this.filePageData[this.curPages].layer.length > this.layerLen ? this.filePageData[this.curPages].layer.length : this.layerLen
        this.pageJsonData = this.filePageData[this.curPages]
      } else { // 双页编辑
        var data = this.tempData2.tplInfos.page
        this.filePageData = JSON.parse(JSON.stringify(data))
        let len = this.filePageData[this.curPages].layer.length + this.filePageData[this.curPages * 1 + 1].layer.length
        this.layerLen = len > this.layerLen ? len : this.layerLen
        this.pageJsonData = []
        this.pageJsonData = [this.filePageData[this.curPages], this.filePageData[this.curPages * 1 + 1]]
      }
      this.editedPageData = JSON.parse(JSON.stringify(this.filePageData))
    },
    getIsInitOver(val) {
      this.isInitOver = val
    },
    toView() {
      this.isShowView = true
      yepnope({
        test : Modernizr.csstransforms, // 条件
        yep: ['/static/bfl-js/turn/turn.js'], // 条件为真时加载
        nope: ['/static/bfl-js/turn/turn.html4.min.js'], // 条件为假时加载
        // both: ['/data/deskData'], // 条件无论真假都加载
        // load: ['/data/deskData.json'], // 条件无论真假都加载
        // callback: (url, result, key)=> { // 回调函数
        //   console.log(url)
        // },
        complete: ()=> { // 加载完成后执行
          var data = JSON.parse(JSON.stringify(this.editedPageData))
          let HWratio = (data[0].pageheight / data[0].pagewidth).toFixed(2)
          let viewPageW = data[0].pagewidth * this.deskScale
          $('.flipbook').turn({
            width: viewPageW * 2,
            height: viewPageW * HWratio,
            elevation: 50,
            gradients: true,
            autoCenter: false,
            pages: 10,
            page: 2,
          });
        }
      });
    },
    toPrevView() {
      $('.flipbook').turn('previous')
    },
    toNextView() {
      $('.flipbook').turn('next')
    },
    toJson() {
      var tempData = this.isSingle ? this.tempData1 : this.tempData2
      var data = {
        tplInfos: {
          page: this.filePageData,
          pagescount: tempData.pagescount,
          photocount: tempData.photocount,
          name: tempData.name
        }
      }
      console.log(JSON.stringify(data))
    },
    toSave() {
      var tempDataInfo = this.isSingle ? this.tempData1.tplInfos : this.tempData2.tplInfos
      var data = {
        tplInfos: {
          page: this.filePageData,
          pagescount: tempDataInfo.pagescount,
          photocount: tempDataInfo.photocount,
          name: tempDataInfo.name
        }
      }
      var fillImgNum = 0
      this.filePageData.forEach((page)=> {
        page.layer.forEach((item)=> {
          if(item.layertype == 3) {
            if(item.img.fillImg) fillImgNum++
          }
        })
      })
      if(fillImgNum == tempDataInfo.photocount) {
        this.$confirm('完成编辑, 已保存到已完成作品中', '提示', {
          confirmButtonText: '查看',
          cancelButtonText: '确定',
          type: 'success'
        }).then(() => {
          this.$router.push({path: 'user/finished'})     
        }).catch(() => {
        });
      } else if(fillImgNum < tempDataInfo.photocount) {
        this.$confirm('未完成编辑, 是否确定保存', '提示', {
          confirmButtonText: '保存到未完成作品中',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }).then(() => {
          this.$confirm('已保存到未完成作品中', '提示', {
            confirmButtonText: '查看',
            cancelButtonText: '确定',
            type: 'success'
          }).then(() => {
            this.$router.push({path: 'user/unfinished'})     
          }).catch(() => {
          });   
        }).catch(() => {
        });
      }
    },
    addCart() {
      this.isShowAddCart = true
      this.unfinishedList = []
      if(this.isSingle) {
        for(let i = 0, len = this.filePageData.length; i < len; i++) {
          var arr = []
          let nufinished1 = 0
          this.filePageData[i].layer.forEach((item)=> {
            if(item.layertype == 3) {
              if(!item.img.fillImg) nufinished1++
            }
          })
          if(nufinished1) arr.push(this.filePageData[i].name + '(' + nufinished1 + ')')
          if(arr.length) this.unfinishedList.push(arr)
        }
      } else { // 双页
        for(let i = 0, len = this.filePageData.length; i < len; i+=2) {
          var arr = []
          let nufinished1 = 0
          this.filePageData[i].layer.forEach((item)=> {
            if(item.layertype == 3) {
              if(!item.img.fillImg) nufinished1++
            }
          })
          if(nufinished1) arr.push(this.filePageData[i].name + '(' + nufinished1 + ')')
          let nufinished2 = 0
          this.filePageData[i + 1].layer.forEach((item)=> {
            if(item.layertype == 3) {
              if(!item.img.fillImg) nufinished2++
            }
          })
          if(nufinished2) arr.push(this.filePageData[i + 1].name + '(' + nufinished2 + ')')
          if(arr.length) this.unfinishedList.push(arr)
        }
      }
      if(this.unfinishedList.length == 0) {
        this.$axios.get(this.sApi.userworks + '?t=uwattr&uwid=' + '7000001').then(response => {
          let res = response.data
          console.log(res)
          if(res.type == 1) {
            // console.log(res.data)
          }
        })
      }
    },
    hiddenPicClick(e) {
      this.isHiddenPics = e.target.checked
      this.hiddenPic()
    },
    hiddenPic() {
      var data = JSON.parse(JSON.stringify(this.editedPageData))
      var arr = this.filePicData.map((pic, idx)=> {
        pic.isUsed = false
        data.forEach((page)=> {
          if(page.photocount > 0) {
            page.layer.forEach((item)=> {
              if(item.layertype == 3) {
                if(item.img.fillImg) {
                  if(item.img.fillImg.url.indexOf(pic.src) > -1) {
                    pic.isUsed = true
                  }
                }
              }
            })
          }
        })
        return pic
      })
      this.filePicData = arr
    },
    onePageFill() {
      if(this.filePicData.length > 0) {
        var picArr = []
        this.filePicData.forEach((pic, idx)=> { // 筛选未被使用的照片
          if(!pic.isUsed) picArr.push(pic)
        })
        if(picArr.length > 0) {
          let clipPathData = this.isSingle ? JSON.parse(JSON.stringify(this.$refs.fabricBox1.clipPathData)) :  JSON.parse(JSON.stringify(this.$refs.fabricBox2.clipPathData)) // 获取画布上的clipPath对象(属性: obj、src)
          // let clipPathData = this.isSingle ? this.$refs.fabricBox1.clipPathData :  this.$refs.fabricBox2.clipPathData // 获取画布上的clipPath对象(属性: obj、src)
          clipPathData.sort((a, b)=> { // 给clipPath对象从右到左排序
            return a.obj.left - b.obj.left
          })

          let pageMaskUrl = [] // 当前页蒙版图片路径数组
          if(this.isSingle) {
            this.editedPageData[this.curPages].layer.forEach((page)=> {
              if(page.layertype == 3 && !page.img.fillImg) pageMaskUrl.push(page.img.mask.url)
            })
          } else {
            this.editedPageData[this.curPages].layer.forEach((page)=> {
              if(page.layertype == 3 && !page.img.fillImg) pageMaskUrl.push(page.img.mask.url)
            })
            this.editedPageData[this.curPages * 1 + 1].layer.forEach((page)=> {
              if(page.layertype == 3 && !page.img.fillImg) pageMaskUrl.push(page.img.mask.url)
            })
          }

          // console.log(clipPathData, pageMaskUrl) // ----------pageMaskUrl 空??????????
          if(pageMaskUrl.length > 0) {
            clipPathData.forEach((clip)=> {
              pageMaskUrl.forEach((url, idx)=> {
                if(clip.src.indexOf(url) > -1) {
                  if(this.isSingle) { // 单页
                    this.$refs.fabricBox1.addFillImg(clip.obj, picArr[idx].src, false)
                  } else { // 双页
                    if(picArr[idx]) {
                      this.$refs.fabricBox2.addFillImg(clip.obj, picArr[idx].src, false)
                    } else {
                      this.isAllFill = false
                      this.$alert('请添加照片', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: action => {}
                      });
                    }
                  }
                }
              })
            })
          }
        } else {
          this.isAllFill = false
          this.$alert('照片都已用, 请添加新照片', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {this.isAllFill = false}
          });
        }
      } else {
        this.isAllFill = false
        this.$alert('请添加照片', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
        });
      }
    },
    allPageFill() {
      let curFillImgNum = 0
      this.editedPageData.forEach(page=> {
        page.layer.forEach((item, idx)=> {
          if(item.layertype == 3 && item.img.fillImg) curFillImgNum++
        })
      })
      var data = this.isSingle ? this.tempData1.tplInfos : this.tempData2.tplInfos
      if(curFillImgNum < data.photocount) {
        if(this.filePicData.length > 0) {
          var picArr = []
          this.filePicData.forEach((pic, idx)=> { // 筛选未被使用的照片
            if(!pic.isUsed) picArr.push(pic)
          })
          if(picArr.length > 0) {
            var tempDataInfo = this.isSingle ? this.tempData1.tplInfos : this.tempData2.tplInfos
            let photoNum = tempDataInfo.photocount
            let picNum = this.filePicData.length
            this.$confirm('本册至少需要' + photoNum + '张照片, 当前有' + picNum + '张照片, 您确定要填充整本页面?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              /*let curPageFillImgNum = 0
              if(this.isSingle) {
                this.editedPageData[0].layer.forEach((page)=> {
                  if(page.layertype == 3 && !page.img.fillImg) curPageFillImgNum++
                })
                if() this.curPages = curPageFillImgNum == this.editedPageData[0].photocount ? 1 : 0
              } else {
                console.log(this.editedPageData[this.curPages], this.editedPageData[this.curPages * 1 + 1])
                this.editedPageData[0].layer.forEach((page)=> {
                  if(page.layertype == 3 && !page.img.fillImg) curPageFillImgNum++
                })
                this.editedPageData[1].layer.forEach((page)=> {
                  if(page.layertype == 3 && !page.img.fillImg) curPageFillImgNum++
                })
                if(curPageFillImgNum == (this.editedPageData[0].photocount*1 + this.editedPageData[1].photocount*1)) this.curPages++
              }*/
              this.curPages = 0
              this.isAllFill = true
              this.onePageFill()
            }).catch(() => {
              this.isAllFill = false
              this.$message({
                type: 'info',
                message: '已取消整本填充'
              });          
            });
          } else {
            this.isAllFill = false
            this.$alert('请添加照片', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: action => {}
            });
          }
        } else {
          this.isAllFill = false
          this.$alert('请添加照片', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {}
          });
        }
      } else {
        this.isAllFill = false
        this.$alert('填充完毕', '提示', {
          type: 'success',
          confirmButtonText: '确定',
          callback: action => {}
        })
      }
    },
    getIsFilled(val) {
      this.isFilled = val
    },
    changeTemp(val) {
      if(this.isSingle) {
        this.tempData1.tplInfos.page = JSON.parse(JSON.stringify(this.editedPageData))
        this.tempData1.tplInfos.page[this.curPages] = this.curTempData[this.changeTempIdx]
        this.changeData()
      } else {
        this.tempData2.tplInfos.page = JSON.parse(JSON.stringify(this.editedPageData))
        if(val == 1) {
          this.tempData2.tplInfos.page[this.curPages*1 + 1] = this.curTempData[this.changeTempIdx]
        } else {
          this.tempData2.tplInfos.page[this.curPages] = this.curTempData[this.changeTempIdx]
        }
        this.changeData()
      }
    },
    toKnowPrice() {
      var params = [{
        "PCID":"7000001", //--当前产品编码
        "PageCount": 10  //--页码. 正整数
      }]
      /*var params = {
        "PCID":"7000001", //--当前产品编码
        "PageCount": 10  //--页码. 正整数
      }*/
      this.$axios.post(this.sApi.userworks + '?t=price', params).then(response => {
        let res = response.data
        console.log(res)
        if(res.type == 1) {
          // console.log(res.data)
          this.isShowPrice = true
        }
      })
    }
  },
  mounted() { 
    this.myFabric.namedImage()
    this.myFabric.myText()
    this.myFabric.myRect()
    this.myFabric.myCircle()
    this.myFabric.myTriangle()
    this.myFabric.myPath()
    this.myFabric.myPolygon()
    this.isSaveFinished = false // 已完成保存-测试
    this.isSaveUnfinished = false // 未完成完成保存-测试

    this.changeData()

    if(this.$route.query.curPages) {
      this.curPages = this.$route.query.curPages
      if(this.curPages > (this.filePageData.length - 1)) this.curPages = 0
    }

    /*var pageW = this.filePageData[0].pagewidth
    this.deskScale = ($('.canvas-box').width() / pageW / 2 * 0.88).toFixed(2)
    $(window).resize(()=> {
      this.deskScale = ($('.canvas-box').width() / pageW / 2 * 0.88).toFixed(2)
    });*/
    var pageH = this.filePageData[0].pageheight
    this.deskScale = ($('.canvas-box').height() / pageH * 0.88).toFixed(2)
    let deskScaleW = ($('.canvas-box').width() / this.filePageData[0].pagewidth / 2 * 0.88).toFixed(2)
      this.deskScale = this.deskScale > deskScaleW ? deskScaleW : this.deskScale 
    $(window).resize(()=> {
      this.deskScale = ($('.canvas-box').height() / pageH * 0.88).toFixed(2)
      let deskScaleW = ($('.canvas-box').width() / this.filePageData[0].pagewidth / 2 * 0.88).toFixed(2)
      this.deskScale = this.deskScale > deskScaleW ? deskScaleW : this.deskScale 
    });
    // console.log($('.canvas-box').height(), this.deskScale, $('.canvas-box').height() / pageH * 0.88)

    this.filePicData = [
      {
        "src": "http://use.photo.j-ink.cn/lhz7MMMTKwbh9zC9JdD0fZEOhPij",
        "name": "40.4X65.4照片墙2.JPG"
      }, {
        "src": "http://use.photo.j-ink.cn/FmBogpun0Tx_jiOW-zqOy5XgfNSC",
        "name": "不负如来不负卿2.png"
      }, {
        "src": "http://use.photo.j-ink.cn/FlP3HMDAv4nuh5DJIeLn-fz0kyZS",
        "name": "cbed4ad9eb8d59235aa7fbd49b29bc9c37ce031fd5ede-LCQrip_fw658.png"
      }, {
        "src": "http://use.photo.j-ink.cn/FkmKkDzJUINDQthrgLkY8CQSXDHf",
        "name": "timg2.jpg"
      }, {
        "src": "http://use.photo.j-ink.cn/FrnxDcTX69NlN8yu1RxuKVJKDRtl",
        "name": "不负如来不负卿.png"
      }, {
        "src": "http://use.photo.j-ink.cn/FvACkvVCJzhP5AukQmmv9uymKTd_",
        "name": "e411f7689b86d847408e8753323af39c8b710d3097a24-rd0Ilk_fw658.jpg"
      }, {
        "src": "http://use.photo.j-ink.cn/Fvs0mZc6XxCWI49SjnLouLyWLGmD",
        "name": "萤火虫洞.jpg"
      }, {
        "src": "http://use.photo.j-ink.cn/FvzjTGhI9-FYD1NcQk7AhLq_BQMO",
        "name": "a195890b5e82f3b7f321f667944495ddb9b650a9ba0af-fymFV7_fw658.jpg"
      }, {
        "src": "http://use.photo.j-ink.cn/Fj9kgD7FEdIEmCxN6d7S8Nv4XaIj",
        "name": "test.jpg"
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit-list {width: 180px; position: absolute; top: 40px; bottom: 0px; min-height: 688px; display: inline-block; border-radius: 0 4px 0 0; background :#eee; user-select: none;}
.edit-list .edit-list-item {width: 100%; background :#fff; height: 40px; line-height: 40px; text-align: center; border: none; border: 1px solid #eee; border-bottom: none; border-radius: 0 4px 4px 0; cursor: pointer;}
.edit-list .edit-list-item:last-child {border-bottom: 1px solid #eee;}
.edit-list .edit-list-item.on,
.edit-list .edit-list-item:hover {background: rgb(58, 170, 146); color: #fff;} 
.edit-list .edit-list-item:hover .icon-more {color: #fff;}
.edit-list .edit-list-item >img {padding-right: 30px;}
.edit-list .edit-list-item .icon-more {padding-left: 40px; color: #ccc;}
.edit-list .edit-list-item .more {-position: absolute; -bottom: 0; position: fixed; bottom: 0; z-index: 10; color: #3aaa92; line-height: 38px; background: #eee; width: 176px; margin-bottom: 0;}
.edit-list .item-list {width: 100%; position: absolute; bottom: 0px; z-index: 10; background:#fff; overflow-y: scroll; padding-bottom: 30px;}
.edit-list .item-list li {color: #111; padding-bottom: 6px;}
/*.edit-list .item-list li:nth-child(2n) {-margin: -10px 0 0 0; -padding-bottom: 0;}*/
.edit-list .item-list li img,
li > .font-box {display: inline-block; box-sizing: border-box; width: 95%; padding: 5px 28px; border: 2px solid #eee;}
li > .font-box > span {display: block; line-height: 20px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}

/*.edit-list .item-list li img.on,*/
.edit-list .item-list li.on img,
li.on > .font-box {border: 2px solid rgb(58, 170, 146);}
.edit-list .file {position: relative; top: 150px; left: 50%; margin-left: -47px; display: inline-block; background: rgb(58, 170, 146); border-radius: 4px; overflow: hidden; color: #fff; text-decoration: none; text-indent: 0; line-height: 20px; padding: 8px 15px;}

.pics-box .main .top .btn.file input {position: absolute; -font-size: 100px; right: 0; top: 0; opacity: 0; width: 100%;}
.pics-box .main .top .btn.file input:hover {background: rgb(43, 155, 131); color: #fff; text-decoration: none;}

.edit-content {min-width: 1010px; position: fixed; top: 40px; bottom: 0px; right: 0px; left: 200px; min-height: 688px;}

.edit .edit-content .edit-top-bor {min-width: 1016px; position: fixed; z-index: 10; -width: 100%;background: #eee; border-radius: 4px; left: 200px; right: 0;}
.edit .edit-content .edit-top-bor ul {display: inline-block; font-size: 14px; color: #999;}
.edit .edit-content .edit-top-bor ul.edit-right {float: right;}
.edit .edit-content .edit-top-bor ul.edit-right i {color: #ff7800;}
.edit .edit-content .edit-top-bor ul li {display: inline-block; height: 40px; line-height: 40px; margin: 0 10px 0 2px; color: #333;}
/*.edit .edit-content .edit-top-bor ul li:nth-child(3) {}*/
.edit .edit-content .edit-top-bor ul li > .btn {display: inline-block; border: 1px solid black; margin-left: 10px; cursor: pointer; border: 1px solid black; border-radius: 254px 16px 226px 16px/16px 226px 16px 254px; margin-bottom: 20px; padding: 0 18px; background: #fff; color: #ff7800; font-size: 20px;}
.edit .edit-content .edit-top-bor ul li.undo > a {color: #aaa; cursor: not-allowed;}
.edit .edit-content .edit-top-bor ul li.redo > a {color: #aaa; cursor: not-allowed;}
.edit .edit-content .edit-top-bor ul li i {margin: 0 10px; -color: #aaa;}
.edit .edit-content .edit-top-bor ul li i.icon-eye {color: #ff7800;}

.edit .edit-bottom {min-width: 1016px; height: 146px; position: fixed; left: 200px; right: 0; bottom: 0px; background: #eee; border-radius: 4px; font-size: 12px;}
.edit .edit-bottom .btn-box >div { display: inline-block;}
.edit .edit-bottom .btn-box >div a { display: inline-block; padding: 8px 18px;}
.edit .edit-bottom .btn-box .btn-left { margin-left: 60px;}
.edit .edit-bottom .btn-box .btn-left a { border: 1px solid transparent;}
.edit .edit-bottom .btn-box .btn-left a.on,
.edit .edit-bottom .btn-box .btn-left a:hover { background: #fff; border: 1px solid #ccc;}
.edit .edit-bottom .btn-box .btn-left span { color: #aaa; margin-left: 20px;}
.edit .edit-bottom .btn-box .btn-right {float: right; margin-right: 60px;}
.edit .edit-bottom .btn-box .btn-right li {display: inline-block; margin: 8px 18px; cursor: pointer; position: relative; overflow: hidden;}
.edit .edit-bottom .btn-box .btn-right li:hover {color: #3aaa92;}
.edit .edit-bottom .btn-box .btn-right li .addPics {position: absolute; width: 66%; z-index: 10; opacity: 0;}
.edit .edit-bottom .btn-box .btn-right img,
.edit .edit-bottom .btn-box .btn-right input { vertical-align: middle; margin-right: 5px;}
.edit .edit-bottom .pic-box { position: relative; height: 110px; top: 5px;}
.edit i.btn-icon {z-index: 10; top: 43%; margin-top: -33px; padding-top: 5px;}
.edit .edit-bottom .pic-box i.btn-icon:before {color: #eee;}
.edit .edit-bottom .pic-box .img-list { position: absolute; top: 0px; bottom: 0px; left: 60px; right: 60px; overflow-x: auto; overflow-y: hidden; white-space: nowrap;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box {height: 105px; white-space: nowrap; position: relative; left: 0px; background: transparent;}
.edit .edit-bottom .pic-box .img-list .ul1 li {display: inline-block; text-align: center;}
.edit .edit-bottom .pic-box .img-list .ul1 li.pics {margin: 0 10px 0 0; position: relative; min-width: 90px; user-select: none; border: 2px solid transparent;}
.edit .edit-bottom .pic-box .img-list .ul1 li.pics.on {border-color: rgb(58, 170, 146);}
.edit .edit-bottom .pic-box .img-list .ul1 li h1 {position: absolute; width: 90px; height: 20px; left: 50%; line-height: 20px; margin-left: -45px;}

.canvas-box {width: 100%; position: absolute; top: 0; bottom: 140px; margin-top: 44px;  display: flex; justify-content: center; align-items: center; font-size: 0;}
/*.canvas-box .fabricBox2-box {}*/

.edit .edit-bottom .pic-box .img-list::-webkit-scrollbar {height: 10px;}

.nemu-box {width: 200px; min-height: 700px; background: #eee; text-align: center;}
.nemu-box .til {height: 46px; line-height: 48px;}
.nemu-box .nemuList {}
.nemu-box .nemuList li {background: #fff; height: 46px; line-height: 46px; border-radius: 4px; margin: 1px; margin-top: 0; font-size: 14; color: #999;}
.nemu-box .nemuList li > img {vertical-align: middle; margin-right: 10px;}
.nemu-box .nemuList li > span {vertical-align: middle;}
.pics-box {position: absolute; top: 0; bottom: 0; left: 200px; right: 0; background: #fff;}
.pics-box .tab-box {background: #eee;}
.pics-box .tab-box .tab {display: inline-block; height: 46px; line-height: 46px; width: 160px; text-align: center; border-radius: 4px;}
.pics-box .tab-box .tab.on {background: #fff;}
.pics-box .main {padding: 0 26px;}
.pics-box .main .top {padding: 20px 100px 20px 0; font-size: 18px; position: relative;}
.pics-box .main .top .tip {-width: 82%; width: 100%; display: inline-block; text-align: center; color: #999; line-height: 34px; box-sizing: border-box;}
.pics-box .main .top p.tip {text-align: right; color: #999; font-size: 16px; padding-right: 10px;}
.pics-box .main .top p.tip .num {color: #f5610c;}
.pics-box .main .footer .btn,
.pics-box .main .top .btn {padding: 8px 10px; background: #34a88e; color: #fff; border-radius: 4px; position: absolute; right: 0; top: 20px;}
.pics-box .main .top .btn i {margin: 0 4px 0 12px; font-size: 20px; position: relative; top: 1px;}
.pics-box .main .top .btn.del {background: #fff; color: #f9ac7d; position: relative; top: -1px;}
.pics-box .main .top .btn.del:hover {color: red;}

.pics-box .main .picList {height: 500px; overflow-y: auto; padding-top: 8px;}
.pics-box .main .picList li {display: inline-block; text-align: center; margin-bottom: 10px; color: #999; padding: 0 3px; margin-top: 1px;}
.pics-box .main .picList li > p {width: 100px; height: 18px;}
.pics-box .main .picList li .pic {width: 103px; height: 103px; background: center / contain no-repeat; border: 1px solid #eee; margin-bottom: 10px; position: relative;}
.pics-box .main .picList li .pic:hover {box-shadow: 2px 2px 5px #aaa; top: -1px;}
.pics-box .main .picList li .pic.on {border-color: #34a88e; box-shadow: 2px 2px 5px #34a88eab; top: -1px;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i,
.pics-box .main .picList li .pic > i {color: red; position: absolute; top: -8px; right: -4px; cursor: pointer; background: radial-gradient(#fff, transparent); display: none;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i.el-icon-success {color: #67c23a;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i {top: 0;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box li > i.on,
.pics-box .main .picList li .pic:hover > i {display: inline-block;}
.pics-box .main .footer {width: 86%; min-height: 88px; padding: 20px 0 30px 0; position: absolute; bottom: 0;}
.pics-box .main .footer .btn {width: 130px; text-align: center; font-size: 18px; padding: 10px 16px; position: absolute; right: 10px;}
.pics-box .main .footer .saveLocation {display: inline-block;}
.pics-box .main .footer .saveLocation p.til {line-height: 40px; color: #f5610c;}
.pics-box .main .footer .saveLocation .radio-box {line-height: 40px;}
.pics-box .main .footer .saveLocation .radio-box .el-box {display: inline-block; height: 34px; line-height: 34px; width: 168px; margin-left: 18px; padding: 0 5px;}
.pics-box .main .footer .saveLocation .radio-box .name {cursor: pointer;}
.pics-box .main .footer .saveLocation .radio-box .name i.circular {display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ccc; vertical-align: top; margin-top: 12px; margin-right: 14px;}
.pics-box .main .footer .saveLocation .radio-box .name i.circular.on {border-color: #f5610c;}

/* 纯css实现table的表头固定tbody内容显示垂直滚动条 -- 拼接法 */
.table-box {width: 100%; max-height: 420px; border: 1px solid #e5e5e5;}
/*设置table-layout: fixed固定宽度，表头和表体需要对齐*/
.table-box table {table-layout: fixed; width: 100%; line-height: 40px; text-align: center;}
.table-box .table-body {overflow-y: auto; max-height: 378px;}/*设置表体内容div高*/
.table-box table th {text-align: center; background: #eee;}
.table-box table td {color: #ababab; border-bottom: 1px dashed #e5e5e5;}
.table-box table td .picName {display: inline-block; width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; vertical-align: middle;}
.table-box table td .btn {font-size: 14px; color: #34a88e; line-height: 26px;}
.table-box table td img {vertical-align: top;}
.table-box table td .todo {font-size: 14px; display: inline-block; -width: 56px;}
.table-box table td .todo.btn-text.danger {color: #f56c6c;}

.dialogCSS h1 {font-size: 20px; color: #000; text-align: left;}
.dialogCSS h1 > img {vertical-align: middle; margin-right: 16px; position: relative; top: -2px;}
.dialogCSS p {text-align: center; font-size: 18px;}
.dialogCSS p.price-box {margin: 28px 0; padding: 0;}
.dialogCSS p.price-box i {font-size: 24px; margin-right: 12px; vertical-align: middle; color: #34a88e;}
.dialogCSS p.price-box .money {color: #ff7800;}
.dialogCSS p.price-box.old .money {color: #aaa; text-decoration: line-through;}
.dialogCSS span.btn {display: inline-block; width: 150px; height: 40px; line-height: 40px; background: #34a88e; color: #fff; border-radius: 2px;}
.konwPrice {width: 480px;}
.addCartDialog h1 > img {margin-right: 0;}
.addCartDialog p.tip {padding: 16px 0 30px 33px; font-size: 12px; text-align: left; color: #999;}
.addCartDialog .box {width: 365px; height: 480px; border: 1px solid #aaa; margin-left: 8px; overflow-y: auto;}
.addCartDialog .box li {line-height: 40px; padding-left: 38px;}
.addCartDialog .box li span {margin-right: 12px;}
.addCartDialog .box li:nth-child(2n-1) {background: #f4fcf9;}
.moreDialog .dialog-box {min-height: 700px; padding: 26px 50px 20px 50px;}
.moreDialog .box {width: 100%; border: 1px solid #ddd; margin-top: 10px; padding: 58px 58px 46px 58px; position: relative; text-align: left;}
.moreDialog .box p.select {position: absolute; top: 10px; right: 58px;}
.moreDialog .box p.select span.on,
.moreDialog .box p.select span:hover {color: #ff7800;}
.moreDialog .box ul.main {height: 508px; overflow-y: auto;}
.moreDialog .box ul.main li {display: inline-block; width: 16%; height: 100px; border: 2px solid #d4d4d4; text-align: center; margin: 0 20px 16px 0; background: center / contain no-repeat;}
.moreDialog .box ul.main li.on,
.moreDialog .box ul.main li:hover {border-color: #3aaa92;}
.moreDialog .box ul.main li .font-box {border: none;}
.moreDialog .box ul.main li .font-box > span {font-size: 18px; line-height: 25px;}
.moreDialog .decorateMenu li {line-height: 60px;}
.moreDialog .decorateMenu li:hover,
.moreDialog .decorateMenu li.on {background: #fff; color: #34a88e;}
.moreDialog div.btn {text-align: right; font-size: 18px;}
.moreDialog div.btn span {display: inline-block; margin-top: 10px; background: #34a88e; color: #fff; width: 105px; height: 38px; border-radius: 4px; text-align: center; margin-right: 35px;}
.moreDialog .decorateMenu {position: absolute; width: 230px; top: 76px; bottom: 20px; border: 1px solid #e4e4e4; background: #eee; text-align: center;}
.moreDialog .filterList {padding: 0 36px;}
.moreDialog .filterList > li {font-size: 18px;}
.moreDialog .filterList .item {display: inline-block;}
.moreDialog .filterList .item li {display: inline-block; font-size: 16px; padding: 0 20px;}
.moreDialog .filterList .item li:hover,
.moreDialog .filterList .item li.on {color: #34a88e;}
.moreDialog .display-box {width: 100%; height: 302px; margin-top: 30px;}
.moreDialog .display {width: 720px; height: 100%; margin: 0 auto;}
.moreDialog .display .right,
.moreDialog .display .left {width: 316px; height: 302px; display: inline-block; background: center / contain no-repeat; vertical-align: top; text-align: center;}
.moreDialog .display .left {margin-right: 80px;}
.moreDialog .display .right h1 {font-size: 24px; padding: 6px 0; text-align: center;}
.moreDialog .display .right p {color: #000; padding: 80px 0 60px;}
.moreDialog .display .right p > span {color: #f8610d;}
.moreDialog .display .right .btn-box > span {display: inline-block; width: 106px; height: 40px; border: 1px solid #34a88e; border-radius: 4px; color: #34a88e; margin-right: 86px;}
.moreDialog .display .right .btn-box > span:last-child {margin-right: 0;}
.moreDialog .display .right .btn-box > span:hover,
.moreDialog .display .right .btn-box > span.on {color: #fff; background: #34a88e;}
.moreDialog .temp-box {position: absolute; bottom: 0; width: 100%; height: 150px;}
.moreDialog .temp-box i.btn-icon {top: 50%;}
.moreDialog .temp-box .tempList-box {width: 88.82%; height: 100%; margin: 0 auto;}
.moreDialog .temp-box .tempList-box .tempList {width: 100%; height: 100%; white-space: nowrap; overflow-y: hidden; overflow-x: auto;}
.moreDialog .temp-box .tempList-box .tempList li {display: inline-block; padding: 0 10px;}
.moreDialog .temp-box .tempList-box .tempList li .imgBox {width: 100px; height: 100px; background: center / contain no-repeat; border: 2px solid #dadada;}
.moreDialog .temp-box .tempList-box .tempList li .imgBox:hover,
.moreDialog .temp-box .tempList-box .tempList li .imgBox.on {border-color: #34a88e;}
.moreDialog .temp-box .tempList-box .tempList li p {font-size: 16px;}

.moreDialog .box ul::-webkit-scrollbar {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
}
.moreDialog .box ul::-webkit-scrollbar-button {
  width: 20px;
  height: 20px;
  border: 2px solid #d4d4d4;
  background: url(/static/bfl-img/edit/scroll-btn-top.png) center / contain no-repeat;
  box-sizing: border-box;
}
.moreDialog .box ul::-webkit-scrollbar-button:end {
  background: url(/static/bfl-img/edit/scroll-btn-btm.png) center / contain no-repeat;
}
.moreDialog .box ul::-webkit-scrollbar-track-piece {
    background-color: #fff;
    -webkit-border-radius: 0;
    border: 2px solid #d4d4d4;
    box-sizing: border-box;
}
.moreDialog .box ul::-webkit-scrollbar-thumb:vertical {
    border: 2px solid #d4d4d4;
    -webkit-border-radius: 0;
    box-sizing: border-box;
    background: #e3e3e4 url(/static/bfl-img/edit/scroll.png) center / contain no-repeat;
}
.moreDialog .box ul::-webkit-scrollbar-thumb:horizontal {
    border: 2px solid #d4d4d4;
    -webkit-border-radius: 0;
    box-sizing: border-box;
    background: #e3e3e4 url(/static/bfl-img/edit/scroll.png) center / contain no-repeat;
}
.moreDialog .box ul.tempList::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
.moreDialog .box ul.tempList::-webkit-scrollbar-button {
  width: 16px;
  height: 16px;
  background-image: url(/static/bfl-img/edit/scroll-btn-left.png);
}
.moreDialog .box ul.tempList::-webkit-scrollbar-button:end {
  background-image: url(/static/bfl-img/edit/scroll-btn-right.png);
}

.isLoading {font-size: 18px; color: #999; text-align: center; margin-top: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0;}

.viewBox .tip {width: 100%; color: #eee; font-size: 26px; position: absolute; top: -180px; text-align: center;}
.viewBox .tip > span {font-size: 16px; line-height: 26px; border-radius: 14px; border: 1px solid #eee; padding: 4px 16px; margin-left: 10px; cursor: pointer;}
.viewBox .btn-icon {width: 84px; height: 164px; position: absolute; left: -150px;}
.viewBox .btn-icon:before {content: ''; width: 110px; height: 110px; border-left: 1px solid #fff; border-bottom: 1px solid #fff; position: absolute; left: 24px; top: 24px; transform: rotate(45deg);}
.viewBox .btn-icon.btn-next {left: auto; right: -150px;}
.viewBox .btn-icon.btn-next:before {border: 1px solid #fff; border-left: none; border-bottom: none; top: 24px; left: auto; right: 24px; transform: rotate(45deg);}

@media screen and (min-width: 1600px) {
  .nemu-box {width: 212px;}
  .pics-box {left: 212px;}
  .pics-box .main .top .tip {width: 86%;}
}
/*@media screen and (min-width: 1440px) and (max-width: 1599px) {}*/
@media screen and (max-width: 1280px) {
  .edit-list {width: 150px;}
  .edit-content {left: 170px; min-height: 500px;}
  .edit-list {min-height: 500px;}
  .edit .edit-bottom,
  .edit .edit-content .edit-top-bor {left: 170px}
}
@media screen and (max-width: 1213px) {
  .edit .edit-bottom .btn-box .btn-right {margin-right: 20px;}
}
</style>  