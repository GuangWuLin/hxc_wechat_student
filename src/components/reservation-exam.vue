<template>
  <section class="reservation-exam">
    <div class="exam-top">
      <div class="top-one">
        <div class="one-left">
          <p>{{examSoon.appointmentExamDate?examSoon.appointmentExamDate:'未知'}}</p>
          <p>考试时间</p>
        </div>
        <div class="one-right">
          <p>{{examSoon.examSite?examSoon.examSite:'未知'}}</p>
          <p>
            考试地点
            <x-button mini @click.native="onItemClick">到这里</x-button>
          </p>
        </div>
      </div>
      <div class="top-two">
        <flexbox :gutter="0">
          <flexbox-item align="center">
            <p>{{examSoon.examStageName?examSoon.examStageName.slice(0,3):'--'}}</p>
            <p>课程</p>
          </flexbox-item>
          <flexbox-item align="center">
            <p>{{examSoon.appointmentDate?examSoon.appointmentDate:'--'}}</p>
            <p>预约日期</p>
          </flexbox-item>
          <flexbox-item align="center">
            <p>{{examSoon.appointmentExamDate?examSoon.appointmentExamDate:'--'}}</p>
            <p>考试日期</p>
          </flexbox-item>
          <flexbox-item align="center">
            <p>{{examSoon.examCarTypeName?examSoon.examCarTypeName:'--'}}</p>
            <p>车型</p>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="exam-middle">
      <group>
        <cell>
          <div slot="title">
            <img class='history' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVo7mAM4vWAAAEqoA7wp4693.png" alt="">
            <em></em>历史战绩
          </div>
        </cell>
        <cell class="middle-content">
          <div slot="title" class="exam-timeline">
            <scroller lock-x scrollbar-y height="-245" v-if='exams.length'>
              <timeline>
                <timeline-item v-for="(item, index) in exams" :key="index">
                  <h3>{{item.examDate}}</h3>
                  <p>车型：{{item.examCarTypeName}}</p>
                  <p>课程：{{item.examStageName}}</p>
                  <p>地点：{{item.examSite}}</p>
                  <img class='isPassed' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVo9qAZMayAAAtsZOxkJs286.png" alt="" v-if="item.isPassed">
                  <img class='isPassed' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVo_2ABqULAAApsO792QI366.png" alt="" v-else>
                </timeline-item>
              </timeline>
            </scroller>
            <!-- 
            <div v-if='isNoData'>
              <img class='nodatas' src="../../static/noData.png" alt="" />
              <p style='text-align:center;'>暂时没有考试记录</p>
            </div>
            -->
            <div v-if='isNoData'>
              <div style="margin: 10px;text-align:center;margin-top:20%;">
                <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
                <p style="margin-top:10%;">暂时没有考试记录</p>
              </div>
            </div>

          </div>
        </cell>
      </group>
    </div>
    <toast v-model="showMsg" :type='type' :text="text"></toast>
  </section>
</template>

<script>
  import {
    Scroller,
    Flexbox,
    Toast,
    FlexboxItem,
    XButton,
    Group,
    Cell,
    Timeline,
    TimelineItem
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
      Scroller,
      Toast,
      Flexbox,
      FlexboxItem,
      XButton,
      Group,
      Cell,
      Timeline,
      TimelineItem
    },
    data() {
      return {
        showMsg: false,
        isNoData: false,
        text: '',
        type: '',
        exams: [],
        examSoon: []
      }
    },
    methods: {
      onItemClick(index) {
        // console.log(this.examSoon.examSite);
        if (this.examSoon.examSite) {
          this.$router.push({
            path: '/examPosition',
            query: {
              examSiteName: this.examSoon.examSite
            }
          });
        }
      },
      getExamInfo() {
        let object = JSON.parse(sessionStorage.getItem('token'));
        if (object) {
          let args = [object.schoolCode.replace(/'/g, ''), object.cardNo.replace(/'/g, '')];
          request.ExamManager.studentExamManager(args).then(res => {
            if (res.success) {
              if (res.object.length) {
                this.exams = res.object;
                res.object.forEach((item, index) => {
                  if (!index.examDate && !item.examScore) {
                    this.examSoon = item;
                    this.exams.splice(index, 1);
                  }
                  item.isPassed = item.examStageName == '科目二' ? (item.examScore >= 80 ? true : false) : (item.examScore >= 90 ? true : false);
                });
              } else {
                this.isNoData = true;
              }
              store.commit('LOADED');
            } else {
              store.commit('LOADED');
              this.type = 'text';
              this.showMsg = true;
              this.text = res.message;
            }
          });
        } else {
          store.commit('LOADED');
          this.type = 'warn';
          this.text = '请先登录';
          this.showMsg = true;
        }
      }
    },
    created() {
      // store.commit('LOADED');
      this.getExamInfo();
    }
  }
</script>

<style lang="less">
  .reservation-exam {
    .exam-top {
      .top-one {
        padding: 0 20px;
        display: -webkit-box;
        display: flex;
        display: -webkit-flex;
        box-align: center;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        height: 110px;
        background: #20A0FF;
        color: #FFF;
        font-size: .95rem;
        .one-left {
          flex: 1;
          -webkit-flex: 1;
          -webkit-box-flex: 1;
        }
        .one-right {
          flex: 1;
          -webkit-flex: 1;
          -webkit-box-flex: 1;
          padding-left: 20px;
          border-left: 1px solid #5FBBFF;
          p {
            .weui-btn {
              padding: 0 8px;
              margin-left: 5px;
              width: auto;
              height: 20px;
              color: #FFF;
              font-size: 12px;
              line-height: 21px;
              border-radius: 21px;
              background: transparent;
              border: 1px solid #FFF;
            }
          }
        }
      }
      .top-two {
        height: 50px;
        background: #FFF;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        .vux-flexbox-item {
          p {
            &:nth-child(odd) {
              color: #1F2D3D;
              font-size: .8rem;
              margin-top: .1rem;
            }
            &:nth-child(even) {
              color: #8492A6;
              font-size: .8rem;
            }
          }
        }
        .two-inner {
          flex: 1;
          -webkit-flex: 1;
          -webkit-box-flex: 1;
          ul li {
            list-style: none;
            display: inline-block;
          }
        }
      }
      margin-bottom: 20px;
    }
    .exam-middle {
      background: #FFF;
      .history {
        width: 20px;
        height: 22px;
        position: relative;
        top: 5px;
      }
      .middle-content {
        &.weui-cell {
          padding: 10px;
        }
        .exam-timeline {
          color: #1F2D3D;
          font-size: 0.8rem;
          .nodatas {
            position: relative;
            margin: 6% 20%;
          }
          .isPassed {
            width: 60px;
            height: 60px;
            margin: 0;
            padding: 0;
            position: absolute;
            right: 1%;
            top: 20%;
          }
          h3 {
            font-weight: bolder;
          }
          p {
            text-indent: 2px;
            line-height: 22px;
          }
          .vux-timeline-item-head-first {
            width: 10px;
            height: 10px;
            left: 1px;
            top: 4px;
            i {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
