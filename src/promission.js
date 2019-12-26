import router from './router'
// import { Message } from 'element-ui'
import axios from 'axios'
const _import = require('./router/_import_' + process.env.NODE_ENV) //获取组件的方法
import Layout from '@/views/layout' //Layout 是架构组件，不在后台返回，在文件里单独引入


var getRouter //用来获取后台拿到的路由

// 假装fakeRouter是通过后台接口请求回来的数据
let fakeRouter = {
  "router":
    [
      // {
      //   "path": "",
      //   "component": "Layout",
      //   "redirect": "dashboard",
      //   "children": [
      //     {
      //       "path": "dashboard",
      //       "component": "dashboard/index",
      //       "meta": { "title": "首页", "icon": "dashboard" }
      //     }
      //   ]
      // },
      // {
      //   "path": "/example",
      //   "component": "Layout",
      //   "redirect": "/example/table",
      //   "name": "Example",
      //   "meta": {
      //     "title": "案例",
      //     "icon": "example"
      //   },
      //   "children": [
      //     {
      //       "path": "table",
      //       "name": "Table",
      //       "component": "table/index",
      //       "meta": {
      //         "title": "表格",
      //         "icon": "table"
      //       }
      //     },
      //     {
      //       "path": "tree",
      //       "name": "Tree",
      //       "component": "tree/index",
      //       "meta": {
      //         "title": "树形菜单",
      //         "icon": "tree"
      //       }
      //     }
      //   ]
      // },
      {
        "path": "",
        "component": "Layout",
        "redirect": "admin/games/list",
        "name": "Example",
        "meta": {
          "title": "菜单管理",
          "icon": "example"
        },
        "children": [
          {
            "path": "admin/games/list",
            "name": "Table",
            "component": "admin/games/list",
            "meta": {
              "title": "游戏管理",
              "icon": "table"
            }
          },
          {
            "path": "admin/gametype/list",
            "name": "Treae",
            "component": "admin/gametype/list",
            "meta": {
              "title": "菜单管理",
              "icon": "tree"
            }
          },
          {
            "path": "admin/systemmenu/list",
            "name": "Tree",
            "component": "admin/systemmenu/list",
            "meta": {
              "title": "系统菜单",
              "icon": "tree"
            }
          },
          {
            "path": "admin/systemmenu/list1",
            "name": "Tr24ree",
            "component": "admin/systemmenu/list1",
            "meta": {
              "title": "系统菜单1",
              "icon": "tree"
            }
          }
        ]
      },
      // {
      //   "path": "/form",
      //   "component": "Layout",
      //   "children": [{
      //     "path": "index",
      //     "name": "Form",
      //     "component": "form/index",
      //     "meta": {
      //       "title": "表单",
      //       "icon": "form"
      //     }
      //   }]
      // },
      // {
      //   "path": "*",
      //   "redirect": "/404",
      //   "hidden": true
      // }
    ]

}


router.beforeEach((to, from, next) => {
  console.log(getRouter)
  if (!getRouter) { //不加这个判断，路由会陷入死循环
    if (!getObjArr('router')) {
      // 下面的url换成自己的接口，后台返回json。需要我们拼装成作者定义的路由规则
      axios.get('http://apis.redtest.zhazhapay.com/admin/systemmenu/list').then(res => {
        var new_router = []
        let menus = res.data.data;
        for (let i = 0, len = menus.length; i < len; i++) {
          let parentMenu = {
            "path": "",
            "component": "Layout",
            "name": "admin",
            "meta": {
              "title": menus[i].columnName,
              "icon": "example"
            },
            children: []
          };
          for (let j = 0, leng = menus[i].childrens.length; j < leng; j++) {
            let chilMenu = {
              path: menus[i].childrens[j].tUrl,
              component: menus[i].childrens[j].tUrl,
              "meta": {
                "title": menus[i].childrens[j].columnName,
                "icon": ''
              }
            }
            parentMenu.children.push(chilMenu)//二级菜单
          }
          new_router.push(parentMenu);
        }
        // getRouter = fakeRouter.router//本地写死测试路由
        getRouter = new_router//真实后台json转换后的路由
        console.log(getRouter)

        saveObjArr('router', getRouter) //存储路由到localStorage

        routerGo(to, next) //执行路由跳转方法
      });
    } else { //从localStorage拿到了路由
      getRouter = getObjArr('router') //拿到路由
      console.log(getRouter)
      routerGo(to, next)
    }
  } else {
    next()
  }

})

function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) //过滤路由
  router.addRoutes(getRouter) //动态添加路由
  global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
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
      if (route.component === 'Layout') { //Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
