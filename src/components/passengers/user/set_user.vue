<template> 
<div class="userset">
	<div class="user-data" v-show="showIndex==0">
		<a class="user-item"href="javascript:;" @click="showIndex=1">
			<p class="u-left">昵称</p>
			<div class="u-right">
				<span>{{user.name}}</span>
				<i class="icon iconfont icon-jiantou3"></i>
			</div>
		</a>
		<a class="user-item"href="javascript:;" @click="showIndex=2">
			<p class="u-left">电话号码</p>
			<div class="u-right">
				<span v-if="user.phone">{{(''+user.phone).substring(0,3)}}****{{(''+user.phone).substring(7)}}</span>
				<i class="icon iconfont icon-jiantou3"></i>
			</div>
		</a>
	</div>

	<div class="username-set bc" v-show="showIndex==1">
		<p class="s-title">设置昵称</p>
		<div class="form-groud">
			<input type="text" name="names" v-model="name">
		</div>
		<div class="form-btn hover" @click="sendName">
			<a href="javascript:;">保存</a>
		</div>
	</div>

	<div class="username-set bc" v-show="showIndex==2">
		<p class="s-title">修改绑定手机号码</p>
		<div class="form-groud">
			<input type="number" name="name" v-model="phone">
		</div>
		<div class="form-yan clearfix">
			<input type="number" name="" v-on:input="onInpFun" v-model="vcode" placeholder="输入验证码">
			<a class="vcode" @click="getVode" href="javascript:;">{{dxtext}}</a>
		</div>
		<div class="form-btn hover" @click="submitCode">
			<a href="javascript:;">提交</a>
		</div>
	</div>		
	<a v-show="showIndex!=0" @click="goback" class="back-btn" href="javascript:;"><i class="icon iconfont icon-jiantou3"></i></a>
</div>
</template>
<script> 
/*
if(typeof Mock!='undefined'){	
	Mock.mock('/user',{
		"name":"邹小一",
		"phone":"15016447087"
	})

	Mock.mock('/setname',{
		"status":1
	})

	Mock.mock('/vcode',{
		"status":1
	})

	Mock.mock('/setting',{
		"status":1
	})
}
*/
	export default{
		name:"userset"
		,data(){
			return{
				alterStatus:false,
				alterTitle:'',
				user:{},
				name:'',
				phone:'',
				oldName:'',
				oldphone:'',
				showIndex:0,
				vcode:'',
				dxtext:'获取验证码',
				disabled:false
			}
		}
		,methods:{
			goback(){
				this.showIndex=0;
				this.getUserData();
			}
			,onInpFun(){
		  		let vc = this.vcode+'';
		  		if(vc.length>6){
		  			this.vcode=this.vcode.slice(0,6)
		  		}
		  	}
			,async getUserData(){
				this.$store.getUserinfo((data)=>{				
					this.user=data;
					this.name=this.user.name;
					this.oldName=this.user.name;
					this.phone=this.user.phone;
					this.oldphone=this.user.phone;
				});
			}
			,async sendName(){
				if(this.name.trim()==''){
					this.$parent.msgAlter("不能为空");
					return;
				}
				if(this.name == this.oldName){
					this.$parent.msgAlter("新名字不能跟旧名字一样");
					return;
				}

				const dat = await this.$ajaxPost('/setname',{"name":this.name})
				if(dat){
					this.$store.setUserinfo('name', this.name);
					this.getUserData();
					this.showIndex=0;
				}
			}
			,async getVode () {
		 		let phone = this.phone;
			    let reg = /^1\d{10}$/;  
			    if(phone == this.oldphone){
			    	this.$parent.msgAlter("新旧号码不能一样");
			    	return;
			    }
			    if(this.disabled) return;                                  		 	//验证数字
			    if (reg.test(phone)) {
			        this.disabled=true;
			      	const dat = await this.$ajaxPost('/vcode',{phone:phone,voiceFlag:false});
			      	if(dat){
			      		this.$toastAlter(dat.error,2000);
			      		let time = 59;                         						//设置的时间
                        let t = setInterval(() => {
                            this.dxtext="已发送" + '(' + time + ')';
                            --time;
                            if (time == 0) {
                                clearInterval(t);
                                 this.dxtext='重新获取';
                                 this.disabled=false;
                            }
                        }, 1000);
			      	}else{
			      		this.disabled=false;
			      	}
			      } else {
			      	this.msgAlter("请输入正确的手机号！");
			    }       
		  	}
		  	,async submitCode(){
		  		let code = this.vcode+'';
		  		let phone = this.phone;
		  		let tha = this;
		  		let reg = /^1\d{10}$/;
		  		if(!reg.test(phone)) {
		  			this.$parent.msgAlter("请输入正确的手机号获取验证码！");
			        return ;
		  		}
			    if (code.trim() == "") {
			        this.$parent.msgAlter("请输入验证码！");
			        return ;
			    }
			    let formData={
			    	phone : phone,
			        code :  code,
			        type : 'setting'
			    }
			    const dat = await this.$ajaxPost('/setting',formData);
			    if(dat){
			    	this.$store.setUserinfo('phone', phone);
			    	this.getUserData();
			    	this.showIndex=0;
			    }
			}
		}
		,created(){
			this.getUserData();
			let tha = this;
			let winHeight = document.documentElement.clientHeight;   //获取当前页面高度
			window.addEventListener("resize",()=>{
				let thisHeight = document.documentElement.clientHeight;
				if(winHeight - thisHeight >50){
					 //当软键盘弹出，在这里面操作
					 tha.$parent.footerAction(false);
				}else{
 					//当软键盘收起，在此处操作
 					tha.$parent.footerAction(true);
				}
			},false)
		}
	}

