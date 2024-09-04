import path from 'path'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'OTA' },
      component: () => import('@/views/home/layout.vue'),
      children: [
        {
          path: '',
          name: 'index',
          meta: { title: '首页' },
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/product',
          name: 'product',
          meta: { title: '产品管理' },
          component: () => import('@/views/product/product.vue')
        },
        {
          path: '/firmware',
          name: 'firmware',
          meta: { title: '固件管理' },
          component: () => import('@/views/firmware/firmware.vue'),
          children: [
            {
              path: ':id/:name',
              name: 'firmwareOfProduct',
              meta: { title: '' },
              component: () => import('@/views/firmware/child/firmwareDetail.vue')
            }
          ]
        },
        {
          path: '/other',
          name: 'other',
          meta: { title: '其他' },
          component: () => import('@/views/home/index.vue')
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name == "firmwareOfProduct") {
    to.meta.title = to.params.name
  }
  next();
});

export default router
