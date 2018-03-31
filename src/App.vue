<template>
  <div id="container">
  	<transition name="fade">
    	<router-view v-show="!$store.state.routerStatus" />
    </transition>
   	<v-loading  :loading="loading" />
    <div class="box-img" v-show="$store.state.routerStatus" ><img :src="welcomeimgs" class="welcomeimgs"></div>	
    <v-msgalter :title="alterTitle" @hideFun="alterStatus=false" :showStatus="alterStatus" />
    <v-send :title="sendTitle" :sendStatus="sendStatus" />
    <v-footerpass v-if="$store.state.passFooter" v-show="footerStatus" />
    <v-footerdriver v-if="$store.state.driverFooter" />
  </div>  
</template>
<script>
import welcomeimgs from '@/assets/welcome.jpg';
import vMsgalter from '@/components/common/msgAlter.vue'
import vSend from '@/components/common/send.vue'
import vLoading from '@/components/common/loading.vue'
import vFooterpass from '@/components/footer_pass.vue'
import vFooterdriver from '@/components/footer_driver.vue'

export default {
  name: 'container',
  components:{
    vMsgalter,
    vSend,
    vLoading,
    vFooterpass,
    vFooterdriver
  }
  ,data(){
    return{
    alterStatus:false,
    alterTitle:'',
    sendTitle:'',
    timers:1000,
    sendStatus:false,
    welcomeimgs:welcomeimgs,
    loading:false,
    footerStatus:true
    }
  }
  ,methods:{
    getParam(name){
    return window.location.href.match(new RegExp('[?&]' + name + '=([^#?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
    }
    ,msgAlter(val){
      this.alterTitle=val;
      this.alterStatus=!0;
    }
    ,msgSend(val){
      this.sendTitle=val;
      this.sendStatus=!0;
    }
    ,endSend(val,ms){
      return new Promise((resolve,reject)=>{
        this.sendTitle=val;
        setTimeout(()=>{
          this.sendStatus=!1;
          resolve();
        },ms*1000)
      })
    }
    ,loadingAction(val){
      this.loading = val;
    }
    ,footerAction(val){
      this.footerStatus=val;
    }
  }  
  ,watch:{
    $route(){
      this.loadingAction(false); //路由切换清除loading
      this.alterStatus=false; //路由切换清除对话框
    }
  }
}
</script>
<style>
@import './iconfont.css';
@import './layer.css';
html{width: 100%;height: 100%;min-height: 33.25rem;overflow-x: hidden;}
body{width: 100%;height: 100%;font-family: "微软雅黑";color: #545454;font-size: 0.6rem;
-webkit-touch-callout: none;-moz-user-select: none;-khtml-user-select: none;
-webkit-user-select: none;-ms-user-select: none;user-select: none;}
.copy{-webkit-touch-callout:text;-moz-user-select: text;-khtml-user-select:text;-webkit-user-select:text;-ms-user-select:text;user-select:text;}
.box-img{position: absolute;z-index: 1000;top:0;left: 0;width: 100%;height: 100%;overflow: hidden;}
.welcomeimgs{display: block;width:100%;}
#container{width:100%;height:100%;}
.close-window{text-align: center;padding:0.5rem;font-size: 0.75rem;}
*{margin:0;padding:0}
a img{border:0}
li{list-style: none;}
a{text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);color: #6d6d6d}
.u-left{float: left;}
.u-right{float: right;}
button,input{border:none;outline: none;}
.clearfix:after,.clearfix:before{content: " ";display: table;}
.clearfix:after,.clearfix{clear: both;*zoom: 1;}
.fx{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}
.fx-no{-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}
.fx-one{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;-webkit-flex-shrink:1;-ms-flex-negative:1;flex-shrink:1}
.bc{box-sizing:border-box;-webkit-box-sizing:border-box;}
.hover{position: relative;overflow: hidden;}
.hover:after {content: "";display: block;position: absolute;width: 100%;height: 100%;top: 0;left: 0;pointer-events: none;background-image: radial-gradient(circle, #666 10%, transparent 10.01%);background-repeat: no-repeat;background-position: 50%;transform: scale(10, 10);opacity: 0;transition: transform .3s, opacity .5s;}
.hover:active:after{transform: scale(0, 0);opacity: .3;transition: 0s;}
.form-btn {width: 100%;height: 2.4rem;line-height: 2.4rem;text-align: center;font-size: 1.0rem;background: #fe7002;border-radius:0.25rem;-webkit-border-radius:0.3rem;position: relative;overflow: hidden;}
.form-btn a{display: block;color: #ffffff;}
.no-data{text-align: center;padding: 0.5rem 0;}

/*过渡动画*/
.fade-enter-active, .fade-leave-active {
  transition: all .3s ease;
  -webkit-transition: all .3s ease;
}
.fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to{
	transform: translateY(0.5rem);	
  	opacity: 0;
}
.fadeIn-enter-active{
  transition: all .3s ease;
  -webkit-transition: all .3s ease;
}
.fadeIn-leave-active {
  transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeIn-enter, .fadeIn-leave-to{
  transform: translateY(0.5rem);  
    opacity: 0;
}
/*时间出来等*/
.fadeUp-enter-active{
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
}
.fadeUp-leave-active{
  transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeUp-enter, .fadeUp-leave-to{
	transform: translateY(-0.5rem);	
  	opacity: 0;
}

</style>
