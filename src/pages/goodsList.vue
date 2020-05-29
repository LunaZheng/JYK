<template>
  <div class="goodsList">
    <logo></logo>
    <navMenu :isTakeup="isTakeup" @getSortItems="getSortItems"></navMenu>
    <div class="wrap">
      <div class="list-box">
        <ul class="sort-bar">
          <li v-for="(detail, idx) in sortList.productpro" :class="{'on': curDetailIdx == idx}" @click="changeCurDetail(idx)">
            <a href="javascript:">{{detail.proname}}</a>
          </li>
          <!-- <li @click="isShowAll = true" :class="{'on': isShowAll}">
            <a href="javascript:">全部</a>
          </li> -->
        </ul>
        <ul class="detail-list">
          <li v-for="(item, idx) in goodsList">
            <div class="img-box">
              <router-link :to="{path: 'productDetail', query: {tpid: item.tpid }}" :key="idx">
                <img v-lazy="item.thumbpic" alt="">
              </router-link>
            </div>
            <div class="sale-box">
              <span class="price">￥{{0}}元</span>
              <span class="num">销量: {{item.totalcount}}</span>
            </div>
            <p class="info">
              <router-link :to="{path: 'productDetail', query: {tpid: item.tpid }}" :key="idx">
                {{item.caption}}
              </router-link>
            </p>
          </li>
          <li class="empty" v-if="goodsList.length == 0">暂无数据</li>
        </ul>
      </div>
      <!-- 分页栏 -->
      <div class="paging-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <vueFooter>
      <div slot="medal" class="medal">
        <div class="wrap">
          <img src="/static/bfl-img/footer.png" alt="">
        </div>
      </div>
    </vueFooter>
  </div>
</template>

<script>
import logo from '@/components/logo'
import navMenu from '@/components/navMenu'
import vueFooter from '@/components/vueFooter'

export default {
  name: 'goodsList',
  components: {
    logo,
    navMenu,
    vueFooter,
  },
  data () {
    return {
      pageSize: 16,
      curPage: 1,
      total: 400,
      isTakeup: false,
      // curDetail: '热门台历',
      curDetailIdx: -1,
      // isShowAll: false,
      isShowMenu: false,
      sortList: [],
      goodsList: [],
    }
  },
  watch: {
    $route(to, from) {
      // console.log(to.query.sort);
      this.curDetailIdx = 0
    },
    curDetailIdx(newVal) {
      if(newVal > -1) {
        this.getGoods(this.sortList, newVal)
      }
    },
    sortList(newVal) {
      this.getGoods(newVal, this.curDetailIdx)
    },
    deep: true
  },
  methods: {
    handleCurrentChange(val) { // 当前页
      this.curPage = val
    },
    /*changeCurDetail(cur, e) {
      this.curDetail = cur
      this.isShowAll = (cur === '全部' ? true : false)
    },*/
    changeCurDetail(idx) {
      // this.isShowAll = false
      this.curDetailIdx = idx
    },
    getIsShowMenu(val) {
      this.isShowMenu = val
    },
    getSortItems(val) {
      this.sortList = val
      this.curDetailIdx = 0
    },
    getGoods(sortList, idx) {
      var params = {
        "ProType": sortList.protype,// --大类编号,url参数获取
        "ProID": sortList.productpro[idx].proid, // --小类编号  url获取
        "OR": 1, // --排序方向  0正序 1倒序
        "OS": 1, // --排序    1时间 2浏览量 3下载量
        "TagID": 1, // --标签编号,可为空
        "Key": "",// --搜索关键词,可为空
        "PageIndex": 1, // --当前页码
        "PageSize": 20  // --每页显示数量
      }
      this.$axios.post(this.sApi.template + '?t=search', params).then(response => {
        let res = response.data
        if(res.type == 1)  this.goodsList = res.data
        // console.log(this.goodsList)
      })
    }
  },
  mounted() {
    // this.$router.currentRoute.query.sort
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goodsList .list-box .sort-bar {border-bottom: 2px solid #35a78e; margin: 36px auto 68px;}
.goodsList .list-box .sort-bar li {height: 50px; line-height: 50px; text-align: center; display: inline-block; font-size: 20px;}
.goodsList .list-box .sort-bar li a {padding: 0 36px; border-right: 1px solid #eee; color: #666;}
.goodsList .list-box .sort-bar li:hover,
.goodsList .list-box .sort-bar li.on {background: #35a78e;}
.goodsList .list-box .sort-bar li:hover a,
.goodsList .list-box .sort-bar li.on a {border-right: 1px solid transparent; color: #fff;}
.goodsList .list-box .sort-bar li:last-child a {border-right: 1px solid transparent;}
.goodsList .list-box .detail-list li {width: 23.6%; text-align: center; display: inline-block; border: 1px solid #eee; margin-right: 1.8%; margin-bottom: 32px;}
.goodsList .list-box .detail-list li.empty {width: 100%; border: none; margin-bottom: 100px; font-size: 20px;}
.goodsList .list-box .detail-list li:nth-child(4n) {margin-right: 0;}
.goodsList .list-box .detail-list li .img-box {width: 100%; height: 260px; margin: 30px auto 11.36%;}
.goodsList .list-box .detail-list li img {width: 91.5%; max-height: 222px;}
.goodsList .list-box .detail-list li .sale-box {padding: 0 16px 26px 26px; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; font-size: 18px;}
.goodsList .list-box .detail-list li .sale-box .price {color: #e76811;}
.goodsList .list-box .detail-list li .sale-box .num {color: #aaa;}
.goodsList .list-box .detail-list li .info {color: #888; text-align: left; padding: 0 16px 38px 16px; font-size: 18px;}
</style>
