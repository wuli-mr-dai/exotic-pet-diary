import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '异宠日记', requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/pet/create',
    name: 'PetCreate',
    component: () => import('@/views/pet/Create.vue'),
    meta: { title: '添加宠物', requiresAuth: true }
  },
  {
    path: '/pet/list',
    name: 'PetList',
    component: () => import('@/views/pet/List.vue'),
    meta: { title: '我的宠物', requiresAuth: true }
  },
  {
    path: '/pet/:id',
    name: 'PetDetail',
    component: () => import('@/views/pet/Detail.vue'),
    meta: { title: '宠物详情', requiresAuth: true }
  },
  {
    path: '/pet/:id/edit',
    name: 'PetEdit',
    component: () => import('@/views/pet/Edit.vue'),
    meta: { title: '编辑宠物', requiresAuth: true }
  },
  {
    path: '/checkin',
    name: 'Checkin',
    component: () => import('@/views/checkin/Index.vue'),
    meta: { title: '打卡', requiresAuth: true }
  },
  {
    path: '/checkin/calendar',
    name: 'CheckinCalendar',
    component: () => import('@/views/checkin/Calendar.vue'),
    meta: { title: '打卡日历', requiresAuth: true }
  },
  {
    path: '/ai/chat',
    name: 'AiChat',
    component: () => import('@/views/ai/Chat.vue'),
    meta: { title: 'AI 养宠顾问', requiresAuth: true }
  },
  {
    path: '/ai/history',
    name: 'AiHistory',
    component: () => import('@/views/ai/History.vue'),
    meta: { title: '问答历史', requiresAuth: true }
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('@/views/album/Index.vue'),
    meta: { title: '成长相册', requiresAuth: true }
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: () => import('@/views/wiki/Index.vue'),
    meta: { title: '品种百科', requiresAuth: false }
  },
  {
    path: '/wiki/:id',
    name: 'WikiDetail',
    component: () => import('@/views/wiki/Detail.vue'),
    meta: { title: '品种详情', requiresAuth: false }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/member/Index.vue'),
    meta: { title: '会员中心', requiresAuth: true }
  },
  {
    path: '/poster/:petId',
    name: 'Poster',
    component: () => import('@/views/poster/Index.vue'),
    meta: { title: '成长海报', requiresAuth: true }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/mine/Index.vue'),
    meta: { title: '我的', requiresAuth: true }
  },
  {
    path: '/mine/settings',
    name: 'Settings',
    component: () => import('@/views/mine/Settings.vue'),
    meta: { title: '设置', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：需要登录的页面跳转到登录页
router.beforeEach((to, _from, next) => {
  // const auth = useAuthStore()
  // if (to.meta.requiresAuth && !auth.isLoggedIn) {
  //   next({ name: 'Login', query: { redirect: to.fullPath } })
  // } else {
  //   next()
  // }
   next()
})

export default router
