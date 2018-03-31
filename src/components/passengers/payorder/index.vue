<template> 
<div class="myorder">
	<v-header></v-header>
	<div class="order-list-box" v-if="orderData.id">
		<div class="no-finish" v-if="orderData.status!=4"> 
			<div class="order-area clearfix">
				<div class="or-left">
					<p class="os"><i class="icon iconfont icon-dingwei"></i>&nbsp;起点&nbsp;:&nbsp;<span>{{orderData.start}}</span></p>
					<p class="oe"><i class="icon iconfont icon-dingwei"></i>&nbsp;终点&nbsp;:&nbsp;<span>{{orderData.end}}</span></p>
				</div>
				<div class="or-right">
					<p>费用(元)</p>
					<p class="yen">&yen;<span>{{orderData.monney}}</span></p>
				</div>
			</div>
			<div class="order-report bc">
				<!-- 通知 -->
				<div class="on-report" v-if="orderData.status<=1 || orderData.status==5 ">
					<i class="icon iconfont icon-tongzhi"></i>
					<span v-if="orderData.status==0 && !cancelOrder">正在努力通知司机</span>
					<span v-if="orderData.status==1 && !cancelOrder">司机成功接单</span>
					<span v-if="cancelOrder">该订单已自动取消</span>
					<span v-if="orderData.status==5 && !cancelOrder">该订单已取消</span>
				</div>
				<!-- 司机信息 -->
				<div class="order-driver clearfix" v-if="orderData.driver.length!=0 && orderData.status>0 && !cancelOrder" v-for="item in orderData.driver">
					<div class="dri-left"> 
						<div class="dri-img"><img :src="item.picture" @error="setErrorImg"></div>
						<div class="dri-cat">
							<p><span>{{item.plate}}</span> <span>{{item.name}}</span></p>
							<p><i v-for="n in Number(item.star)" class="icon iconfont icon-xingxing"></i></p>
							<p><span>{{item.color}}</span><span>{{item.cat}}</span></p>
						</div>
					</div>
					<div class="dri-right" v-if="orderData.status<=4"> 
						<a :href="'tel:'+item.phone"><i class="icon iconfont icon-ai206"></i></a>
					</div>
				</div>
				<!-- 倒计时 -->
				<transition name="fadeUp">
					<div>
						<div class="time-report" v-show="timers" v-if="orderData.status<2 && !cancelOrder">
							<span>{{timeData}}</span>
							<p v-if="orderData.status==0">等待司机接单</p>
						</div>
						<div class="reason" v-if="orderData.dreason">司机取消原因: {{orderData.dreason}}</div>
					</div>
				</transition>	
			</div>
			<!-- 取消按钮 -->
			<div class="del-order bc" v-if="orderData.status<2 && !cancelOrder">
				<p v-if="orderData.status==0">若{{orderData.longtime}}分钟后没有司机接单，系统将自动取消</p>
				<p v-if="orderData.status==1">司机接单{{orderData.shorttime}}分钟后，您若取消订单将扣除{{orderData.glodnum}}个金豆</p>
				<div class="form-btn bc hover" @click="cancelAtion">
					<a href="javascript:;">取消</a>
				</div>
			</div>
			<!-- 取消订单后 -->
			<div class="del-order bc" v-if="cancelOrder || orderData.status==5">
				<div class="form-btn bc hover" @click="$router.replace({name:'pass_place'})">
					<a href="javascript:;" >返回下单</a>
				</div>
			</div>
			<!-- 支付确认 和 到达目的地-->
			<div class="dao-order bc" v-if="orderData.status == 2 || orderData.status == 3">
				<div class="form-btn bc hover" v-if="!orderData.isover">
					<a href="javascript:;" @click="finishPay">我已到达目的地</a>
				</div>
				<div class="form-btn bc hover" v-if="orderData.isover">
					<a href="javascript:;" @click="payStatus=!0">支付该订单</a>
				</div>
			</div>
		</div>
		<transition name="fade">
			<v-finish v-if="orderData.status == 4"  :orderList="orderData"  :comDate="orderData.comments" />	
		</transition>
	</div>
	<div class="order-list-box" style="padding-top:3.5rem;" v-if="!orderData.id && !loadStatus">
	<div class="on-report">
		<i class="icon iconfont icon-tongzhi"></i>					
		<span>该订单不存在</span>
		<div class="del-order bc"><div class="form-btn bc hover" @click="$router.replace({name:'pass_place'})">
			<a href="javascript:;" >返回下单</a>
		</div></div>
	</div></div>

	<div class="load-img" v-else-if="loadStatus" ><img src="../../../assets/loading-2.gif" >正在加载...</div>	
	<!-- 弹窗的组件 -->
	<v-pay @hideFun="payStatus=false" :showStatus="payStatus" :monney="orderData.monney" />
	<v-cancelalter :title="cancelTitle" :sectit="cancelsectit" :showStatus="cancelStatus" :showInput="cancelStatus" @inpFun="reasonData" @hideFun="cancelStatus=!1" @comFun="postCancel"  />
