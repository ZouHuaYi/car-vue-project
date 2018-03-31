<template> 
	<div class="userset">
		<div v-if="">
			<div class="glod-head">
				<div class="gold-top">
					<div class="g-l u-left">
						<p class="g-t"><span>金豆</span> 1元 = 1金豆</p>
						<p class="g-b"><span>{{glod}}</span></p>
					</div>
					<a class="top-up" @click="czClick" href="javascript:;">充值</a>
				</div>
				<p class="con-tit">消费记录</p>
			</div>
			<div class="consumption">
				<v-bscroll ref="bscroll"
				  @onPullUp="pullUpHandle"
				  @onPullDown="pullDownHandle"
				  :dataList="downdata" 
				  :pullDownRefresh="pullDownRefresh"
				  :pullUpLoad="pullUpLoad"
				  :downTop="9.25"
				  :upBottom="-4">
					<div class="scrollBox" :style="{minHeight:iH+'px'}">
						<div class="on-f" v-if="!downdata.length">没有相关记录</div>
						<div class="consum-item bc" v-for="(item,n) in downdata">
							<div class="d-box clearfix">
								<div class="d-l u-left">
									<p>{{item.title}}</p>
									<span>{{$formatDate('yy/MM/dd HH:mm',item.time)}}</span>
								</div>
								<div class="d-r u-right" :class="{'act':Number(item.monney)<0}">{{item.monney}}</div>
							</div>
						</div>
					</div>
				</v-bscroll>
			</div>
		</div>
		<v-czglod ref="czglod" :maxmoney="maxmoney" @sendFun="czGlod" @hideFun="czStatus=false" :showStatus="czStatus"></v-czglod>
	</div>
</template>
<script> 
	import vCzglod from "./cz_glod.vue";
	import vBscroll from "@/components/common/bscroll.vue";
	import wx from 'weixin-js-sdk'

