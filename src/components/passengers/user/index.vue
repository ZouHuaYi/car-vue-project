<template> 
<div class="userset" >
	<div class="userBox" v-if="user.id">
		<a @click="$router.push({name:'pass_setuser'})" class="setting" href="javascript:;"><i class="icon iconfont icon-xiugaishanchuyibiaopanshi"></i></a>
		<div class="user-top">
			<div class="user-header"><img :src="user.picture" @error="setErrorImg"></div>
			<div class="user-name">
			<p>{{user.name}}</p>
			<p>{{strPhone(user.phone)}}</p>
			</div>
		</div>	
		<div class="user-detail clearfix">
			<ul>
				<li @click="$router.push({name:'pass_order',query:{p:1}})">
					<div class="u-l">
						<i class="icon iconfont icon-qiche"></i>
						<span>订单</span>
					</div>
					<span class="u-r"><i class="icon iconfont icon-jiantou3"></i></span>
				</li>
				<li @click="$router.push({name:'pass_glod'})">
					<div class="u-l">
						<i class="icon iconfont icon-qianbao"></i>
						<span>金豆</span>
					</div>
					<span class="u-r"><i class="icon iconfont icon-jiantou3"></i></span>	
				</li>
				<li>
					<div class="u-l">
						<i class="icon iconfont icon-ai206"></i>
						<a :href="'tel:'+user.tel">投诉电话 {{user.tel}}</a>
					</div>
					<span class="u-r"><i class="icon iconfont icon-jiantou3"></i></span>
				</li>
			</ul>
		</div>
	</div>
</div>
</template>
<script> 
	import images from '@/assets/timg.jpg';
	export default{
		name:"user"
		,data(){
			return{
				user:{}
			}
		}
		,methods:{
			setErrorImg(e){
				e.target.onerror = null;
				e.target.src = images
			}
			,strPhone(val){
				let vals=val+'';
				if(val!=''){
					return vals.substring(0,3)+'****'+vals.substring(7);
				}
			}
		}
		,created(){
			this.$store.getUserinfo((data)=>{				
				this.user=data;
			});
		}
	}
</script>
<style scoped> 
.userset{width: 100%;height: 100%;background: #f6f6f6;}
.user-top{width: 100%;background: #ffffff;padding: 1.5rem 0;}
.user-header{width:4.75rem;height: 4.75rem;overflow:hidden;border:0.075rem solid #fff;border-radius: 50%;margin:0 auto;}
.user-header img{width:100%;height:100%;}
.user-name{text-align: center;font-size: 1.0rem;line-height: 1.0rem}
.user-name p{padding-top: 0.6rem;}
.user-detail{margin-top: 0.375rem;background: #ffffff;}
.user-detail ul li{width: 100%;height:2.7rem;line-height: 2.7rem;box-sizing:border-box;-webkit-box-sizing:border-box;border-bottom: 0.025rem solid #bfbfbf;padding: 0 1.0rem 0 1.25rem;}
.user-detail ul li .u-l{float: left;display: block;width: 15.0rem}
.user-detail ul li .u-l span,.user-detail ul li .u-l a{display: inline-block;padding-left: 0.875rem;font-size: 0.8rem;}
.user-detail ul li .u-r{float: right;width: 0.85rem;flex: none;-webkit-flex:none;-webkit-box-flex: none;box-flex: none;}
.user-detail ul li .u-l i{float: left;width: 1.2rem;text-align: center;font-size: 1.0rem;color: #000000;}
.user-detail ul li .u-r i{font-size: 0.85rem;}
.userset .setting{position: fixed;right: 0.9rem;top:0.65rem;}
.userset .setting i{font-size: 1.1rem;color: #000000;}
.load-img{text-align: center;font-size: 0.75rem;padding:0.5rem 0 1.625rem;}
.load-img img{width: 1rem;vertical-align: middle;padding-right: 0.25rem;}
</style>