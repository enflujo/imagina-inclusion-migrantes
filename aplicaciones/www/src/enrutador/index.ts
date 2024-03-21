import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '../paginas/Inicio.vue';

const enrutador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Inicio,
    },
    {
      path: '/sobre',
      name: 'sobre',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../paginas/Sobre.vue'),
    },
  ],
});

export default enrutador;
