<template> 
<div class="dri-order bc">
	<div class="driver-box" v-if="downdata.length>0">
		<v-bscroll ref="bscroll"
		  @onPullUp="pullUpHandle"
		  @onPullDown="pullDownHandle"
		  :dataList="downdata" 
		  :pullDownRefresh="pullDownRefresh"
		  :pullUpLoad="pullUpLoad"
		  :downTop="0.75"
		  :upBottom="-3.5">
			<section class="order-list" :style="{minHeight:iH+'px'}">
				<div class="order-item bc" v-for="item in downdata">
					<div class="order-time"><i class="icon iconfont icon-shijian"></i>{{$formatDate('yyyy-M-dd HH:mm',item.time)}}</div>
					<div class="order-area clearfix">
						<div class="oa-left u-left">
							<i class="icon iconfont icon-dingwei"></i><span>起点:</span>
						</div>
						<div class="oa-right u-left">
							<h3>{{item.startTitle}}</h3>
							<p>{{item.startArea}}</p>
						</div>
					</div>
					<div class="order-area clearfix">
						<div class="oa-left u-left">
							<i class="icon iconfont icon-dingwei act"></i><span>终点:</span>
						</div>
						<div class="oa-right u-left">
							<h3>{{item.endTitle}}</h3>
							<p>{{item.endArea}}</p>
						</div>
					</div>
					<a class="click hover" @click="testOrder(item.id)" href="javascript:;">抢单</a>
				</div>
			</section>
		</v-bscroll>
	</div>
	<div class="reload" v-if="sxSatus" @click="getData">
		<div class="reload-btn bc hover">
			<a href="javascript:;">刷新</a>
		</div>
		<p>暂时没有发现订单,点击刷新</p>
	</div>
</div>
</template>
<script>
import vBscroll from "@/components/common/bscroll.vue";
/*
if(typeof Mock!='undefined'){
	// 抢单 数据
	
	Mock.mock('/qdorder',
		{"list|2":[
			{
			"id|1000-3000":3000,
			"time":1518576008,
			"startTitle":"某某学校",
			"startArea":"广州市番禺区海伦堡创业园公寓",
			"endTitle":"某某村",
			"endArea":"广州市番禺区海伦堡创业园公寓"
			}
		]}
	)	*/
	/*
	// 判断 单是否被抢 0 没有 1 已经被抢
	Mock.mock('/qdtest',{
		"status":0,
		"error":"你已经有单不能抢了"
	})	
}
*/
	export default{
		data(){
			return{
				counter: 1         //当前页
				,num: 5             // 一页显示多少条
				,downdata: []       // 上拉更多的数据存放数组
				,pullUpLoad: {threshold:-40}
				,pullDownRefresh:{threshold:40,stop:40}	
				,iH:0
				,sxSatus:false
				,runtime:null
				,pageSizeData:{} //每页载入临时数据
			}
		}
		,components:{
			vBscroll
		}
		,methods:{
			async getData(isloading){
				this.counter=1; this.pageSizeData = {}; this.sxSatus = false;

				if(isloading)this.$parent.loadingAction(true);
				const dat = await this.$ajaxPost('/qdorder');
				if(isloading)this.$parent.loadingAction(false);

				this.downdata = [];
				if(dat){
					if(dat.offset)this.num = dat.offset;
					if(dat.list && dat.list.length > 0){
						if(dat.list.length == this.num){
							this.counter++;
						}
						//this.downdata = dat.list;

						dat.list.forEach((el,index)=>{
							if(!this.pageSizeData[el.id]){
								this.pageSizeData[el.id] = 1;
								this.downdata.push(el);
							}
						});

						this.sxSatus = false;
					}else{
						this.sxSatus = true;
					}
				}else{
					this.sxSatus = true;
				}
			}
			//上拉加载
			,async pullUpHandle() {
				await this.$sleep(1);
				const dat = await this.$ajaxPost('/qdorder',{pages:this.counter});
				if(dat){
					if(dat.list && dat.list.length > 0){
						this.sxSatus = false;

						dat.list.forEach((el,index)=>{
							if(!this.pageSizeData[el.id]){
								this.pageSizeData[el.id] = 1;
								this.downdata.push(el);
							}
						});

						if(dat.list.length == this.num){
							this.counter++;
						}else{
							this.$refs.bscroll.disContinue('PullUp');
						}
						
						this.$refs.bscroll.finish('PullUp');
					}else{
						this.$refs.bscroll.disContinue('PullUp');
						this.$refs.bscroll.finish('PullUp');
					}
				}else{
					this.$refs.bscroll.disContinue('PullUp');
					this.$refs.bscroll.finish('PullUp');
				}
			}
			//下拉刷新
			,async pullDownHandle() {
				await this.$sleep(1); 
				this.getData(false);
				this.$refs.bscroll.finish('PullDown');
			}
			,async testOrder(val){
				this.counter=1; this.$parent.msgSend('正在抢单');
				const dat = await this.$ajaxPost('/qdtest',{"orderId":val});
				if(dat){
					this.$store.orderIdAction(val);
					await this.$parent.endSend('抢单成功',0.5);
					this.$router.push({name:"dri_pay"})
				}else{
					await this.$parent.endSend('抢单失败',0.5);
					this.getData(true);
				}
			}
		}
		,created(){
			this.iH=document.body.offsetHeight-60;
			this.getData(true);
			this.runtime = setInterval(()=>{
				if(this.$refs.bscroll){
					this.pullUpHandle();
				}
			}, 10000)
		}
		,beforeDestroy(){
			clearInterval(this.runtime);
			this.pullUpHandle=function(){};
		}
	}
</script>

<style scoped> 
.dri-order{width: 100%;height: 100%;background: #f8f7f7;padding: 0 0.5rem;color: #9c9b9b;font-size: 0.7rem;}
.order-list{padding-bottom: 3.5rem;}
.order-item{width: 100%;height: 9.0rem;margin-top: 1.15rem;padding: 1.0rem 0 0 0.5rem;background: #ffffff;border-radius: 0.3rem;-webkit-border-radius:0.3rem;position: relative;}
.order-item .click{position: absolute;width: 3.5rem;height: 3.5rem;border-radius: 50%;-webkit-border-radius: 50%;background: #fe7002;color: #ffffff;line-height: 3.5rem;text-align: center;font-size: 0.85rem;right: 0.75rem;top: 3.0rem;}
.order-time{height: 0.7rem;line-height: 0.7rem;}
.order-time i{font-size: 0.7rem; color: #d3d1d1;margin-right: 0.5rem}
.order-area{width: 100%;height: 2.5rem;margin-top:0.9rem;}
.oa-left{height:100%;line-height: 2.5rem;margin-right: 0.7rem;font-size: 0.85rem}
.oa-left i{font-size: 0.8rem;color: #2fb700;margin-right: 0.5rem}
.oa-left i.act{color: #fe0202;}
.oa-right{width: 8.25rem;}
.oa-right h3{width: 100%;font-size: 0.9rem;height: 1.1rem;line-height: 1.1rem;color: #545454;font-weight: normal;padding-bottom: 0.55rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
.oa-right p{width: 100%;height: 1.0rem;font-size: 0.7rem;line-height: 1.0rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
.reload{padding: 3.5rem 0rem;text-align: center;}
.reload .reload-btn{display: inline-block;width: 3.5rem;height: 3.5rem;background: #fe7002;text-align: center;line-height: 3.5rem;border-radius: 50%;-webkit-border-radius: 50%;}
.reload .reload-btn a{ color: #ffffff;font-size: 0.75rem;}
.reload p{padding-top: 0.5rem;}
</style>