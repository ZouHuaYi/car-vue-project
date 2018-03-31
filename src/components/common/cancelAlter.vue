<template> 
<div class="queding" v-if="showStatus" >
	<div class="layui-m-layershade" @click="hideFun(!1)"></div>
	<div class="layui-m-layermain">
		<div class="layui-m-layersection">
			<div class="layui-m-layerchild layui-m-anim-scale layui-content-que bc">
				<div class="layui-title-que">{{title}}</div>
				<div class="form-groud bc" v-if="showInput">
					<input type="text" placeholder="请输入取消理由" value="inpData" @input="inpFun" v-model.trim="inpData">
				</div>
				<p class="p-glod-que">{{sectit}}</p>
				<div class="layui-btn-sec">
					<a href="javascript:;" @click="hideFun(!1)" >取消</a>
					<a class="act" href="javascript:;" @click="comFun(!1)" >确定</a>
				</div>
			</div>
			
		</div>
	</div>	
</div>
</template>
<script> 
	export default{
		name:"cancelalter",
		props:{
			title:{
				type:String
			}
			,sectit:{
				type:String
			}
			,showStatus:{
				type:Boolean,
				default: false
			}
			,showInput:{
				type:Boolean,
				default: true
			}	
		}
		,data(){
			return{
				inpData:''
			}
		}
		,methods:{
			hideFun(val){
				this.$emit("hideFun",val);
			},
			comFun(){
				this.$emit("comFun");
			},
			inpFun(){
				this.$emit("inpFun",this.inpData);
			}
		}
	}
</script>
<style type="text/css" scoped>
	.form-groud{padding:0.5rem 0.75rem;}
	.form-groud input{width: 100%;height: 2.2rem;border: 0.025rem solid #FE7002;border-radius: 0.25rem;padding: 0 0.5rem;box-sizing: border-box;font-size: 0.75rem;}
	.form-groud input::-webkit-input-placeholder{color: #d8d8d8;}
	.form-groud input::input-placeholder{color: #d8d8d8;}
</style>