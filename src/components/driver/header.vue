<template>
	<div class="pass-header bc clearfix">
		<section class="p-img u-left"><img :src="img"/></section>
		<p class="u-left">邹小一</p>
		<a class="phone u-right" href="">
			<i class="icon iconfont icon-dianhua3"></i>
		</a>
	</div>
</template>
<script type="text/javascript">
import images from "@/assets/timg.jpg";
	export default{
		data(){
			return{
				img:images
			}
		}
	}
</script>
<style type="text/css" scoped>
	.pass-header{width: 100%;height: 4.05rem;border-bottom: 0.025rem solid #cfcfcf;position: fixed;top: 0;left: 0;padding: 0.5rem 0.5rem 0;}
	.p-img{width: 2.9rem;height: 2.9rem;border-radius: 50%;-webkit-border-radius:50%;overflow: hidden;}
	.p-img img{width: 100%;height: 100%;}
	.pass-header p{font-size: 0.9rem;height: 3.05rem;line-height: 3.05rem;padding-left:0.7rem;}
	.pass-header .phone{width: 2.9rem;height: 2.9rem;border-radius: 50%;-webkit-border-radius:50%;}
	.pass-header .phone i{font-size: 2.9rem;color: #ffa600}
</style>