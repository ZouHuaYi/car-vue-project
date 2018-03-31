<template>
	<div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="icon iconfont2 icon-cuowu"></i></div>
        <div class="weui-msg__text-area">
            <h2 class="weui-msg__title">操作失败</h2>
            <p class="weui-msg__desc bc">{{msg}}</p>
        </div>
        <div class="weui-msg__opr-area bc">
            <div class="form-btn hover" @click="goWait">
				<a href="javascript:;">好的，我知道了</a>
			</div>
        </div>
    </div>
</template>
<script>
	export default{
        name:'error',
        data(){
            return{
                msg:'本次操作失败，服务器出现致命的错误!'
            }
        },
        methods:{
            goWait(){               
                this.$isCloseWindow(true);
            }            
        },
        created(){
            if(this.$route.query.msg){
                this.msg = this.$route.query.msg;
            }
        }
    }
</script>
<style scoped>
.weui-msg { padding-top: 0.9rem;text-align: center;}
.weui-msg__icon-area{margin-bottom: 0.75rem;}
.weui-msg__icon-area i{color: #F76260;}
.weui-msg__icon-area i{font-size: 3.75rem;}
.weui-msg__title{font-size: 0.9rem;font-weight: 700;}
.weui-msg__desc{padding: 0.5rem 0.5rem;font-size: 0.75rem;line-height: 0.8rem;}
.weui-msg__opr-area{margin-top: 1.0rem;padding: 0 4.9rem;}
.weui-msg__opr-area .form-btn{background:#ffffff;border:0.025rem solid #F76260;}
.weui-msg__opr-area .form-btn a{color: #F76260;}
</style>