import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { DatosBuscador, DatosInclusion, Geo } from '../../../../tiposCompartidos/compartidos';
import { pedirDatos } from '@/utilidades/ayudas';
import type { Feature, FeatureCollection, Polygon, MultiPolygon, Point } from 'geojson';

interface EstructuraDatos {
  datos: Geo | null;
  datosA: DatosInclusion[];
  datosD: DatosInclusion[];
  datosABC: DatosInclusion[];
  datosBuscador: DatosBuscador[];
  geojson: FeatureCollection<Polygon | MultiPolygon, DatosInclusion>;
  cargados: boolean;
  lugaresSeleccionados: { id: number; nombre: string }[];
  limiteLugares: number;
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
    datos: null,
    datosA: [],
    datosD: [],
    datosABC: [],
    datosBuscador: [],
    geojson: { type: 'FeatureCollection', features: [] },
    cargados: false,
    lugaresSeleccionados: [],
    limiteLugares: 4,
  }),

  actions: {
    seleccionarLugar(lugar: { id: number; nombre: string }) {
      if (this.lugaresSeleccionados.length <= this.limiteLugares - 1) {
        if (!this.lugaresSeleccionados.includes(lugar)) {
          this.lugaresSeleccionados.push(lugar);
        }
      }
    },

    async cargarDatos() {
      this.datos = await pedirDatos<Geo>(`${import.meta.env.BASE_URL}/inclusion-municipios.json`);
      const lugares: DatosInclusion[] = []; //Feature<MultiPolygon>[] = [];

      this.datos.features.forEach((lugar) => {
        lugares.push({
          //type: 'Feature',
          //properties: {
          id: lugar.id ? +lugar.id : 0,
          valorRank: lugar.properties.valorRank,
          valorIndice: lugar.properties.valorIndice,
          poblacionTotal: lugar.properties.poblacionTotal,
          nombre: lugar.properties.nombre,
          dep: lugar.properties.dep,
          // },
          //geometry: { type: 'MultiPolygon', coordinates: [] },
        });
      });

      this.datosA = lugares; //[...this.datos.features.map((obj) => obj.properties)];

      // El problema es esta reorganizada. Colapsa.
      // this.datosD = [...this.datosA.reverse()];
      /*  this.datosABC = [
        ...this.datosA.sort((a, b) => {
          if (a.nombre < b.nombre) return -1;
          if (a.nombre > b.nombre) return 1;
          return 0;
        }),
      ];  */
      this.geojson = this.datos;
    },

    async cargarDatosBuscador() {
      const datos = await pedirDatos<DatosBuscador[]>(`${import.meta.env.BASE_URL}/buscador.json`);
      this.datosBuscador = datos;
    },
  },
});

const indicadores = [
  {
    nombre: 'Controles prenatales',
    slug: 'controles-prenatales',
    pregunta: '¿Cuantas mujeres Venezolanas se hacen 4 controles prenatales durante su embarazo?',
  },
];

export const usarCerebroEscalera = defineStore('escaleras', {
  state: () => ({
    indicadores,
  }),
});
