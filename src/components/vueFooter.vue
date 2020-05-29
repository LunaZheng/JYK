<template>
  <div class="vueFooter">
    <slot name="medal"></slot>
    <div class="btm-box">
      <div class="main">
        <span>关于我们</span>
        <span>商家合作</span>
        <span>合作咨询</span>
        <span>使用协议</span>
        <span>诚聘英才</span>
        <span>网站地图</span>
        <span>帮助中心</span>
      </div>
      <p class="wrap">沪ICP备18045062号-1 Copyright © 2018 佳印客版权所有 </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vueFooter'
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vueFooter {background: #f9f9fc; width: 100%;}
.vueFooter .btm-box {height: 94px;}
.vueFooter .btm-box .main {display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center;}
.vueFooter .btm-box .main span {display: inline-block; color: #666; font-size: 16px; margin: 18px 24px 26px 0px; padding-right: 24px; border-right: 1px solid #ccc;}
.vueFooter .btm-box .main span:last-child {border-right: none;}
.vueFooter .btm-box p {text-align: center; color: #999; font-size: 14px; -padding: 10px;}
</style>
