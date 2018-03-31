import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Qs from 'qs'
import wx from 'weixin-js-sdk'

//import layer from 'vue-layer'
//https://www.npmjs.com/package/vue-layer
//Vue.prototype.$layer = layers;

Vue.config.productionTip = false;
window.ApiVersion = process.env.VERSION;

if(process.env.NODE_ENV=='development'){
	window.Mock = require('mockjs');
	Vue.prototype.APIbaseURL = 'http://192.168.1.118/carapi';
	window.ApiVersion = '';
}else{
	Vue.prototype.APIbaseURL = 'http://www.incar888.com/carapi';
}

if(typeof window.Mock!='undefined'){
	window.mock = {...Mock}
	Mock.mock = function () {	
	  if (arguments.length === 1) {
	    return mock.mock(...Array.from(arguments))
	  } else {
	    mock.mock(Vue.prototype.APIbaseURL + arguments[0], ...Array.from(arguments).slice(1))
	  }
	}
}

// 获取token的值  通过url 获取的token值;
let history=window.sessionStorage;
let local=window.localStorage;
let toGetTokenTime=null;

Vue.prototype.$unique = function(arr, key) {
	var obj = {}, result = [];
	arr.filter((a) =>{
		if(a.hasOwnProperty(key)){
			if(!obj[a[key]]){//数组元素重复了
			   obj[a[key]] = true;
			   result.push(a);
			}
		}
	});
	obj = {};
	return result;
}

function toGetToken(){
	history.clear();
	const url = window.location.href;
	history.setItem("_url", url);
	if(toGetTokenTime)clearTimeout(toGetTokenTime);
	toGetTokenTime = setTimeout(()=>{
		window.location.replace(Vue.prototype.APIbaseURL+"/checkme?url="+encodeURIComponent(url));
	}, 1000);
}

// 气泡提示
let toastAltertimer = null;
let toastOnlineStatus=true;
Vue.prototype.$toastAlter=function(val,ts){	
	if(!toastOnlineStatus) return;	
	let box=document.querySelector("#layer-toast");
	if(!val || ts==0){		
		box.innerHTML='';
		return;
	}
	let html = '<div class="layui-m-layer layui-m-layer0">'
		html += '<div class="layui-m-layermain">'
		html += '<div class="layui-m-layersection">'		
		html +=	'<div class="layui-m-layerchild layui-m-layer-msg  layui-m-anim-up">'
		html +=	'<div style="padding:0.5rem 0.5rem;font-size: 0.75rem;" class="layui-m-layercont-m">'+val+'</div>'
		html +=	'</div>'
		html +=	'</div>'	
		html +=	'</div>'
		html +=	'</div>'
	box.innerHTML=html;
	if(ts > 0){
		if(toastAltertimer){
			clearTimeout(toastAltertimer);
		}
		toastAltertimer = setTimeout(()=>{
			box.innerHTML='';
		},ts);
	}
}

// 浏览器关闭时候显示的页面
function isCloseWindow(isstop){	
	history.clear();
	if(!isstop){
		setTimeout(()=>{
			WeixinJSBridge.invoke('closeWindow',{},function(res){});
		},100)
	}else{
		let host = document.location.protocol+'//'+document.domain;
		if(location.port && location.port!='80')host = host+':'+location.port;
		window.top.location.href = host;
	}
}
Vue.prototype.$isCloseWindow=isCloseWindow;

//路由切换中断API请求
const CancelToken = axios.CancelToken;  
let ajaxCancel=[];

