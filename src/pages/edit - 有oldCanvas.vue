<template>
  <div class="edit">
    <ul class="edit-list">
      <li class="edit-list-item" 
        v-for="(item, idx) in editList" 
        @mouseenter="hoverIn(idx)" 
        @mouseleave="hoverOut(idx)"
        @click="showList(idx, $event)"
        :class="{'on': idx ===curShowListIdx}" 
      >
        <img :src="(idx === curChangeIconIdx || idx === curShowListIdx) ? ('/static/bfl-img/edit/' + item.tag + '-hover.svg') : ('/static/bfl-img/edit/' + item.tag + '.svg')" alt="" class="edit-list-icon">
        <span>{{item.name}}</span>
        <i class="icon-more"></i>
        <ul :class="'edit-' + item.tag + '-list item-list'" v-if="idx === curShowListIdx" :style="{'top': 40 * (idx + 1) + 'px', 'padding-top': '2px'}" @click="stopBubble">
          <li v-for="(v, i) in item.item" :class="{'on': i === 0}">
            <img :src="v.img" alt="" :title="v.title" 
              v-if="!(item.name === '图片' || item.name === '装饰' || item.name === '文字')"
              @click="editListClick(item.name, i, $event)"
            >
            <img :src="v.img" alt="" :title="v.title" 
              v-if="item.name === '文字'" 
              draggable="true" 
              @mousedown="drag(item.name, i, $event)"
            >
            <img draggable="true" 
              :src="v.img" alt="" :title="v.title"
              v-if="item.name === '图片' || item.name === '装饰'"
              @mousedown="drag(item.name, i, $event)"
            />
            <h1 v-if="item.name === '模板'" style="margin-top: -14px;">{{v.tag}}</h1>
          </li>
          <li class="more" @click="isShowMore = true">
            更多{{item.name}}
            <i class="el-icon-d-arrow-right"></i>
          </li>
        </ul>

        <!-- 更多 -->
        <el-dialog class="moreDialog dialogCSS" :visible="isShowMore && (idx === curShowListIdx)" width="73%" @closed="isShowMore = false">
          <!--  :class="{'on': item.name == '模板'}" -->
          <div class="dialog-box" @click="stopBubble" :style="{'min-height': item.name == '模板' ? '760px' : '700px'}">
            <h1>
              <img :src="'/static/bfl-img/edit/' + curShowListIdx + '.png'" alt="">
              <!-- <img :src="'/static/bfl-img/edit/5.png'" alt=""> -->
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
                <li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'">
                </li>
                <li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'">
                </li>
              </ul>
            </div>
            <div class="box" v-if="item.name == '文字'" style="border: none; padding: 0;">
              <ul class="main" style="height: 560px;">
                <li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14%; height: 90px; margin: 0 20px 2px 0;">
                </li><!-- 
                 --><li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14%; height: 90px; margin: 0 20px 2px 0;">
                </li><!-- 
                 --><li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14%; height: 90px; margin: 0 20px 2px 0;">
                </li><!-- 
                 --><li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14%; height: 90px; margin: 0 20px 2px 0;">
                </li>
              </ul>
              <div class="btn">
                <span>确定</span>
              </div>
            </div>
            <ul class="decorateMenu" v-if="item.name == '装饰'">
              <li v-for="(v, i) in decorateMenu" :class="{'on': i == curDecorateMenuIdx}" @click="curDecorateMenuIdx = i">{{v.name}}</li>
            </ul>
            <div class="box" v-if="item.name == '装饰'" style="width: auto; position: absolute; top: 66px; bottom: 20px; left: 279px; right: 50px;">
              <p class="select">
                请选择：
                <span>全选</span>&nbsp;&nbsp;
                <span>反选</span>&nbsp;&nbsp;
                <span class="on">无</span>
              </p>
              <ul class="main">
                <li v-for="(v, i) in decorateMenu[curDecorateMenuIdx].list" :style="'background-image: url(' + v.img + ');'" style="width: 140px; height: 140px; margin: 0 30px 20px 0;">
                </li>
              </ul>
              <div class="btn">
                <span style="margin-top: 0; position: relative; top: -10px;">确定</span>
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
          <li @click="isShowPrice = true">
            <a href="javascript:"><i class="icon-cion"></i>了解价格</a>
          </li>
          <li>
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
        <div @dragover="allowDrop">
          <fabricBox v-show="isSingle" idName="canvasSingle" ref="fabricBox1" :isSingle="isSingle" :deskScale="deskScale" :pageData="pageJsonData" :curDragImg="curDragImg" :dragType="dragType" :fontFamily="fontFamily" :curDragDecorate="curDragDecorate" @getOldPageData="getOldPageData" @getIsInitOver="getIsInitOver" @getSaveData="getSaveData"></fabricBox>
          <fabricBox v-show="!isSingle" idName="fabricBoxDouble" ref="fabricBox2" :isSingle="isSingle" :deskScale="deskScale" :pageData="pageJsonData" :curDragImg="curDragImg" :dragType="dragType" :fontFamily="fontFamily" :curDragDecorate="curDragDecorate" @getOldPageData="getOldPageData" @getIsInitOver="getIsInitOver" @getSaveData="getSaveData"></fabricBox>
        </div>
      </div>
      <div class="edit-bottom">
        <div class="btn-box">
          <div class="btn-left">
            <a class="pic-btn" :class="{'on': !isShowPage}" @click="isShowPage = !isShowPage">照片</a>
            <a class="page-btn" :class="{'on': isShowPage}" @click="isShowPage = !isShowPage">页面</a>
            <span class="totalPage">共计{{isShowPage ? filePageData.length : filePicData.length}} 张{{isShowPage ? '页面' : '图片'}}</span>
          </div>
          <ul class="btn-right">
            <li href="javascript:"><img src="/static/bfl-img/edit/delTemp.svg" alt="">删除模板</li>
            <li href="javascript:" @click="isAllFill = true"><img src="/static/bfl-img/edit/allFill.svg" alt="">整本填充</li>
            <li href="javascript:"><img src="/static/bfl-img/edit/singleFill.svg" alt="">单页填充</li>
            <li href="javascript:" @click="openAddPics"><img src="/static/bfl-img/edit/addPic.svg" alt="">添加照片</li>
            <li href="javascript:" @click="isDelPic = !isDelPic"><img src="/static/bfl-img/edit/delPic.svg" alt="">删除照片</li>
            <li href="javascript:"><input type="checkbox">隐藏已用照片</li>
          </ul>
        </div>
        <div class="btn-list">
           
        </div>
        <div class="pic-box">
          <i class="btn-icon icon-prev" v-show="isShowPage" @click="prevPic"></i>
          <i class="btn-icon icon-next" v-show="isShowPage" @click="nextPic"></i>
          <div class="img-list">
            <ul class="ul1 pics-box" v-show="!isShowPage">
              <li class="pics" v-for="(img, idx) in filePicData">
                <img height="78" draggable="true" 
                  :src="img.src + '?imageView2/2/w/400'" alt="" :clsaa="'img' + idx" 
                  :title="img.name" 
                  @mousedown="drag('照片', 0, $event)"
                />
                <h1 class="ellipsis" :title="img.name">{{img.name}}</h1>
                <i class="el-icon-error" :class="{'on': isDelPic}" @click="delPic(idx)"></i>
              </li>
            </ul>
            <ul class="ul1 pages-box" v-show="isShowPage">
              <li class="pages" v-for="(page, idx) in filePageData">
                <ul class="pageBox" v-if="idx % 2 == 0 && !isSingle" @click="curPages = idx" :class="{'on': curPages == idx}">
                  <li class="item" style="display: inline-block;">
                    <img height="60" :src="'http://img.res.excelll.org/' + filePageData[idx].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
                    <!-- <p v-if="filePageData[idx].index == 0">封底(1)</p>
                    <p v-if="filePageData[idx].index == 1">封面(2)</p>
                    <p v-if="filePageData[idx].index == 2">扉页</p>
                    <p v-if="filePageData[idx].index > 2">{{filePageData[idx].index}}页</p> -->
                    <p>{{filePageData[idx].name}}</p>
                  </li><!-- 
                   --><li class="item" style="display: inline-block;">
                    <img height="60" :src="'http://img.res.excelll.org/' + filePageData[idx + 1].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
                    <!-- [idx + 1] -->
                    <p>{{filePageData[idx + 1].name}}</p>
                  </li>
                </ul>
                <div v-if="isSingle" class="pageBox" @click="curPages = idx" :class="{'on': curPages == idx}">
                  <img height="60" :src="'http://img.res.excelll.org/' + filePageData[idx].thumb + '?imageView2/2/w/105'" alt="" :class="'page' + idx" style="background: #fff;"/>
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
          当前作品金额为：<span class="money">￥58.00元</span>
        </p>
        <p>
          <span class="btn" @click="isShowPrice = false">确 定</span>
        </p>
      </div>
    </el-dialog>
    <!-- 加入购物车 -->
    <el-dialog class="addCartDialog dialogCSS" :visible.sync="isShowAddCart">
      <div class="unfinished" v-if="!isFinished">
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
      <div class="finished" v-if="isFinished">
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
              暂无照片，去 
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
            <table>
              <thead>
                <tr>
                  <th>编号</th>
                  <th>缩略图</th>
                  <th width="200px">名称</th>
                  <th>大小</th>
                  <th>完成进度</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
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
                  <td>
                    <p class="picName ellipsis" :title="item.name">{{item.name}}</p>
                  </td>
                  <td>{{item.size}}kb</td>
                  <td>
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
              </tbody>
            </table>
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
              <!-- <div v-for="(page, idx) in filePageData" :style="'background:url(http://img.res.excelll.org/' + filePageData[idx].thumb + '?imageView2/2/w/' + (viewPageW*0.7).toFixed(0) + ') no-repeat; background-size: ' + (viewPageW*0.5).toFixed(0) + 'px; background-position: 0px 0px;'"></div> -->
              <div v-for="(page, idx) in filePageDataStr">
                <fabricView :idName="'view' + idx" :deskScale="deskScale" :pageData="page"></fabricView>
                <!-- <fabricBox v-show="!isSingle" idName="fabricBoxDouble" ref="fabricBox2" :isSingle="isSingle" :deskScale="deskScale" :pageData="pageJsonData" :curDragImg="curDragImg" :dragType="dragType" :fontFamily="fontFamily" :curDragDecorate="curDragDecorate" @getOldPageData="getOldPageData" @getIsInitOver="getIsInitOver"></fabricBox> -->
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
import tempData2 from '@/data/deskData.json' // 双页编辑
// import tempData1 from '@/data/deskData.json' // 台历
import tempData1 from '@/data/deskData-2.json' // 台历
import fabricBox from '@/components/fabricBox' // 相册-canvas组件
import fabricView from '@/components/fabricBox-view' // 相册-canvas组件

