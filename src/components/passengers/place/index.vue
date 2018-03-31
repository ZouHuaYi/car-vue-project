<template> 
	<div class="place" id="place">
		<v-header></v-header>
		<div class="place-where">
			<div class="place-title">您要去哪？</div>
			<div class="place-btn">
				<div class="place-btn-groud">
					<a class="hover start" href="javascript:;" @click="startGo">
						<span class="ld"><i class="icon iconfont icon-dingwei"></i></span>
						<span class="cd">{{startArea}}</span>
						<span class="rd"><i class="icon iconfont icon-jiantou3"></i></span>
					</a>
				</div>
				<div class="place-btn-groud">
					<a class="hover" href="javascript:;" @click="endGo">
						<span class="ld ch"><i class="icon iconfont icon-dingwei"></i></span>
						<span class="cd">{{endArea}}</span>
						<span class="rd"><i class="icon iconfont icon-jiantou3"></i></span>
					</a>
				</div>
				<a class="place-change"  v-show="showHide" href="javascript:;" @click="changePlace"><i class="icon iconfont icon-weibiaoti7"></i></a>
				<div class="place-money" v-if="showJg && !showHide">正在为您计价...</div>
				<transition name='fadeIn'>
					<div class="place-money" v-show="showHide" >费用&nbsp;&yen;&nbsp;<strong>{{monney}}</strong>元</div>
				</transition>
			</div>
			<div class="place-form">
				<div class="form-btn hover">
					<a href="javascript:;" @click="postPay">下单</a>
				</div>
			</div>
			<div class="place-form drop" v-show="noPayStatus" >
				<div class="form-btn hover">
					<a href="javascript:;" @click="$router.push({name:'pass_order'})">你有一张待支付的订单</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script> 
	import vHeader from '../header.vue'
/*
if(typeof Mock!='undefined'){
	// 计费API
	Mock.mock('/placeroute',{
		"id|1-2000":200,
		"monney|50-200":200,
		"shopid":"900"
	})

	// 下单 请求 0下单成功 1失败 订单的id 要返回
	Mock.mock("/placeorder",{
		"orderId|1-1000":1000,
		"status":0,
		"error":"这条路线无法下单"
	})
}
*/

	export default{
		name:"place"
		,components:{
			vHeader
		}
		,data(){
			return{
				startArea: this.$store.state.startArea.place,   
				endArea:   this.$store.state.endArea.place,
				startId:   this.$store.state.startArea.placeId,
				endId:     this.$store.state.endArea.placeId,
				monney:0,
				showHide:false,
				noPayStatus:false,
				showJg:false
			}
		}
		,methods:{
			startGo(){
				this.$store.clearEndAreaAction();
				this.$router.push({name:'pass_areas',query:{ap:'start'}});
			}
			,endGo(){
				if(this.startId){			
					this.$router.push({name:'pass_areas',query:{ap:'end'}})
				}else{
					this.$toastAlter('先选择起点位置',2000);
				}
			}
			,async sendPlace(){
				if(this.startId && this.endId){
					let formData={
						startId:this.startId,
						endId:this.endId
					}
					this.showJg = true;
					this.showHide=false;
					const dat = await this.$ajaxPost("/placeroute",formData);
					if(dat){
						this.monney=dat.monney;
						this.showHide=!0;
						this.showJg=false;
					}
				}
			}
			//出法调换位置
			,changePlace(){
				var center = this.startArea , cendterId = this.startId;
				this.startArea = this.endArea;
				this.startId = this.endId;
				this.endId=cendterId;
				this.endArea=center;
				this.$store.startAreaAction(this.startArea,parseInt(this.startId));
				this.$store.endAreaAction(this.endArea,parseInt(this.endId));
				this.sendPlace();
			}
			// 下单 逻辑 部分
			,async postPay(){

				if(!this.startId || !this.endId){
					this.$parent.msgAlter("请选择坐车地点！");
					return;
				}

				this.$parent.msgSend('正在下单');

				//await this.$sleep(2);                    			         //测试时使用

				let formData={startId: this.startId,endId: this.endId};
				let dat = await this.$ajaxPost("/placeorder",formData);     //发送下单请求
				
				if(dat){
					if(dat.status == 0){
						await this.$parent.endSend("下单成功",0.5);
						this.$store.orderIdAction(dat.orderId);                  //设置下单id
						this.$router.push({name:"pass_pay"});
					} else if(dat.status == 1){
						await this.$parent.endSend("下单失败",0);
						let msg = dat.error ? dat.error : '下单失败';
						this.$toastAlter(msg,2000);
						return;
					}
				} else {
					await this.$parent.endSend("下单失败",0);
					return;
				}
		
				//下单后 清空 所有的 下单数据
				this.$store.clearStartAreaAction();
				this.$store.clearEndAreaAction();
			}
		}
		,created(){
			this.sendPlace();
		}
	}
</script>

<style scoped>
/*------place 下单-----*/
.place{width: 100%;height: 100%;background: #ffffff;box-sizing:border-box;-webkit-box-sizing:border-box;padding-top: 6.5rem;}
.place-title{width: 100%;text-align: center;font-size: 1.8rem;color: #545454;}
.place-btn{box-sizing:border-box;-webkit-box-sizing:border-box;padding: 2.35rem 2.4rem 4.75rem;position: relative;}
.place-btn-groud{margin-bottom: 1.25rem;}
.place-btn-groud a{display: block;width: 100%;height: 2.45rem;font-size: 0.9rem;border:1px solid #abaaaa;border-radius: 0.25rem;color: #545454;line-height: 2.45rem;position: relative;overflow: hidden;}
.place-btn-groud a span{display: block;}
.place-btn-groud a span.ld{float: left;width:2.0rem;text-align: center;}
.place-btn-groud a span.ld i{color: #2fb700;font-size: 1.25rem;}
.place-btn-groud a span.ch i{color: #fe0202;}
.place-btn-groud a span.cd{float: left;width: 10.0rem;height: 2.45rem;line-height: 2.45rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
.place-btn-groud a span.rd{float: right;width: 1.5rem;}
.place-btn-groud a span.rd i{font-size: 1.25rem;color: #BABABA;}
.place-form{padding:0 1.875rem;}
.place-form.drop{margin-top:2.5rem;}
.place-form.drop a{font-size:0.65rem;background:#8F8F8F;}
.place-change{position: absolute;width: 1.05rem;height: 1.05rem;right: 0.9rem;top:5.0rem;}
.place-change i{font-size: 1.0rem;color: #a7a7a7;}
.place-money{position: absolute;width: 100%;bottom: 0.25rem;left: 0;text-align: center;font-size: 0.9rem;color: #545454}
.place-money strong{font-size: 1.8rem;font-weight: normal;}
</style>