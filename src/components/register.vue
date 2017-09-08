<!-- 用户手机绑定 -->
<template>
  <section>
    <group>
      <div class="weui-cell weui-cell_vcode">
        <div class="weui-cell__hd">
          <label class="weui-label">手机号</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="tel" placeholder="请输入手机号" v-model="mobile">
        </div>
        <div class="weui-cell__ft">
          <a href="javascript:;" class="weui-vcode-btn" @click='getCheckCode' v-if='!showCount'>获取验证码</a>
          <div v-else style='color:#1AAD19;'>
            <countdown v-model="time" @on-finish="finish"></countdown>
            秒后重试
          </div>
        </div>
      </div>
      <div class="weui-cell weui-cell_vcode">
        <div class="weui-cell__hd">
          <label class="weui-label">验证码</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="tel" @keyup='enterCode' v-model="checkCode" placeholder="请输入验证码">
        </div>
      </div>
    </group>
  
    <box gap="20px 20px">
      <x-button type="primary" :disabled='isClick' @click.native='bindInfo'>下一步</x-button>
    </box>
    <!--失败的提示-->
    <toast v-model="showMsg" :type='type' :text='text'></toast>
  </section>
</template>

<script>
  import {
    Box,
    XButton,
    Toast,
    Group,
    Countdown
  } from "vux"
  import {
    global
  } from '../assets/javascript/global.js'
  import {
    request
  } from '../api/api.js'
  import store from '../store.js'
  
  export default {
    components: {
      Box,
      Group,
      Toast,
      XButton,
      Countdown
    },
    data() {
      return {
        mobile: "",
        showMsg: false,
        showCount: false,
        isClick: true,
        text: '',
        checkCode: '',
        openId: '',
        redirectUrl: '',
        type: '',
        time: 120
      }
    },
    methods: {
      finish() {
        this.showCount = false;
      },
      enterCode(v) {
        if (this.checkCode.length === 6) this.isClick = false;
      },
      // 获取验证码
      getCheckCode() {
        // this.showCount = true;
        let args = {
          phone: this.mobile
        };
        if (args.phone.length > 0) {
          if (global.fieldVerification.IsPhone(Number(args.phone))) {
            request.Authorize.verificationCode(args).then(res => {
              if (res.success) {
                this.showCount = true;
                this.type = 'text';
                this.text = '短信验证码已发送';
                this.showMsg = true;
              } else {
                this.type = 'text';
                this.text = res.message;
                this.showMsg = true;
              }
            });
          } else {
            this.type = 'text';
            this.text = '请输入正确的电话号码';
            this.showMsg = true;
          }
        } else {
          this.type = 'text';
          this.text = '手机号不能为空';
          this.showMsg = true;
        }
      },
      // 绑定用户手机
      bindInfo() {
        const args = {
          phone: this.mobile,
          code: this.checkCode,
          openId: this.openId,
          redirectURL: this.redirectUrl
        }
        if (!args.phone) {
          this.type = 'text';
          this.showMsg = true;
          this.text = '手机号码不能为空';
        } else if (!global.fieldVerification.IsPhone(Number(args.phone))) {
          this.type = 'text';
          this.text = '请输入正确的手机号码';
          this.showMsg = true;
        } else {
          request.Authorize.wx_Infobind(args).then(res => {
            // global.printLog(res);
            if (res.success) {
              let tmpObj = res.object.loginUser;
              tmpObj.openId = res.object.openId;
              tmpObj.redirectUrl = res.object.redirectUrl;
              sessionStorage.setItem('token', JSON.stringify(tmpObj));
              this.$router.push({
                path: '/'
              });
            } else {
              this.type = 'text';
              this.showMsg = true;
              this.text = res.message;
            }
          });
        }
      },
      getDataFromUrl() {
        var path = this.$route;
        // console.log(path);
        store.commit('LOADED');
        this.openId = path.query.openId;
        this.redirectUrl = path.query.redirectUrl;
      }
    },
    created() {
      this.getDataFromUrl();
    },
  
  }
</script>

<style lang="less">
  .weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      left: 15px;
      z-index: 2;
    }
  }
  
  .weui-label {
    display: block;
    width: 105px;
    word-wrap: break-word;
    word-break: break-all;
  }
  
  .weui-cell__bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }
  
  .weui-cells_form input {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  
  .weui-input {
    width: 100%;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: inherit;
    color: inherit;
    height: 1.47058824em;
    line-height: 1.47058824;
  }
  
  .weui-cells_form .weui-cell__ft {
    font-size: 0;
  }
  
  .weui-cell__ft {
    text-align: right;
    color: #999999;
  }
  
  button.weui-vcode-btn {
    background-color: transparent;
    border-top: 0;
    border-right: 0;
    border-bottom: 0;
    outline: 0;
  }
  
  .weui-cell_vcode .weui-vcode-btn {
    display: inline-block;
    height: 23px;
    margin-left: 5px;
    padding: 0 0.6em 0 0.7em;
    border-left: 0 solid #E5E5E5;
    line-height: 23px;
    vertical-align: middle;
    font-size: 17px;
    color: #3CC51F;
  }
</style>