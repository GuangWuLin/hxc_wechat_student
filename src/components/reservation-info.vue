<!-- 预约信息，选择时段 -->
<template>
  <section>
    <div class="reservation-info">
      <div class="info-top">
        <div class="top-row-one">
          <div class="one-inner">
            <div class="inner-left-avatar">
              <img :src="teacherInfo.photosUrl" />
            </div>
            <div class="inner-right-info">
              <p>{{teacherInfo.teacherName}}</p>
              <p>
                <rater :disabled='true' v-model="rater" :max="5" active-color="#FF8800" :font-size="20"></rater>
                <span class="evaluation-count">{{teacherInfo.evaCount}}条评论</span>
              </p>
            </div>
          </div>
        </div>
        <div class="top-row-two">
          <flexbox :gutter="0">
            <flexbox-item align="center">
              <div>{{stage==2?'科目二':'科目三'}}</div>
              <div>课程</div>
            </flexbox-item>
            <flexbox-item align="center">
              <div>{{teacherInfo.bindCar?teacherInfo.bindCar:'--'}}</div>
              <div>车牌</div>
            </flexbox-item>
            <flexbox-item align="center">
              <div>{{teacherInfo.teachCarTypeName?teacherInfo.teachCarTypeName:'--'}}</div>
              <div>车型</div>
            </flexbox-item>
            <flexbox-item align="center">
              <div>{{stage == 2 ? teacherInfo.appointmentCountTwo:teacherInfo.appointmentCountThree}}次 </div>
              <div>预约</div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <div v-show="userInfo.learnFirst.replace(/'/g,'') ==='false'">
        <div class="info-middle">
          <div class="middle-date">
            <img src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVo5uADAhUAAALrWuBbjA048.png" style='width: 13.36px;height: 13.36px;' alt="">
            <calendar title v-model="calendarDate" @on-change='changeDate' disable-past></calendar>
          </div>
          <!-- <scroller lock-x> -->
          <div class='scrollers' v-if='allOptions.length'>
            <checklist :options="allOptions" @on-change='checkListChanged' v-model="hasChecked" class="mylist">
            </checklist>
          </div>
          <!-- <div v-if='isNoData'>
            <img class='nodatas' src="../../static/noData.png" alt="" />
            <p style='text-align:center;'>暂时没有约考时段</p>
          </div>
          -->
          <div style='position:absolute;margin:35% 24%;' v-if='isNoData'>
            <div style="margin: 10px;text-align:center;margin-top:20%;">
              <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
              <p style="margin-top:10%;">暂时没有约考时段</p>
            </div>
          </div>
          <!-- </scroller> -->
        </div>
        <div class="fixed-bottom-bar" v-show='allOptions.length'>
          <div class="bar-left">
            <ul>
              <li>
                <span>预约:<em>{{hasChecked.length}}</em>条</span>
              </li>
              <li>|</li>
              <li>
                <span>学时:<em>{{allTime}}</em></span>
              </li>
              <li>|</li>
              <li>
                <span>金额:<em>￥{{allCount}}</em></span>
              </li>
            </ul>
          </div>
          <div class="link-right">
            <x-button type="primary" @click.native='submit'>提交</x-button>
            <!-- <x-button type="primary" class="" @click.native='submit'>提交</x-button> -->
          </div>
        </div>
      </div>
      <div class="router-view" v-show="userInfo.learnFirst.replace(/'/g,'') ==='true'">
        <div style="margin: 10px;text-align:center;margin-top:20%;">
          <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
          <p style="margin-top:10%;">暂不支持先学后付学员预约</p>
        </div>
      </div>
  
  
    </div>
    <!--提示-->
    <toast v-model="errShow" :type='type' :text="text"></toast>
    <confirm v-model="showMsg" :close-on-confirm="false" title="预约结果" cancel-text='查看' confirm-text='继续预约' @on-cancel="onCancel" @on-confirm="onConfirm">
      <div style="text-align:left;">
        <h4>{{titleMsg}}</h4>
        <h5 style='margin:5px 0;'> {{reason}} </h5>
        <p v-for='(item,index) in mainMsg' :key='index'> {{item}}</p>
      </div>
    </confirm>
  </section>
</template>

