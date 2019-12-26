import router from './router'
const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
import home from '@/components/common/Home.vue' //Layout 是架构组件，不在后台返回，在文件里单独引入
import menu from '@/router/menu.js'

var getRouter //用来获取后台拿到的路由
console.log(getRouter)
router.beforeEach((to, from, next) => {
  if (!getRouter) {//不加这个判断，路由会陷入死循环
    // if (!getObjArr('router')) {
      // axios.get('https://www.easy-mock.com/mock/5a5da330d9b48c260cb42ca8/example/antrouter').then(res => {
      getRouter = menu.data.router//后台拿到路由
      saveObjArr('router', getRouter) //存储路由到localStorage
      // console.log(getRouter)
      routerGo(to, next)//执行路由跳转方法
  } else {
    next()
  }

})


function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) //过滤路由
  // console.log(getRouter)
  router.addRoutes(getRouter) //动态添加路由
  global.antRouter = getRouter[1].children //将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({ ...to, replace: true })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
  localStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) { //localStorage 获取数组对象的方法
  return JSON.parse(window.localStorage.getItem(name));
}

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
