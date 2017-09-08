// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "./assets/css/iconfont.css"
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router/index'
import AMap from "vue-amap"
import { ConfirmPlugin } from 'vux'
import { cookie } from 'vux'
import store from './store.js'
import { request } from './api/api.js'
import VueWechatTitle from 'vue-wechat-title'
import vueTap from 'v-tap';
Vue.use(vueTap);
Vue.use(ConfirmPlugin)
Vue.use(VueRouter)
Vue.use(AMap)
Vue.use(VueWechatTitle)

AMap.initAMapApiLoader({
  // 高德的key
  key: 'b74bcc6bdd4c036f38101faefc87a8d2',
  // 插件集合
  plugin: ['Geocoder', 'Driving', "AMapManager", "Marker", "Geolocation"]
});

const router = new VueRouter({
  routes
});

FastClick.attach(document.body)

Vue.config.productionTip = false
/* eslint-disable no-new */
//钩子函数
router.beforeEach((to, from, next) => {
  // console.log(router);
  // 每次路由跳转，都要先转动 loading 这个页
  // if (to.path !== '/isAppointment') store.commit('LOADING');
  let destnation = to.path;
  let requireAuth = to.meta.requireAuth;
  let user = JSON.parse(sessionStorage.getItem("token"));
  if (!localStorage.getItem('wechatApi')) {
    localStorage.setItem('wechatApi', to.query.requestUrl + '/hxc');
  }
  // next();
  // 判断是否存有 token 值，且不为 手机绑定页
  if (!user && requireAuth) {
    // alert('has no token and not register')
    // 路由跳转前根据去向路由的 url参数 schoolCode 来查询 appid
    if (to.query.schoolCode) {
      // alert('has shoolCode')
      // 意外删除 token后，服务器将 新的 token 值赋在 url后，根据是否有 openId判断
      if (!to.query.openId) {
        // alert('has schoolCode but no openId')
        // 将 api 存入 sessionStorage 
        let str = JSON.stringify(to);
        let py_url = window.location.href.split('#')[0];
        request.Appointment.authorizerAppId([to.query.schoolCode]).then(res => {
          if (res.success) {
            // 跳往的地址 没有新token 进入鉴权页面
            destnation_ = destnation.slice(1);
            // alert(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.object}&redirect_uri=${to.query.requestUrl}/hxc/wx/userAuthorizationCallback?py_url=${py_url}&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=wxcc69aed71888cc64#wechat_redirect`);
            window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.object.appid}&redirect_uri=${to.query.requestUrl}/hxc/wx/userAuthorizationCallback?py_url=${py_url}${destnation}&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=${res.object.component_appid}#wechat_redirect`);
          } else {
            next();
          }
        });
      }
      // 删除 token 但 url 有 新的 token值
      else {
        let token = to.query;
        sessionStorage.setItem('token', JSON.stringify(token));
        // 进入下一个路由管道
        if (destnation === '/reservation' || destnation === '/') {
          if (token.appointment.toString() === 'false') {
            next({
              path: '/isAppointment'
            });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    } else {
      next();
    }
  }
  // 若 存在 token 值
  else {
    // alert('has token')
    if (!user) {
      next();
    } else {
      // 非预约学员
      // console.log(user.appointment.toString() === 'false');
      // console.log(to.path);
      if (to.path === '/reservation' || to.path === '/') {
        if (user.appointment.toString() === 'false') {
          // 跳转到 非预约学员提示页
          store.commit('LOADED');
          setTimeout(() => {
            next({
              path: '/isAppointment'
            });
          }, 10);
        } else {
          // 是预约学员，则进入路由管道
          next();
        }
      } else {
        next();
      }
    }
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')


