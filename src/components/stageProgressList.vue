<template>
    <section class='container'>
        <router-link style='width:100%;height:60px;background:#fff;display:inline-block;text-align:center;line-height:60px;color:rgb(18, 150, 219);' :to="{ path: '/stageProgress/stageProgressChange' }">
            <img style='width:20px;height:20px;position:relative;top:3px;right:3px;' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVouuAQH8wAAAbfAPmj2s651.png" alt="">查看培训历史
        </router-link>
        <ul v-if='historyTrain.length'>
            <li v-for='(item,index) in historyTrain' class='listInfo'>
                <img :src="item.studentPhoto" alt="" style='width:60px;height:60px;border-radius:4px;'>
                <div class='infoRight'>
                    <p>
                        <button mini style='background:#1296db;border:1px solid #1296db;border-radius:2px;color:#fff;'>实操</button>
                        {{new Date(item.beginTime).toLocaleDateString().replace(/\//g,'-')}}<em>|</em>{{new Date(item.beginTime).toTimeString().slice(0,5)}} - {{new Date(item.endTime).toTimeString().slice(0,5)}}
                        <em>|</em>{{item.stage ===1?'科目一':item.stage===2?'科目二':item.stage===3?'科目三':'科目四'}}
                    </p>
                    <p>
                        里程{{item.mileage}}KM<em> &nbsp;&nbsp; </em>有效{{item.validStudyMin}}分
                    </p>
                </div>
            </li>
        </ul>
        <div class="router-view" v-else>
            <div style="margin: 10px;text-align:center;margin-top:20%;">
                <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
                <p style="margin-top:10%;">暂时没有培训记录</p>
            </div>
        </div>
    </section>
</template>

<script>
    import {
        Tab,
        TabItem,
        XProgress,
        XButton,
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
            XButton,
            Toast,
            XProgress
        },
        data() {
            return {
                totalMile: 0,
                hasRun: 0,
                totalTime: 0,
                hasTime: 0,
                userInfo: JSON.parse(sessionStorage.getItem('token')),
                showMsg: false,
                type: '',
                messages: '',
                historyTrain: JSON.parse(sessionStorage.getItem('stageProgress')),
                showDetail: true
            }
        },
        computed: {
            stage: {
                get() {
                    return store.state.stage
                },
                set() {
                    return store.state.stage
                }
            }
        },
        watch: {
            stage: function(val, oldVal) {
                this.stage = val;
                this.getDefaultDatas();
            }
        },
        methods: {
            getDefaultDatas() {
                if (this.userInfo) {
                    this.historyTrain = [];
                    let args = [this.userInfo.studentId, this.stage, this.userInfo.carType, this.userInfo.province.replace(/'/g,'')];
                    request.timerClass.classRecord(args).then(res => {
                        // console.log(res.object.classRecordList.list);
                        if (res.success) {
                            this.totalMile = res.object.totalMileage;
                            this.hasRun = res.object.learnMileage;
                            this.totalTime = res.object.totalTimer;
                            this.hasTime = res.object.learnTimer;
                            if (res.object.classRecordList.list.length) {
                                res.object.classRecordList.list.forEach(item => {
                                    this.historyTrain.push({
                                        allStudyMin: item.allStudyMin,
                                        appointmentBeginTime: item.appointmentBeginTime,
                                        appointmentEndTime: item.appointmentEndTime,
                                        beginTime: item.beginTime,
                                        cardNo: item.cardNo,
                                        classId: item.classId,
                                        classRecordId: item.classRecordId,
                                        deviceId: item.deviceId,
                                        endTime: item.endTime,
                                        mileage: item.mileage,
                                        photosUrl: item.photosUrl,
                                        schoolCode: item.schoolCode,
                                        sim: item.sim,
                                        stage: item.stage,
                                        studentName: item.studentName,
                                        studentPhoto: item.studentPhoto,
                                        subjectType: item.subjectType,
                                        teacherName: item.teacherName,
                                        validStudyMin: item.validStudyMin
                                    });
                                });
                            } else {
                                this.text = '暂时没有数据';
                                this.type = 'text';
                                this.showMsg = true;
                            }
                            sessionStorage.setItem('stageProgress', JSON.stringify(this.historyTrain));
                        } else {
                            this.text = res.messages;
                            this.type = 'text';
                            this.showMsg = true;
                        }
                    });
                } else {
                    this.text = '请先登录';
                    this.type = 'warn';
                    this.showMsg = true;
                }
    
            }
    
        }
    }
</script>

<style lang="less">
    .container{
        background: #EFEFF4 !important;
        .listInfo {
            display: flex;
            flex-flow: row;
            margin: 5px 2px;
            padding: 5px 0;
            background: #fff;
            justify-content: space-around;
            .infoRight {
                display: flex;
                flex-flow: column;
                font-size:13px;
                justify-content: space-around;
            }
        }
    }
    
</style>