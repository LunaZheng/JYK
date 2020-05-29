<template>
  <div class="logo wrap">
    <router-link to="/" class="">
      <img src="/static/bfl-img/common/logo.png" alt="">
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'logo',
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {height: 70px;}
.logo a {height: 100%; display: inline-block;}
.logo img {height: 74%; margin-top: 10px;}
</style>