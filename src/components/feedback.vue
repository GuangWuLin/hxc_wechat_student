<!-- 用户回馈 -->
<template>
  <section>
    <div class="feedback">
      <div class="feedback-top">
        <label>意见所属类别</label>
        <checker v-model="checked" type="radio" default-item-class="checker-item" selected-item-class="checker-item-selected">
          <checker-item v-for="(item,index) in allTags" :key="index" :value="item.key">{{item.value}}</checker-item>
        </checker>
      </div>
      <div class="feedback-middle">
        <label>反馈内容</label>
        <x-textarea :max="200" placeholder="给点反馈和建议" @on-focus='onTextFocus' :cols="10" :autosize="true" v-model='feedMsg'></x-textarea>
        <div class="upload-inner">
          <div class="inner-view" v-if="uploadList.length">
            <div class="view-item" v-for="(item,index) in uploadList" :key="index">
              <img :src="item" />
              <a href="javascript:;" class="item-close" @click="deleteItem(index)"></a>
            </div>
          </div>
          <a href="javascript:;" class="inner-upload" v-else>
            <fileupload target="http://api.wechat.haoxueche.com/hxc/file/uploadFile" name="fileUpload" action="POST" class="upload-file" v-on:start="startUpload" v-on:finish="finishUpload"></fileupload>
          </a>
        </div>
      </div>
    </div>
    <div class="fixed-bottom feedback" style='position:static;'>
      <div class="bottom-inner">
        <x-button type="primary" @click.native='submit' ref='XBtn'>提交</x-button>
      </div>
    </div>
    <!--提示-->
    <toast v-model="showMsg" :type='type'>{{messages}}</toast>
  </section>
</template>

<script>
import { Toast, Scroller, XButton, Checker, CheckerItem, XTextarea, Sticky } from 'vux'
import {
  global
} from '../assets/javascript/global.js'
import {
  request
} from '../api/api.js'
import store from '../store.js'
import FileUpload from "../components/common/FileUpload.vue";
export default {
  components: {
    Scroller,
    Toast, XButton, Checker, CheckerItem, XTextarea, Sticky,
    "fileupload": FileUpload
  },
  data() {
    return {
      type: "",
      checked: [],
      allTags: [
        {
          key: 'COMPLAINT_TEACHERS',
          value: '投诉教练'
        },
        {
          key: 'COMPLAINT_WORKS',
          value: '投诉工作人员'
        },
        {
          key: 'SUGGESTION_EX',
          value: '建议用户体验'
        },
        {
          key: 'SUGGESTION_LOSE',
          value: '建议功能缺失'
        },
        {
          key: 'SUGGESTION_OTHER',
          value: '其他'
        }
      ],
      feedMsg: '',
      userInfo: JSON.parse(sessionStorage.getItem('token')),
      messages: "",
      showMsg: false,
      uploadList: []
    }
  },
  methods: {
    onTextFocus() {
      // console.log(this.$refs.XBtn.$el.style);
      // console.log(111)
      // let Xbt = this.$refs.XBtn.$el;
      // Xbt.style.position = 'absolute';
      // Xbt.style.bottom = -400;
    },
    submit() {
      if (this.userInfo) {
        let feedMsg = this.feedMsg;
        if (feedMsg === "") {
          this.type = "text";
          this.messages = "请填写反馈内容";
          this.showMsg = true;
        }
        else if(!this.checked.length){
          this.type = "text";
          this.messages = "请选择意见类别标签";
          this.showMsg = true;
        }
        else {
          // let args = {
          //   openId: "123",
          //   studentId: 1,
          //   csContent: this.feedMsg,
          //   csImg: this.uploadList[0],
          //   userTypeEnum: 'STUDENT',
          //   schoolCode: 123456,
          //   csTypeEnum: this.checked
          // };
          let args = {
            openId: this.userInfo.openId,
            studentId: this.userInfo.studentId,
            csContent: this.feedMsg,
            csImg: this.uploadList[0],
            userTypeEnum: 'STUDENT',
            schoolCode: this.userInfo.schoolCode,
            csTypeEnum: this.checked
          };
          // console.log(args);
          request.feedback.ComplaintSuggestion(args).then(res => {
            if (res.success) {
              this.feedMsg = "";
              this.checked = [];
              this.uploadList = [];
              this.type = "success";
              this.messages = "反馈提交成功";
            } else {
              this.type = "warn";
              this.messages = "反馈提交失败";
            }
            this.showMsg = true;
          });
        }
      }
      else {
        this.type = "text";
        this.messages = "请先登录";
        this.showMsg = true;
      }
    },
    startUpload(e) {
      // console.log("startUpload");
    },
    finishUpload(e) {
      let status = e.target.status;
      let response = e.target.response;
      if (status === 200) {
        let result = JSON.parse(response);
        if (result.success) {
          this.uploadList.push(result.object[0])
        }
      }
    },
    deleteItem(index) {
      this.uploadList.splice(index, 1);
    }
  },
  created() {
    this.uploadList = [];
    store.commit('LOADED');
  }
}
</script>

<style lang="less">
.feedback {
  .feedback-top,
  .feedback-middle {
    background-color: #FFF;
    padding-left: 10px;
    padding-bottom: 10px;
  }
  .feedback-middle {
    margin-top: 20px;
    padding-bottom: 20px;
    .weui-cell {
      padding: 0 5px;
      &:before {
        border: 0;
        height: 0;
      }
    }
    .upload-inner {
      min-height: 120px;
      margin-left: 7px;
      .inner-view {
        float: left;
        .view-item {
          width: 100px;
          height: 100px;
          position: relative;
          float: left;
          margin-right: 12px;
          margin-top: 12px;
          .item-close {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 22px;
            height: 22px;
            background: url('http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVo0GAT0jbAAAFLmoI7S8347.png') no-repeat;
          }
          img {
            width: 100px;
            height: 100px;
            display: inline-block;
            border-radius: 6px;
            border: 1px solid #fff;
          }
        }
      }
      .inner-upload {
        border: 1px solid #cdcdcd;
        border-radius: 4px;
        width: 78px;
        height: 78px;
        outline: 0;
        display: inline-block;
        position: relative;
        top: 12px;
        background: url('http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVo2uAKjceAAACDbw3Rbw138.png') no-repeat center center;
        .upload-file {
          opacity: 0;
          display: block;
          width:78px;
          height:78px;
          outline: 0;
        }
      }
    }
  }
  label {
    color: #1F2D3D;
    display: block;
    padding: 10px 0;
    text-indent: 6px;
    font-weight: 400;
  }
  .checker-item {
    margin: 5px;
    height: 26px;
    line-height: 26px;
    padding: 0 16px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid #99A9BF;
    font-size: .8rem;
  }
  .checker-item-selected {
    color: #20A0FF;
    border-color: #20A0FF;
  }
}

.fixed-bottom {
  &.feedback {
    .bottom-inner {
      margin: 0 20px;
      position: relative;
      bottom: -20px;
    }
  }
}
</style>