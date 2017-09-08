import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 应用初始状态
const state = {
    isLoading: false,
    stage:1
}

// 定义所需的 mutations
const mutations = {
    LOADING(state) {
        state.isLoading = true;
    },
    LOADED(state){
        state.isLoading = false;
    },
    CHANGESTAGE(state,arg){
        state.stage = arg;
    }
}
const getters = {
    isLoading:state => state.isLoading,
    stage:state => state.stage
}
// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations,
    getters
})