<template>
<div class="man-center">
	<div v-if="driver.id">
		<div class="user-top">
			<transition name="fadeTop">
				<div class="user-header" v-show="scrollStatus">
					<a @click="$router.push({name:'dri_setuser'})" class="setting" href="javascript:;"><i class="icon iconfont icon-xiugaishanchuyibiaopanshi"></i></a>
					<div class="h-img"><img :src="driver.picture" @error="setErrorImg"></div>	
					<p class="name">{{driver.name}}</p>
					<div class="star">
						<i v-for="n in driver.star" class="icon iconfont icon-xingxing"></i>
					</div>
					<p class="plate">{{driver.plate}}</p>
					<div class="left-zs">
						<p>总收入</p>
						<strong>{{driver.monney}}</strong>
					</div>
					<div class="left-zs right">
						<p>总订单数</p>
						<strong>{{driver.ordernum}}</strong>
					</div>
				</div>
			</transition>
			<nav class="usernav">
				<div class="l-f">订单记录</div>
				<div class="l-r" >
					<a v-for="(item,n) in navlist" :class="{'act':n==indexNum}" @click="indexNum=n" href="javascript:;">{{item}}</a>
				</div>
			</nav>
		</div>
		<div class="dri-order-list">
			<div v-for="(item,n) in navlist" >
				<v-orderlist v-if="n==indexNum" :indexNum="n"  />
			</div>
		</div>
	</div>	
</div>
</template>
<script type="text/javascript">
	import images from "@/assets/timg.jpg";
	import vOrderlist from './order_list.vue';
/*
if(typeof Mock!='undefined'){	
	Mock.mock('/driuser',{
		"id|1000-2000":2000,
		"name":"李师傅",
		"plate":"粵B12345",
		"monney":"10000",
		"ordernum":"900",
		"picture":images,
		"star":2
	})	
}
*/
	export default{
		components:{
			vOrderlist
		}
		,data(){
			return{
				driver:{},
				indexNum:0,
				scrollStatus:true,
				navlist:['今天','本周','本月']
			}
		}		
		,methods:{
			setErrorImg(e){
				e.target.onerror = null;
				e.target.src = images
			}
			,async getData() {
				const dats = await this.getUpData();
				this.driver=dats;

				//更新订单 金额 车牌 星级相关数
				const dat = await this.$ajaxPost('/driuser',{});				
				if(dat){
					if(dat.plate){
						this.driver.star=dat.star;
						this.driver.plate=dat.plate;
						this.driver.ordernum=dat.ordernum;
						this.driver.monney=dat.monney;

						this.$store.setUserinfo('star', dat.star);
						this.$store.setUserinfo('plate', dat.plate);
						this.$store.setUserinfo('ordernum', dat.ordernum);
						this.$store.setUserinfo('monney', dat.monney);
					}
				}
			}
			,getUpData(){
				return new Promise((resolve,reject)=>{
					this.$store.getUserinfo((data)=>{
						resolve(data);			
					});
				});
			}
			,topHideHandle(val){
				this.scrollStatus=val;
			}
		}
		,created(){
			this.getData();
		}
	}
</script>
<style type="text/css" scoped>
	.man-center{width: 100%;height: 100%;}
	.user-top{width: 100%;position: fixed;top: 0;left: 0;background: #ffffff;z-index: 10000;}
	.h-img{width: 100%;text-align: center;padding-top: 0.925rem;}
	.h-img img{width: 3.65rem;height: 3.65rem;border-radius: 50%;-webkit-border-radius:50%;}
	.user-header{width: 100%;height: 9.25rem;position: relative;}
	.user-header p{text-align: center;}
	.star{text-align: center;}
	.name{font-size: 0.9rem;line-height: 0.9rem;padding:0.55rem 0 0.3rem;}
	.star i{font-size: 0.8rem;color:  #ffa600}
	.plate{font-size: 0.65rem;padding-top: 0.3rem;}
	.left-zs{position: absolute;left: 0.75rem;top: 3.1rem;}
	.left-zs p{font-size: 0.7rem;color: #9c9b9b;text-align: left;line-height: 0.7;padding-bottom: 0.5rem;}
	.left-zs strong{float: left;font-size:0.9rem;font-weight: normal;line-height: 0.9rem;}
	.left-zs span{float: left;margin: 0.4rem 0.2rem 0;}
	.left-zs.right{left: auto;right: 0.75rem}
	.usernav{width: 100%;height: 2.0rem;line-height: 2.0rem;font-size: 0.65rem;}
	.usernav .l-f{float: left;width: 10.0rem;height: 2.0125rem;background: #e6e6e6;text-indent: 0.75rem;border-bottom: 0.025rem
		solid #cfcfcf;}
	.usernav .l-r{float: left;width:8.75rem}
	.usernav .l-r a{float: left;width: 33.33%;height: 100%;box-sizing:border-box;-webkit-box-sizing:border-box;text-align: center;border-left: 0.025rem solid #cfcfcf;border-bottom: 0.025rem
		solid #cfcfcf;position: relative;}
	.usernav .l-r a.act:after{position: absolute;content: " ";width: 100%;border-bottom:0.1rem solid #ffa600;left: 0;bottom: -0.1rem;}	
	.setting{position: fixed;right: 0.9rem;top:0.65rem;}
	.setting i{font-size: 1.1rem;color: #000000;}
.fadeTop-enter-active{
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
}
.fadeTop-leave-active{
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeTop-enter, .fadeTop-leave-to{
	transform: translateY(-2rem);	
  	opacity: 0;
}

</style>