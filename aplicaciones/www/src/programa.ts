import './estaticos/estilos.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Aplicacion from './Aplicacion.vue';
import enrutador from './enrutador';

const aplicacion = createApp(Aplicacion);

aplicacion.use(createPinia());
aplicacion.use(enrutador);

aplicacion.mount('#aplicacion');