<script>
  import {
    Toast,
    Confirm,
    Flexbox,
    FlexboxItem,
    Rater,
    Icon,
    Checklist,
    Calendar,
    XButton
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
      Confirm,
      Toast,
      Icon,
      FlexboxItem,
      Flexbox,
      Rater,
      Checklist,
      Calendar,
      XButton
    },
    data() {
      return {
        calendarDate: new Date().toLocaleDateString().replace(/\//g, '-'),
        pageSize: global.pageSize,
        page: 1,
        showMsg: false,
        errShow: false,
        text: '',
        type: '',
        rater:5,
        mainMsg: [],
        titleMsg: '',
        reason: '',
        teacherId: this.$route.query.teacherId,
        stage: this.$route.query.stage,
        successrMsg: '',
        teacherInfo: {},
        allOptions: [],
        isNoData: false,
        hasChecked: [],
        allTime: 0,
        allCount: 0,
        checkListsInfo: [],
        userInfo: JSON.parse(sessionStorage.getItem('token')),
        pullAllDatas: false
      }
    },
    methods: {
      changeDate(val) {
        this.calendarDate = val;
        this.hasChecked = [];
        store.commit('LOADING');
        // alert(2)
        this.getAppointmentTimeSlot();
      },
      onCancel() {
        // global.printLog('cancle')
        this.checkListsInfo = [];
        this.hasChecked = [];
        this.$router.push({
          path: '/'
        })
      },
      onConfirm() {
        this.checkListsInfo = [];
        this.hasChecked = [];
        this.getAppointmentTimeSlot();
        this.showMsg = false;
      },
      submit() {
        let args = {
          infos: this.checkListsInfo
        };
        if (this.userInfo) {
          // alert('islearnFirst :' + this.userInfo.learnFirst.toString() !== 'false');
          if (this.userInfo.learnFirst.toString() === 'true') {
            this.errShow = true;
            this.text = '对不起，暂不支持 先学后付学员预约～';
            this.hasChecked = [];
  
          } else if (this.hasChecked.length === 0) {
            this.text = '请先选择预约时段再提交～';
            this.errShow = true;
          } else {
            request.Appointment.createAppointment(args).then(res => {
              if (res.success) {
                // alert('预约请求结束 ：' + JSON.stringify(res.object));
                this.showMsg = true;
                // 将错误信息拆开，以 句号为分割
                let tmp = res.object.message.split('。');
                // 句号之前是表示 成功几条 失败几条 的信息。
                this.titleMsg = tmp[0];
                // 句号之后是原因
                let msg = tmp[1];
                // 失败原因 或者 成功原因的表头
                this.reason = msg.slice(0, 5);
                // 各时段成功或失败原因
                let reasons = msg.slice(5);
                // 将每个时段拆分开
                this.mainMsg = reasons.split('；');
                this.pullAllDatas = false;
              } else {
                this.errShow = true;
                this.text = res.message;
              }
            });
          }
        }
  
      },
      // 选择中的时段列表
      checkListChanged(val) {
        let times = 0,
          count = 0;
        this.checkListsInfo = [];
        if (val.length) {
          val.forEach((item, index) => {
            console.log(item);
            count += this.allOptions[item].cost;
            times += Number(this.allOptions[item].classMin);
            this.checkListsInfo.push({
              beginTime: this.allOptions[item].beginTime,
              endTime: this.allOptions[item].endTime,
              teacherId: Number(this.teacherId),
              studentId: Number(this.userInfo.studentId),
              appointmentStage: Number(this.stage),
              schoolCode: Number(this.userInfo.schoolCode),
              modelId: this.teacherInfo.modelId, // modelId 是干哈的
              // modelId: 3,
              appointmentType: 40,
              appointmentUserType: 10,
              appointmentUserId: Number(this.userInfo.studentId)
            });
          });
          // console.log(this.checkListsInfo);
        }
        // console.log(times);
        this.allTime = times;
        this.allCount = count;
      },
      // 查询 该教练所执教的时间段
      getAppointmentTimeSlot() {
        // global.printLog(this.$route.query)
        let query = this.$route.query;
        // this.teacherInfo = {};
        if (this.userInfo) {
          let args = [this.userInfo.schoolCode, this.userInfo.studentId, this.calendarDate, query.teacherId, query.stage];
          // let args = [510100755, 20000610, 'TODAY', 20000030, 2];
          request.Appointment.appointmentTimeSlot(args).then(res => {
            if (res.success) {
              // console.error(this.pullAllDatas)
              if (res.object.length) {
                store.commit('LOADED');
                // this.teacherInfo = res.object[0];
                if (!this.pullAllDatas) {
                  this.teacherInfo.teacherName = res.object[0].teacherName;
                  this.teacherInfo.phone = res.object[0].phone;
                  this.teacherInfo.photosUrl = res.object[0].photosUrl;
                  this.teacherInfo.idNumber = res.object[0].idNumber;
                  this.teacherInfo.gender = res.object[0].gender;
                  this.teacherInfo.carId = res.object[0].carId;
                  this.teacherInfo.bindCar = res.object[0].bindCar;
                  this.teacherInfo.schoolCode = res.object[0].schoolCode;
                  this.teacherInfo.teachCarType = res.object[0].teachCarType;
                  this.teacherInfo.carName = res.object[0].carName;
                  this.teacherInfo.teacherCount = res.object[0].teacherCount;
                  this.teacherInfo.modelId = res.object[0].modelId;
                  this.teacherInfo.teachCarTypeName = res.object[0].teachCarTypeName;
                  this.teacherInfo.genderName = res.object[0].genderName;
                  this.teacherInfo.evaCount = res.object[0].evaCount;
                  this.teacherInfo.evaScore = res.object[0].evaScore;
                  this.teacherInfo.appointmentCountTwo = res.object[0].appointmentCountTwo;
                  this.teacherInfo.appointmentCountThree = res.object[0].appointmentCountThree;
                  this.pullAllDatas = true;
                  this.rater = res.object[0].evaScore / res.object[0].evaCount;
                  // this.teacherInfo.evaScore / this.teacherInfo.evaCount;
                }
                this.allOptions = [];
                res.object[0].timeDOS.forEach((item, index) => {
                  this.allOptions.push({
                    value: item.orderTime,
                    key: index,
                    inlineDesc: item.message,
                    cost: item.cost,
                    classMin: item.classMin,
                    isOrder: item.isOrder,
                    personHas: item.personHas,
                    personCount: item.personCount,
                    beginTime: item.beginTime,
                    endTime: item.endTime,
                    valid: item.isOrder === 1 ? false : true // isOrder 为1 可以预约，0 不可预约
                  });
                });
              } else {
                tihs.isNoData = true;
                store.commit('LOADED');
              }
            } else {
              this.type = 'text';
              this.text = res.message;
              this.errShow = true;
              store.commit('LOADED');
            }
          });
        } else {
          store.commit('LOADED');
          this.type = 'warn';
          this.text = '请先登录';
          this.errShow = true;
        }
      }
    },
    created() {
      // store.commit('LOADED');
      // alert(1)
      this.getAppointmentTimeSlot();
    }
  }
