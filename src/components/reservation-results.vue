<!-- 预约列表 -->
<template>
  <section class="reservation">
    <scroller v-if='appointmentList.length' lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" use-pulldown :pulldown-config="pulldownConfig" :scroll-bottom-offst="20" @on-pullup-loading="onPullUpLoad" @on-pulldown-loading="onPullDownLoad" ref="scrollerBottom"
      v-model="status">
      <!-- @on-scroll-bottom="onScrollBottom" -->
      <div class="results">
        <group :title="item.appointmentDate" v-for="(item,index) in appointmentList" :key="index" slot="default">
          <cell>
            <div slot="title">
              {{item.appointmentStage}}
            </div>
            <div slot="default">
              <ul>
                <li>{{item.schoolName}}</li>
                <li>{{item.teacherName}}</li>
                <li>
                  <img :src="item.photosUrl" />
                </li>
              </ul>
            </div>
          </cell>
          <!-- 跳转到编辑评价页 或者 查看评价页 -->
          <cell class="times" @click.native="onItemClick(item,index)">
            <div slot="title">
              {{item.beginTime.slice(0,5) }} - {{item.endTime.slice(0,5) }}
            </div>
            <div slot="default">
              <x-button :type='item.buttonType' v-text='item.tag'></x-button>
            </div>
          </cell>
        </group>
      </div>
      <p style='width:100%;text-align:center;color:#99A9BF;' v-if='isAll'>{{deadlineMsg}}</p>
    </scroller>
    <!--
    <div style='position:absolute;margin:35% 24%;' v-if='!appointmentList.length && isNoData'>
      <img src="../../static/noData.png" alt="">
      <span style='display:block;loadTalign:center;'>暂时没有预约结果信息</span>
    </div>
    -->
    <div style='position:absolute;margin:35% 24%;' v-if='!appointmentList.length && isNoData'>
      <div style="margin: 10px;text-align:center;margin-top:20%;">
        <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
        <p style="margin-top:10%;">暂时没有预约结果信息</p>
      </div>
    </div>
    <div class="new-reservation">
      <x-button type="primary" @click.native='addAppointment'>添加预约</x-button>
    </div>
    <toast v-model="showMsg" :type='type' :text='text'></toast>
    <confirm v-model="showWarn" title="操作提示" @on-cancel="onCancel" @on-confirm="onConfirm">
      <p style="text-align:center;">确定要取消?</p>
    </confirm>
  </section>
</template>

