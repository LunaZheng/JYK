import Vue from 'vue'
import Router from 'vue-router'
import toPath from '@/components/toPath'
import test from '@/pages/test'
import test01 from '@/pages/test-01'
import index from '@/pages/index'
import login from '@/pages/login'
import register from '@/pages/register'
import cart from '@/pages/cart'
import printing from '@/pages/printing'
import creativeLife from '@/pages/creativeLife'
import productDetail from '@/pages/productDetail'
import printDetail from '@/pages/printDetail'
import goodsList from '@/pages/goodsList'
import album from '@/pages/album'
import pay from '@/pages/pay'
import toOrder from '@/pages/toOrder'
import edit from '@/pages/edit'
import page_404 from '@/pages/page_404'
import applyText from '@/pages/applyText'

import user from '@/pages/user'
import orderList from '@/pages/user/orderList'
import orderDetail from '@/pages/user/orderDetail'
import favorite from '@/pages/user/favorite'
import addAddress from '@/pages/user/addAddress'
import userInfo from '@/pages/user/userInfo'
import finished from '@/pages/user/finished'
import unfinished from '@/pages/user/unfinished'

Vue.use(Router)


/* 
  ******还原静态数据前*******
  --> 注释: requireAuth: true
            mode: 'history', // 路径去掉 #
 */

export default new Router({
  // mode: 'history', // 路径去掉 #
  routes: [
    { path: '*', component: page_404 }, // 404 页面
    {
      path: '/',
      redirect: '/index',
    }, {
      path: '/test',
      name: 'test', // name 不能缺 用于判定是否404页面
      component: test
    }, {
      path: '/test01',
      name: 'test01',
      component: test01
    }, {
      path: '/toPath',
      name: 'toPath',
      component: toPath
    }, {
      path: '/index',
      name: 'index',
      component: index
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/register',
      name: 'register',
      component: register
    }, {
      path: '/cart',
      name: 'cart',
      component: cart,
      meta: {
        // requireAuth: true,
      },
    }, {
      path: '/album',
      component: album,
      name: 'album',
      meta: {
        // requireAuth: true,
      },
    }, {
      path: '/pay',
      component: pay,
      name: 'pay',
      meta: {
        // requireAuth: true,
      },
    }, {
      path: '/applyText',
      component: applyText,
      name: 'applyText',
      meta: {
        // requireAuth: true,
      },
    }, {
      path: '/toOrder',
      component: toOrder,
      name: 'toOrder',
      meta: {
        // requireAuth: true,
      },
    }, {
      path: '/printing',
      name: 'printing',
      component: printing
    }, {
      path: '/creativeLife',
      name: 'creativeLife',
      component: creativeLife
    }, {
      path: '/edit',
      name: 'edit',
      component: edit,
      meta: {
        // requireAuth: true,
      },
    }, {
      path: '/productDetail',
      name: 'productDetail',
      component: productDetail
    }, {
      path: '/printDetail',
      name: 'printDetail',
      component: printDetail
    }, {
      path: '/goodsList',
      name: 'goodsList',
      component: goodsList
    }, {
      path: '/user',
      name: 'user',
      component: user,
      meta: {
        // requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [
        {
          path: 'orderList',
          name: 'orderList', 
          component: orderList,
          meta: {
            // requireAuth: true,
            // keepAlive: true, // 会被缓存  
          },
        },{
          path: 'orderDetail',
          name: 'orderDetail', 
          component: orderDetail,
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'finished',
          name: 'finished', 
          component: finished,
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'unfinished',
          name: 'unfinished', 
          component: unfinished,
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'album',
          name: 'my-album', 
          redirect: '/album',
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'cart',
          name: 'my-cart', 
          redirect: '/cart',
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'addAddress',
          name: 'addAddress', 
          component: addAddress,
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'favorite',
          name: 'favorite', 
          component: favorite,
          meta: {
            // requireAuth: true,
          },
        },{
          path: 'userInfo',
          name: 'userInfo', 
          component: userInfo,
          meta: {
            // requireAuth: true,
          },
        }
      ]
    }
  ]
})
