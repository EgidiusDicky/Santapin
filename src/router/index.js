import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import AdminLayout from '../layouts/AdminLayout.vue'

// Views
import AdminLogin     from '../views/AdminLogin.vue';
import AdminDashboard from '../views/AdminDashboard.vue'
import ManageMenu     from '../views/ManageMenu.vue'
import ViewOrder      from '../views/ViewOrder.vue'
import Feedback       from '../views/Feedback.vue'

import Home           from '../views/Home.vue';
import Menu           from '../views/Menu.vue';
import Orders         from '../views/Orders.vue';
import Login          from '../views/Login.vue';
import Register       from '../views/Register.vue';
import Cart           from '../views/Cart.vue';
import Checkout       from '../views/Checkout.vue';
import OrdersTracking from '../views/OrdersTracking.vue';
import Receipt        from '../views/Receipt.vue';
import MenuDetail     from '../views/MenuDetail.vue';
import About          from '../views/About.vue'

const routes = [
  { path: '/',                    name: 'Home',           component: Home },
  { path: '/menu',                name: 'Menu',           component: Menu },
  { path: '/orders',              name: 'Orders',         component: Orders },
  { path: '/login',               name: 'Login',          component: Login },
  { path: '/register',            name: 'Register',       component: Register },
  { path: '/cart',                name: 'Cart',           component: Cart },
  { path: '/checkout',            name: 'Checkout',       component: Checkout },
  { path: '/orders-tracking/:id', name: 'OrdersTracking', component: OrdersTracking },
  { path: '/receipt',             name: 'Receipt',        component: Receipt },
  { path: '/menu/:id',            name: 'MenuDetail',     component: MenuDetail },
  { path: '/admin-login',         name: 'AdminLogin',     component: AdminLogin },
  { path: '/about',               name: 'About',          component: About },

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'manage-menu', component: ManageMenu },
      { path: 'view-order', component: ViewOrder },
      { path: 'feedback', component: Feedback },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'

  // protect routes that start with '/admin' AND are not '/admin-login'
  if (to.path.startsWith('/admin') && to.path !== '/admin-login') {
    if (isAdminLoggedIn) {
      next()
    } else {
      next('/admin-login')
    }
  } else {
    next()
  }
})

export default router;