//设置全局的请求次数，请求的间隙
var instance = axios.create({
  	baseURL: Vue.prototype.APIbaseURL,
 	timeout: 10000,
	retry: 3,
	retryDelay: 1000,
	transformResponse: [function (data) {
		Vue.prototype.$toastAlter('');
		let dat = JSON.parse(data);
		if(dat.status == '302'){  // token 过期
			toGetToken();
			return;
		}else{
			if(dat.status=='404'){ //  司机 跟 乘客 非法操作
				let msg = dat.error ? dat.error : '本次操作是非法';
				router.replace({name:'error', query:{msg:msg}});
				return false;
			}

			if(dat.error && dat.status == 1){ //返回数据出错
				Vue.prototype.$toastAlter(dat.error,2000);
				return false;
			}			
			return dat;
		}		
  	}],
  	headers: {
  		'token': history.getItem('token')?history.getItem('token'):'',
  		'API-Version': ApiVersion
  	}
});
// 超时响应拦截，重新执行3次（配置请求回来的信息）
instance.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config; console.log(err);
    
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Check if we've maxed out the total number of retries
    if(config.__RetryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    
    config.__RetryCount = config.__RetryCount || 0;

    // Increase the retry count
    config.__RetryCount += 1;

 	/*while (ajaxCancel.length > 0) {
		ajaxCancel.pop()();
	}*/
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) { 
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
    	config.headers['Authorization'] = config.__RetryCount;
		return instance(config);
    });
});
Vue.prototype.$https=instance;
Vue.prototype.$ajaxPost=function(url,data){
	return new Promise((resolve,reject)=>{
		instance.post(url,data,{
			cancelToken: new CancelToken(c => {  //强行中断请求要用到的  
        		ajaxCancel.push(c); 
    		})
		}).then((data)=>{			
			resolve(data.data);
		}).catch((error)=>{// 服务器出现严重错误的时候 跳转到404页面去						
			resolve();
		})
	})
}

window.addEventListener("online", function () {
	toastOnlineStatus=true;
	Vue.prototype.$toastAlter('', 0);//清除网络通讯中断提示		
});
window.addEventListener("offline", function () {	
	Vue.prototype.$toastAlter('网络连接中断, 请检查你的网络', -1);
	toastOnlineStatus=false;
});

// 隐式的获取token值
var timersGetToken=null;
function timeGetToken(){
	instance.post('/gettoken',{}).then((data)=>{
		let dat = data.data;
		if(dat.token){
			instance.defaults.headers.token=dat.token;
			history.setItem('token',dat.token);
			history.setItem('tokenData',dat.tokenData);
			history.setItem('user',dat.user=='isdriver'?1:0);
			history.setItem('userinfo',JSON.stringify(dat.userinfo));
			timeRunGetToken();
		}
	})
}
Vue.prototype.$timeGetToken=timeGetToken;
function timeRunGetToken(){
	let tim = history.getItem('tokenData');
	if(timersGetToken)clearInterval(timersGetToken)
	if(tim){
		timersGetToken = setInterval(()=>{
			tim--;
			history.setItem('tokenData',tim);
			if(tim<=10){				
				clearInterval(timersGetToken);
				timeGetToken();
			}
		},1000);
	}
}
timeRunGetToken();

Vue.prototype.$formatDate = function (fmt,time) { 
	let timer = new Date(time*1000);
	let o = {
		"M+": timer.getMonth() + 1,    //月份 
		"d+": timer.getDate(),         //日 
		"H+": timer.getHours(),        //小时 
		"m+": timer.getMinutes(),      //分 
		"s+": timer.getSeconds(),      //秒 
		"S":  timer.getMilliseconds()  //毫秒 
	};
	if (/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (timer.getFullYear() + "").substr(4 - RegExp.$1.length));
	} 
	for (var k in o){
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};

