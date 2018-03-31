import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

let getCommonComponent = componentName => resolve => require(['@/components/driver'], components => resolve(components[componentName]))
let getCommonComponentplace = componentName => resolve => require(['@/components/passengers'], components => resolve(components[componentName]))

export default new Router({
    //mode: 'history',
    base: baseFile,  
      routes: [
        /*{
            path: '/',
            redirect: '/login'
        },*/
        {
        	path: '/login',
        	name: 'login',
        	component:  resolve=>require(['@/components/login/login.vue'],resolve)
        }
        ,{
            path: '/reg',
            name: 'reg',
            component:  resolve=>require(['@/components/login/reg.vue'],resolve)
        }
        //乘客
        ,{
        	path: '/pass/place',
        	name: 'pass_place',
        	component:  getCommonComponentplace('pass_place'),//resolve=>require(['@/components/passengers/place/index.vue'],resolve)
        }
        ,{
        	path: '/pass/areas',
        	name: 'pass_areas',
        	component:  getCommonComponentplace('pass_areas'),//resolve=>require(['@/components/passengers/place/areas.vue'],resolve)
        }
        ,{
        	path: '/pass/pay',
        	name: 'pass_pay',
        	component:  getCommonComponentplace('pass_pay'),//resolve=>require(['@/components/passengers/payorder/index.vue'],resolve),            
        }
        ,{
        	path: '/pass/user',
        	name: 'pass_user',
        	component:  getCommonComponentplace('pass_user'),//resolve=>require(['@/components/passengers/user/index.vue'],resolve),
            meta:{isFooter:true}
        }
        ,{
        	path: '/pass/order',
        	name: 'pass_order',
        	component:  getCommonComponentplace('pass_order'),//resolve=>require(['@/components/passengers/user/order.vue'],resolve),
            meta:{isFooter:true}
        }
        ,{
        	path: '/pass/glod',
        	name:  'pass_glod',
        	component:  getCommonComponentplace('pass_glod'),//resolve=>require(['@/components/passengers/user/glod.vue'],resolve),
            meta:{isFooter:true}
        }
        ,{
        	path: '/pass/setuser',
        	name: 'pass_setuser',
        	component:  getCommonComponentplace('pass_setuser'),//resolve=>require(['@/components/passengers/user/set_user.vue'],resolve),
            meta:{isFooter:true}
        }


        //司机
        ,{
            path: '/driver/order',
            name: 'dri_order',
            component:  getCommonComponent('place_index'),//resolve=>require(['@/components/driver/order/index.vue'],resolve),
            meta:{isdriver:true}
        }
        ,{
            path: '/driver/pay',
            name: 'dri_pay',
            component:  getCommonComponent('dri_pay'),//resolve=>require(['@/components/driver/pay/index.vue'],resolve),
            meta:{isdriver:true}
        }
        ,{
            path: '/driver/user',
            name: 'dri_user',
            component:  getCommonComponent('dri_user'),//resolve=>require(['@/components/driver/user/index.vue'],resolve),
            meta:{isdriver:true}
        }
         ,{
            path: '/driver/setuser',
            name: 'dri_setuser',
            component:  getCommonComponent('dri_setuser'),//resolve=>require(['@/components/driver/user/set_user.vue'],resolve),
            meta:{isdriver:true}
        }
        ,{
            path: '/error',
            name: 'error',
            component:  resolve=>require(['@/error/404.vue'],resolve)
        }
      ]
})