export default {
  name: 'edit',
  components: {
    fabricBox,
    fabricView
  },
  data () {
    return {
      editList: [ // 左侧编辑列表内容
        {
        tag: 'template',
        name: '模板',
        item: [
          {
            img: '/static/bfl-img/edit/temp01.png',
            tag: '封面'
          },{
            img: '/static/bfl-img/edit/temp02.png',
            tag: '1页'
          },{
            img: '/static/bfl-img/edit/temp03.png',
            tag: '2页'
          },{
            img: '/static/bfl-img/edit/temp02.png',
            tag: '3页'
          },{
            img: '/static/bfl-img/edit/temp03.png',
            tag: '4页'
          }
        ]
        },{
          tag: 'font',
          name: '文字',
          item: [
            {
              img: '/static/bfl-img/edit/font01.png',
              title: 'STXingkai 华文行楷'
            },{
              img: '/static/bfl-img/edit/font02.png',
              title: 'STXinwei 华文新魏'
            },{
              img: '/static/bfl-img/edit/font03.png',
              title: 'STLiti 华文隶书'
            },{
              img: '/static/bfl-img/edit/font01.png',
              title: 'STHupo 华文琥珀'
            },{
              img: '/static/bfl-img/edit/font02.png',
              title: 'STCaiyun 华文彩云'
            },{
              img: '/static/bfl-img/edit/font03.png',
              title: 'FZYaoti 方正姚体'
            },{
              img: '/static/bfl-img/edit/font01.png',
              title: 'Delicious'
            },{
              img: '/static/bfl-img/edit/font02.png',
              title: 'Hoefler Text'
            },{
              img: '/static/bfl-img/edit/font03.png',
              title: 'STXinwei'
            }
          ]
        },{
          tag: 'bg',
          name: '背景',
          item: [{
            img: '/static/bfl-img/edit/bg.png'
          },{
            img: '/static/bfl-img/edit/bg01.png'
          },{
            img: '/static/bfl-img/edit/bg02.png'
          },{
            img: '/static/bfl-img/edit/bg03.png'
          },{
            img: '/static/bfl-img/edit/bg01.png'
          },{
            img: '/static/bfl-img/edit/bg02.png'
          }]
        },{
          tag: 'pic',
          name: '图片',
          item: [{
            img: '/static/bfl-img/edit/bg01.png'
          },{
            img: '/static/bfl-img/edit/bg02.png'
          },{
            img: '/static/bfl-img/edit/bg03.png'
          },{
            img: '/static/bfl-img/edit/bg01.png'
          },{
            img: '/static/bfl-img/edit/bg02.png'
          }]
        },{
          tag: 'decorate',
          name: '装饰',
          item: [{
            img: '/static/bfl-img/edit/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          }]
        },{
          tag: 'layout',
          name: '布局',
          item: [{
            img: '/static/bfl-img/edit/layout01.png'
          },{
            img: '/static/bfl-img/edit/layout02.png'
          },{
            img: '/static/bfl-img/edit/layout03.png'
          },{
            img: '/static/bfl-img/edit/layout04.png'
          },{
            img: '/static/bfl-img/edit/layout05.png'
          },{
            img: '/static/bfl-img/edit/layout06.png'
          },{
            img: '/static/bfl-img/edit/layout01.png'
          },{
            img: '/static/bfl-img/edit/layout02.png'
          },{
            img: '/static/bfl-img/edit/layout03.png'
          }]
        }
      ],
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
      curDragImg: '', // 当前拖拽的照片
      curDragDecorate: '', // 当前拖拽的装饰图片
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
      isDelPic: false, // 删除照片按钮
      isCutImg: false, // 是否裁剪图片
      curCutImg: '', // 剪切图片的数据true
      dragType: '', // 拖拽类型
      fontFamily: '', // 字体
      isShowPrice: false, // 了解价格
      isShowAddCart: false, // 加入购物车
      unfinishedList: [
        ['封底(1)', '封面(2)'],
        ['封底(1)', '封面(2)'],
        ['封底(1)', '封面(2)'],
      ],
      isFinished: false, // 是否编辑完成
      decorateMenu: [
        {
          name: '卡通',
          list: [{
            img: '/static/bfl-img/edit/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          }]
        }, {
          name: '可爱',
          list: [{
            img: '/static/bfl-img/edit/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate03.png'
          }]
        }, {
          name: '爱心',
          list: [{
            img: '/static/bfl-img/edit/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          }]
        }, {
          name: '花纹',
          list: [{
            img: '/static/bfl-img/edit/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate01.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
          },{
            img: '/static/bfl-img/edit/decorate03.png'
          },{
            img: '/static/bfl-img/edit/decorate04.png'
          },{
            img: '/static/bfl-img/edit/decorate02.png'
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
          img: '/static/bfl-img/edit/temp/temp-00.png'
        }, {
          name: '育儿家园',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-01.png'
        }, {
          name: '聪明宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-02.png'
        }, {
          name: '漂亮宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-03.png'
        }, {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-04.png'
        }, {
          name: '婚礼杂志册',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-03.png'
        },{
          name: '育儿家园',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-01.png'
        }, {
          name: '聪明宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-02.png'
        }, {
          name: '漂亮宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-03.png'
        }, {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-04.png'
        }, {
          name: '婚礼杂志册',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-03.png'
        },{
          name: '育儿家园',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-01.png'
        }, {
          name: '聪明宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-02.png'
        }, {
          name: '漂亮宝宝',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-03.png'
        }, {
          name: '快乐童年',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-04.png'
        }, {
          name: '婚礼杂志册',
          downloadNum: 11238,
          img: '/static/bfl-img/edit/temp/temp-03.png'
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
      filePageDataStr: '', // 编辑后的str数据
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
    isAllFill(newVal) { // 整本填充
      this.$confirm('您确定要自动填充整本页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$alert('填充成功', '提示', {
          type: 'success',
          showClose: false,
          confirmButtonText: '确定',
        }); 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消整本填充'
        });          
      });
      this.isAllFill = false
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
      if(newVal) {
        this.deskScale = 0.25
      } else {
        this.deskScale = ($('.canvas-box').width() / this.filePageData[0].pagewidth / 2 * 0.88).toFixed(2)
        // console.log(this.deskScale)
      }
      this.curPages = 0
      this.changeData(newVal)
    },
    $route(to, from){
      // console.log(to, from);
      if(to.query.curPages) this.curPages = to.query.curPages
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
    editListClick(name, idx, e) { // 点击左侧菜单栏-选择模板/布局
      $(e.target.closest('li')).siblings().removeClass('on')
      $(e.target.closest('li')).addClass('on')
      switch (name) {
        case '模板': // 模板
          console.log('模板', idx)
          break
        case '布局': // 布局
               
          break
      }
    },
    allowDrop(e) {},
    drag(name, idx, e) { // @dragstart: 在用户开始拖动元素时执行
      $(e.target.closest('li')).siblings().removeClass('on')
      $(e.target.closest('li')).addClass('on')
      this.dragType = name
      switch (name) {
        case '文字': // 文字
          this.fontFamily = this.editList[1].item[idx].title.split(' ')[0]
          break
        case '图片': // 图片
          console.log('图片', idx)          
          break
        case '装饰': // 装饰
          this.curDragDecorate = e.target        
          break
        case '背景': // 背景
          console.log('背景', idx)    
          break
        default:
          this.curDragImg = e.target
      }
    },
    toPrevPage() {
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
    toJson() {
      var data = {
        tplInfos: {
          page: this.filePageData,
          pagescount: 26,
          photocount: 15,
          name: "喜洋洋2"
        }
      }
      console.log(JSON.stringify(data))
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
      var i = $(e.target).closest('tr').index()
      if(this.oFileArr.length > 0) {
        this.oFileArr.forEach((item, idx)=> {
          if(i == item.code) {
            this.update(item.oFile, item.code)
            this.oFileArr.splice(idx, 1)
          }
        })
        console.log(this.oFileArr)
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
        'bucket': 'http://pcpwiayu4.bkt.clouddn.com', //七牛的地址(外链)，这个是你自己配置的（变量）
      };
      this.updatePicsList[idx].code = d.DateAdd('m', 1).Format('YYMMDDhhmmss') + Math.floor(Math.random()*10)
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
          'Content-Type': 'multipart/form-data'
        } 
      };
      //先从自己的服务端拿到token
      /*this.$axios.get('/token', this.qs.stringify(tokenParem))*/
      // this.$axios.get('/api/qiniu.html?t=qiniu', this.qs.stringify(tokenParem))
      this.$axios.get('http://222.73.182.225:8888/qiniu.html?t=qiniu', this.qs.stringify(tokenParem))
        .then(response => {
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
      this.$axios.post('http://upload.qiniu.com/', param, config)
        .then(res1 => { // 上传图片到七牛
        if(res1.status == 200) {
          var key = res1.data.key // 上传图片成功后七牛返回的图片key
          var hash = res1.data.hash // 上传图片成功后七牛返回的图片hash\
          // console.log('http://pcpwiayu4.bkt.clouddn.com/' + key) // 图片的线上路径
          this.$axios.get('http://pcpwiayu4.bkt.clouddn.com/' + key + '?imageInfo')
            .then(res2 => { // 从七牛获取图片基本信息
            if(res2.status == 200) {
              var imgInfo = res2.data
              let size = (imgInfo.size / 1024).toFixed(0) * 1
              var addParam = {
                'vipno': 4, // 用户编号
                'pgid': 1, //图片分类编号,没有给-1
                'md5co': hash, //图片md5,唯一
                'ImgPath': 'http://pcpwiayu4.bkt.clouddn.com/' + key,
                'PrimitiveWidth': imgInfo.width, //图片宽度
                'PrimitiveHeight': imgInfo.height, //图片高度
                'FileName': name,
                'filesize': size, //图片大小,单位为kb
              }
              this.$axios.post('http://222.73.182.225:8888/photo.html?t=add', addParam, { // 上传图片到服务器
                headers: {
                  "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
                } 
              }).then(res3 => {
                // console.log(res3);
                if(res3.status == 200) {
                  this.getUploadImgList()
                  if(res3.data.type == 1) {
                    updatePicsList[idx].upid = res3.data.data
                  }
                }
              })
            }
          })
        }
      })
    },
    getUploadImgList() {
      // this.dialogFormVisible = !this.dialogFormVisible
      var pics = $('ul.picList .pic')
      ;[].slice.call(pics).forEach((item, idx)=> {
        $(item).removeClass('on')
      })
      // 获取图片列表
      var params = {
        "vipno": 4, // --用户编号,必须
        "key": "",   // --关键词(文件名/路径),默认为空
        "pageindex": 1, // --当前页码
        "pagesize": 50  // --每页显示数量
      }
      this.$axios.post('http://222.73.182.225:8888/photo.html?t=search', params, {
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }).then(res => {
        this.isPicListLoading = false
        if(res.status == 200) {
          this.picListData = res.data.data
        }
      })
    },
    delOnePic(upid) { // 删除单张照片
      var params = {
        params: {
          "userid": 4, // --用户编号,必须
          "upid": upid,   // --图片编号
        }
      }
      this.$axios.get('http://222.73.182.225:8888/photo.html?t=del', params, {
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }).then(res => {
        // console.log(res);
        if(res.data.type == 1) {
          this.updatePicsList.forEach((item, idx)=> {
            if(item.upid == upid) {
              this.updatePicsList.splice(idx, 1)
            }
          })
          this.getUploadImgList()
          this.$message({
            type: 'success',
            message: res.data.msg
          });
        } else {
          this.$message.error(res.data.msg);
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
          this.filePicData.push(obj)
        }
      })
      this.isCheckedAll = false
      this.dialogFormVisible = false
    },
    delPic(idx) {
      this.filePicData.splice(idx, 1)
    },
    addCart() {
      this.isShowAddCart = true
    },
    getOldPageData(val) {
      // console.log('f--' + this.filePageData[this.oldPagesIdx].name, 'z--' + val.name)
      if(this.isSingle) {
        if(this.filePageData[this.oldPagesIdx].name == val.name) this.filePageData[this.oldPagesIdx] = val
      } else {
        // console.log(val[0].layer, val[1].layer)
        if(this.filePageData[this.oldPagesIdx].name == val[0].name) this.filePageData[this.oldPagesIdx] = val[0]
        if(this.filePageData[this.oldPagesIdx * 1 + 1].name == val[1].name) this.filePageData[this.oldPagesIdx * 1 + 1] = val[1]
      }
      this.filePageDataStr = JSON.parse(JSON.stringify(this.filePageData))
    },
    getSaveData(val) {
      if(this.isSingle) {
        if(this.filePageData[this.curPages].name == val.name) this.filePageData[this.curPages] = val
      } else {
        // console.log(val[0].layer, val[1].layer)
        if(this.filePageData[this.curPages].name == val[0].name) this.filePageData[this.curPages] = val[0]
        if(this.filePageData[this.curPages * 1 + 1].name == val[1].name) this.filePageData[this.curPages * 1 + 1] = val[1]
      }
      this.filePageDataStr = JSON.parse(JSON.stringify(this.filePageData))
    },
    /*getPagePrevData(val) {
      // console.log(this.filePageData[this.oldPagesIdx].name, val.name)
      if(this.filePageData[this.oldPagesIdx].name == val.name) this.filePageData[this.oldPagesIdx] = val
    },
    getPageNextData(val) {
      // console.log(this.filePageData[this.oldPagesIdx * 1 + 1].name, val.name)
      if(this.filePageData[this.oldPagesIdx * 1 + 1].name == val.name) this.filePageData[this.oldPagesIdx * 1 + 1] = val
    },*/
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
    changeData(isSingle) {
      if(isSingle) { // 单页编辑
        var data = this.tempData1.tplInfos.page
        /*for(var i = 0, len = data.length; i < len; i++) {
          this.layerLen = data[i].layer.length > this.layerLen ? data[i].layer.length : this.layerLen
        }*/
        this.filePageData = JSON.parse(JSON.stringify(data)) // 台历
        this.layerLen = this.filePageData[this.curPages].layer.length > this.layerLen ? this.filePageData[this.curPages].layer.length : this.layerLen
        this.pageJsonData = this.filePageData[this.curPages]
      } else { // 双页编辑
        var data = this.tempData2.tplInfos.page
        this.filePageData = JSON.parse(JSON.stringify(data))
        let len = this.filePageData[this.curPages].layer.length + this.filePageData[this.curPages * 1 + 1].layer.length
        this.layerLen = len > this.layerLen ? len : this.layerLen
        // 加上扉页
        /*this.filePageData.splice(2, 0, {
          text: '扉页,缤纷乐相册书从这里开始',
          index: '2',
          images: 'Templatethumb/feiYe.jpg'
        })*/
        // 相册数据
        /*this.pagePrevData = this.filePageData[this.curPages]
        this.pageNextData = this.filePageData[this.curPages * 1 + 1]*/
        // console.log(this.curPages, this.pagePrevData, this.curPages * 1 + 1, this.pageNextData)
        this.pageJsonData = []
        this.pageJsonData = [this.filePageData[this.curPages], this.filePageData[this.curPages * 1 + 1]]
      }
      this.filePageDataStr = JSON.parse(JSON.stringify(this.filePageData))
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
          var data = JSON.parse(JSON.stringify(this.filePageDataStr))
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
    /*loadView() {
      var data = JSON.parse(JSON.stringify(this.filePageDataStr))
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
    },*/
    toPrevView() {
      $('.flipbook').turn('previous')
    },
    toNextView() {
      $('.flipbook').turn('next')
    }
  },
  mounted() { 
    this.myFabric.namedImage()
    this.myFabric.myText()
    this.myFabric.myRect()
    this.myFabric.myCircle()
    this.myFabric.myTriangle()
    this.myFabric.myPath()
    this.isSaveFinished = false // 已完成保存-测试
    this.isSaveUnfinished = false // 未完成完成保存-测试

    this.changeData(this.isSingle)
    
    if(this.$route.query.curPages) {
      this.curPages = this.$route.query.curPages
      if(this.curPages > (this.filePageData.length - 1)) this.curPages = 0
    }

    var pageW = this.filePageData[0].pagewidth
    this.deskScale = ($('.canvas-box').width() / pageW / 2 * 0.88).toFixed(2)
    $(window).resize(function() {
      this.deskScale = ($('.canvas-box').width() / pageW / 2 * 0.88).toFixed(2)
    });

    var obj = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/FnnADUOMXNcdkqyRrDeccej8HlFr',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj)
    var obj1 = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/FlP3HMDAv4nuh5DJIeLn-fz0kyZS',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj1)
    var obj2 = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/Fj9kgD7FEdIEmCxN6d7S8Nv4XaIj',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj2)
    var obj3 = {
      src: 'http://pcpwiayu4.bkt.clouddn.com/FnvBAbDj-6cEYcrG6QDtbvwY9IlG',
      name: 'seying.jpg' 
    }
    this.filePicData.push(obj3)

    /*yepnope({
        test : Modernizr.csstransforms,
        yep: ['/static/bfl-js/turn/turn.js'],
        nope: ['/static/bfl-js/turn/turn.html4.min.js'],
        // both: ['css/basic.css'],
        complete: ()=> { // 加载完成后执行
          this.loadView()
        }
      });*/
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
.edit-list .item-list li {margin-bottom: 10px; color: #111;}
.edit-list .item-list li:nth-child(2n) {margin: -10px 0 0 0;}
.edit-list .item-list li img {display: inline-block; box-sizing: border-box; width: 95%; padding: 5px 28px; border: 2px solid #eee;}

/*.edit-list .item-list li img.on,*/
.edit-list .item-list li.on img {border: 2px solid rgb(58, 170, 146);}
.edit-list .file {position: relative; top: 150px; left: 50%; margin-left: -47px; display: inline-block; background: rgb(58, 170, 146); border-radius: 4px; overflow: hidden; color: #fff; text-decoration: none; text-indent: 0; line-height: 20px; padding: 8px 15px;}

.pics-box .main .top .btn.file input {position: absolute; -font-size: 100px; right: 0; top: 0; opacity: 0; width: 100%;}
.pics-box .main .top .btn.file input:hover {background: rgb(43, 155, 131); color: #fff; text-decoration: none;}

.edit-content {min-width: 1010px; position: absolute; top: 40px; bottom: 0px; right: 0px; left: 200px; min-height: 688px; -min-width: 1100px; overflow-y: auto;}

.edit .edit-content .edit-top-bor {position: fixed; z-index: 10; -width: 100%;background: #eee; border-radius: 4px; left: 200px; right: 0;}
.edit .edit-content .edit-top-bor ul {display: inline-block; font-size: 14px; color: #999;}
.edit .edit-content .edit-top-bor ul.edit-right {float: right;}
.edit .edit-content .edit-top-bor ul.edit-right i {color: #ff7800;}
.edit .edit-content .edit-top-bor ul li {display: inline-block; height: 40px; line-height: 40px; margin: 0 10px 0 2px;}
.edit .edit-content .edit-top-bor ul li > .btn {display: inline-block; border: 1px solid black; margin-left: 10px; cursor: pointer; border: 1px solid black; border-radius: 254px 16px 226px 16px/16px 226px 16px 254px; margin-bottom: 20px; padding: 0 18px; background: #fff; color: #ff7800; font-size: 20px;}
.edit .edit-content .edit-top-bor ul li.undo > a {color: #aaa; cursor: not-allowed;}
.edit .edit-content .edit-top-bor ul li.redo > a {color: #aaa; cursor: not-allowed;}
.edit .edit-content .edit-top-bor ul li i {margin: 0 10px; -color: #aaa;}
.edit .edit-content .edit-top-bor ul li i.icon-eye {color: #ff7800;}

.edit .edit-bottom {-width: 100%; height: 146px; position: fixed; left: 200px; right: 0; bottom: 0px; background: #eee; border-radius: 4px; font-size: 12px;}
.edit .edit-bottom .btn-box >div { display: inline-block;}
.edit .edit-bottom .btn-box >div a { display: inline-block; padding: 8px 18px;}
.edit .edit-bottom .btn-box .btn-left { margin-left: 60px;}
.edit .edit-bottom .btn-box .btn-left a { border: 1px solid transparent;}
.edit .edit-bottom .btn-box .btn-left a.on,
.edit .edit-bottom .btn-box .btn-left a:hover { background: #fff; border: 1px solid #ccc;}
.edit .edit-bottom .btn-box .btn-left span { color: #aaa; margin-left: 20px;}
.edit .edit-bottom .btn-box .btn-right {float: right; margin-right: 60px;}
.edit .edit-bottom .btn-box .btn-right li {display: inline-block;  padding: 8px 18px; cursor: pointer; position: relative; overflow: hidden;}
.edit .edit-bottom .btn-box .btn-right li .addPics {position: absolute; width: 66%; z-index: 10; opacity: 0;}
.edit .edit-bottom .btn-box .btn-right img,
.edit .edit-bottom .btn-box .btn-right input { vertical-align: middle; margin-right: 5px;}
.edit .edit-bottom .pic-box { position: relative; height: 110px; top: 5px;}
.edit i.btn-icon {z-index: 10; top: 43%; margin-top: -33px; padding-top: 5px;}
.edit .edit-bottom .pic-box i.btn-icon:before {color: #eee;}
.edit .edit-bottom .pic-box .img-list { position: absolute; top: 0px; bottom: 0px; left: 60px; right: 60px; overflow-x: auto; overflow-y: hidden; white-space: nowrap;}
.edit .edit-bottom .pic-box .img-list .ul1.pics-box {height: 105px; white-space: nowrap; position: relative; left: 0px; background: transparent;}
.edit .edit-bottom .pic-box .img-list .ul1 li {display: inline-block; text-align: center;}
.edit .edit-bottom .pic-box .img-list .ul1 li.pics {margin: 0 10px 0 0; position: relative; min-width: 90px; user-select: none;}
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

.table-box {width: 100%; max-height: 560px; border: 1px solid #e5e5e5; overflow-y: auto;}
.table-box table {width: 100%; line-height: 40px; text-align: center;}
.table-box table th {-width: 400px; text-align: center; background: #eee;}
.table-box table td {color: #ababab; border-bottom: 1px dashed #e5e5e5;}
.table-box table td .picName {display: inline-block; width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; vertical-align: middle;}
.table-box table td .btn {font-size: 14px; color: #34a88e; line-height: 26px;}
.table-box table td img {vertical-align: top;}
.table-box table td .todo {font-size: 14px; display: inline-block; width: 56px;}
.table-box table td .todo.btn-text.danger {color: #f56c6c;}

.dialogCSS h1 {font-size: 20px; color: #000; text-align: left;}
.dialogCSS h1 > img {vertical-align: middle; margin-right: 16px; position: relative; top: -2px;}
.dialogCSS p {text-align: center; font-size: 18px;}
.dialogCSS p.price-box {padding: 68px 0;}
.dialogCSS p.price-box i {font-size: 24px; margin-right: 12px; vertical-align: middle; color: #34a88e;}
.dialogCSS p.price-box .money {color: #ff7800;}
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
.moreDialog .box ul.main li {display: inline-block; width: 15.2%; height: 180px; border: 2px solid #d4d4d4;  background: center / contain no-repeat; margin: 0 40px 30px 0;}
.moreDialog .box ul.main li.on,
.moreDialog .box ul.main li:hover {border-color: #3aaa92;}
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
    background: #f8f8f9 url(/static/bfl-img/edit/scroll.png) center / contain no-repeat;
}
.moreDialog .box ul::-webkit-scrollbar-thumb:horizontal {
    border: 2px solid #d4d4d4;
    -webkit-border-radius: 0;
    box-sizing: border-box;
    background: #f8f8f9 url(/static/bfl-img/edit/scroll.png) center / contain no-repeat;
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
@media screen and (max-width: 1213px) {
  .edit .edit-bottom .btn-box .btn-right {margin-right: 20px;}
}

</style>  