<template> 
<div class="queding" v-if="sendStatus">
	<div class="layui-m-layershade"></div>
	<div class="layui-m-layermain">
		<div class="layui-m-layersection">
			<div class="layui-m-layerchild  layui-m-anim-scale layui-content-send">
				<div class="img"><img src="./img/loading-3.gif"></div>
				<div class="layui-title-send">{{title}}</div>
			</div>
		</div>
	</div>	
</div>
</template>
<script> 
	export default{
		name: 'send'
		,props:{
			sendStatus:{
				type:Boolean,
				default:false
			}
			,title:{
				type:String,
				default:'正在发送'
			}
		}
		,data(){
			return{}
		}
	}
</script>
<style scoped> 
.layui-content-send{width:4.8rem;background:rgba(0,0,0,0.7);border-radius:0.25rem;}
.img{width:100%;text-align:center;padding-top:0.75rem;}
.img img{width:2.0rem;}
.layui-title-send{text-align:center;color:#ffffff;font-size:0.8rem;padding:0.55rem 0;}
.queding .layui-m-layershade{background:none;}
</style>