import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login/:name',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('./views/Detail.vue')
    },
    {
      path: '/write/:type',
      name: 'write',
      component: () => import('./views/Write.vue')
    },
    {
      path: '/manageTag',
      name: 'manageTag',
      component: () => import('./views/ManageTag.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('./views/Setting.vue')
    },
		{
			name: 'NotMatch',
			path: '*',
			component: () => import('./views/404.vue'),
		}
  ]
});

router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

  const nextRoute = ['detail','index','manageTag','setting','write'];
  console.log(store.state.isLogin);
  let isLogin = store.state.isLogin;
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.name) >= 0 && !isLogin) {
      next({
          path: '/login/login',
          replace: true
      })
  }else{
      next();
  }
  // 已登录状态；当路由到login时，跳转至home
  if (to.name === 'login') {
    if (isLogin) {
        console.log('已登录');
        router.push({ path: '/' });
    }
  }
});

export default router;
