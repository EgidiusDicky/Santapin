import { createRouter, createWebHistory } from 'vue-router';

import Home           from '../views/Home.vue';
import Menu           from '../views/Menu.vue';
import Orders         from '../views/Orders.vue';
import Login          from '../views/Login.vue';
import Register       from '../views/Register.vue';
import Cart           from '../views/Cart.vue';
import Checkout       from '../views/Checkout.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  { path: '/',         name: 'Home',           component: Home },
  { path: '/menu',     name: 'Menu',           component: Menu },
  { path: '/menu/:id', name: 'MenuDetail',     component: () => import('../views/MenuDetail.vue')},
  { path: '/orders',   name: 'Orders',         component: Orders },
  { path: '/login',    name: 'Login',          component: Login },
  { path: '/register', name: 'Register',       component: Register },
  { path: '/cart',     name: 'Cart',           component: Cart },
  { path: '/checkout', name: 'Checkout',       component: Checkout },
  { path: '/admin',    name: 'AdminDashboard', component: AdminDashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;