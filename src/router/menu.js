export default {
    data:{
        "router": [
            {
                path: '/',
                redirect: '/dashboard'
            },
            {
                path: '/',
                component: 'home',
                "children": [
                    {
                      "path": "/dashboard",
                      "component": "page/Dashboard",
                      icon: 'el-icon-lx-home',
                      index: 'dashboard',
                      title: '系统首页',
                      "meta": {
                        "title": "首页",
                      }
                    },
                    {
                      path: '/icon',
                      component: "page/Icon",
                      meta: { title: '自定义图标' },
                      icon: 'el-icon-lx-emoji',
                      index: 'icon',
                      title: '自定义图标'
                    },
                    {
                      path: '/table',
                      component: 'page/BaseTable',
                      icon: 'el-icon-lx-cascades',
                      index: 'table',
                      title: '基础表格',
                      meta: { title: '基础表格' }
                    },{
                        path: '/tabs',
                        component:'page/Tabs',
                        meta: { title: 'tab选项卡' },
                        icon: 'el-icon-lx-copy',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        path: '/form',
                        component: 'page/BaseForm',
                        meta: { title: '基本表单' },
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        // 富文本编辑器组件
                        path: '/editor',
                        component: 'page/VueEditor',
                        meta: { title: '富文本编辑器' }
                    },
                    {
                        // markdown组件
                        path: '/markdown',
                        component: 'page/Markdown',
                        meta: { title: 'markdown编辑器' }    
                    },
                    {
                        // 图片上传组件
                        path: '/upload',
                        component: 'page/Upload',
                        meta: { title: '文件上传' }   
                    },
                    {
                        // vue-schart组件
                        path: '/charts',
                        component: 'page/BaseCharts',
                        meta: { title: 'schart图表' },
                        icon: 'el-icon-pie-chart',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        // 拖拽列表组件
                        path: '/drag',
                        component: 'page/DragList',
                        meta: { title: '拖拽列表' }
                    },
                    {
                        // 拖拽Dialog组件
                        path: '/dialog',
                        component: 'page/DragDialog',
                        meta: { title: '拖拽弹框' },
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    },
                    {
                        // 国际化组件
                        path: '/i18n',
                        component: 'page/I18n',
                        meta: { title: '国际化' },
                        icon: 'el-icon-lx-global',
                        index: 'i18n',
                        title: '国际化功能'
                    },
                    {
                        // 权限页面
                        path: '/permission',
                        component: 'page/Permission',
                        meta: { title: '权限测试', permission: true },
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    },
                    {
                        path: '/404',
                        component:'page/404',
                        meta: { title: '404' }
                    },
                    {
                        path: '/403',
                        component: 'page/403',
                        meta: { title: '403' }
                    }
                  ]          
             }
        ]
    }
  }