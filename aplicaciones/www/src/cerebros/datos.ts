import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { DatosInclusion } from 'tipos/compartidos';
import { pedirDatos } from '@/utilidades/ayudas';
import type { Feature, FeatureCollection, Point } from 'geojson';

interface EstructuraDatos {
  datos: DatosInclusion[];
  geojson: FeatureCollection<Point>;
  cargados: boolean;
  lugaresSeleccionados: { id: number; nombre: string }[];
}

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export const usarCerebroDatos = defineStore('datos', {
  state: (): EstructuraDatos => ({
    datos: [],
    geojson: { type: 'FeatureCollection', features: [] },
    cargados: false,
    lugaresSeleccionados: [],
  }),

  getters: {},

  actions: {
    async cargarDatos() {
      const datos = await pedirDatos<DatosInclusion[]>('/inclusion-municipios.json');
      const lugares: Feature<Point>[] = [];

      datos.forEach((lugar, i) => {
        lugar.id = i;
        lugares.push({
          type: 'Feature',
          properties: {
            ranking: lugar.valorRank,
            indice: lugar.valorIndice,
            poblacion: lugar.poblacionTotal,
            mun: lugar.nombre,
            dep: lugar.dep,
          },
          geometry: { type: 'Point', coordinates: [lugar.longitud, lugar.latitud] },
        });
      });

      this.datos = datos;
      this.geojson.features = lugares;
    },
  },
});
