<template>
	<div class="dri-order">		
		<v-bscroll ref="bscroll"
			  @onPullUp="pullUpHandle"
			  @onPullDown="pullDownHandle"
			  @onScroll="posHandle"
			  :dataList="downdata" 
			  :pullDownRefresh="pullDownRefresh"
			  :pullUpLoad="pullUpLoad"
			  :downTop="padTop"
			  :upBottom="-3">
			<div class="driver-play" :style="{minHeight:iH+'px',paddingTop: padTop +'rem'}">
				<div class="no-img" v-if="loadStatus"><img src="../../../assets/loading-2.gif" >正在加载...</div>
				<div class="opl-item bc" v-for="item in downdata" @click="gotoOrder(item.orderId)">
					<div class="opl-title">
						<p>订单号：{{item.ordersn}}</p>
						<span v-if="item.status==0 || item.status==1" style="border-color:#FFAA0B;color:#FFAA0B;">等待</span>
						<span v-if="item.status==2 || item.status==3" style="border-color:#FF3131;color:#FF3131;">未支付</span>
						<span v-if="item.status==5" style="border-color:#D8D8D8;color:#D8D8D8;">无效</span>
						<span v-if="item.status==4 && item.comtime!=0" style="border-color:#2CB30E;color:#2CB30E;">已完成</span>
						<span v-if="item.status==4 && item.comtime==0" style="color:#f47920;border-color:#f47920;">未评论</span>
					</div>
					<div class="opt-box clearfix">
						<div class="p-l u-left">
							<p><i class="icon iconfont icon-shijian"></i><span>{{$formatDate('yyyy-M-dd HH:mm',item.time)}}</span></p>
							<p><i class="icon iconfont icon-dingwei"></i><span>起点：{{item.startArea}}</span></p>
							<p><i class="icon iconfont icon-dingwei"></i><span>终点：{{item.endArea}}</span></p>
						</div>
						<span class="p-r u-right">&yen;{{item.monney}}</span>
					</div>
				</div>
			</div>
		</v-bscroll>	
	</div>
</template>
<script type="text/javascript">
	import vBscroll from "@/components/common/bscroll.vue";
	if(typeof Mock!='undefined'){
	    //获取数据  
	    /*
		Mock.mock('/getOrder',{
		"list|5":[{		    
				"orderId|1-900000":900000,
				"dtit":"未支付",
				"time":1518243720,
				"startArea":"某某学校某某学校某某学校某某学校某某学校某",
				"endArea":"某某小学",
				"monney|50-300":300
			}]
		})
		*/
		
	}

	export default{
		name:"order"
		,components: {
			vBscroll,
		}
		,props:{
			indexNum:{
				type:Number
			}
		}
		,data(){
			return{
				counter: 1                  //当前页
				,num: 5                     // 一页显示多少条
				,downdata: []               // 上拉更多的数据存放数组
				,pullUpLoad: {threshold:-40}
				,pullDownRefresh:{threshold:40,stop:40}	
				,iH:0
				,title:''
				,padTop:this.$parent.scrollStatus ? 11.375:2.0125 
				,topStatus:true
				,loadStatus:true
				,pageSizeData:{} //每页载入临时数据
			}
		}
		,methods:{
			posHandle(val){
				if(val.y<-20){
					if(this.topStatus){
						this.padTop=2.0125;
						this.$parent.topHideHandle(false);
						this.$refs.bscroll.startScroll();
						this.topStatus=false;
					}
					
				}
				if(val.y>10){
					this.padTop=11.375;
					this.$parent.topHideHandle(true);
					this.topStatus=true;
				}
			}
			,goToWait(orderId){
				this.$store.orderIdAction(orderId);
				this.$router.push({name:"wait"});
			}
			//上啦加载
			,async pullUpHandle() {
				await this.$sleep(1);				
				const dat = await this.$ajaxPost('/getOrder', {type:this.indexNum, pages:this.counter});
				if(dat){					
					if(dat.list && dat.list.length>0){

						dat.list.forEach((el,index)=>{
							if(!this.pageSizeData[el.orderId]){
								this.pageSizeData[el.orderId] = 1;
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
				await this.$sleep(1); this.getData(false);
				this.$refs.bscroll.finish('PullDown');
			}
			,async getData(isloading){				
				this.counter=1; this.pageSizeData = {};
				const dat = await this.$ajaxPost('/getOrder', {type:this.indexNum, pages:1}); 				

				this.downdata=[]; this.loadStatus = false;
				if(dat){	
					if(dat.offset)this.num = dat.offset;
					if(dat.list && dat.list.length > 0){
						if(dat.list.length == this.num){
							this.counter++;
						}
						this.downdata = dat.list;
					}
				}
			}
			,gotoOrder(val){
				this.$store.orderIdAction(val);
				this.$router.push({name:"dri_pay"});
			}
		}
		,mounted(){
			this.iH=document.body.offsetHeight;
			window.scrollTo(0,0);
			this.getData(true);
		}
		

	}

</script>
<style type="text/css" scoped>
	.dri-order{height: 100%;width: 100%;}
	.driver-play{width: 100%;padding-top: 11.375rem;padding-bottom:3.0rem;}
	.opl-item{padding: 0 0.75rem 0.875rem;border-bottom: 0.025rem solid #cfcfcf;height: 7.5rem;position: relative;}
	.opl-title{width: 100%;height: 2.5rem;border-bottom: 0.025rem solid #c2c2c2;position: relative;}
	.opl-title p{float: left;line-height: 2.5rem;font-size: 0.7rem;color: #b9b8b8}
	.opl-title span{float: right;width: 2.45rem;height: 1.0rem;border:0.025rem solid #ffa600;text-align: center;line-height: 1.0rem;font-size: 0.55rem;color: #ffa600;margin-top: 0.65rem;}
	.opt-box .p-l p{font-size: 0.65rem;line-height: 0.75rem;padding-top: 0.65rem;clear: both;width: 14rem;overflow: hidden;}
	.opt-box .p-l p span{width: 80%;height: 0.75rem;float: left;padding-left: 0.625rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
	.opt-box .p-l p i{float: left;font-size: 0.65rem;color: #d3d1d1;}
	.opt-box .p-r{position: absolute;right: 0.75rem;top:4.5rem;color: #bbbaba;font-size: 0.7rem;line-height: 0.7rem;}
	.no-img{text-align: center;font-size: 0.75rem;padding:0.5rem 0 1.625rem;}
	.no-img img{width: 1rem;vertical-align: middle;padding-right: 0.25rem;}
</style>