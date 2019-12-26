<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
// import 'element-ui/lib/theme-chalk/index.css';
export default {
  name: 'app',
  created () {
      let theme
      if(localStorage.getItem('theme')){
          theme = localStorage.getItem('theme')
      }else{
          theme = this.defaultTheme;
      }
      document.querySelector('link[name="index"]').setAttribute('href', './static/' +theme+ '/index.css')
      document.querySelector('link[name="color"]').setAttribute('href', './static/' +theme+ '/color.css')
  }
}
</script>

<style>
    /* @import 'element-ui/lib/theme-chalk/index.css'; */
    /* @import './assets/css/theme/light_green/color.css';
    @import './assets/css/theme/light_green/index.css' */
</style>