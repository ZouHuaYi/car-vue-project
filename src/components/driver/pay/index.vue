<template>
<div class="dri-pass" ref="driPass">
	<div class="driver-box" v-if="passengers.id">
		<div class="pass-header bc clearfix" v-if="passengers.pass.length!=0" v-for="item in passengers.pass">
			<section class="p-img u-left"><img :src="item.picture" @error="setErrorImg"></section>
			<p class="u-left">{{item.name}}</p>
			<a v-if="item.phone" class="phone u-right" :href="'tel:'+item.phone">
				<i class="icon iconfont icon-dianhua3"></i>
			</a>
		</div>
		<div class="dri-pay">
			<transition name="fadePlace">
				<div class="dri-area clearfix" v-if="!commentsStatus">
					<div class="order-area clearfix">
						<div class="oa-left u-left">
							<i class="icon iconfont icon-dingwei"></i><span>起点:</span>
						</div>
						<div class="oa-right u-left">
							<h3>{{passengers.startTitle}}</h3>
							<p>{{passengers.startArea}}</p>
						</div>
					</div>
					<div class="order-area clearfix">
						<div class="oa-left u-left">
							<i class="icon iconfont icon-dingwei act"></i><span>终点:</span>
						</div>
						<div class="oa-right u-left">
							<h3>{{passengers.endTitle}}</h3>
							<p>{{passengers.endArea}}</p>
						</div>
					</div>
				</div>
			</transition>

			<div class="getmonny">费用&nbsp;&nbsp;<span>&yen;<strong>{{passengers.monney}}</strong></span>&nbsp;元</div>
			<div class="pass-order bc" v-if="passengers.status==1">
				<div class="form-btn bc hover">
					<a href="javascript:;" @click="postCome">确认乘客已上车</a>
				</div>
			</div>
			<div class="pass-order bc" v-if="passengers.status==2">
				<div class="form-btn bc hover">
					<a href="javascript:;" @click="postPay">通知乘客支付</a>
				</div>
			</div>
			<div class="del-order bc" v-if="passengers.status==1 && !passengers.cancelTimer">
				<div class="form-btn bc hover">
					<a href="javascript:;" @click="cancelAction(passengers.cancelStatus)">取消</a>
				</div>
				<p class="del-warn">一天之内只能取消{{passengers.clsnum}}次</p>
			</div>
			<div class="pass-haspay bc" v-if="passengers.status==3">
				<p>等待乘客支付</p>
			</div>
			<div class="pass-haspay bc" v-if="passengers.status==4">
				<p>乘客已支付</p>
				<a href="javascript:;" @click="commentsAction">{{comTitle}} <i class="icon iconfont icon-jiantou11"></i></a>
			</div>
			<div class="on-f" v-if="passengers.status==5">该订单乘客已取消</div>
			<div class="reason" v-if="passengers.reason">乘客取消原因: {{passengers.reason}}</div>
		</div>
		<transition name="fadeCom">
			<div class="dri_com" v-if="passengers.comments.length>0 && commentsStatus" v-for="item in passengers.comments">
				<div class="comments bc">
					<div class="com-title">乘客的评价</div>
					<div class="com-star">
						<i v-for="n in 5" class="icon iconfont icon-xingxing" :class="{'act':n<=item.star}" ></i>
					</div>	
					<div class="com-form clearfix">
						<div class="com-f clearfix">
						 <label class="active hover" v-for="i in item.radio">{{i}}<input type="checkbox" ></label>
						</div>
					</div>
				</div>
				<div class="com-txt">{{item.text}}</div>
					
				<div class="com-order bc">
					<div class="form-btn bc hover" @click="$router.push({name:'dri_order'})">
						<a href="javascript:;">返回抢单页</a>
					</div>
				</div>
			</div>
			<div class="com-on" v-if="passengers.comments.length==0 && commentsStatus">乘客还没有评论</div>	
		</transition>				
	</div>

	<div class="order-list-box" style="padding-top:3.5rem;" v-if="!passengers.id && !loadStatus">
	<div class="on-report">
		<i class="icon iconfont icon-tongzhi"></i>					
		<span>该订单不存在</span>
		<div class="del-order bc"><div class="form-btn bc hover" @click="$router.push({name:'dri_order'})">
			<a href="javascript:;" >返回抢单页</a>
		</div></div>
	</div></div>
	
	<v-cancelalter :title="cancelTitle" :sectit="cancelsectit" :showStatus="cancelStatus" :showInput="cancelStatus" @inpFun="reasonData" @hideFun="cancelStatus=!1" @comFun="postCancel" />
