<template> 
	<div class="glod-bean-money" v-show="showStatus">
		<div class="layui-m-layershade" @click="hideFun"></div>
		<div class="layui-m-layermain">
			<div class="layui-m-layersection">
				<div class="layui-m-layerchild  layui-m-anim-scale layui-content-glod bc">
					<div class="layui-title">金豆充值</div>
					<div class="layui-money bc"><i>&yen;&nbsp;</i><input type="number" v-on:input="onInpFun" v-model="glodNum" /></div>
					<div class="layui-box clearfix">
						<label class="hover" :class="{'act':indexNum==n}" @click="indexNum=n" v-for="(item,n) in monney">
							&yen;{{item}}<input name="glod" v-model="glodNum" :value="item" type="radio"> 
						</label>
					</div>
					<p class="layer-glod">1元=1金豆</p>
					<div class="layui-my-btn hover">
						<a href="javascript:;" @click="sendGlod(glodNum)">充值</a>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>
<script> 
	export default{
		name:'cz_glod'
		,props:{
			showStatus:{
				type:Boolean,
				default: false
			},
			maxmoney:{
				type:Number,
				default: 0
			}
		}
		,data(){
			return{
				glodNum:30,
				indexNum:0,
				monney:['30','50','80','100','200','300']
			}
		}
		,methods:{
			onInpFun(){
				this.indexNum=-1;
		  		this.glodNum = (''+this.glodNum).replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
		  		
		  	}
		  	,clearFun(){
		  		this.indexNum=0;
		  		this.glodNum=30;
		  	}
			,hideFun(){
				this.$emit("hideFun")
			}
			,sendGlod(val){				
				if((''+val).trim()=='' || val<=0){
					this.$toastAlter('请输入要充值的金额',2000);
					return;
				}
				if(val > this.maxmoney){
					this.$toastAlter('已超出单笔付款限额，请减少金额重试',2000);
					return;
				}
				this.$emit("sendFun",val);
			}

		}

	}
</script>
<style scoped> 
.layui-content-glod{width: 16.25rem;height: 19.25rem;background: #ffffff;border-radius: 0.3rem;padding: 0 1.2rem;}
.layui-title{font-size: 1.15rem;text-align: center;padding: 1.1rem 0 1.6rem;}
.layui-money{width: 100%;height: 2.45rem;border:0.025rem solid #b3b2b2;border-radius: 0.3rem 0.3rem;-webkit-border-radius: 0.3rem 0.3rem;line-height: 2.45rem;padding-left:0.75rem;outline: none;position: relative;}
.layui-money input{display:block;width: 90%;height:100%;outline: none;font-size: 1.2rem;border: none;}
.layui-money i{font-size: 0.65rem;color: #d8d8d8;font-style:normal;position: absolute;left: 0.25rem;}
.layui-box label{float: left;width: 28%;text-align: center;height: 2.0rem;line-height: 2.0rem;font-size: 0.7rem;border:0.025rem solid #b3b2b2;border-radius: 0.3rem;margin-top: 0.95rem;box-sizing:border-box;-webkit-box-sizing:border-box;}
.layui-box label input{display:none;}
.layui-box label.act{color: #fe7002;border-color:#fe7002;}
.layui-box label:nth-of-type(3n-1){margin-right: 8%;margin-left: 8%;}
.layer-glod{padding-top: 1.25rem;text-align: center;font-size: 0.7rem;color: #9a9a9a;}
.layui-my-btn{width: 100%;height: 2.5rem;background: #fe7002;line-height: 2.5rem;border-radius: 0.3rem;text-align: center;margin-top: 0.9rem;}
.layui-my-btn a{display: block;width: 100%;height: 100%;color: #ffffff;font-size: 1.05rem;}
</style>