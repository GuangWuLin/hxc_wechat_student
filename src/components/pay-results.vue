<!-- 支付结果 -->

<template>
  <section class="msg-info">
    <msg :icon="icon" description>
      <p slot="description">
        你成功支付了
        <em>10.00</em>元
      </p>
    </msg>
  </section>
</template>

<script>
import { Msg } from 'vux'

export default {
  components: {
    Msg
  },
  data() {
    return {
      icon: ""
    }
  },
  methods: {
    changeIcon() {
      // console.log(this.icon);
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
    },
    
  },
  mounted() {
    this.changeIcon();
  }
}
</script>

<style lang="less">
.msg-info {
  margin-top: 100px;
  .weui-icon_msg {
    font-size: 50px;
  }
  .weui-msg__desc {
    color: #1F2D3D;
    font-size: 15px;
    em {
      color: #FF3457;
      font-style: normal;
      margin-right: 5px;
    }
  }
}
</style>
