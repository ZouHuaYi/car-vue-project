<template>
	<div class="scroll-list">
		<v-bscroll ref="bscroll"
		  @onPullUp="pullUpHandle"
		  @onPullDown="pullDownHandle"
		  :dataList="downdata" 
		  :pullDownRefresh="pullDownRefresh"
		  :pullUpLoad="pullUpLoad"
		  :downTop="2.5"
		  :upBottom="-4">
			<div class="order-play" :style="{minHeight:iH+'px'}">

				<div class="opl-item bc" v-for="(item,index) in downdata" @click="goToWait(item.orderId)">
					<div class="opl-title">
						<p>订单号：{{item.ordersn}}</p>
						<span v-if="item.comtime!=0" style="color:#23b003;border-color:#23b003;">已完成</span>
						<span v-if="item.comtime==0" style="color:#f47920;border-color:#f47920;">待评论</span>
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
		</v-bscroll>
	</div>
</template>
<script>
	import vBscroll from "@/components/common/bscroll.vue";

	export default{
		components:{
			vBscroll
		}
		,data(){
			return{
				counter: 1                    // 下拉起始页码
				,num: 5                       // 一页显示多少条
				,downdata: []                 // 上拉更多的数据存放数组
				,pullUpLoad: {threshold:-40}
				,pullDownRefresh:{threshold:40,stop:40}	
				,iH:0
				,pageSizeData:{} //每页载入临时数据
			}
		}
		,methods:{
			goToWait(orderId){
				this.$store.orderIdAction(orderId);
				this.$router.push({name:"pass_pay"});
			}
			,async getFinishData(isloading){
				this.counter = 1; this.pageSizeData = {}; this.$parent.notdata = false; 

				if(isloading)this.$parent.$parent.loadingAction(true);
				const dat = await this.$ajaxPost('/orderlist',{type:4});
				if(isloading)this.$parent.$parent.loadingAction(false);

				this.downdata=[];
				if(dat){					
					if(dat.offset)this.num = dat.offset;
					if(dat.list.length > 0){
						console.log(this.counter, dat.list.length, this.num);
						if(dat.list.length == this.num){
							this.counter++;
						}
						this.downdata = dat.list;
					}else{
						this.$parent.notdata = true;
					}
				}
			}
			//上啦加载
			,async pullUpHandle() {
				await this.$sleep(1);
				const dat = await this.$ajaxPost('/orderlist',{type:4, pages:this.counter, });
				if(dat){
					if(dat.list && dat.list.length > 0){	

						dat.list.forEach((el,index)=>{
							if(!this.pageSizeData[el.orderId]){
								this.pageSizeData[el.orderId] = 1;
								this.downdata.push(el);
							}
						});

						console.log(this.counter, dat.list.length, this.num, this.downdata.length);

						if(dat.list.length < this.num){							
							this.$refs.bscroll.disContinue('PullUp');
						}else{
							this.counter++;
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
				this.getFinishData(false);
				this.$refs.bscroll.finish('PullDown');
			}

		}
		,created(){
			this.iH=document.body.offsetHeight;
			this.getFinishData(true);
		}
	}
</script>