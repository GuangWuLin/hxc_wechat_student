<template>
  <div id="app">
    <router-view v-wechat-title="$route.name"></router-view>
    <loading v-model="isLoading" :text="text"></loading>
  </div>
</template>

<script>
  import {
    Loading
  } from 'vux'
  import store from './store.js'
  export default {
    name: 'app',
    data() {
      return {
        text: '加载中 ...'
      }
    },
    components: {
      Loading
    },
    computed: {
      isLoading: {
        get: function() {
          return store.state.isLoading
        },
        set: function() {
          return store.state.isLoading
        }
      }
    }
  }
  // reset.less 取消会影响到之后页面的布局。
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  body {
    background-color: #EFEFF4;
    overflow: hidden;
  }
  
  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }
  
  .dialog-demo {
    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 8px;
    }
    .dialog-title {
      line-height: 30px;
      color: #666;
    }
    .img-box img {
      border-radius: 5px;
    }
    .vux-close {
      margin-top: 8px;
      margin-bottom: 10%;
    }
  }
  
  .fixed-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #1F2D3D;
    background: transparent;
    line-height: 45px;
    font-size: .9rem;
    .bottom-inner {
      display: -webkit-box;
      display: flex;
      display: -webkit-flex;
      .left-info {
        flex: 1;
        -webkit-flex: 1;
        padding-left: 8px;
        -webkit-box-flex: 1;
        border-top: 1px solid #D3DCE6;
        ul li {
          margin-right: 2px;
          display: inline-block;
          em {
            color: #FF3457;
            font-style: normal;
          }
        }
      }
      .right-link {
        width: auto;
        border-top: 1px solid #1AAD19;
        .weui-btn {
          border-radius: 0;
          line-height: 45px;
        }
      }
    }
  }
</style>
