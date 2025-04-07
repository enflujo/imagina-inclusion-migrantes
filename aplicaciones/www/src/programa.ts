import './scss/estilos.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue/client';

import Aplicacion from './Aplicacion.vue';
import enrutador from './enrutador';

const aplicacion = createApp(Aplicacion);

aplicacion.use(createPinia());
aplicacion.use(enrutador);
aplicacion.use(createHead());

aplicacion.mount('#aplicacion');
