import { createRouter, createWebHistory } from 'vue-router';
import Escaleras from '../paginas/Escaleras.vue';

const enrutador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Escaleras,
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
      path: '/recursos',
      name: 'recursos',
      component: () => import('../paginas/Recursos.vue'),
    },
    // {
    //   path: '/mapa',
    //   name: 'mapa',
    //   component: () => import('../paginas/Mapa.vue'),
    // },
  ],
});

export default enrutador;
