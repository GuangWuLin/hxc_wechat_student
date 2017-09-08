 <!-- 选择 教练 科目 预约 -->
<template>
  <section class="reservation">
    <tab bar-active-color="#1AAD19" :line-width="3" active-color="#000">
      <tab-item selected @on-item-click="onItemClick">科目二</tab-item>
      <tab-item @on-item-click="onItemClick">科目三</tab-item>
    </tab>
    <div class="card-row">
      <div v-for='(item,index) in coaches' :key='index' class="card-column" @click='goRouteInfo(item)'>
        <img :src="item.photosUrl" style="width:67px;height:67px;" />
        <p style='font-size:18px;'>{{item.teacherName}}</p>
        <div class="inner-info" style='color:#C0CCDA;margin-bottom:1%;'>
          <p>已预约{{stage === 2?item.appointmentCountTwo:item.appointmentCountThree}}次 | {{item.carType}}</p>
        </div>
      </div>
     <!-- <div v-if='isNoData' style='width:100%;'>
        <img class='nodatas' src="../../static/noData.png" alt="" />
        <p style='text-align:center;'>暂时没有可预约教练</p>
      </div>
-->
      <div v-if='isNoData' style='width:100%;'>
        <div style="margin: 10px;text-align:center;margin-top:20%;">
          <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
          <p style="margin-top:10%;">暂时没有可预约教练</p>
        </div>
      </div>


    </div>
    <!--失败的提示-->
    <toast v-model="showMsg" :type='type' :text="text"></toast>
  </section>
</template>

<script>
  import {
    Tab,
    TabItem,
    Card,
    Toast
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
      TabItem,
      Toast,
      Card
    },
    data() {
      return {
        pageSize: global.pageSize,
        page: 1,
        stage: 2,
        showMsg: false,
        isNoData: false,
        text: '',
        type: '',
        coaches: [],
        userInfo: JSON.parse(sessionStorage.getItem('token')),
      }
    },
    methods: {
      onItemClick(index) {
        let state = index === 0 ? 2 : 3;
        // console.log(this.stage);
        // console.log('=====')
        if (this.stage !== state) {
          this.stage = state;
          this.isNoData = false;
          store.commit('LOADING');
          this.getReservedCoach();
        }
        // console.log(this.stage)
      },
      goRouteInfo(param) {
        // global.printLog(param);
        param.stage = this.stage;
        this.$router.push({
          path: '/reservationInfo',
          query: {
            teacherId: param.teacherId,
            stage: param.stage
          }
        });
        // sessionStorage.setItem('teacherInfo', JSON.stringify(param));
      },
      getReservedCoach() {
        this.coaches = [];
        if (this.userInfo) {
          let args = [this.userInfo.schoolCode, this.userInfo.studentId, this.page, this.pageSize, this.stage];
          // let args = [510100010, 122, this.page, this.pageSize, this.stage];
          request.Appointment.queryAppointmentTeacherBind(args).then(res => {
            // global.printLog(res);
            if (res.success) {
              if (res.object.list.length) {
                store.commit("LOADED");
                res.object.list.forEach(item => {
                  this.coaches.push({
                    appointmentCountThree: item.appointmentCountThree,
                    appointmentCountTwo: item.appointmentCountTwo,
                    bindCar: item.bindCar,
                    evaCount: item.evaCount,
                    evaScore: item.evaScore,
                    carType: item.name,
                    photosUrl: item.photosUrl,
                    schoolCode: item.schoolCode,
                    stage: item.stage,
                    teacherId: item.teacherId,
                    teacherName: item.teacherName
                  });
                });
              } else {
                this.isNoData = true;
                store.commit('LOADED');
              }
            } else {
              this.type = 'text';
              this.showMsg = true;
              this.text = res.message;
              store.commit("LOADED");
            }
          });
        } else {
          this.type = 'warn';
          this.text = '请先登录';
          this.showMsg = true;
          store.commit("LOADED");
        }
      }
    },
    created() {
      // store.commit('LOADED');
      this.getReservedCoach();
      // console.log(this.$router);
  
    }
  }
</script>

<style lang="less">
  .reservation {
    .vux-tab {
      height: 55px;
      .vux-tab-item {
        line-height: 55px;
      }
    }
    .card-row {
      padding: 10px;
      display: -webkit-box;
      display: flex;
      flex-flow: row wrap;
      display: -webkit-flex;
      box-align: center;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      font-size: 14px;
      .nodatas {
        position: relative;
        margin: 10% 20%;
      }
      .card-column {
        background: #FFF;
        flex: 0 0 47%;
        min-width: 20px;
        width: 100%;
        color: #1F2D3D;
        margin-bottom: 2%;
        margin-left: 2%;
        border-radius: 5px;
        text-align: center;
        img {
          width: 67px;
          height: 67px;
          border-radius: 100%;
          margin-top: 8%;
          display: inline-block;
        }
        .column-inner {
          display: table-cell;
          vertical-align: middle;
          height: 178px;
          width: .1%;
          background: #FFF;
          border-radius: 5px;
          text-align: center;
          .inner-info {
            margin-top: 10px;
            color: #8492A6;
            p {
              line-height: 23px;
            }
          }
        }
        &:nth-child(even) {
          margin-left: 3%;
        }
      }
      &:nth-child(even) {
        padding-bottom: 0;
      }
    }
  }
</style>
