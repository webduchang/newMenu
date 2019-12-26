import router from './router'
// import { Message } from 'element-ui'
import axios from 'axios'
const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
import home from '@/components/common/Home.vue' //Layout 是架构组件，不在后台返回，在文件里单独引入
import menu from '@/router/menu.js'
var getRouter
//初始化路由
function initRouter(){
    router.beforeEach((to, from, next) => {
        if (!getRouter) {//不加这个判断，路由会陷入死循环
            getRouter = menu.data.router//后台拿到路由
            // getRouter = getData()//后台拿到路由
            saveObjArr('router', getRouter) //存储路由到localStorage
            routerGo(to, next)//执行路由跳转方法
        } else {
          next()
        }
      })
}
//获取后台的数据，并且转换成路由需要的数据
function getData(){
  let menu = [
      {
          path: '/',
          redirect: '/dashboard'
      },
      {
          path: '/',
          component: 'home', 
          children:[
            {
              "path": "/dashboard",
              "component": "page/Dashboard",
              icon: 'el-icon-lx-home',
              index: 'dashboard',
              title: '系统首页',
              "meta": {
                "title": "首页",
              }
            }
          ]  
       }
  ]
  let menuData = JSON.parse(localStorage.getItem('menu'));
  let parent = []
  let children = []
  menuData.forEach(menu=>{
      if(menu.parentModuleId===''){
          parent.push(menu)
      }else{
          children.push(menu)
      }
  })
  parent.forEach(item=>{
      let i = 0;
      let pathData = {
          // 拖拽Dialog组件
          path: '/dialog',
          component: 'page/DragDialog',
          icon: 'el-icon-lx-home',
          title: item.moduleName,
      }
      children.forEach(res=>{
          i++;
          if(item.moduleId===res.parentModuleId){
              menu[1].children.push({
                  path: '/drag',
                  component: 'page/DragList',
                  meta: { title: res.moduleName }
              })
              if(!pathData.subs) pathData.subs = []
              pathData.subs.push({
                  index: 'drag',
                  title: res.moduleName,
              })
          }
          if(i===children.length){
              menu[1].children.push(pathData)
          }
      })
  })
  console.log(menu)
  return menu
}
//路由跳转添加
function routerGo(to, next) {
  let routerJson = JSON.parse(window.localStorage.router)
  getRouter = filterAsyncRouter(routerJson) //过滤路由
  router.addRoutes(getRouter) //动态添加路由
  global.antRouter = getRouter[1].children //将路由数据传递给全局变量，做侧边栏菜单渲染工作
  console.log(getRouter[1].children)
  next({ ...to, replace: true })
}
//localStorage 保存组对象的方法
function saveObjArr(name, data) { //localStorage 存储数组对象的方法
  localStorage.setItem(name, JSON.stringify(data))
}
//localStorage 获取数组对象的方法
function getObjArr(name) { //localStorage 获取数组对象的方法
  return window.localStorage.getItem(name);
}
//过滤路由
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'home') {//Layout组件特殊处理
        route.component = home
      } else {
        // console.log(route.component)
        route.component = _import(route.component)
        // console.log(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

export default {//导出初始化路由的方法跟过滤路由的方法
    initRouter,filterAsyncRouter
}