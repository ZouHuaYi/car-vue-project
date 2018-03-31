<template>
	<div class="layui-m-layer layui-m-layer0" v-if="toastStatus" >
		<div class="layui-m-layermain">
			<div class="layui-m-layersection">
				<div class="layui-m-layerchild layui-m-layer-msg  layui-m-anim-up">
					<div style="padding:0.5rem 0.5rem;font-size: 0.75rem;" class="layui-m-layercont-m">{{title}}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		props:{
			toastStatus:{
				type:Boolean,
				default:false
			}
			,title:{
				type:String,
				default:'hello world'
			}
		}
		,data(){
			return{}
		}
	}
</script>
