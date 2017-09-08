<!-- 支付结果 -->

<template>
    <section class='allContainer'>
        <tab bar-active-color="#1AAD19" :line-width="3" active-color="#000">
            <tab-item :selected='stage===1' @on-item-click="onItemClick">科目一</tab-item>
            <tab-item :selected='stage===2' @on-item-click="onItemClick">科目二</tab-item>
            <tab-item :selected='stage===3' @on-item-click="onItemClick">科目三</tab-item>
            <tab-item :selected='stage===4' @on-item-click="onItemClick">科目四</tab-item>
        </tab>
        <!-- <div class='content'>
            <div class='contentColumn'>
                <div class='divzContent' v-tap="{ methods : touched }">科目一</div>
                <div class='divzContent'>科目二</div>
            </div>
            <div class='contentColumn'>
                <div class='divzContent'>科目三</div>
                <div class='divzContent'>科目四</div>
            </div>
        </div>
        -->
        <router-view></router-view>
    </section>
</template>

<script>
    import {
        Tab,
        TabItem,
        Toast
    } from 'vux'
    import store from '../store.js'
    export default {
        components: {
            Tab,
            TabItem,
            Toast
        },
        data() {
            return {
                showMsg: false,
                type: '',
                messages: ''
            }
        },
        computed:{
            stage: {
                get() {
                    return store.state.stage
                },
                set() {
                    return store.state.stage
                }
            },
        },
        methods: {
            onItemClick(index) {
                let state = index+1;
                if (this.stage !== state) {
                    store.commit('CHANGESTAGE',state);
                    // console.log(this.stage)
                    // console.log('do not yi')
                }
                // console.log('state : ' + state)
                // console.log('index : ' + index)
                // console.log('stage : ' + this.stage);
            }
        }
    }
</script>

<style lang="less">
.allContainer{
    background-image:url('http://img.haoxueche.com:8888/group1/M00/04/1F/wKgKH1mVoq2APCG8AACqbIgJ_30568.png');
    background-repeat:no-repeat;
    background-size: 100%;
    background-position-y:-100px;
}
</style>
