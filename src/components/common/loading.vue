<template>
	<div class="loading" v-if="loading">
		<div class="load-img"><img src="./img/loading-2.gif">正在加载...</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:'loading'
		,props:{
			loading:{
				type:Boolean,
				default:false
			}
		}
	}
</script>
<style type="text/css" scoped>
.loading{position: absolute;top:3.5rem;left: 0;width: 100%;}
.load-img{text-align: center;font-size: 0.75rem;padding: 0 0 1.625rem;}
.load-img img{width: 1rem;vertical-align: middle;padding-right: 0.25rem;}
</style>
