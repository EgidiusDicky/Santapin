import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import RegisterView from "../views/Register.vue";

// Halaman placeholder (sementara) untuk Menu, Pesanan, dan Keranjang
const DummyPage = {
  template: `
    <div style="padding: 2rem; text-align: center">
      <h2>Halaman ini masih dalam pengembangan.</h2>
    </div>
  `,
};

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/",
    redirect: "/login", // Default route diarahkan ke login
  },
  {
    path: "/menu",
    name: "Menu",
    component: DummyPage,
  },
  {
    path: "/pesanan",
    name: "Pesanan",
    component: DummyPage,
  },
  {
    path: "/keranjang",
    name: "Keranjang",
    component: DummyPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
