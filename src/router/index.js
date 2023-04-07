import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main'
import Home from '@/views/Home'
import Menu from '@/views/Menu'
import Shopbag from '@/views/Shopbag'
import User from '@/views/User'

// 账号密码：
// 1、13101425321---hyt123123
// 2、13799418676---hyt123123




Vue.use(VueRouter)

const routes = [
  //  一级路由
  {
    path: "/main",
    name: "Main",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("../views/Menu.vue"),
      },
      {
        path: "shopbag",
        name: "Shopbag",
        component: () => import("../views/Shopbag.vue"),
      },
      {
        path: "user",
        name: "User",
        component: () => import("../views/User.vue"),
      },
      
    ]
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: () => import("../views/Forgot.vue"),
  },
  
  {
      path: "/detail/:pid",
      name: "Detail",
      component: () => import("../views/Detail.vue"),
  },
  {
    path: "/pay",
    name: "Pay",
    component: () => import("../views/Pay.vue"),
},
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
// 我的界面跳转路由
{
  path: "/account",
  name: "Account",
  component: () => import("../views/Account.vue"),
},
{
  path: "/address",
  name: "Address",
  component: () => import("../views/Address.vue"),
},
{
  path: "/newaddress",
  name: "NewAddress",
  component: () => import("../views/NewAddress.vue"),
},
{
  path: "/like",
  name: "Like",
  component: () => import("../views/Like.vue"),
},
{
  path: "/order",
  name: "Order",
  component: () => import("../views/Order.vue"),
},
{
  path: "/secure",
  name: "Secure",
  component: () => import("../views/Secure.vue"),
},
{
  path: "/track",
  name: "Track",
  component: () => import("../views/Track.vue"),
},

  //  路由重定向，设置进入页面默认为home
{
  path: "*",
  redirect: {
    name: "Home"
  }
}

]

const router = new VueRouter({
  routes
})

export default router
