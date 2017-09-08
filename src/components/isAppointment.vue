<template>
  <section class='wrapper'>
    <img src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVoomAIddXAAAqkLh5VYk640.png">
    <p>对不起，您不是预约学员</p>
  </section>
</template>

<script>
  import store from '../store.js'
  export default {
    created() {
      store.commit('LOADED');
    }
  }
</script>

<style lang='less'>
  .wrapper {
    text-align: center;
    margin: 30% 10%;
    img {
      margin-bottom: 3%;
      width: 200px;
      height: 200px;
      border-radius: 4px;
    }
  }
</style>
