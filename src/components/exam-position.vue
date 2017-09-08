<!-- 考场位置 -->
<template>
  <section class="exam-position">
    <div id="mapControl">
      <!-- <p>正在定位，请稍后...</p> -->
    </div>
    <!--失败的提示-->
    <toast v-model="showMsg" type='text' position="top" :time="1000">
      <p style="font-size:13px;">{{msgInfo}}</p>
    </toast>
    <el-amap vid="amapDemo" :plugin="plugin" style="display:none;"></el-amap>
  </section>
</template>

<script>
var map;
import {
  Toast
} from "vux"
import store from '../store.js'
import { request } from '../api/api.js'
export default {
  components: {
    Toast
  },
  data() {
    let self = this;
    return {
      siteName: '',
      src: "",
      center: [114.06578, 30.657706],
      lng: 0,
      lat: 0,
      loaded: false,
      showMsg: false,
      msgInfo: "",
      plugin: [{
        pName: "Geolocation",
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if(result.info==="FAILED"){
                store.commit("LOADED");
                self.showMsg = true;
                self.msgInfo = "未开启定位";
              }
              else if (result && result.position) {
                self.lng = result.position.lng;
                self.lat = result.position.lat;
                self.center = [self.lng, self.lat];
                self.loaded = true;
                self.data.destinationName = (self.siteName === undefined || self.siteName === "" ? "成都广都地铁站" : self.siteName);//自贡市大安区和平乡自贡英祥交通驾校 this.siteName;
                request.public.getLocationByAddress([self.data.destinationName]).then(res => {
                  if (res.info === "OK" && res.status === "1") {
                    let geocodes = res.geocodes;
                    if (geocodes.length > 0) {
                      let lnglat = geocodes[0].location.split(",");
                      self.src = "http://uri.amap.com/navigation?from=" + self.lng + "," + self.lat + "," + result.formattedAddress + "&to=" + lnglat[0] + "," + lnglat[1] + "," + self.data.destinationName + "&via=&mode=car&policy=1&&coordinate=gaode&callnative=0";
                      loadControl(self.src);
                    }
                    else {
                      self.showMsg = true;
                      self.msgInfo = "目的地位置无效";
                      self.src = "http://ditu.amap.com/?src=uriapi";
                      loadControl(self.src);
                    }
                  }
                  store.commit("LOADED");
                });
              }
            });
          }
        },
        showMarker: false,
        buttonPosition: "RB"
      }],
      data: {
        distance: 0,
        destinationName: ""
      }
    }
  },
  methods: {
    onItemClick(index) {
    }
  },
  created() {
    this.siteName = this.$route.query.examSiteName;
    store.commit("LOADING");
  }
}

function loadControl(src) {
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", src);

  if (iframe.attachEvent) {
    iframe.attachEvent("onload", function () {
      store.commit("LOADED");
    });
  }
  else {
    iframe.onload = function () {
      store.commit("LOADED");
    };
  }
  var mapControl = document.getElementById("mapControl");
  mapControl.appendChild(iframe);
}
</script>

<style lang="less">
.exam-position {
  #mapControl {
    width: 0.1%;
    display: table-cell;
    vertical-align: middle;
    height: 300px;
    text-align: center;
    font-size: 13px;
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .exam-top {
    height: 394px;
  }
  .exam-bottom {
    background: #FFF;
    .bottom-position {
      height: 45px;
      display: table-cell;
      vertical-align: middle;
      padding: 20px 15px;
      p {
        color: #8492A6;
        font-size: .95rem;
        &:first-child {
          color: #33404E;
          font-size: .99rem;
          letter-spacing: 1px;
        }
        em.glyph-icon {
          display: inline-block;
          font-size: 18px;
          margin-right: 10px;
          line-height: 1;
          &.icon-position {
            color: #20A0FF;
          }
          &.go {
            color: #8492A6;
          }
        }
      }
    }
    &:not(:last-child) {
      border-bottom: 1px solid #D8D8D8;
    }
    .bottom-go-type {
      height: 82px;
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
    }
    .vux-flexbox-item {
      font-size: .95rem;
      &:not(:last-child) {
        border-right: 1px solid #D8D8D8;
      }
      p>em {
        color: #8492A6;
        font-size: 20px;
      }
    }
  }
}
</style>
