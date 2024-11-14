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
          path: '/device',
          name: 'device',
          meta: { title: '设备管理' },
          component: () => import('@/views/device/device.vue'),
          children: [
            {
              path: ':id/:name',
              name: 'deviceListOfProduct',
              meta: { title: 'name' },
              component: () => import('@/views/device/child/deviceDetail.vue'),
            }
          ]
        }, {
          path: '/production',
          name: 'production',
          meta: { title: '生产' },
          component: () => import('@/views/production/production.vue'),
          children: [
            {
              path: ':id',
              name: 'productionDetail',
              meta: { title: '' },
              component: () => import('@/views/production/child/productionDetail.vue'),
            }
          ]
        },
        {
          path: '/test',
          name: 'test',
          meta: { title: '测试' },
          component: () => import('@/views/home/test.vue')
        },
        {
          path: '/other',
          name: 'other',
          meta: { title: '其他' },
          component: () => import('@/views/home/index.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'manager',
      meta: 'OTA_MANAGE',
      component: () => import('@/views/admin/home/layout.vue'),
      children: [
        {
          path: '',
          name: 'adminIndex',
          meta: { title: '首页' },
          component: () => import('@/views/admin/home/index.vue')
        },
        {
          path: 'product',
          name: 'adminProduct',
          meta: { title: '产品管理' },
          component: () => import('@/views/admin/product/product.vue'),
          children: [
            {
              path: 'instruction',
              name: 'productDetailInstruction',
              meta: { title: '产品权限说明' },
              component: () => import('@/views/admin/product/child/Instructions.vue')
            },
            {
              path: 'pm/:id',
              name: 'productDetailMakePm',
              meta: { title: '设置项目PM' },
              component: () => import('@/views/admin/product/child/makePm.vue')
            },
            {
              path: ':id',
              name: 'productDetailManager',
              meta: { title: '设置项目负责人' },
              component: () => import('@/views/admin/product/child/makeManager.vue')
            },
            {
              path: ':id',
              name: 'productDetailDeveloper',
              meta: { title: '设置项目开发者' },
              component: () => import('@/views/admin/product/child/makeDeveloper.vue')
            },
          ]
        },
        {
          path: 'administrator',
          name: 'administrator',
          meta: { title: '设置管理员' },
          component: () => import('@/views/admin/administrator/administrator.vue')
        },
        {
          path: 'production_member',
          name: 'productionMember',
          meta: { title: '生产团队' },
          component: () => import('@/views/admin/produtionMember/productionMember.vue')
        }
      ]
    },
    {
      path: '/login',
      nameL: 'login',
      component: () => import('@/views/login/feishuAuth/index.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name == "firmwareOfProduct") {
    to.meta.title = to.params.name
  }
  next();
});

export default router