//状态管理，相当于全局变量
var store={
	debug: true,
	state: {
	   startArea: {
			place: history.getItem('sPlace') ? history.getItem('sPlace'):'起点位置',
			placeId:history.getItem('startId')
	   },
	   endArea: {
			place: history.getItem('ePlace') ? history.getItem('ePlace'):'终点位置',
			placeId:history.getItem('endId')
	   },
	   orderId: history.getItem("orderId") ? history.getItem("orderId"):0,
	   routerStatus: false,
	   passFooter: false,
	   driverFooter: false
	}
	,getUserinfo(cb){
		if(history.getItem('userinfo')){
			let userinfo = history.getItem('userinfo');	       
			cb(JSON.parse(userinfo));	        
		}else{
			timeGetToken();
			Vue.prototype.$toastAlter('正在载入身份', -1);
			let timersGetuserinfo = setInterval(()=>{
			let userinfo = history.getItem('userinfo');
				if(userinfo && userinfo!='undefined'){
					Vue.prototype.$toastAlter('', 0);
					clearInterval(timersGetuserinfo);
					cb(JSON.parse(userinfo));
				}
			},1000);
		}
	}
	,setUserinfo(name, val){
		let userinfo = history.getItem('userinfo');
		userinfo = JSON.parse(userinfo);
		if(userinfo.hasOwnProperty(name))userinfo[name] = val;
		history.setItem('userinfo',JSON.stringify(userinfo));
	}
	,startAreaAction(value,id){
		this.state.startArea.place = value;
		this.state.startArea.placeId = id;
		history.setItem('sPlace',value);
		history.setItem('startId',id);
	}
	,clearStartAreaAction(){
		this.state.startArea.place = '起点位置';
		this.state.startArea.placeId = 0;
		history.removeItem('sPlace');
		history.removeItem('startId');
	}
	,endAreaAction(value,id){
		this.state.endArea.place = value;
		this.state.endArea.placeId = id;
		history.setItem('ePlace',value);
		history.setItem('endId',id);
	}
	,clearEndAreaAction(){
		this.state.endArea.place = '终点位置';
		this.state.endArea.placeId = 0;
		history.removeItem('ePlace');
		history.removeItem('endId');
	}
	,orderIdAction(value){
		this.state.orderId=value;
		history.setItem("orderId",value);
	}
	,clearOrderIdAction(){
		this.state.orderId=0;
		history.removeItem("orderId");
	}
	,statusAction(val){
		this.state.routerStatus = val;
	}
	,passAction(val){
		this.state.passFooter = val;
	}
	,driverAction(val){
		this.state.driverFooter = val;
	}
}

Vue.prototype.$store=store;

Vue.prototype.$sleep=function(ms){
	return new Promise(resolve => setTimeout(resolve,ms*1000))
}

String.prototype.trim = function(){
    return this.replace(/^\s+(.*?)\s+$/, "");
}

