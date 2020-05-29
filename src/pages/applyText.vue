<template>
  <div v-html="apply">{{apply}}</div>
</template>

<script>
export default {
  name: 'applyText',
  data () {
    return {
      apply: '',
    }
  },
  methods: {
    
  },
  mounted() {
    let form = this.$route.query.htmls
    this.apply = form;
    this.$nextTick(()=> {
      document.forms[0].submit()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>