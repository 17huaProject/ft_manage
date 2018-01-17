<template>
  <div id="app">
    <div id="bk_img"></div>
    <city v-bind:cityModel="true"></city>
    <search></search>
    <logo></logo>
    <img id='home_tab_more_icon' @click="routerGo('/mp')" src="../../static/obj_img/home_tab_more_icon.png">
    <img id='home_tab_my_icon' @click="routerGo('/ac')" src="../../static/obj_img/home_tab_my_icon.png">
    <div id="bottom_button_index" @click="routerGo('/list')">
      <div>发现与众不同</div>
      <img src="../../static/obj_img/home_icon_ArrDown.png">
    </div>
  </div>
</template>

<script>
import search from './ForIndex/Search.vue'
import city from './ForIndex/city.vue'
import logo from './ForImgLocal/logo.vue'
export default {
  data() {
    return {

    }
  },
  methods: {
    routerGo: function (paths) {
      this.$router.push({ path: paths })
    },
  },
  computed: {

  },
  components: { search, logo, city }
}
</script>

<style>
#bk_img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: url('../../static/obj_img/home_img_bk.png') no-repeat;
  background-size: cover;
}

#home_tab_more_icon {
  position: absolute;
  left: 23%;
  top: 67%;
  width: 11.1%;
}

#home_tab_my_icon {
  position: absolute;
  right: 23%;
  top: 67%;
  width: 11.1%;
}

#bottom_button_index {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding-bottom: 24px;
}

#bottom_button_index div {
  width: 100%;
  text-align: center;
  color: #ffffff;
  font-size: 14px;
}

#bottom_button_index img {
  position: absolute;
  left: 50%;
  bottom: 0;
  margin-left: -10px;
  height: 20px;
  -webkit-animation: rdownStatr 1s infinite
}

@-webkit-keyframes rdownStatr {
  from {
    bottom: 10px;
    opacity: 0.5
  }
  to {
    bottom: 0;
    opacity: 1
  }
}
</style>
