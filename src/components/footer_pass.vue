<template> 
<footer class="footer">
	<ul>
		<li @click="goToPlace"><a class="icons" href="javascript:;"><i class="icon iconfont icon-qiche"></i></a>叫车</li>
		<li @click="$router.replace({name:'pass_user'})"><a class="icons act" href="javascript:;"><i class="icon iconfont icon-huiyuan21"></i></a>我的</li>
	</ul>
</footer>
</template>
<script> 
	export default{
		data(){
			return{}
		}
		,methods:{
			goToPlace(){
				//下单后 清空 所有的 下单数据
				this.$store.clearStartAreaAction();
				this.$store.clearEndAreaAction();
				this.$router.replace({name:'pass_place'});
			}
		}
	}
</script>

<style scoped> 
.footer{position: fixed;bottom: 0;left: 0;width: 100%;height: 2.975rem;border-top: 0.025rem solid #cfcfcf;background: #ffffff;z-index:999;}
.footer ul{width: 100%;}
.footer ul li{width: 50%;height: 100%;float: left;position: relative;line-height: 3.5rem;box-sizing:border-box;-webkit-box-sizing:border-box;text-align:center;font-size:0.75rem;}
.footer ul li:first-child{border-right: 0.025rem solid #cfcfcf;}
.footer a.icons{position: absolute;left: 50%;top: -1.075rem;margin-left:-1.075rem;width: 2.15rem;height: 2.15rem;background: #ffffff;border:0.025rem solid #d6d6d6;border-radius: 50%;border-radius: 50%;line-height: 2.15rem;text-align: center;}
.footer a.icons i{font-size: 1.15rem;}
.footer a.icons.act{color: #FE7002;}
</style>