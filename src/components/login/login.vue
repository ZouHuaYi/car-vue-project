<template>
	<div class="register" v-if="regStatus">
		<div class="wx-header bc"><img :src="wxheader" ref="errimg"></div>
		<div class="form-login bc">
			<div class="form-groud fx">
				<label class="fx-no"><i class="icon iconfont icon-shouji"></i></label>
				<input class="fx-one" type="number" name="phone" autofocus="autofocus" placeholder="输入手机号码" v-model="phone">
			</div>
			<div class="form-groud clearfix">
				<label class="fl"><i class="icon iconfont icon-yanzhengma"></i></label>
				<input class="fc" type="number"  v-on:input="onInpFun" placeholder="输入验证码" v-model="vcode">
				<button class="vcode fr" :class="{'disabled' : disabled}" href="javascript:;" @click="getVode" >{{dxtext}}</button>
			</div>
			<div class="form-btn">
				<a class="hover" :class="{'disabled' : disabled}" href="javascript:;" @click="submitCode">注册</a>
			</div>
		</div>
		<div class="footers">版权所有&copy;广州鹰卡汽车服务有限公司</div>
	</div>
</template>
<script>
	import imgs from '@/assets/timg.jpg';
	/*
	if(typeof Mock!='undefined'){
		//发送验证码
		Mock.mock('/vcode',
			{
				"status":0,
				"error"  :"对不起这个号码无法接收信息"
			}
		)*/
		//登录验证
		/*Mock.mock('/login',
			{
				"status":0,
				"error" :"后台正在维护中无法登录...",
				"token" :"1234567890",
				"tokenData":"1517965305",
				"user": "isdriver"	
			}
		)
	}
	*/

	export default {
	  name: 'login'
	  ,data () {
	    return {
	     	wxheader:window.sessionStorage.getItem('img') ? window.sessionStorage.getItem('img') : imgs,
	     	dxtext:'获取验证码',
	     	disabled:false,
	     	phone:'',
	     	vcode:'',
	     	regStatus:true
	    }
	  }
	  ,mounted () {
		this.$refs.errimg.onerror = () => {
			this.$refs.errimg.error = null;			
			this.$refs.errimg.src = imgs;
		}
	  }
	  ,methods:{
	  	onInpFun(){
	  		let vc = this.vcode+'';
	  		if(vc.length>6){
	  			this.vcode=this.vcode.slice(0,6)
	  		}
	  	}
	  	,async getVode () {
	 		let phone = this.phone;
		    let reg = /^1\d{10}$/;  
		    let tha = this;
		    if(this.disabled) return;                                  		 	//验证数字
		    if (reg.test(phone)) {
		        this.disabled=true;
		        const dat = await this.$ajaxPost('/vcode',{phone:phone,voiceFlag : 'false'});
		        if(dat){
		        	this.$toastAlter(dat.error,2000);
		        	let time = 59;                         						//设置的时间
                    let t = setInterval(function() {
                        tha.dxtext="已发送" + '(' + time + ')';
                        --time;
                        if (time == 0) {
                            clearInterval(t);
                             tha.dxtext='重新获取';
                             tha.disabled=false;
                        }
                    }, 1000);
		        }else{
		        	tha.disabled=false;
		        }
		      } else {
		      	 tha.$parent.msgAlter("请输入正确的手机号！");
		      }
		           
	  	},
	  	async submitCode(){
	  		var code = this.vcode+'';
	  		var phone = this.phone;
	  		var reg = /^1\d{10}$/;
	  		if(!reg.test(phone)) {
	  			this.$parent.msgAlter("请输入正确的手机号！");
		        return ;
	  		}
		    if (code.trim() == "") {
		        this.$parent.msgAlter("请输入验证码！");
		        return ;
		    }
		    let formData={
		    	openid :window.sessionStorage.getItem("openid"),
		    	phone : phone,
		        code :  code,
		        type : 'login'
		    }
		    const dat = await this.$ajaxPost('/login',formData);

		    if(dat.token){
		    	//跳转到主要介绍页面
                window.sessionStorage.setItem("token",dat.token); 
                window.sessionStorage.setItem("user",dat.user);
                window.sessionStorage.setItem("tokenDate",dat.tokenData);
                window.sessionStorage.removeItem('openid');
                if(dat.user=="isdriver"){
                	this.$router.push({name:'dri_order'});
                }else{
                	this.$router.push({name:'pass_place'});
                }  
		    }else{
		    	this.phone='';
	            this.vcode='';
		    }
		}
	  }
	  ,created(){
	  	let token = window.sessionStorage.getItem("token");
	  	let user = window.sessionStorage.getItem("user");
	  	if(token){
	  		this.regStatus=!1;
	  		if(user == 1){
	  			this.$router.replace({name:"dri_order"});
	  		}else{
	  			this.$router.replace({name:"pass_place"});
	  		}
	  	}
	  }

	}
</script>
<style type="text/css" scoped>
	.register{width: 100%;height: 100%;background: #fff2d0;padding-top: 3.6rem;box-sizing:border-box;-webkit-box-sizing:border-box;}
	.wx-header{width:4.75rem;height: 4.75rem;border:0.075rem solid #fff;margin:0 auto 2.0rem;border-radius: 50%;;overflow: hidden;}
	.wx-header img{width: 100%;height: 100%;border-radius: 50%;}
	.register .form-login{padding:0rem 1.375rem;}
	.register .form-groud{width: 100%;height:2.5rem;margin-bottom:0.9rem;}
	.register .form-groud label{width:1.85rem;height: 2.5rem;line-height: 2.5rem;text-align: center;background: #ffffff;border-radius: 0.3rem 0 0 0.3rem;-webkit-border-radius: 0.3rem 0 0 0.3rem;}
	.register .form-groud label.fl{float: left;}
	.register .form-groud label i{font-size: 1.125rem;color: #ffa600;}
	.register .form-groud input{width: auto;font-size: 0.9rem;border:none;outline: none;height: 100%;line-height: 2.5rem;background: #ffffff;border-radius:0 0.3rem 0.3rem 0;-webkit-border-radius:0 0.3rem 0.3rem 0;}
	.register .form-groud input.fc{float: left;width: 7.2rem;}
	.register .form-groud input::-webkit-input-placeholder{color: #d8d8d8;}
	.register .form-groud input::input-placeholder{color: #d8d8d8;}
	.register .form-groud .vcode{float: right;width: 6.0rem;height: 100%;background: #ffa600;font-size: 0.9rem;text-align: center;line-height: 2.5rem;color: #ffffff;border-radius: 0.3rem;-webkit-border-radius: 0.3rem;}
	.disabled{opacity: 0.6;cursor: not-allowed;}
	.footers{width: 100%;font-size: 0.75rem;text-align: center;padding-top:8.75rem;color: #b0aea9;}
</style>