<!-- 支付结果 -->

<template>
    <section>
        <div class='infoDetail'>
            <div class='infoDetailHead'>
                <img src="../../static/bill.png" alt="" style='width:20px;height:20px;margin: 0 5px;'>
                <h5>基本信息</h5>
                <span style='background:#1296db;color:#fff;margin:0 5px;border-radius:5px;text-align:center;height:20px;width:30px;font-size:13px;'>实操</span>
            </div>
            <div class='infoDetailBody'>
                <p class='infoDetailBodies'>
                    <div class='innerInfo'>培训车辆：{{stageProgress.cardNo}}</div>
                    <div class='innerInfo'>培训教练：{{stageProgress.teacherName}}</div>
                </p>
                <p class='infoDetailBodies'>
                    <div class='innerInfo'>培训日期：{{new Date(1502421564000).toLocaleDateString().replace(/\//g,'-')}}</div>
                    <div class='innerInfo'>培训科目：{{stageProgress.stage === 1?'科目一':stageProgress.stage===2?'科目二':stageProgress.stage===3?'科目三':'科目四'}}</div>
                </p>
                <p class='infoDetailBodies'>
                    <div class='innerInfo'>签到时间：{{new Date(stageProgress.beginTime).toTimeString().slice(0,5)}}</div>
                    <div class='innerInfo'>签退时间：{{new Date(stageProgress.endTime).toTimeString().slice(0,5)}}</div>
                </p>
                <p class='infoDetailBodies'>
                    <div class='innerInfo'>有效时长：{{stageProgress.validStudyMin}}分钟</div>
                    <div class='innerInfo'>培训时长：{{stageProgress.allStudyMin}}分钟</div>
                </p>
            </div>
        </div>
        <hr>
        <div class='infoImg'>
            <div class='infoImgHead'>
                <img src="../../static/picturey.png" alt="" style='width:20px;height:20px;margin: 0 5px;'>
                <h5>培训照片</h5>
            </div>
            <scroller lock-y :scrollbar-x='false'>
                <div class="box1">
                    <div class="box1-item">
                        <img :src="stageProgress.studentPhoto" alt="">
                    </div>
                </div>
            </scroller>
        </div>
    
        <hr>
    
        <div class='infoRoutes'>
            <div class='infoRoutesHead'>
                <img src="../../static/routes.png" alt="" style='width:20px;height:20px;margin: 0 5px;'>
                <h5>历史轨迹</h5>
            </div>
            <div id="mapControl">
                <!-- <p>正在定位，请稍后...</p> -->
            </div>
        </div>
        
    </section>
</template>

<script>
    import {
        Toast,
        Scroller
    } from 'vux'
    import store from '../store.js'
    import {
        global
    } from '../assets/javascript/global.js'
    import { request } from '../api/api.js'

    export default {
        components: {
            Toast,
            Scroller
        },
        data() {
            return {
                stageProgress: JSON.parse(sessionStorage.getItem('stageProgress'))[0],
                
            }
        },
        methods: {
            initMap(){
                var map = new AMap.Map('container', {
                    resizeEnable: true,
                    zoom:11,
                    center: [116.397428, 39.90923]
                });
            }
        },
        created() {
            // this.siteName = '云南';
        }
    }
    
</script>

<style lang="less">
   
    .infoImg {
        margin-bottom: 10px;
    }
    
    .infoDetailHead,
    .infoRoutesHead,
    .infoImgHead {
        display: flex;
        flex-flow: wrap;
        justify-content: flex-start;
        align-items: center;
        margin: 10px 0;
    }
    
    .infoDetailBodies {
        display: flex;
        flex-flow: wrap;
        justify-content: space-around;
    }
    
    .innerInfo {
        display: inline-block;
        width: 160px;
        margin: 5px 5px;
        font-size: 14px;
    }
    
    .box1 {
        height: 100px;
        position: relative;
        width: 1500px;
    }
    
    .box1-item {
        width: 200px;
        height: 100px;
        background-color: #ccc;
        display: inline-block;
        margin-left: 15px;
        float: left;
        text-align: center;
        line-height: 100px;
        img {
            width: 200px;
            height: 100px;
        }
    }
</style>
