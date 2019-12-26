import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '@/assets/css/icon.css';
import '@/components/common/directives';
import "babel-polyfill";
import $ from 'jquery'
import '@/utils/global'//全局


import "@/assets/css/main.css";
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题

// import "@/assets/css/theme/light_blue/color.css";   // 蓝色主题
// import "@/assets/css/theme/light_blue/index.css";    // 蓝色主题
import '@/assets/css/icon.css';
import dynamicRouter from '@/dynamicRouter.js'
Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});

//初始颜色
Vue.prototype.defaultTheme = 'light_red'
Vue.prototype.$axios = axios;
Vue.prototype.dynamicRouter = dynamicRouter;
Vue.prototype.$ = $;
const i18n = new VueI18n({
    locale: 'zh',
    messages
})
 //判断用户是否登录，如果登录直接取localstorage里面的路由值
    let userRole = localStorage.getItem('ms_username')
    if(userRole) {
        let routerJson = JSON.parse(window.localStorage.router)//获取路由值
        let getRouterTemp = dynamicRouter.filterAsyncRouter(routerJson) //过滤路由
        router.addRoutes(getRouterTemp) //动态添加路由
        global.antRouter = getRouterTemp[1].children //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    }
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    let role = localStorage.getItem('ms_username')
    if(!role && to.path !== '/login'){
        next('/login')
    }else{
        next()
    }
})
new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')