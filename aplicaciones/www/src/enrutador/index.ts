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
      component: () => import('../paginas/Creditos.vue'),
    },
    {
      path: '/recursos',
      name: 'recursos',
      component: () => import('../paginas/Recursos.vue'),
    },
  ],
});

export default enrutador;
