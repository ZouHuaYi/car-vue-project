<template> 
<footer class="footer">
	<ul>
		<li><a class="icons" :class="{'act':act}" href="javascript:;" @click="$router.replace({name:'dri_order'})"><i class="icon iconfont icon-qiche"></i></a><span>抢单</span></li>
		<li><a class="icons" :class="{'act':!act && andAct}" href="javascript:;" @click="$router.replace({name:'dri_user'})"><i class="icon iconfont icon-huiyuan21"></i></a><span>我的</span></li>
	</ul>
</footer>
</template>
<script> 
	export default{
		name: 'vfooter'
		,props:{
			act:{
				type:Boolean,
				default:false
			}
			,andAct:{
				type:Boolean,
				default:false
			}
		}
		,data(){
			return{}
		}
	}
</script>

<style scoped> 
.footer{position: fixed;bottom: 0;left: 0;width: 100%;height: 2.95rem;border-top: 0.025rem solid #cfcfcf;background: #ffffff;z-index:999;}
.footer ul{width: 100%;}
.footer ul li{width: 50%;height: 100%;float: left;box-sizing:border-box;-webkit-box-sizing:border-box;text-align:center;font-size:0.625rem;}
.footer ul li:first-child{border-right: 0.025rem solid #cfcfcf;}
.footer ul li span{display: block;margin-top: -0.26rem}
.footer a.icons{width: 1.15rem;height: 1.15rem;line-height: 2.15rem;text-align: center;}
.footer a.icons i{font-size: 1.15rem;}
.footer a.icons.act{color: #FE7002;}
</style>