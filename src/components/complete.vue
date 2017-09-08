<!-- 手机绑定成功 -->

<template>
  <section class="msg-info">
    <msg title="绑定成功" :icon="icon"></msg>
  </section>
</template>

<script>
import { Msg } from 'vux'
import store from '../store.js'
export default {
  components: {
    Msg
  },
  data() {
    return {
      icon: ''
    }
  },
  methods: {
    changeIcon() {
      if (!this.icon || this.icon === 'success') {
        this.icon = 'warn';
      }
      else if (this.icon === 'warn') {
        this.icon = 'info';
      }
      else if (this.icon === 'info') {
        this.icon = 'waiting';
      }
      else if (this.icon === 'waiting') {
        this.icon = 'success';
      }
      else {
        this.icon = 'success';
      }
    }
  },
  created() {
    // this.changeIcon();
    store.commit('LOADED');
  }
}
</script>

<style lang="less">
.msg-info {
  margin-top: 100px;
}
</style>