</div>
</template>
<script> 
	import images from '@/assets/timg.jpg';
	import vPay from './pay.vue';
	import vHeader from '../header.vue'
	import vCancelalter from '@/components/common/cancelAlter.vue'
	import vFinish from './finish.vue'		
	
/*
status : 订单状态
	0  下单 倒计时 15       等待  	
	1  司机接单 倒计时 10   等待
	2  司机来到 上车        未完成
	3  到达目的地           未支付
	4  支付完成
	5  无效           
cancelStatus : 直接写文字也行 或者 就是数字状态 只有 0-2 三种状态码
*/
/*
if(typeof Mock!='undefined'){	
	//获取订单
	Mock.mock('/order',{
		"id|1000-2000":2000,
		"status": 4,
		"time": Math.round(new Date()/1000)+(20),
		"start":"大罗村",
		"end":  "小罗村",
		"monney|100-300":300,
		"driver":[{
			"id|1000-2000":2000,
			"picture" : images,
			"name" : "老师傅",
			"phone" : "15016447087",
			"plate": "粵B12345",
			"color": "白色",
			"cat":"丰田",
			"star|1-5":5
		}],
		"comments":[{
			"star":1,
			"text":"司机开车很稳定",
			"radio":["满意","司机服务周到"]
		}]
		"glodnum":3,
		"longtime":15,
		"shorttime":10
	})

	//判断状态的api  0-4
	Mock.mock('/cycle',{
		"status":4
	})

	//取消订单
	Mock.mock('/cancel',{
		"status": 1,
		"error":  "无法取消"
	})	
}
*/	
	export default{
		name:'wait',
		components:{
			vPay,
			vHeader,
			vCancelalter,
			vFinish
		}
		,data(){
			return{
				payStatus:false,
				cancelTitle:"",
				cancelsectit:"",
				cancelStatus:false,
				orderData:{},						                     // 数据部分		
				timers:null,						                     // 时间		
				timeData:"00:00:00",
				timeStatus:true,
				cancelOrder:false,
				runtime:null,
				loadStatus:true,
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
			,async orderHtml(){
				const orderId = this.$store.state.orderId;
				if(!orderId){
					this.$router.replace({name:"pass_place"});    
					return;
				}
				if(this.timers){
					clearInterval(this.timers);
					this.timers = null;
				}
				let order={"orderId":orderId};
				this.loadStatus=true;
				const dat = await this.$ajaxPost('/order',order);       	    //等待获取数据
				this.loadStatus=false;
				if(dat){
					this.orderData=dat;
					this.orderStatus=dat.status;
					this.waitTime(dat.time);
					this.cycleAtion();
				}
			}
			// 检测订单的状态 
			,async cycleAtion(){
				if(this.runtime)clearTimeout(this.runtime);
				const orderId = this.$store.state.orderId;	
				let order={"orderId": orderId};
				const dat = await this.$ajaxPost('/cycle',order);
				if(dat){
					if(this.orderStatus>2) return;			                //支付完成不用再请求
					if(dat.status != this.orderStatus) {
						this.orderHtml();                               //状态不同重新渲染
					} else {
						this.runtime = setTimeout(()=>{
							this.cycleAtion();                          //不停的请求 1s 一次 递归
						},3000)
					}
				} 
			}
			//取消的动作
			,cancelAtion(){
				if(this.orderData.status==0){
					this.$parent.msgAlter('暂无法取消此订单！');
					return;
				}
				if(this.timeStatus){
					this.cancelAlter('你确定要取消此订单吗！');
				}else{
					let txtl = '你确定要取消此订单吗?';
					let txtr = '将扣除'+this.orderData.glodnum+'个金豆'
					this.cancelAlter(txtl,txtr);
				}
			}
			,async postCancel(){
				if(this.resonCancel==''){
					this.$toastAlter('请输入取消理由',2000);
					return;
				}
				this.cancelStatus=!1;
				const orderId = this.$store.state.orderId;	
				this.$parent.msgSend('正在取消');
				let order={
					"orderId": orderId,
					"reason" : this.resonCancel
				};
				const dat = await this.$ajaxPost('/cancel',order);
				if(dat){
					await this.$parent.endSend("成功取消",0.5);
				} else {
					await this.$parent.endSend("无法取消",0);
				}
				this.orderHtml();
			}
			,async autoCancel(){
				this.cancelStatus=!1
				const orderId = this.$store.state.orderId;	
				let order={"orderId": orderId};
				await this.$ajaxPost('/cancel',order);
				this.orderHtml();
			}
			// 等待的倒计时
			,async waitTime(timers){
				if(!timers)return;

				var tha=this, da = timers;//获得剩余的秒数				 

				var f = Math.floor(da/60) < 10? '0'+Math.floor(da/60):Math.floor(da/60);
				var s = da%60 < 10 ? '0'+da%60:da%60;
				tha.timeData = '00'+':'+f+':'+s;
				tha.timers = setInterval(()=>{
					da--;
					if(da<=0){
						clearInterval(tha.timers);
						tha.timers = null;
						// 自动取消的时候
						if(tha.orderData.status==0){
							tha.cancelOrder = !0;
							tha.autoCancel();
						} else {
							tha.timeStatus = false;
						}
					}else{
						if(!tha.timeStatus){
							tha.timeStatus = true;
						}
					}
					f = Math.floor(da/60) < 10? '0'+Math.floor(da/60):Math.floor(da/60);
					s = da%60 < 10 ? '0'+da%60:da%60;
					tha.timeData = '00'+':'+f+':'+s;
				},1000)
			}
			//到达目的地
			,async finishPay(){
				this.payStatus=!0;
				const orderId = this.$store.state.orderId;	
				let order={"orderId": orderId};
				const dat_1 = await this.$ajaxPost('/orderok',order);
				if(!dat_1) return;
				const dat = await this.$ajaxPost('/order',order);
				if(dat){
					this.orderData=dat;
					this.orderStatus=dat.status;
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
		,beforeCreate(){
			let oId = this.$parent.getParam('orderid');
			if(oId){
				this.$store.orderIdAction(oId);
			}
		}
		,created(){			
			document.addEventListener("error", function(e){
				console.dir(e)
			});			
			this.orderHtml();
		}
		,beforeDestroy(){
			this.payStatus=false;
			this.cancelStatus=false;
			clearTimeout(this.runtime);
			clearTimeout(this.timers);	
			this.timers = null;		
			this.waitTime=function(){};
			this.cycleAtion=function(){};
		}
	}
</script>
<style scoped> 
	.order-area{padding: 3.75rem 0.68rem 1.15rem;width: 100%;box-sizing:border-box;-webkit-box-sizing:border-box;position: relative;overflow: hidden;}
	.order-area:after{position: absolute;content: " ";width: 17.55rem;border-top: 0.025rem solid #cfcfcf;bottom: 0;left: 0.6rem;}
	.order-area .or-left{float: left;width: 11.0rem;padding-right: 0.5rem;}
	.order-area .or-left p{width: 100%;height: 1.15rem;font-size: 0.8rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;line-height: 1.15rem;}
	.order-area .or-left p i{font-size: 1.15rem;vertical-align: middle;}
	.order-area .or-left p.os i{color: #2fb700;}
	.order-area .or-left p.oe i{color: #fe0202;}
	.order-area .or-left p.oe{padding-top: 0.8rem;}
	.order-area .or-right{float: right;font-size: 0.95rem;text-align: right;line-height: 1.25rem;}
	.order-area .or-right p.yen span{font-size: 1.65rem;}
	.order-area .or-right p.yen{padding-top: 0.45rem;color: #6d6d6d;}
	.order-report{padding:0 0.6rem;}
	.on-report{text-align: center;padding-top: 1.25rem;}
	.on-report i{font-size: 2.8rem;color: #ffa600;}
	.on-report span{display: block;font-size: 1.0rem;color: #8b8b8b;padding-top: 1.2rem;}
	.time-report{text-align: center;padding-top: 1.0rem;}
	.time-report span{font-size: 1.55rem;color: #6d6d6d;}
	.time-report p{font-size: 0.9rem;padding-top: 0.25rem;color: #9c9b9b;}
	.del-order{width: 100%;padding: 1.25rem 2.375rem 0.75rem;text-align: center;}
	.del-order p{font-size: 0.5rem;line-height: 0.85rem;color: #8b8b8b;padding-bottom: 0.75rem;}
	.del-order .form-btn{background: none;border:0.05rem solid #fe7002;}
	.del-order .form-btn a{color: #fe7002;}
	.order-driver{padding: 2.55rem 0.25rem 0;}
	.dri-left{position: relative;height: 4.0rem;float: left;width: 12.25rem;}
	.dri-img{width: 4.0rem;height: 4.0rem;border-radius: 50%;float: left;overflow:hidden;}
	.dri-img img{width:100%;height:100%;}
	.dri-cat{width: 7.75rem;float: left;margin-left:0.5rem;}
	.dri-cat p{font-size: 0.7rem;height: 0.7rem;padding: 0.3rem 0;line-height: 0.7rem;}
	.dri-cat p i{font-size: 0.7rem;color: #ffa600;}
	.dri-right{width: 2.7rem;height: 100%;float: left;text-align: right;line-height: 4.0rem;position: relative;}
	.dri-right:after{position: absolute;content: " ";height: 100%;left: 0;top: 0;border-left: 0.025rem solid #a0a0a0;}
	.dri-right a{display: inline-block;}
	.dri-right a i{font-size: 1.9rem;}
	.dri-time{font-size: 1.5rem;text-align: center;padding-top: 1.0rem;color: #6d6d6d;}
	.dao-order{padding: 5.0rem 1.85rem 0;}
	.load-img{text-align: center;font-size: 0.75rem;padding:3.5rem 0 1.625rem;}
	.load-img img{width: 1rem;vertical-align: middle;padding-right: 0.25rem;}
	.reason{text-align: center;background: #efefef;padding: 0.5rem 0;margin-top: 0.5rem;font-size: 0.65rem;color: #999999;}
</style>
</style>