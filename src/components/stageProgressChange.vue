<template>
    <section>
        <!-- <div class='content1' @touchstart='start' @touchmove='move' ref='allStage'>
                <div class='divzContent1' id='1'>
                    <div class='innerContent' id='1'>
                        <p class='stageName' id='1'>时间1</p>
                        <p style='font-weight:bold;font-size:20px;' id='1'>{{hasTime}}分钟</p>
                    </div>
                </div>
                <div class='divzContent1' id='2'>
                    <div class='innerContent' id='2' >
                        <p class='stageName' id='2'>时间2</p>
                        <p id='2'>{{hasTime}}分钟</p>
                    </div>
                </div>
                <div class='divzContent1' id='3'>
                    <div class='innerContent' id='3'>
                        <p class='stageName' id='3'>时间3</p>
                        <p id='3'>{{hasTime}}分钟</p>
                    </div>
                </div>
                <div class='divzContent1' id='4'>
                    <div class='innerContent' id='4'>
                        <p class='stageName' id='4'>时间4</p>
                        <p id='4'>{{hasTime}}分钟</p>
                    </div>
                </div>
            </div> -->
        <swiper loop style='height:171px;margin-top:50px;' :aspect-ratio="300/800" @on-index-change="onSwiperItemIndexChange" v-model="rollStage">
            <swiper-item class="divzContent1">
                <div class='innerContent'>
                    <p class='stageName'>时间</p>
                    <p class='fonts'>{{hasTime}}分钟</p>
                </div>
            </swiper-item>
            <swiper-item class="divzContent1">
                <div class='innerContent'>
                    <p class='stageName'>时间</p>
                    <p class='fonts'>{{hasTime}}分钟</p>
                </div>
            </swiper-item>
            <swiper-item class="divzContent1">
                <div class='innerContent'>
                    <p class='stageName'>时间</p>
                    <p class='fonts'>{{hasTime}}分钟</p>
                </div>
            </swiper-item>
            <swiper-item class="divzContent1">
                <div class='innerContent'>
                    <p class='stageName'>时间</p>
                    <p class='fonts'>{{hasTime}}分钟</p>
                </div>
            </swiper-item>
        </swiper>
        <div class='footerInfo'>
            <div v-if='stage===3' class='stage'>
                <p class='transInfo'>
                    <img style='width:30px;height:30px;position:relative;top:8px;' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVoxCAXQ07AAAWF87tLRg141.png" alt="">
                    <span>当前培训{{hasRun}}公里</span>
                    
                </p>
                <x-progress :percent="percent" :show-cancel="false"></x-progress>
                <div style='text-align:right;'>{{totalMile}}公里
                    <img style='width:20px;height:20px;' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVosyARHUTAAAZAutjJ_E041.png" alt="">
                </div>
                
            </div>
            <router-link style='display: inline-block;width: 100%;margin-bottom:10%;text-align: center;color:rgb(18, 150, 219);' :to="{ path: '/stageProgress/stageProgressList' }">
                <img style='width:20px;height:20px;position:relative;top:3px;right:3px;' src="http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVouuAQH8wAAAbfAPmj2s651.png" alt="">查看培训历史
            </router-link>
        </div>
        <!--提示-->
        <toast position='bottom' v-model="showMsg" :type='type' :text='text'></toast>
    </section>
</template>

<script>
    import {
        XProgress,
        Toast,
        Swiper,
        SwiperItem
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
            XProgress,
            Swiper,
            SwiperItem
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
                text: '',
                historyTrain: [],
                swiperItemIndex: 0
            }
        },
        computed: {
            percent: function() {
                return (this.hasRun / this.totalMile) * 100
            },
            stage: {
                get() {
                    return store.state.stage
                },
                set() {
                    return store.state.stage
                }
            },
            rollStage:{
                get() {
                    return store.state.stage - 1
                },
                set() {
                    return store.state.stage - 1
                }
            }
        },
        watch: {
            stage: function(val, oldVal) {
                // console.log('新stage ： ' + Val);
                // console.log('旧stage ： ' + oldVal);
                this.stage = val;
                this.getDefaultDatas();
            }
        },
        methods: {
            onSwiperItemIndexChange(index) {
                // console.log('demo item change', index);
                store.commit('CHANGESTAGE',index + 1);
            },
            getDefaultDatas() {
                if (this.userInfo) {
                    this.totalMile = 0;
                    this.hasRun = 0;
                    this.totalTime = 0;
                    this.hasTime = 0;
                    this.historyTrain = [];
                    let args = [this.userInfo.studentId, this.stage, this.userInfo.carType, this.userInfo.province];
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
        },
        mounted() {
            this.getDefaultDatas();
            // console.log('change : ' + store.state.stage)
        }
    }
</script>

<style lang="less">
    .divzContent1 {
        width: 100%;
        height: 160px;
        text-align: center;
        margin: 1px 5px;
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        items-align: center;
        .innerContent {
            border-radius: 50%;
            border: 5px solid #99A9BF;
            width: 160px;
            height: 160px;
            text-align: center;
            .stageName {
                margin-top: 50px;
                color:#F9FAFC;
            }
            .fonts{
                font-weight:bold;
                font-size:20px;
                color:#F9FAFC;
            }
        }
    }
    
    .vux-swiper {
        height: 185px;
    }
    .vux-slider>.vux-swiper {
        overflow: hidden;
        position: relative;
    }
    
    .footerInfo {
        height: 120px;
        width: 100%;
        opacity: .8;
        border-top-left-radius: 40%;
        border-top-right-radius: 40%;
        display: flex;
        margin-top:39%;
        flex-flow: column;
        justify-content: center;
        .transInfo {
            text-align: center;
            margin-bottom: 2%;
        }
    }
</style>