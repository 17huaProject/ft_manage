import Vue from 'vue'
import Vuex from 'vuex'
import md5 from 'js-md5';
import axios from 'axios'
//const _wx = require('weixin-js-sdk')
import _wx from 'weixin-js-sdk'
Vue.use(Vuex)
const bDaty = new Date();
const toDay = new Date(bDaty.getTime() - parseInt(30 * 24 * 60 * 60 * 1000)); //
const afterWeek = new Date(bDaty.getTime() + parseInt(30 * 24 * 60 * 60 * 1000));
var _thisM = this;
const state = {
  SyetemBaseConfig: {}, //image_prefix,site_status(0_stop,1_online),sys_time,site_notice
  SelectCity: '上海',
  openID: '',
  customization: {
    custphone: '',
    custName: '',
    joinNumber: '',
    activeAddress: '',
  },
  locationIN: {
    latitude: '',
    longitude: ''
  },
  WX_baseAPiConfig: {

  },
  ScanNumber:'',
  GiftCardCustInfo: {
    page: 0,
    to: '',
    context: '',
    by: '',
    num: 0,
  },
  selectTimeFomt: new Date().getFullYear() + '-' + (1 + new Date().getMonth()) + '-' + new Date().getDate(),
  SelectCityCode: '3101',
  SelectCityArray: [],
  payOrderInfo: {},
  useConpon: {},
  buyNumber: 1,
  SelectNearSortCount: [{
      arrList: ['10km', '50km', '100km', '全市'],
      sOn: 3
    },
    {
      arrList: ['距离排序', '时间排序'],
      sOn: 1
    },
    {
      arrList: [1, 2, 3, 4, 5, 'more'],
      sOn: 0
    }
  ],
  SearchKeyWord: '',
  commInfo: '',
  getParamString: '',
  serverHost: 'http://123.206.108.152:8080', //正式,
  //serverHost: 'http://123.207.173.153:8080', //测试,
  usrPhone: '',
  usrInfomation: {},
  serverTime: new Date(),
  ChangeCalendar: {
    startTime: toDay,
    endTime: afterWeek
  },
  routerPath: [],
  connectionObj: {}
}
const actions = {
  urlEncode(param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
      for (var i in param) {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += actions.urlEncode(param[i], k, encode);
      }
    }
    return paramStr;
  },
  sharePage(obj) {
    _wx.ready(function () {
      _wx.onMenuShareTimeline({
        title: obj.sharetitle, // 分享标题
        link: obj.sharelink, // 分享链接
        imgUrl: obj.shareimgUrl, // 分享图标
        success: function () {
          console.log('SinglePageSuccess')
        },
        cancel: function () {
          console.log('SinglePageFalse')
        }
      });
      _wx.onMenuShareAppMessage({
        title: obj.sharetitle, // 分享标题
        desc: obj.shareDesc, // 分享描述
        link: obj.sharelink, // 分享链接
        imgUrl: obj.shareimgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          console.log('SinglePageSuccess')
        },
        cancel: function () {
          console.log('SinglePageFalse')
        }
      });
    })
  },
  getlocationAPI() {
    _wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        // var speed = res.speed; // 速度，以米/每秒计
        // var accuracy = res.accuracy; // 位置精度
        state.locationIN = {
          latitude: res.latitude,
          longitude: res.longitude
        }
      }
    });
  },
  reLoadWXconfig() {
    let w = {
      url: location.href.split('#')[0]
    }
    mutations.ConectionPara(state, w)
    let getString = state.getParamString;
    let postString = getString.replace('?', '');
    axios.get(state.serverHost + '/yqhbsp/config/getWXJSConfig' + getString).then(m => actions.getConfigByReload(m.data)).catch(r => console.log(r));
  },
  getScanQRcode() {
    let _this = this
    _wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        state.ScanNumber = res.resultStr+'-'+Math.random(); // 当needResult 为 1 时，扫码返回的结果
      }
    });
  },
  getConfigByReload(data) {
    if (data.errcode == 200) {
      _wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.record.appId, // 必填，公众号的唯一标识
        timestamp: data.record.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.record.nonceStr, // 必填，生成签名的随机串
        signature: data.record.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  }

}
const mutations = {
  changeCity(state, newCity) { //变更城市以及代码
    state.SelectCity = newCity.name;
    state.SelectCityCode = newCity.code;
  },
  ChangeTime(state, time) { //获取变更时间
    time.startTime ? state.ChangeCalendar.startTime = time.startTime : '';
    time.endTime ? state.ChangeCalendar.endTime = time.endTime : '';
  },
  SelectTime(state, time) { //获取变更时间
    state.selectTimeFomt = time
  },
  PushINArr(state, msg) { //插入路由数据
    state.routerPath.push(msg);
  },
  DeletINArr(state, msg) { //删除路由数据
    let index = state.routerPath.indexOf(msg)
    state.routerPath.splice(index, 1);
  },
  saveWXconfig(state, conf) { //微信API调用配置
    state.WX_baseAPiConfig = conf;
    var share = {
      sharetitle: '我喜欢这个绘画活动，你也去一起画吧',
      sharelink: 'wx.17hua.me',
      shareimgUrl: 'http://wx.17hua.me/static/obj_img/logo_for_share.png',
      shareDesc: '创建独一无二的作品！'
    };
    _wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: conf.appId, // 必填，公众号的唯一标识
      timestamp: conf.timestamp, // 必填，生成签名的时间戳
      nonceStr: conf.nonceStr, // 必填，生成签名的随机串
      signature: conf.signature, // 必填，签名，见附录1
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'getLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    _wx.ready(function () {
      _wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          state.locationIN = {
            latitude: res.latitude,
            longitude: res.longitude
          }
        }
      })
      _wx.onMenuShareTimeline({
        title: share.sharetitle, // 分享标题
        link: share.sharelink, // 分享链接
        imgUrl: share.shareimgUrl, // 分享图标
        success: function () {

        },
        cancel: function () {

        }
      });
      _wx.onMenuShareAppMessage({
        title: share.sharetitle, // 分享标题
        desc: share.shareDesc, // 分享描述
        link: share.sharelink, // 分享链接
        imgUrl: share.shareimgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {

        },
        cancel: function () {

        }
      });
      _wx.error(function (res) {
        if (res.errMsg != 'config.ok') {

          try {
            actions.reLoadWXconfig()
          } catch (error) {}
        }
      });
    })
  },
  getCityArray(state, arr) { //获取开放城市
    state.SelectCityArray = arr;
  },
  getBaseConfig(state, arr) { //获取系统参数
    state.SyetemBaseConfig = arr;
  },
  saveConnectionObj(state, obj) { //获取下单人信息
    state.connectionObj = obj
  },
  setCommodityInfo(state, arr) { //获取下单活动信息
    state.commInfo = arr;
  },
  setSelectNearSortCount(state, _obj) { //列表信息存入
    state.SelectNearSortCount[_obj.index].sOn = _obj.num;
  },
  useShareFun(state, obj) { //分享属性
    actions.sharePage(obj)
  },
  findWhereAmI(state, obj) { //找到我在哪儿
    actions.getlocationAPI()
  },
  saveListKeyWord(state, key) { //列表关键字存入
    state.SearchKeyWord = key;
  },
  runScanQRCodeFun(){
    actions.getScanQRcode()
  },
  saveOpenID(state, openid) { //存储openid
    state.openID = openid;
  },
  savePayOrderInfo(state, info) { //存储支付信息
    state.payOrderInfo = info
  },
  saveCouponInfo(state, info) { //存储优惠券选择
    state.useConpon = info
  },
  savebuyNumber(state, number) { //记录购买数量
    state.buyNumber = number
  },
  saveCustomizationinfo(state, info) { //定制信息存储
    state.savecustomizationinfo = info
  },
  saveGiftCardStyleinfo(state, info) { //礼品卡内容存储
    state.GiftCardCustInfo = info
  },
  ConectionPara(state, obj) { //请求参数补全
    let BaseArr = {
      phone: state.usrInfomation.phone || '',
      timestamp: state.serverTime.YYYYMMDDHHMMSS(),
      sign: md5(state.usrInfomation.phone || '' + state.serverTime.YYYYMMDDHHMMSS() + 'HBQPr1YD5QXVGUgG14eZlP6u484wfmHf'),
      pid: '100001',
      ver: '1.0',
      client: 'WAP',
      test: 'http://' + window.location.host
    };
    let requestArr = Object.assign(BaseArr, obj);
    state.getParamString = actions.urlEncode(requestArr).replace('&', '?')
  },
  ConectionParaWithOutPhone(state, obj) { //请求参数补全
    let BaseArr = {
      timestamp: state.serverTime.YYYYMMDDHHMMSS(),
      sign: md5(state.serverTime.YYYYMMDDHHMMSS() + 'HBQPr1YD5QXVGUgG14eZlP6u484wfmHf'),
      pid: '100001',
      ver: '1.0',
      client: 'WAP',
      test: 'http://' + window.location.host
    };
    let requestArr = Object.assign(BaseArr, obj);
    state.getParamString = actions.urlEncode(requestArr).replace('&', '?')
  },
  getBaseUsrInfo(state, arr) { //获取用户信息
    state.usrInfomation = arr;
  },
}
const getters = {}
const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
// store.commit('changeCity','abd')
export default store
Date.prototype.YYYYMMDDHHMMSS = function () {
  var yyyy = this.getFullYear().toString();
  var MM = pad(this.getMonth() + 1, 2);
  var dd = pad(this.getDate(), 2);
  var hh = pad(this.getHours(), 2);
  var mm = pad(this.getMinutes(), 2)
  var ss = pad(this.getSeconds(), 2)
  return yyyy + MM + dd + hh + mm + ss;
};

function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
