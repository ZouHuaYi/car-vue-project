<template>
  <div class="app-header">
  	<a @click="$router.push({name:'pass_user'})" href="javascript:;"><i class="icon iconfont icon-huiyuan21"></i>我的</a> 
  </div>
</template>
<script>
export default {
  name: 'vheader'
  ,data(){return{}}
}
</script>
<style scoped>
.app-header{position: fixed;top:0;left: 0;width: 100%;height: 2.5rem;line-height: 2.5rem;box-sizing: border-box;-webkit-box-sizing: border-box;padding:0 0.6rem;background:#ffffff;z-index: 9999;}
.app-header a{display: block;width: 100%;height: 100%;border-bottom: 0.025rem solid #cfcfcf;font-size: 0.9rem;}
.app-header a i{display: inline-block;font-size: 0.9rem;padding: 0 0.5rem;color: #000000;}
</style>