<script>
  import {
    Scroller,
    Group,
    Cell,
    XButton,
    Toast,
    Spinner,
    Confirm
  } from 'vux'
  import {
    request
  } from '../api/api.js'
  import {
    global
  } from '../assets/javascript/global.js'
  import store from '../store.js'
  export default {
    components: {
      Scroller,
      Group,
      Cell,
      XButton,
      Confirm,
      Spinner,
      Toast
    },
    computed: {
      isAll: function() {
        return this.page > this.totalPage
      }
    },
    data() {
      return {
        pageSize: global.pageSize,
        appointmentList: [],
        onFetching: false,
        showMsg: false,
        showWarn: false,
        isNoData: false,
        page: 1,
        pullupConfig: {
          content: "",
          downContent: "松开进行加载",
          upContent: "上拉加载更多",
          loadingContent: "加载中..."
        },
        pulldownConfig: {
          content: "下拉刷新",
          downContent: "下拉刷新",
          upContent: "释放刷新",
          loadingContent: "加载中..."
        },
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        totalPage: 1,
        text: '',
        type: '',
        willCancelAppId: '',
        willCancelIndex: -1,
        userInfo: JSON.parse(sessionStorage.getItem('token')),
        deadlineMsg: ''
      }
    },
    methods: {
      onCancel() {
        this.showWarn = false;
      },
      onConfirm() {
        let args = {
          cancelUserId: Number(this.userInfo.studentId),
          appointmentId: Number(this.willCancelAppId),
          cancelUserType: 10
        };
        request.Appointment.cancelAppointment(args).then(res => {
          if (res.success) {
            // console.log(res);
            this.type = 'success';
            this.text = res.object.message;
            this.showMsg = true;
            this.appointmentList.splice(this.willCancelIndex, 1);
            if (!this.appointmentList.length) this.isNoData = true;
          } else {
            this.type = 'text';
            this.text = res.message;
            this.showMsg = true;
          }
        });
      },
      addAppointment() {
        this.$router.push({
          path: '/reservation'
        })
      },
      onItemClick(data, index) {
        console.log(index);
        sessionStorage.setItem('yyInfo', JSON.stringify(data));
        if (data.tag === '可取消') {
          console.log('可取消');
          this.showWarn = true;
          this.willCancelAppId = data.appointmentId;
          this.willCancelIndex = index;
        } else if (data.tag === '待支付') {
          this.type = 'text';
          this.text = '未支付';
          this.showMsg = true;
        } else if (data.tag === '未开始' || data.tag === '培训中') {
          return
        } else {
          // isEvaluate==1 已评价的进入评价完成页
          if (data.isEvaluate) {
            this.$router.push({
              path: '/evaluationResult',
              query: {
                teacherId: data.teacherId,
                appointmentId: data.appointmentId
              }
            });
          } else {
            // isEvaluate==0 未评价的进入 评价页
            this.$router.push({
              path: '/evaluation',
              query: {
                studentId: data.studentId,
                teacherId: data.teacherId
              }
            });
          }
        }
      },
      // 上拉操作
      onPullUpLoad() {
        setTimeout(() => {
          // 当 page 小于 总页数时 页数递加 并请求新数据
          if (this.page < this.totalPage) {
            this.page++;
            this.loadText = '上拉加载更多'
            this.getReservationData();
          } else {
          // 当 page 大于或 等于总页数时 禁止上拉 并且不发起新的数据请求
            this.page += 1;
            this.$refs.scrollerBottom.disablePullup();
            this.$nextTick(() => {
              // 底部 无新数据 提示
              this.deadlineMsg = '已加载全部信息';
            });
          }
        }, 1000);
      },
      // 下拉操作
      onPullDownLoad() {
        // 下拉操作为更新，获取第一页最新的信息覆盖当前的信息
        this.getReservationData('updata');
        setTimeout(() => {
          this.$nextTick(() => {
            this.page = 1;
            this.$refs.scrollerBottom.donePulldown();
            // 当 当前页面数小于总页数时 可上拉，否则 不可上拉
            this.page < this.totalPage ? this.$refs.scrollerBottom.enablePullup() : this.$refs.scrollerBottom.disablePullup();
            this.status.pulldownStatus = "default";
            this.deadlineMsg = '已加载全部信息';
          });
        }, 1000);
        // console.log('DownLoad');
        // console.log('page: ' + this.page);
        // console.log('totalPage: ' + this.totalPage);
  
  
  
      },
      // onScrollBottom() {
      //   if (!this.onFetching) {
      //     this.onFetching = true
      //     setTimeout(() => {
      //       this.$nextTick(() => {
      //         this.$refs.scrollerBottom.reset()
      //       })
      //       this.onFetching = false
      //     }, 2000)
      //   }
      //   console.log('scrollDown');
      // },
      getReservationData(type) {
        // type  判断是否 是下拉
        // 从 session 中获取存取的信息
        // 当存储的 session 信息中有值时
        if (this.userInfo) {
          let args = [this.userInfo.schoolCode, this.userInfo.studentId, this.page, this.pageSize];
          // let args = [510100010, 122, this.page, this.pageSize];
          request.Appointment.appointmentList(args).then(res => {
            // console.log(res);
            if (res.success) {
              this.totalPage = res.object.totalPage;
              if (res.object.list.length) {
                store.commit('LOADED');
                if (type === 'updata') {
                  this.appointmentList = [];
                  this.text = '刷新成功';
                  this.type = 'text';
                  this.showMsg = true;
                }
                res.object.list.forEach(item => {
                  this.appointmentList.push({
                    appointmentDate: `${new Date(item.appointmentDate).toLocaleDateString().replace(/\//g, '.')} 星期${this.switchType(new Date(item.appointmentDate).getDay(), true)}`,
                    appointmentId: item.appointmentId,
                    appointmentStage: this.switchType(item.appointmentStage, false),
                    nativeStage: item.appointmentStage,
                    beginTime: new Date(item.beginTime).toTimeString().slice(0, 8),
                    endTime: new Date(item.endTime).toTimeString().slice(0, 8),
                    id: item.id,
                    isComplaint: item.isComplaint,
                    isEvaluate: item.isEvaluate,
                    isLearnFirst: item.isLearnFirst,
                    isPay: item.isPay,
                    photosUrl: item.photosUrl,
                    schoolName: item.schoolName,
                    state: item.state,
                    studentId: item.studentId,
                    tag: item.tag,
                    teacherId: item.teacherId,
                    teacherName: item.teacherName,
                    buttonType: item.tag === '未支付' ? 'warn' : (item.tag === '可取消' ? 'default' : 'primary')
                  });
                });
                
              } else {
                this.isNoData = true;
                store.commit('LOADED');
                type === 'updata' ? this.text = '刷新成功,暂时没有数据' : this.text = '没有更多数据' 
                this.type = 'text';
                this.showMsg = true;
              }
              setTimeout(() => {
                this.$refs.scrollerBottom.donePullup();
              }, 100);
            } else {
              store.commit('LOADED');
              this.type = 'warn';
              this.text = `数据请求失败，原因： ${res.message}`;
              this.showMsg = true;
            }
          });
        } else {
          store.commit('LOADED');
          this.type = 'warn';
          this.text = '请先登录';
          this.showMsg = true;
        }
      },
      switchType(param, type) {
        let newChar = '';
        // type 为 true 时，转换周一，周二等数字，为false时，转换 科目 为科目一 科目二等 
        if (type) {
          switch (param) {
            case 1:
              newChar = '一';
              break;
            case 2:
              newChar = '二';
              break;
            case 3:
              newChar = '三';
              break;
            case 4:
              newChar = '四';
              break;
            case 5:
              newChar = '五';
              break;
            case 6:
              newChar = '六';
              break;
            case 7:
              newChar = '日';
              break;
            default:
              break;
          }
        } else {
          switch (param) {
            case 1:
              newChar = '科目一';
              break;
            case 2:
              newChar = '科目二';
              break;
            case 3:
              newChar = '科目三';
              break;
            case 4:
              newChar = '科目四';
              break;
            default:
              break;
          }
        }
        return newChar;
      }
    },
    created() {
      // store.commit('LOADED');
      // console.log(this.$router);
      this.appointmentList = [];
      this.getReservationData();
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/close.less';
  .reservation {
    .results {
      padding-bottom: 10px;
      .weui-cell {
        padding: 1px 15px;
      }
      .times {
        &.weui-cell {
          padding: 10px 15px;
          .weui-btn {
            line-height: 1.8;
            font-size: 1rem;
          }
        }
      }
      ul li {
        float: left;
        list-style: none;
        line-height: 40px;
        img {
          position: relative;
          top: 7px;
          width: 30px;
          height: 30px;
          border-radius: 100%;
        }
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
    }
    .new-reservation {
      position: absolute;
      bottom: 10px;
      margin-left: -58px;
      left: 50%;
      .weui-btn {
        width: 116px;
        height: 40px;
        border-radius: 35px;
        &:after {
          border: 0;
        }
      }
    }
  }
</style>