</script>

<style lang="less" scoped>
  .weui-cells,
  .weui-cells_checkbox {
    .weui-cell,
    .weui-check_label {
      .weui-cell__bd {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
    }
  }
  
  .reservation-info {
    height: 100%;
    overflow: hidden;
    .info-top {
      background: #FFF;
      .top-row-one {
        height: 60px;
        border-bottom: 1px solid #EEE;
        display: table-cell;
        vertical-align: middle;
        width: 0.1%;
        padding: 15px 20px;
        .one-inner {
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
            -webkit-box-flex: 1;
            flex: 1;
            -webkit-flex: 1;
            p {
              line-height: 30px;
              .vux-rater {
                margin-left: -2px;
              }
              .evaluation-count {
                margin-left: 10px;
                color: #8492A6;
              }
            }
          }
        }
      }
      .top-row-two {
        color: #8492A6;
        padding: 7px 0;
        font-size: .99rem;
        .vux-flexbox-item {
          div {
            &:nth-child(even) {
              font-size: .8rem;
            }
          }
        }
      }
    }
    .info-middle {
      margin-top: 10px;
      background: #FFF;
      color: #1F2D3D;
      
      .middle-date {
        height: 44px;
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        .weui-cell__ft,
        .vux-cell-primary {
          text-align: center !important;
        }
        .weui-cell_access .weui-cell__ft::after {
          right: 14% !important;
        }
      }
      .scrollers {
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        position: absolute;
        bottom: 43px;
        top: 212px;
      }
    }
  }
  
  .fixed-bottom-bar {
    display: flex;
    position: absolute;
    z-index: 500;
    bottom: 0;
    width: 100%;
    background-color: #FFF;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 1px;
      border-top: 1px solid #979797;
      color: #979797;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .bar-left {
      font-size: 13px;
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      -webkit-tap-highlight-color: transparent;
      ul {
        margin-left: 10px;
      }
      ul li {
        margin-right: 2px;
        display: inline-block;
        line-height: 42px;
        em {
          color: #FF3457;
          font-style: normal;
        }
      }
    }
    .link-right {
      width: 75px;
      .weui-btn {
        width: 75px;
        height: 100%;
        border-radius: 0;
        &:after {
          border: 0;
        }
      }
    }

     

  }
</style>
