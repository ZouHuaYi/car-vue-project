<template>
	<div class="register">
		<div class="wx-header bc"><img :src="wxheader" ref="errimg"></div>
		<div class="form-login bc">
			<div class="form-groud">
				<input class="fx-one" type="text"  autofocus="autofocus" placeholder="输入姓名" v-model.trim="name">
			</div>
			<div class="form-groud">
				<input class="fx-one" type="text"  autofocus="autofocus" placeholder="输入车牌号" v-model.trim="plate">
			</div>
			<div class="form-groud">
				<input class="fx-one" type="text" autofocus="autofocus" placeholder="输入车颜色"  v-model.trim="color">
			</div>
			<div class="form-groud">
				<input class="fx-one" type="text" autofocus="autofocus" placeholder="输入车品牌" v-model.trim="cat">
			</div>
			<div class="form-btn">
				<a class="hover" href="javascript:;" @click="submitCode">申请成为司机</a>
			</div>
		</div>
	</div>
</template>
<script>
	import imgs from '@/assets/timg.jpg';

	export default {
	  name: 'login'
	  ,data () {
	    return {
	     	wxheader:window.sessionStorage.getItem('img') ? window.sessionStorage.getItem('img') : imgs,
	     	name:'',
	     	plate:'',
	     	color:'',
	     	cat:''
	    }
	  }
	  ,mounted () {
		this.$refs.errimg.onerror = () => {
			this.$refs.errimg.error = null;			
			this.$refs.errimg.src = imgs;
		}
	  }
	  ,methods:{
	  	async submitCode(){
	  		if(this.name=='' || this.plate=='' || this.color=='' || this.cat==''){
	  			this.$parent.msgAlter('请填写完整信息');
	  			return;
	  		}
	  		let formData={
	  			name: this.name,
	  			plate: this.plate,
	  			color: this.color,
	  			cat: this.cat
	  		}
	  		this.$parent.msgSend('正在申请');
	  		const dat = await this.$ajaxPost('/reg',formData);
	  		await this.$parent.endSend('申请成功',0);
	  		if(dat){
	  			if(dat.user==0){
	  				this.$router.replace({name:'pass_user'})
	  			}else if(dat.user==1){
	  				this.$router.replace({name:'dri_user'})
	  			}  			
	  		}
		}
	  }
	}
</script>
<style type="text/css" scoped>
	.register{width: 100%;height:100%;min-height: 28.25rem;background: #fff2d0;padding-top: 3.6rem;box-sizing:border-box;-webkit-box-sizing:border-box;}
	.wx-header{width:4.75rem;height: 4.75rem;border:0.075rem solid #fff;margin:0 auto 2.0rem;border-radius: 50%;;overflow: hidden;}
	.wx-header img{width: 100%;height: 100%;border-radius: 50%;}
	.register .form-login{padding:0rem 1.375rem;}
	.register .form-groud{width: 100%;height:2.5rem;margin-bottom:0.9rem;}
	.register .form-groud input{display: block;width: 100%;font-size: 0.9rem;border:none;outline: none;height: 100%;line-height: 2.5rem;background: #ffffff;border-radius:0.3rem 0.3rem;-webkit-border-radius:0.3rem 0.3rem;box-sizing: border-box;-webkit-box-sizing: border-box;padding-left: 0.5rem}
	.register .form-groud input::-webkit-input-placeholder{color: #d8d8d8;}
	.register .form-groud input::input-placeholder{color: #d8d8d8;}
</style>