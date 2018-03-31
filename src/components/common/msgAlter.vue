<template> 
<div class="queding" v-if="showStatus">
	<div class="layui-m-layershade" @click="hideFun(!1)"></div>
	<div class="layui-m-layermain">
		<div class="layui-m-layersection">
			<div class="layui-m-layerchild  layui-m-anim-scale layui-content-alter">
				<div class="layui-title-alter bc">{{title}}</div>
				<div class="layui-btn-alert layerbtn hover" @click="hideFun(!1)">
					<a href="javascript:;">确定</a>
				</div>
			</div>
		</div>
	</div>	
</div>
</template>
<script> 
	export default{
		name:"msgAlter",
		props:{
			title:{
				type:String
			},
			showStatus:{
				type:Boolean,
				default: false
			}	
		}
		,data(){
			return{

			}
		}
		,methods:{
			hideFun(val){
				this.$emit("hideFun",val);
			}
		}
	}
</script>
