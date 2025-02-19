import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import AllProducts from '@/components/AllProducts.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CartView from '@/views/CartView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import OrderView from '@/views/OrderView.vue'
import AdminView from '@/views/AdminView.vue'
import AdminProducts from '@/views/AdminProducts.vue'
import AdminOrders from '@/views/AdminOrders.vue'
import AdminUsers from '@/views/AdminUsers.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/products/', name: 'Products', component: AllProducts },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/register', component: RegisterView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cart', name: 'Cart', component: CartView },
  {
    path: '/admin',
    component: AdminView,
    children: [
      { path: 'products', component: AdminProducts },
      { path: 'users', component: AdminUsers },
      { path: 'orders', component: AdminOrders },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'Order',
    component: OrderView,
    meta: { requiresAuth: true },
  },
  { path: '/admin', name: 'Admin', component: AdminView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
