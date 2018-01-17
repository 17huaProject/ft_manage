<template>
  <div id="app">
    <city></city>
    <search></search>
    <logo></logo>
  </div>
</template>

<script>
 
  import search from './components/ForIndex/Search.vue'
  import city from './components/ForIndex/city.vue'
  import logo from './components/ForImgLocal/logo.vue'
  export default {
    data () {
      return {
        
      }
    },
    components: {search,logo,city}
  }
</script>

<style>
  /*#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }*/
</style>