</div>
</template>
<script type="text/javascript">
	import images from "@/assets/timg.jpg"
	import vCancelalter from "@/components/common/cancelAlter.vue"
/*
if(typeof Mock!='undefined'){
	Mock.mock('/driverpay',{
		"id|1-2000":2000,
		"status":4,
		"startTitle":"某某学校",
		"startArea":"广州市番禺区海伦堡创业园公寓",
		"endTitle":"某某学校",
		"endArea":"广州市番禺区海伦堡创业园",
		"monney|300-500":500,
		"pass":[{
			"name":"邹小一",
			"phone":"1501644708",
			"picture":images
		}],
		"comments":[{
			"star|1-5":5,
			"text":"客户留言客户留言",
			"radio":["满意","司机服务周到","满意","司机服务周到"]

		}],
		"cancelTimer|0-2":2,
		"cancelStatus":0
	})

	// 0 取消成功
	Mock.mock('/drivercancel',{
		"status":1
	})

	// 确认乘客上车 确认上车 0
	Mock.mock('/passcome',{
		"status":0
	})

	// 通知乘客支付 0提交成功
	Mock.mock('/passpay',{
		"status":0
	})
}
*/
	export default{
		components:{
			vCancelalter
		}
		,data(){
			return{
				cancelTitle:"",
				cancelsectit:"",
				cancelStatus:false,
				passengers:{},
				commentsStatus:false,
				runtime:null,
				orderStatus:null,
				loadStatus:true,
				comTitle:'展开评论',
				resonCancel:''
			}
		}
		,methods:{
			reasonData(val){
				this.resonCancel=val;
			}
			,setErrorImg(e){
				e.target.onerror = null;
				e.target.src = images
			}
			,async getPassData(){
				let orderId=this.$store.state.orderId;
				if(!orderId){
					this.$router.replace({name:"dri_order"});
					return;
				}
				let odat={"orderId":orderId};
				//this.$parent.loadingAction(true);
				this.loadStatus=true;
				const dat = await this.$ajaxPost('/driverpay',odat);
				this.loadStatus=false;
				//this.$parent.loadingAction(false);
				if(dat){
					this.orderStatus=dat.status;
					this.passengers=dat;
					this.cycleAtion();
				}
			}
			//接口轮询
			,async cycleAtion(){
				clearTimeout(this.runtime);
				const orderId = this.$store.state.orderId;	
				let order={"orderId": orderId};
				const dat = await this.$ajaxPost('/cycle',order);
				if(dat){
					if(this.orderStatus>3) return;			  //支付完成不用再请求
					if(dat.status != this.orderStatus) {
						this.getPassData();                               //状态不同重新渲染
					} else {
						this.runtime = setTimeout(()=>{
							this.cycleAtion();                          //不停的请求 1s 一次 递归
						},3000)
					}
				} 
			}

			,async postCome(){
				this.$parent.msgSend('正在提交');                                	
				let odat={"orderId":this.$store.state.orderId,"come":!0};
				const dat = await this.$ajaxPost('/passcome',odat);
				if(dat.status==0){
					await this.$parent.endSend('成功提交',0.5);
					this.getPassData();
				}else{
					await this.$parent.endSend('提交失败',0.5);
				}
			}
			,async postPay(){
				this.$parent.msgSend('正在提交');
				let odat={"orderId":this.$store.state.orderId,"pay":!0};
				const dat = await this.$ajaxPost('/passpay',odat);
				if(dat.status==0){
					await this.$parent.endSend('成功提交',0.5);
					this.getPassData();
				}else{
					await this.$parent.endSend('提交失败',0.5);
				}
			}
			,async postCancel(){
				if(this.resonCancel==''){
					this.$toastAlter('请输入取消理由',2000);
					return;
				}
				this.cancelStatus=!1;
				this.$parent.msgSend('正在取消');
				let odat={
					"orderId": this.$store.state.orderId,
					"dreason" :this.resonCancel
				};
				const dat = await this.$ajaxPost('/drivercancel',odat);
				if(dat){
					await this.$parent.endSend('成功取消',0);
					this.$router.replace({name:'dri_order'});
				}else{
					this.getPassData();
					await this.$parent.endSend('取消失败',0);
				}
			}
			,commentsAction(){
				this.commentsStatus=!this.commentsStatus;
				this.comTitle = this.commentsStatus ? '收起评论':'展开评论';
				if(this.passengers.comments.length==0){
					this.getPassData();
				}
				//window.scrollTo(0,0);
			}
			,cancelAction(val){
				if(val==0) {
					this.cancelAlter('你确定取消此次订单吗？','您今天还可以取消'+(this.passengers.clsnum-this.passengers.myclsnum)+'次');
				}else{
					this.$parent.msgAlter('对不起此次订单不能取消。');
				}
			}
			//取消的显示
			,cancelAlter(val1,val2){
				this.cancelTitle=val1;
				if(val2){
					this.cancelsectit=val2;
				}
				this.cancelStatus=!0;
			}
		}
		,created(){
			let oId = this.$parent.getParam('orderid');
			if(oId){
				this.$store.orderIdAction(oId);
			}
			this.getPassData();
		}
		,beforeDestroy(){
			clearTimeout(this.runtime);
			this.cycleAtion=function(){};
		}
	}
