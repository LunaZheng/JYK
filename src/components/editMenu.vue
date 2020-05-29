<template>
  <div class="editMenu">
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
          <div class="dialog-box" @click="stopBubble">
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
                <li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14.62%; height: 90px; margin: 0 20px 2px 0;">
                </li><!-- 
                 --><li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14.62%; height: 90px; margin: 0 20px 2px 0;">
                </li><!-- 
                 --><li v-for="(v, i) in item.item" :style="'background-image: url(' + v.img + ');'" style="width: 14.62%; height: 90px; margin: 0 20px 2px 0;">
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
      <span class="file" @click="$emit('getShowAddPicsDialog', true)">添加照片</span>
    </ul>
    <!-- 添加图片 - 模态框 -->
    <el-dialog :visible.sync="isShowAddPics" width="74%">
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
    <!-- 查看大图 -->
    <el-dialog class="myDialog" :visible.sync="innerVisible">
      <div class="loading-box" v-if="isImgLoading">
        <i class="el-icon-loading"></i><br>
        <span>loading...</span>
      </div>
      <img class="maskImg" :src="curViewPicUrl" alt="" @load="isImgLoading = false">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'editMenu',
  props: ["isShowAddPicsDialog"],
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
      curShowListIdx: -1, // 当前左侧列展开的项 idx
      curChangeIconIdx: -1, // 当前左侧列 icon 触发的 idx
      isShowMore: false, // 跟多
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
      
      picFoldersList: [
        {value: '2018-08-02', label: '2018-08-02'},
        {value: '2018-08-03', label: '2018-08-03'},
        {value: '2018-08-04', label: '2018-08-04'},
      ],
      curPicTab: 1,
      isPicListLoading: true, // 添加照片-正在加载照片列表
      picListData: '', // 添加照片-照片列表
      isCheckedAll: false, // 添加照片-是否全选
      updatePicsList: [], // 上传照片的本地数据
      curSaveFolder: 1, // 要保存的文件夹
      newFolderName: '', // 新文件夹
      existFolders: '', // 已有文件夹
      oFileArr: [], // 上传的文件数据
      isShowAddPics: false, // isShowAddPicsDialog
      innerVisible: false, // 图片预览
      isImgLoading: true, // 图片预览-loading
      curViewPicUrl: '', // 图片预览路径
      isDisable: false, // 防止重复点击
    }
  },
  watch: {
    isShowAddPicsDialog(newVal) {
      this.isShowAddPics = newVal
    },
    isShowAddPics(newVal) {
      this.$emit('getShowAddPicsDialog', newVal)
      if(newVal) {
        this.getUploadImgList()
      }
    },
    deep: true
  },
  methods: {
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
    editListClick(name, idx, e) {
      $(e.target.closest('li')).siblings().removeClass('on')
      $(e.target.closest('li')).addClass('on')
      switch (name) {
        case '模板': // 模板
          console.log('模板', idx)
          break
        /*case '文字': // 文字
          let fontFamily = this.editList[1].item[idx].title.split(' ')[0]
          console.log(idx, fontFamily)
          this.curEditFont = ''
          this.isEditFont = true
          break
        case '背景': // 背景
             
          break
        case '图片': // 图片
          console.log('图片', idx)          
          break
        case '装饰': // 装饰
          console.log('装饰', idx)          
          break*/
        case '布局': // 布局
               
          break
      }
      if(name != "文字") {
        // this.isAddtext = false
      }
    },
    stopBubble(e) { // 禁止事件冒泡
      if ( e && e.stopPropagation ) {
        e.stopPropagation();  // 非IE浏览器
      } else {
        window.event.cancelBubble = true;  // IE取消事件冒泡 
      }
    },
    toPrevTemp() {
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
        }, (this.layerLen + 1) * 100)
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
        }, (this.layerLen + 1) * 100)
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
    addPics() { // 添加照片到底部拖拽栏
      var pics = $('ul.picList .pic')
      ;[].slice.call(pics).forEach((item, idx)=> {
        var pic = $(item)
        if(pic.hasClass("on")) {
          console.log(pic)
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
    drag(name, idx, e) { // @dragstart: 在用户开始拖动元素时执行
      $(e.target.closest('li')).siblings().removeClass('on')
      $(e.target.closest('li')).addClass('on')
      this.dragType = name
      switch (name) {
        case '文字': // 文字
          // this.fontFamily = this.editList[1].item[idx].title.split(' ')[0]
          this.$emit('getFontFamily', this.editList[1].item[idx].title.split(' ')[0])
          break
        case '图片': // 图片
          console.log('图片', idx)          
          break
        case '装饰': // 装饰
          // this.curDragDecorate = e.target  
          this.$emit('getCurDragDecorate', e.target)      
          break
        case '背景': // 背景
          console.log('背景', idx)    
          break
        default:
          // this.curDragImg = e.target
          this.$emit('getCurDragImg', e.target)
      }
    },
  },
  mounted() {
    if(this.isShowAddPicsDialog) {
      this.isShowAddPics = true
    }
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
.edit-list .file {position: relative; top: 150px; left: 50%; margin-left: -47px; display: inline-block; background: rgb(58, 170, 146); border-radius: 4px; overflow: hidden; color: #fff; text-decoration: none; text-indent: 0; line-height: 20px; padding: 8px 15px; cursor: pointer;}
.edit-list .file:hover {background: rgba(58, 170, 146, 0.8);}

.nemu-box {width: 200px; min-height: 700px; background: #eee; text-align: center;}
.nemu-box .til {height: 46px; line-height: 48px;}
.nemu-box .nemuList {}
.nemu-box .nemuList li {background: #fff; height: 46px; line-height: 46px; border-radius: 4px; margin: 1px; margin-top: 0; font-size: 14; color: #999;}
.nemu-box .nemuList li > img {vertical-align: middle; margin-right: 10px;}
.nemu-box .nemuList li > span {vertical-align: middle;}
.pics-box .main .top .btn.file input {position: absolute; -font-size: 100px; right: 0; top: 0; opacity: 0; width: 100%;}
.pics-box .main .top .btn.file input:hover {background: rgb(43, 155, 131); color: #fff; text-decoration: none;}
.pics-box {position: absolute; top: 0; bottom: 0; left: 200px; right: 0;}
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
.pics-box .main .footer .saveLocation .radio-box .el-box {display: inline-block; height: 34px; line-height: 34px; width: 138px; margin-left: 18px; padding: 0 5px;}
.pics-box .main .footer .saveLocation .radio-box .name {cursor: pointer;}
.pics-box .main .footer .saveLocation .radio-box .name i.circular {display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ccc; vertical-align: top; margin-top: 12px; margin-right: 14px;}
.pics-box .main .footer .saveLocation .radio-box .name i.circular.on {border-color: #f5610c;}
.isLoading {font-size: 18px; color: #999; text-align: center; margin-top: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0;}

.table-box {width: 100%; max-height: 560px; border: 1px solid #e5e5e5; overflow-y: auto;}
.table-box table {width: 100%; line-height: 40px; text-align: center;}
.table-box table th {-width: 400px; text-align: center; background: #eee;}
.table-box table td {color: #ababab; border-bottom: 1px dashed #e5e5e5;}
.table-box table td .picName {display: inline-block; width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; vertical-align: middle;}
.table-box table td .btn {font-size: 14px; color: #34a88e; line-height: 26px;}
.table-box table td img {vertical-align: top;}
.table-box table td .todo {font-size: 14px; display: inline-block; width: 56px;}
.table-box table td .todo.btn-text.danger {color: #f56c6c;}

.moreDialog .dialog-box {padding: 26px 50px 20px 50px;}
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
.moreDialog .decorateMenu {position: absolute; width: 230px; top: 76px; bottom: 20px; border: 1px solid #e4e4e4; background: #eee;}
.moreDialog .filterList {padding: 0 36px;}
.moreDialog .filterList > li {font-size: 18px;}
.moreDialog .filterList .item {display: inline-block;}
.moreDialog .filterList .item li {display: inline-block; font-size: 16px; padding: 0 20px;}
.moreDialog .filterList .item li:hover,
.moreDialog .filterList .item li.on {color: #34a88e;}
.moreDialog .display-box {width: 100%; height: 302px; margin-top: 30px; position: relative;}
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
.moreDialog .temp-box i.btn-icon,
.moreDialog .display-box i.btn-icon {margin-top: -33px;}

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

@media screen and (min-width: 1600px) {
  .nemu-box {width: 212px;}
  .pics-box {left: 212px;}
  .pics-box .main .top .tip {width: 86%;}
}
</style>