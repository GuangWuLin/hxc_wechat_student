<!-- 预约结果，只读页面，不可编辑 -->

<template>
  <section>
    <div class="evaluation">
      <div class="evaluation-info">
        <div class="info-inner">
          <div class="inner-left-avatar">
            <img :src="teacherInfo.photosUrl" />
          </div>
          <div class="inner-right-info">
            <p>{{teacherInfo.teacherName}}</p>
            <p>
              <rater v-model="rater" :max="5" active-color="#FF8800" :font-size="20" :disabled="true"></rater>
              <span class="evaluation-count">{{teacherInfo.tcount}}条评论</span>
            </p>
            <p>
           <!-- 车牌：川XXXXX学
              <em>|</em> -->
              已预约{{yyInfo.nativeStage===2?teacherInfo.appointmentCountTwo:teacherInfo.appointmentCountThree}}次
              <em>|</em>{{teacherInfo.carType}}</p>
            <p>{{yyInfo.appointmentDate.replace(/[\u2E80-\u9FFF]+/g,'')}}
              <em>|</em>{{yyInfo.beginTime.slice(0,5)}}-{{yyInfo.endTime.slice(0,5)}}
              <em>|</em>{{yyInfo.appointmentStage}}</p>
          </div>
        </div>
      </div>
      <div class="evaluation-middle">
        <div class="middle-item">
          <label>我的评价</label>
          <rater v-model="selfRater" :max="5" active-color="#FF8800" :font-size="35" :disabled="true"></rater>
        </div>
        <div class="middle-item">
          <label>评价标签</label>
          <checker v-model="commentsTag" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
            <checker-item :disabled='true' v-for="(item,index) in commentsTag" :key="index" :value="item">{{item.value}}</checker-item>
          </checker>
        </div>
        <div class="middle-item">
          <label>评价</label>
          <group>
            <x-textarea :max="200" :cols="10" :readonly="true" :disabled='true' v-model="comments" :show-counter="false"></x-textarea>
          </group>
        </div>
      </div>
    </div>
    <!--失败的提示-->
    <toast v-model="showMsg" :type='type' :text='text'></toast>
  </section>
</template>
<script>
  import {
    Toast,
    Rater,
    Checklist,
    XButton,
    Group,
    XTextarea,
    Checker,
    CheckerItem
  } from 'vux'
  import {
    global
  } from '../assets/javascript/global.js'
  import {
    request
  } from '../api/api.js'
  import store from '../store.js'
  export default {
    components: {
      Toast,
      Rater,
      Group,
      Checklist,
      XButton,
      XTextarea,
      Checker,
      CheckerItem
    },
    data() {
      return {
        rater: 0,
        selfRater: 0,
        commentsTag: [],
        yyInfo: JSON.parse(sessionStorage.getItem('yyInfo')),
        // yyInfo:{
        //   nativeStage:2,
        //   carType:'C1',
        //   appointmentDate:'2017-01-01',
        //   beginTime:'2017-01-01',
        //   endTime:'2017-01-01',
        //   appointmentStage:''
        // },
        anonymous: false,
        showMsg: false,
        text: '',
        type:'',
        comments: '',
        teacherInfo: {},
        userInfo:JSON.parse(sessionStorage.getItem('token'))
      }
    },
    methods: {
      onItemClick(data) {
        // console.log("on item click:", data)
      },
      getCommentsData() {
        let querys = this.$route.query;
        if(this.userInfo){
          const args = [this.userInfo.schoolCode, querys.teacherId, querys.appointmentId];
          // const args = [510100010, 31, 180283];
          request.Appointment.evaResult(args).then(res => {
            // global.printLog(res);
            if (res.success) {
              store.commit('LOADED');
              this.teacherInfo = res.object.evaTeacherInfo;
              let commentTag = res.object.baseEvaluate.evaluateList.split('|');
              if(commentTag.length){
                commentTag.forEach((item, index) => {
                  this.commentsTag.push({
                    key: index,
                    value: item
                  });
                });
              }
              this.selfRater = res.object.baseEvaluate.score;
              this.rater = res.object.evaTeacherInfo.tscore / res.object.evaTeacherInfo.tcount;
              this.comments = res.object.baseEvaluate.comments;
            } else {
              store.commit('LOADED');
              this.type = 'text';
              this.text = res.message;
              this.showMsg = true;
            }
          });
        }else{
          store.commit('LOADED');
          this.type = 'warn';
          this.text = '请先登录';
          this.showMsg = true;
        }
      }
    },
    created() {
      // store.commit('LOADED');
      this.getCommentsData();
    }
  }
</script>
<style lang="less">
  .evaluation {
    .evaluation-info {
      width: .01%;
      height: 100px;
      padding: 10px;
      background: #FFF;
      display: table-cell;
      vertical-align: middle;
      .info-inner {
        display: -webkit-box;
        display: flex;
        display: -webkit-flex;
        box-align: center;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        .inner-left-avatar {
          width: 60px;
          text-align: center;
          margin-right: 15px;
          img {
            width: 60px;
            height: 60px;
            border-radius: 100%;
          }
        }
        .inner-right-info {
          flex: 1;
          -webkit-flex: 1;
          -webkit-box-flex: 1;
          color: #8492A6;
          font-size: .83rem;
          p {
            line-height: 30px;
            .vux-rater {
              margin-left: -2px;
            }
            .evaluation-count {
              margin-left: 10px;
            }
            em {
              font-style: normal;
              margin: 0 3px;
            }
          }
        }
      }
    }
    .evaluation-middle {
      margin-top: 20px;
      background: #FFF;
      width:100%;
      .middle-item {
        padding: 10px;
        padding-bottom: 10px;
        &:not(:last-child) {
          border-bottom: 1px solid #E5E9F2;
        }
        .weui-cell {
          padding: 0 5px;
          &:before {
            border: 0;
            height: 0;
          }
        }
      }
      label {
        color: #1F2D3D;
        display: block;
        padding-bottom: 10px;
      }
      .checker-item {
        margin: 5px;
        height: 30px;
        line-height: 30px;
        padding: 0 18px;
        text-align: center;
        border-radius: 30px;
        border: 1px solid #99A9BF;
        background-color: #FFF;
        font-size: .8rem;
      }
      .checker-item-selected {
        color: #FFF;
        border-color: #FFF;
        background: #20A0FF;
      }
    }
  }
</style>