/*
if(typeof Mock!='undefined'){
	//获取数据	
	Mock.mock('/glodlist',{
	"id|1-2000":2000,	
	"glodnumber|1000-2000":	2000,	                 //多少个金豆
	"list|2":[{
			"orderId":"245354646456546",
			"title":"金豆充值",
			"time":1518243720,
			"monney":"+1000个"
			},
			{
			"orderId":"245354646456546",
			"title":"微信支付",
			"time":1518243720,
			"monney":"-100元"	
			},
			{
			"orderId":"245354646456546",
			"title":"金豆支付",
			"time":1518243720,
			"monney":"-100个"	
			}
		]
	})
	//充值 0 成功 1 失败
	Mock.mock('/sendGlod',{
		"status":0
	
	})	
}
*/

	export default{
		name:"glod"
		,components:{
			vBscroll,
			vCzglod
		}
		,data(){
			return{
				counter: 1         //当前页
				,num: 5            // 一页显示多少条
				,downdata: []       // 上拉更多的数据存放数组
				,pullUpLoad: {threshold:-40}
				,pullDownRefresh:{threshold:40,stop:40}	
				,glod:0
				,czStatus:false
				,iH:0
				,idGlod:false
				,maxmoney:0
				,pageSizeData:{} //每页载入临时数据
			}
		}
		,methods:{
			czClick(){
				this.czStatus=true;
				this.$refs.czglod.clearFun();
			}
			,async getGlod(isloading){
				this.counter = 1; this.pageSizeData = {};

				if(isloading)this.$parent.msgSend('正在读取...');
				const dat = await this.$ajaxPost('/glodlist',{pages:1});
				if(isloading)await this.$parent.endSend("读取成功", 0);

				this.downdata=[];
				if(dat){
					this.maxmoney = dat.maxmoney;
					this.glod = dat.glodnumber;
					this.idGlod=dat.id;

					if(dat.offset)this.num = dat.offset;
					if(dat.list.length > 0){
						this.counter++;
						this.downdata = dat.list;
					}
				} 
			}
			//充值 调用 函数
			,async czGlod(val){
				if(WeixinJSBridge){
					let tha = this; this.$toastAlter('正在调起支付', -1);
					let urls = document.location.href;
					const dats = await this.$ajaxPost('/pay',{glod:val,url:encodeURIComponent(urls)});					
					if(dats.jspai){
						this.$toastAlter('调起成功', 0); 

						wx.config(dats.config);
						wx.ready(function(){
							wx.chooseWXPay({
			                    timestamp: dats.jspai.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			                    nonceStr: dats.jspai.nonceStr, // 支付签名随机串，不长于 32 位
			                    package: dats.jspai.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			                    signType: dats.jspai.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			                    paySign: dats.jspai.paySign, // 支付签名
			                    success: async function (response) {// 支付成功后的回调函数			                        
			                        if(response.errMsg == "chooseWXPay:ok"){			                        
			                        	tha.$toastAlter('已支付成功',2000);
			                    	}else{
			                    		tha.$toastAlter('支付成功',20000);
			                    	}
			                        const datz = await tha.$ajaxPost('/pay',{payid:dats.paylogId, chkok:'yes'});
		                    		if(datz){
		                    			tha.czStatus=false;
		                    			tha.getGlod();
		                    		}
			                    },
			                    cancel: function (re) {
			                        tha.$toastAlter('支付已取消',2000);
			                        tha.$ajaxPost('/pay',{payid:dats.paylogId});
			                    }
			                });
						});


                		/*
						await this.$sleep(0.1);
						WeixinJSBridge.invoke('getBrandWCPayRequest', {
		                        "appId": dats.jspai.appId,
		                        "timeStamp": dats.jspai.timeStamp,
		                        "nonceStr": dats.jspai.nonceStr,
		                        "package": dats.jspai.package,
		                        "signType": dats.jspai.signType,
		                        "paySign": dats.jspai.paySign
		                    },async function (res) {
		                    	if(res.err_msg=='get_brand_wcpay_request:ok'){
		                    		const datz = await tha.$ajaxPost('/pay',{payid:dats.paylogId, chkok:'yes'});
		                    		if(datz){
		                    			tha.czStatus=false;
		                    			tha.getGlod();
		                    		}
		                    	} else if(res.err_msg=='get_brand_wcpay_request:cancel'){
		                    		tha.$ajaxPost('/pay',{payid:dats.paylogId});
		                    	}
		                });
		                */	   
					}
				}
			}
			//上啦加载
			,async pullUpHandle() {
				await this.$sleep(1);
				const dat = await this.$ajaxPost('/glodlist',{pages:this.counter});				
				if(dat){
					if(dat.list.length>0){						

						dat.list.forEach((el,index)=>{
							if(!this.pageSizeData[el.orderId]){
								this.pageSizeData[el.orderId] = 1;
								this.downdata.push(el);
							}
						});

						if(dat.list.length == this.num){
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
				await this.$sleep(1); this.getGlod(false);
				this.$refs.bscroll.finish('PullDown');
			}
			
			
		}
		,created(){
			this.iH=document.body.offsetHeight;
			this.getGlod(true);
		}
	}

</script>

<style scoped> 
.glod-head{position:fixed;top:0;left:0;width:100%;z-index:999;background:#ffffff;}
.gold-top{position: relative;width: 100%;height: 6.0rem;border-bottom: 0.025rem solid #D4D3D2;background: #ffffff;}
.gold-top .g-l{padding-left: 1.0rem;}
.gold-top .g-l p.g-t{padding:1.2rem 0 0.8rem;line-height: 0.8rem;}
.gold-top .g-l p.g-t span{font-size: 0.8rem;}
.gold-top .g-l p.g-b span{font-size: 2.0rem;line-height: 2.0rem;}
.gold-top .top-up{position: absolute;width: 2.95rem;height: 1.45rem;border:1px solid #fe7002;border-radius: 0.25rem 0.25rem;-webkit-border-radius: 0.25rem 0.25rem;text-align: center;line-height: 1.45rem;font-size: 1.0rem;top: 3.0rem;right: 1.0rem;color: #fe7002}
.con-tit{height: 2.25rem;line-height: 2.25rem;font-size: 0.8rem;text-indent: 0.75rem;border-bottom: 0.025rem solid #cfcfcf;}
.consum-item{padding: 0 0.75rem;background: #ffffff;border-bottom: 0.025rem solid #d4d3d2;}
.consum-item p.d-title{height:2.5rem;line-height: 2.5rem;font-size:0.75rem;color: #b9b8b8;border-bottom: 0.025rem solid #d4d3d2;}
.consum-item .d-box{padding: 1.0rem 0 0.625rem;}
.consum-item .d-box .d-l p{font-size: 0.9rem;color: #000;line-height: 0.9rem;padding-bottom: 0.5rem;}
.consum-item .d-box .d-l span{font-size:0.65rem;color: #afafaf;}
.consum-item .d-box .d-r{font-size: 0.8rem;}
.scrollBox{padding:9.25rem 0 4.0rem;}
.u-right.act{color: red;}
</style>