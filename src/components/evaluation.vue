<!-- 预约结果，可评价预约 -->

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
                <rater :disabled='true' v-model="rater" :max="5" active-color="#FF8800" :font-size="20"></rater>
                <span class="evaluation-count">{{teacherInfo.tcount}}条评论</span>
              </p>
              <p>
              <!-- 车牌：XXXXX学<em>|</em> -->
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
            <label>综合评价</label>
            <rater v-model="editRater" :max="5" active-color="#FF8800" :font-size="35"></rater>
          </div>
          <div class="middle-item">
            <label>评价标签</label>
            <div v-show='editRater'>
              <checker v-if='editRater>3' v-model="commentsTag" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
                <checker-item v-for="(item,index) in goodTag" :key="index" :value="item">{{item.value}}</checker-item>
              </checker>
              <checker v-else-if='editRater==3' v-model="commentsTag" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
                <checker-item v-for="(item,index) in middleTag" :key="index" :value="item">{{item.value}}</checker-item>
              </checker>
              <checker v-else v-model="commentsTag" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
                <checker-item v-for="(item,index) in badTag" :key="index" :value="item">{{item.value}}</checker-item>
              </checker>
            </div>
          </div>
          <div class="middle-item">
            <label>评价</label>
            <!--自定义评价内容-->
            <x-textarea v-model="comments" :max="200" placeholder="请输入其它意见和建议（非必填）" :cols="10"></x-textarea>
          </div>
        </div>
      </div>

    <div class="fixed-bottom evaluation" v-if='isOrigin'>
      <div class="bottom-inner">
        <div class="left-info">
          <check-icon :value.sync="anonymous">匿名</check-icon>
        </div>
        <div class="right-link">
          <x-button type="primary" class="" @click.native='commentUp'>发表评论</x-button>
        </div>
      </div>
    </div>
   <!-- 提示 -->
    <toast v-model="showMsg" :type='type' :text='text'></toast>
    
  </section>
</template>
<script>
import {
  Toast,
  Tab,
  Rater,
  Checker,
  CheckIcon,
  CheckerItem,
  XButton,
  XTextarea
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
    Tab,
    Toast,
    Rater,     
    Checker,
    CheckIcon,
    CheckerItem,
    XTextarea,
    XButton
  },
  data() {
    return {
      showMsg: false,
      editRater: 0,
      text: '',
      type:'',
      goodTag: [],
      middleTag: [],
      badTag: [],
      yyInfo: JSON.parse(sessionStorage.getItem('yyInfo')),
      // yyInfo:{
      //   nativeStage:2,
      //   carType:'C1',
      //   appointmentDate:'2017-01-01',
      //   beginTime:'2017-01-01',
      //   endTime:'2017-01-01',
      //   appointmentStage:'',
      //   appointmentId:3
      // },
      schoolCode: global.schoolCodes,
      studentId: global.studentId,
      pageSize: global.pageSize,
      page: 1,
      commentsTag: [],
      comments: '',
      anonymous: false,
      teacherInfo: {},
      userInfo: JSON.parse(sessionStorage.getItem('token')),
      originHeight: document.body.clientHeight,//默认高度在watch里作比较
      isOrigin:true,
      tmp:''
    }
  },
  computed: {
    rater: {
      get: function () {
        return this.teacherInfo.tscore / this.teacherInfo.tcount
      },
      set: function () {
        return this.teacherInfo.tscore / this.teacherInfo.tcount;
      }
    }
  },
  watch: {
      tmp (val,oldVal) {
        // alert('had watched changed');
        if(this.originHeight !== val) {
          this.isOrigin = false;
        }else{
          this.isOrigin = true;
        }
        // alert('isOrigin : ' + this.isOrigin);
        // alert('screenHeight: ' + this.screenHeight);
        // alert('originHeight: ' + this.originHeight);
        // alert('new val: ' + val);
      }
  },
  methods: {
    onItemClick(data) {
      // console.log("on item click:", data)
    },
    getTeacherInfo() {
      // console.log(this.$route.query);
      if (this.userInfo) {
        const args = [this.userInfo.schoolCode, this.$route.query.teacherId];
        // const args = [510100010, 31];
        setTimeout(() => {
          request.Appointment.evaTeacherInfo(args).then(res => {
            global.printLog(res);
            if (res.success) {
              store.commit('LOADED');
              this.teacherInfo = res.object.teacherInfo;
              if(res.object.tagList.length){
                 res.object.tagList.forEach(item => {
                    if (item.typeId === 29) {
                      this.goodTag.push({
                        key: item.id,
                        value: item.name
                      });
                    } else if (item.typeId === 30) {
                      this.middleTag.push({
                        key: item.id,
                        value: item.name
                      });
                    } else if (item.typeId === 31) {
                      this.badTag.push({
                        key: item.id,
                        value: item.name
                      });
                    }
                  });
              }
            } else {
              store.commit('LOADED');
              this.type = 'warn';
              this.text = res.message;
              this.showMsg = true;
            }
          });
        });
      }else{
        this.type = 'warn';
        this.text = '请先登录';
        this.showMsg = true;
        store.commit('LOADED');        
      }
    },
    commentUp() {
      if (this.userInfo) {
        let evaluate = '';
        this.commentsTag.forEach((item, index) => {
          if (index === 0) evaluate += item.value;
          else if (index > 0 && index < this.commentsTag.length) {
            evaluate += `| ${item.value}`;
          }
        });
        if(evaluate ===''){
          this.type = 'text';
          this.showMsg = true;
          this.text = '请选择评价标签';
        }else{
          var args = {
            "schoolCode": Number(this.userInfo.schoolCode),
            "studentId": Number(this.userInfo.studentId),
            "studentName": this.userInfo.studentName.replace(/'/g,''),
            "studentIdNumber":this.userInfo.cardNo.replace(/'/g,''),
            "evaObjectId": Number(this.teacherInfo.teacherId),
            "score": Number(this.editRater),
            "stage": Number(this.yyInfo.nativeStage),
            "evaluateList": evaluate,
            "comments": this.comments,
            "appointmentId": Number(this.yyInfo.appointmentId),
            "isNickName": Number(this.anonymous ? '1' : '2')
          };
          // alert('可以评论')
          request.Appointment.addEvaluate(args).then(res => {
            if (res.success) {
              this.type = 'success';
              this.text = '评论成功~';
              this.showMsg = true;
              setTimeout(()=>{
                this.$router.replace({
                  path: '/',
                });
              },2000);
            } else {
              this.type = 'text';
              this.text = res.message;
              this.showMsg = true;
            }
            this.comments = '';
            this.editRater = 5;
            this.commentsTag = [];
          });
        }
      }else{
        this.type = 'warn';
        this.text = '请先登录';
        this.showMsg = true;
      }
    }
  },
  created() {
    // store.commit('LOADED');
    this.getTeacherInfo();
  },
  mounted(){
    window.onresize = () => {
      this.tmp = document.body.clientHeight;
      // alert('after resize, height: ' + this.tmp);
      
      // return (() => {
      //   this.tmp = document.body.clientHeight;
      // })();
    }
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
    background: #FFF;
    position: absolute;
    overflow: auto;
    bottom: 46px;
    top: 140px;
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

.fixed-bottom {
  position:fixed;
  bottom:0;
  &.evaluation {
    background-color: #FFF;
  }
}
</style>
