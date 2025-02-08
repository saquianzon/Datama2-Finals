import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Hero.vue';
import Menu from '../components/Menu.vue';
import Orders from '../components/Orders.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/hero', component: Home },
  { path: '/menu', component: Menu },
  { path: '/orders', component: Orders },
  { path: '/register', component: Register },
  { path: '/login', component: Login }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