</script>
<style scoped> 
.userset{width:100%;height:100%;}
.user-data a{display: block;width: 100%;height: 2.7rem;background: #ffffff;border-bottom:0.025rem solid #cfcfcf;line-height: 2.7rem;font-size: 0.9rem;}
.user-data a p{padding-left: 0.75rem;color: #a2a2a2;}
.user-data a div{padding-right: 0.75rem;color: #000;}
.user-data a div i{font-size: 0.9rem;color: #a2a2a2;}
.username-set{padding:3.0rem 1.4rem;width:100%;height:100%;background:#EFEFEF;}
.username-set .s-title{text-align: center;font-size: 1.0rem;}
.username-set .form-groud{width: 100%;padding: 1.5rem 0;}
.username-set .form-groud input{display: block;width: 100%;height: 2.5rem;background: #ffffff;border:none;outline: none;font-size: 0.9rem;line-height: 2.5rem;text-indent: 0.5rem;border-radius: 0.25rem 0.25rem;-webkit-border-radius: 0.25rem 0.25rem;}
.username-set .form-yan{width: 100%;height: 2.5rem;margin-bottom:1.45rem;}
.username-set .form-yan input{float: left;width: 9.0rem;border:none;outline: none;height: 100%;line-height: 2.5rem;background: #ffffff;border-radius:0.25rem 0.25rem;-webkit-border-radius:  0.25rem 0.25rem;font-size: 0.9rem;text-indent: 0.5rem;}
.username-set .form-yan input::-webkit-input-placeholder{color: #d8d8d8;}
.username-set .form-yan input::input-placeholder{color: #d8d8d8;}
.username-set .form-yan .vcode{float: right;width: 6.0rem;height: 100%;background: #ffa600;font-size: 0.9rem;text-align: center;line-height: 2.5rem;color: #ffffff;border-radius:0.2rem 0.2rem;-webkit-border-radius: 0.2rem 0.2rem;}
.back-btn{position:fixed;top:1.0rem;left:0.75rem;transform:rotate(180deg);width:1.0rem;height:1.0rem;}
.back-btn i{font-size:1.0rem;font-weight:900;}
</style>