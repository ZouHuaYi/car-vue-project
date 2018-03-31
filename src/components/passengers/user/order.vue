<template> 
<div class="play-list">
		<nav class="play-nav">
			<ul>
				<li :class="{'active':n+1==$route.query.p}" @click="goTab(n)" v-for="(item,n) in navlist">{{item.title}}</li>
			</ul>
		</nav>
		<div class="on-f" v-if="notdata">没有相关订单</div>
		<div class="scroll-list" v-if="$route.query.p==1">
			<!-- 等待 -->
			<div class="order-play">
				<div class="opl-item bc" v-for="(item,index) in downdata_1" @click="goToWait(item.orderId)" >
					<div class="opl-title">
						<p>订单号：{{item.ordersn}}</p>
						<span style="color:#ff0000;border-color:#ff0000;">等待</span>
					</div>
					<div class="opt-box clearfix">
						<div class="p-l u-left">
							<p><i class="icon iconfont icon-shijian"></i><span>{{$formatDate('yyyy-M-dd HH:mm',item.time)}}</span></p>
							<p><i class="icon iconfont icon-dingwei"></i><span>起点：{{item.start}}</span></p>
							<p><i class="icon iconfont icon-dingwei"></i><span>终点：{{item.end}}</span></p>
						</div>
						<span class="p-r u-right">&yen;{{item.monney}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="scroll-list" v-if="$route.query.p==2">	
			<!-- 未支付 -->
			<div class="order-play">
				<div class="opl-item bc" v-for="(item,index) in downdata_2" @click="goToWait(item.orderId)" >
					<div class="opl-title">
						<p>订单号：{{item.ordersn}}</p>
						<span style="color:#ffa600;border-color:#ffa600;">未支付</span>
					</div>
					<div class="opt-box clearfix">
						<div class="p-l u-left">
							<p><i class="icon iconfont icon-shijian"></i><span>{{$formatDate('yyyy-M-dd HH:mm',item.time)}}</span></p>
							<p><i class="icon iconfont icon-dingwei"></i><span>起点：{{item.start}}</span></p>
							<p><i class="icon iconfont icon-dingwei"></i><span>终点：{{item.end}}</span></p>
						</div>
						<span class="p-r u-right">&yen;{{item.monney}}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 中间的滚动部分 -->
		<v-No v-if="$route.query.p == 3" />
		<v-finish v-if="$route.query.p == 4" />
	</div>
</template>
<script> 

import vBscroll from "@/components/common/bscroll.vue";
import vNo from "./order_no.vue";
import vFinish from "./order_finish.vue";
/*	
//post 回来 的是 type：1,2,3,4
if(typeof Mock!='undefined'){
	Mock.mock('/orderlist',{
		"list|5":[{		    
			"orderId|100-900":900,
			"time":1518243720,
			"start":"某某学校",
			"end":"某某小学",
			"monney|50-300":300,
			"ordersn":"353535345345"
		}]	
	})
}
*/

	export default{
		name:"order"
		,components:{
			vNo,
			vBscroll,
			vFinish
		}
		,data(){
			return{
				navlist:[
					{title:'等待',color:'#ff0000'},
					{title:'未支付',color:'#ffa600'},
					{title:'无效',color:'#d8d8d8'},
					{title:'完成',color:'#23b003'}
				]
				,waitdata:[]
				,paydata:[]
				,nofinish:[]
				,downdata_1:[]
				,downdata_2:[]
				,notdata:false
			}
		}
		,methods:{
			goTab(num){
				this.$router.replace({query:{'p':num+1}});
				this.getOrderDate();
			}
			,goToWait(orderId){
				this.$store.orderIdAction(orderId);
				this.$router.push({name:"pass_pay"});
			}
			,async getOrderDate(){
				let p = this.$route.query.p;
				if(p==1 || p==2){
					this.downdata_1 = this.downdata_2 = [];
					this.notdata = false; this.$parent.loadingAction(true);
					const dat_re = await this.$ajaxPost('/orderlist',{type:p});
					this.$parent.loadingAction(false);
					if(dat_re){
						if(dat_re.list){						
							if(p == 1){
								this.downdata_1=dat_re.list;
							}else{
								this.downdata_2=dat_re.list;
							}
						}else{
							this.notdata = true;
						}					
					}
				}
			}
		}
		,created(){
			this.getOrderDate();
		}
	}
</script>
<style> 
.play-list{width: 100%;height: 100%;}
.play-nav{width: 100%;position: fixed;top: 0px;left: 0px;height: 2.25rem;border-bottom: 0.025rem solid #d4d3d2;line-height: 2.25rem;z-index:10000;background:#ffffff;}
.play-nav ul li{float: left;width: 3.5rem;height: 2.175rem;border-left: 0.025rem solid  #d4d3d2;margin-left:-0.025rem;text-align: center;font-size: 0.85rem;border-bottom: 3px solid transparent;position: relative;}
.play-nav ul li.active:after{position: absolute;content: " ";width: 100%;left: 0;bottom: -0.1rem;color: #fe7002;border-bottom: 0.1rem solid #fe7002;}
.order-play{width: 100%;padding-top: 2.25rem;padding-bottom:4rem;}
.opl-item{padding: 0 0.75rem 0.875rem;border-bottom: 0.025rem solid #d4d3d2;}
.opl-title{width: 100%;height: 2.5rem;border-bottom: 0.025rem solid #efefef;}
.opl-title p{float: left;line-height: 2.5rem;font-size: 0.7rem;color: #b9b8b8}
.opl-title span{float: right;width: 2.45rem;height: 1.0rem;border:0.025rem solid #ffa600;text-align: center;line-height: 1.0rem;font-size: 0.55rem;color: #ffa600;margin-top: 0.65rem;}
.opt-box .p-l p{font-size: 0.65rem;line-height: 0.65rem;padding-top: 0.65rem;}
.opt-box .p-l p span{display: inline-block;padding-left: 0.625rem;}
.opt-box .p-l p i{font-size: 0.65rem;color: #d3d1d1;}
.opt-box .p-r{color: #bbbaba;font-size: 0.7rem;line-height: 0.7rem;margin-top: 1.95rem;}
.on-f{text-align: center;font-size: 0.8rem;padding-top:3rem;color: #C1C1C1}
</style>