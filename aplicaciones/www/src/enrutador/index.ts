import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '../paginas/Inicio.vue';

const enrutador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio,
    },
    {
      path: '/creditos',
      name: 'creditos',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../paginas/Creditos.vue'),
    },
    {
      path: '/escaleras',
      name: 'escaleras',
      component: () => import('../paginas/Escaleras.vue'),
    },
  ],
});

export default enrutador;