// 微信 分享
var wxJssdk=function(){	
	
	let res = null;
	let urls = document.location.href;

	urls = urls.split('#')[0];

	wx.ready(function(){
		if(!res)return;

		/*wx.hideAllNonBaseMenuItem({
		    success: function () {
		       
		    }
	    });*/
		
		wx.onMenuShareTimeline({
			title: res.title, // 分享标题
			link: res.link, // 分享链接
			desc: res.content,
			imgUrl: res.img,
			success: function () {
			// 用户确认分享后执行的回调函数
			},
			cancel: function () {
			// 用户取消分享后执行的回调函数
			}
		});

		// 朋友
		wx.onMenuShareAppMessage({
			title: res.title, // 分享标题
			link: res.link,   // 分享链接
			desc: res.content,
			imgUrl: res.img,
			success: function () {
			// 用户确认分享后执行的回调函数
			},
			cancel: function () {
			// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareQQ({
			title: res.title, // 分享标题
			link: res.link,   // 分享链接
			desc: res.content,
			imgUrl: res.img,
			success: function () {
			// 用户确认分享后执行的回调函数
			},
			cancel: function () {
			// 用户取消分享后执行的回调函数
			}
		});
	});

	instance.post('/wxapi', {url:encodeURIComponent(urls)}).then((response) => {
		if(!response.data)return;
		res = response.data;
		wx.config(res.config);		
		wx.error(p => {
			console.log(p)
		});
	},(response) => {
		//请求出错
	});	
}
wxJssdk();

function urlGetParam(name){
    return window.location.href.match(new RegExp('[?&]' + name + '=([^#?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
}

function directRightUrl () {	
	let paths = window.location.href.split('#')
	if(paths[0].indexOf('/?') > -1)return;
	paths[1] = paths[1] || '/';
	// 老式的#!分隔跳转  
	if (paths[0].charAt(paths[0].length - 1) !== '?') {  
		paths[0] = `${paths[0]}?`;
	}  
	if (paths[1].charAt(0) === '!') {
		paths[1] = paths[1].substr(1);
	}  
	let url = (`${paths[0]}#${paths[1]}`).replace('/#','/?#');
	if (window.location.href !== url) {
		window.location.href = url;
	}  
}  
directRightUrl();//补回URL ？ 防止微信支付和分享签名失败

window.confirm = function (message) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    var alertFrame = window.frames[0];
    var result = alertFrame.window.confirm(message);
    iframe.parentNode.removeChild(iframe);
    return result;
};

router.afterEach((to)=>{	
	store.statusAction(false);
});

router.beforeEach((to,from,next)=>{
	Vue.prototype.$toastAlter('');//清空所有气泡

	let user = history.getItem('user');
	let token = history.getItem('token');

	let host = document.location.protocol+'//'+document.domain;
	if(location.port && location.port!='80')host = host+':'+location.port;
	host = host + '/';

	if(ApiVersion){// 版本控制更新
		axios.get('./static/apiversion.json?_t='+Math.random()).then(res=>{
			if(typeof(res.data.version)!='undefined' && ApiVersion!=res.data.version){				
				console.log(ApiVersion, res.data.version); next(false); 
				var reloadUrl = function(){
					Vue.prototype.$toastAlter('正在更新...', -1);
					if(toGetTokenTime)clearTimeout(toGetTokenTime);
					toGetTokenTime = setTimeout(()=>{
						window.location.reload(true);
					}, 1000);
				};

				if(confirm('发现有新版本，请确定更新')){					
					reloadUrl();
				}else{
					reloadUrl();
				}
				return;
			}
		});	
	}

	if(to.name!='error'){				
		if(!token){
			store.statusAction(true);

			token = urlGetParam('token');

			let userImg = urlGetParam("img"); //微信头像
			if(userImg)history.setItem("img", decodeURIComponent(userImg));

			let user = urlGetParam("user") == "isdriver" ? 1 : 0;
			history.setItem("user",user); //是否司机

			let openid = urlGetParam("openid"); //微信OPENID
			if(openid)history.setItem("openid", openid);

			if(!token){
				if(openid){//存在openid进入登录页
					window.location.replace(host+'#/login');
					return;
				}else{
					if(!history.getItem('openid')){//没有本地openid跳取token
						toGetToken();
						return;
					}else{//存在本地openid
						if(to.name!='login'){//不是登录页跳取token
							toGetToken();
							return;
						}else{//登录页放行
							next();
						}
					}
				}
			}else{
				history.setItem("token",token);
				let tokenData = urlGetParam("tokenData");
				tokenData = tokenData ? parseInt(tokenData) : 12;
				history.setItem('tokenData',tokenData);

				if(history.getItem("_url"))host = history.getItem("_url");
				
  				history.removeItem("_url");
				window.location.replace(host);
				return;
			}
		}
	}
	
	while (ajaxCancel.length > 0) {
		ajaxCancel.pop()();
	}

	if((user!=0 && user!=1)){//没有user跳取
		toGetToken();
		return;
	}

	//不合法路由选择跳转
	if(to.matched.length === 0){
		let toname = user==1 ? 'dri_order' : 'pass_place';
		from.name ? router.replace({name:from.name}) : router.replace({name:toname})
	}	
	
	//底部菜单
	if(user==0){
		store.driverAction(false);
		if(to.meta.isFooter){
			store.passAction(true);
		}else{
			store.passAction(false);
		}		
		next();
	}else if(user==1){
		store.passAction(false);
		store.driverAction(true);
		next();
	}	
});

new Vue({
  el: '#container',
  router,
  components: { App },
  template: '<App />'
});