</script>
<style type="text/css" scoped>
	.on-report{text-align: center;padding-top: 1.25rem;}
	.on-report i{font-size: 2.8rem;color: #ffa600;}
	.on-report span{display: block;font-size: 1.0rem;color: #8b8b8b;padding-top: 1.2rem;}

	.dri-pass{width: 100%;/*height: 100%;*/padding-bottom: 3.75rem;}
	.pass-header{width: 100%;height: 4.05rem;border-bottom: 1px solid #cccccc;position: fixed;top: 0;left: 0;padding: 0.5rem 0.5rem 0;background: #ffffff;z-index: 1000;}
	.p-img{width: 2.9rem;height: 2.9rem;border-radius: 50%;-webkit-border-radius:50%;overflow: hidden;}
	.p-img img{width: 100%;height: 100%;}
	.pass-header p{font-size: 0.9rem;height: 3.05rem;line-height: 3.05rem;padding-left:0.7rem;}
	.pass-header .phone{width: 2.9rem;height: 2.9rem;border-radius: 50%;-webkit-border-radius:50%;}
	.pass-header .phone i{font-size: 2.9rem;color: #ffa600}
	.dri-pay{width: 100%;padding-top:4.5rem;}

	.dri-area{width: 100%;padding-bottom: 1.625rem;border-bottom: 0.025rem solid #cccccc;}
	.order-area{width: 100%;height: 2.5rem;font-size: 0.85rem;margin-top:1.625rem;}
	.oa-left{height:100%;line-height: 2.5rem;margin-right: 0.7rem;margin-left: 2.125rem;}
	.oa-left i{font-size: 0.9rem;color: #2fb700;margin-right: 0.5rem}
	.oa-left i.act{color: #fe0202;}
	.oa-right{width: 8.25rem;}
	.oa-right h3{width: 100%;font-size: 1.0rem;height:1.2rem;line-height: 1.2rem;color: #545454;font-weight: normal;padding-bottom: 0.55rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
	.oa-right p{width: 100%;height: 0.9rem;font-size: 0.7rem;line-height: 0.9rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
	.getmonny{padding-top: 2.5rem;width: 100%;text-align: center;font-size: 0.9rem}
	.getmonny span{font-size: 0.65rem;}
	.getmonny span strong{font-size: 1.75rem;font-weight: normal;}
	.pass-order{padding: 0 2.0rem;margin-top:2.0rem;}
	.del-order{padding: 0 2.0rem;margin-top: 0.75rem;}
	.del-order .form-btn{background: none;border:1px solid #fe7002;}
	.del-order .form-btn a{color: #fe7002;}
	.del-warn{text-align: center;padding-top: 0.825rem;color: #9c9b9b;}
	.pass-haspay{padding: 0 2.0rem;margin-top:2.0rem;text-align: center;}
	.pass-haspay p{font-size: 1.0rem;color: #fe9e6c;padding-bottom:0.75rem;}
	.pass-haspay a{display: block;font-size:0.7rem;}
	.pass-haspay a i{font-size: 0.6rem;color: #9c9b9b}
	.dri_com{padding-bottom: 3rem}
	.comments{padding: 1.125rem 0.85rem 0;}
	.comments .com-title{text-align: center;height: 0.8rem;line-height: 0.8rem;font-size: 0.8rem;position: relative;}
	.comments .com-title:before{position: absolute;content: " ";width: 4.0rem;border-bottom:0.025rem solid #ABAAAA;left: 0;top:0.425rem;}
	.comments .com-title:after{position: absolute;content: " ";width: 4.0rem;border-bottom:0.025rem solid #ABAAAA;right: 0;top:0.425rem;}
	.comments .com-star{text-align: center;height: 4.0rem;line-height: 4.0rem;}
	.comments .com-star i{font-size: 1.625rem;letter-spacing: 1.125rem;color: #D1D1D1;}
	.comments .com-star i.act{color: #ffa600;}
	.com-f{text-align: center;}
	.com-form label input[type="checkbox"]{display: none;}
	.com-form label{display:inline-block;vertical-align: top;margin: 0 0.125rem 0.5rem;height: 1.8rem;border: 0.025rem solid #a0a0a0;color: #a0a0a0;border-radius: 0.25rem 0.25rem;-webkit-border-radius:0.25rem 0.25rem;text-align: center;line-height: 1.8rem;font-size:0.8rem;padding: 0 0.25rem;text-align: center;-webkit-box-sizing: border-box;box-sizing: border-box;}
	.com-form label.active{color: #ffa600;border-color: #ffa600}
	.com-text{width: 100%;height: 2.5rem;line-height: 2.5rem;border:none;background: #efefef;outline: none;font-size: 0.8rem;border-radius: 0.25rem 0.25rem;-webkit-border-radius:0.25rem 0.25rem;text-indent: 0.5rem;}
	.com-txt{padding: 0.5rem 0.5rem 1.0rem;text-align: center;font-size: 0.9rem;color: #A2A2A0;}
	.com-order{padding: 0.8rem 1.85rem 0.25rem;margin-bottom:0.75rem;}
	.on-f{text-align: center;font-size: 0.9rem;padding-top: 1rem;color: #C1C1C1}
	.com-on{text-align: center;font-size: 0.9rem;padding-top: 1rem;color: #C1C1C1}
	.reason{text-align: center;background: #efefef;padding: 0.5rem 0;margin-top: 0.5rem;font-size: 0.65rem;color: #999999;}
/*时间出来等*/
.fadePlace-enter-active{
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
}
.fadePlace-leave-active{
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadePlace-enter, .fadePlace-leave-to{
	transform: translateY(-0.5rem);	
  	opacity: 0;
}
.fadeCom-enter-active{
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
}
.fadeCom-leave-active{
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeCom-enter, .fadeCom-leave-to{
	transform: translateY(-0.5rem);	
  	opacity: 0;
}
</style>