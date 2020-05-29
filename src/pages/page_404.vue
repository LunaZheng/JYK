<template>
  <div class="page_404">
    <div class="txtbg404">
      <img src="/static/bfl-img/page404.png" alt="">
      <div class="txtbox">
        <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
        <p>
          <el-button plain><router-link to="/index">返回网站首页</router-link></el-button>
          <el-button type="primary" plain @click="$router.go(-1)">返回上一页面</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page_404',
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page_404 {width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;}
.txtbg404 img {width: 360px; margin: 100px 0 30px;}
.txtbg404 .txtbox {width: 390px; color:#333; font-size:13px;}
.txtbg404 .txtbox p {text-align: center; margin-top: 20px;}
</style>