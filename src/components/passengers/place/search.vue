<template> 
	<div class="search"> 
		<div class="search-input bc">
			<a class="back-btn" @click="goback" href="javascript:;"><i class="icon iconfont icon-jiantou3"></i></a>
			<input class="input" autofocus="autofocus" type="text" name="" :placeholder="'搜索'+searchType" v-model.trim="search" v-on:input="sendSearch" />
			<a class="search-btn" @click="sendSearch" href="javascript:;">搜索</a>
		</div>
		<div class="areas">
			<div class="area-list">
				<ul id="areaBox">
					<li v-for="item in list">
						<a href="javascript:;" @click="goToPlace(item.title,item.id)">
							<h3>{{item.title}}</h3>
							<p>{{item.content}}</p>	
						</a> 
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script> 
	export default{
		name: 'search'
		,props:{
			listPlace:{
				type:[Array,Object],
				default:[]
			}
		}
		,data(){
			return{
				search:'',
				searchType:this.$parent.startHide ? '起始':'终点',
				list: []
			}
		}
		,methods:{
			goback(){
				this.search=='';
				this.$emit("backFun");
				
			}
			,sendSearch(){
				if(this.search=='') {
					this.list = this.listPlace;
					return; 
				}
				this.list = this.listPlace.filter((item,index) =>{
					if(item.title.indexOf(this.search) > -1 || item.content.indexOf(this.search) > -1){
					    return item
					}
				})
			}
			,goToPlace(name,id){
				this.search=='';
				this.$parent.setPlaceArea(name,id);
			}
		}
		,created(){
			this.list = this.listPlace;
		}
	}
</script>
<style type="text/css" scoped> 
.search{width: 100%;height: 100%;}
.search-input{width: 100%;height: 2.5rem;position: fixed;top: 0;left: 0;background: #ffffff;padding: 0.375rem 2.5rem 0.375rem 1.75rem;border-bottom:0.025rem solid #d5d5d5;}
.input{display: block;width: 100%;height:1.75rem;line-height: 1.75rem;border:none;background: #EFEFEF;text-indent: 0.5rem;border-radius: 0.3rem;outline: none;font-size: 0.8rem;color: #000;}
.back-btn,.search-btn{position: absolute;}
.back-btn{left: 0.25rem;top: 0.625rem;transform:rotate(180deg);width:1.25rem;height:1.25rem;-webkit-transform:rotate(180deg);}
.back-btn i{font-size:1.25rem;font-weight:900;}
.search-btn{width: 2.0rem;height: 1.75rem;text-align: center;line-height: 1.75rem;background: #a2a2a2;right: 0.25rem;top:0.375rem;border-radius: 0.3rem;color: #ffffff}
.areas{padding-top: 2.5rem;}
</style>