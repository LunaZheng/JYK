<template>
  <div id="app">
    <vueHeader v-show="!is404"></vueHeader>
    <router-view/>
  </div>
</template>

<script>
import vueHeader from '@/components/vueHeader'

export default {
  name: 'App',
  components: {
    vueHeader,
  },
  data () {
    return {
      is404: false,
    }
  },
  watch: {
    $route(newVal, oldVal){
      this.is404 = newVal.name == undefined ? true : false
      if(oldVal) {
        this.$store.commit('setOldRouter', oldVal.path)
      }
    }
  },
  created() {
    this.is404 = this.$route.name == undefined ? true : false
  }
}
</script>