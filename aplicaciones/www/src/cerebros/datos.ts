import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { DatosBuscador, DatosInclusion, Geo } from '../../../../tiposCompartidos/compartidos';
import { pedirDatos } from '@/utilidades/ayudas';
import type { Feature, FeatureCollection, Polygon, MultiPolygon, Point } from 'geojson';

interface EstructuraDatos {
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
    datosA: [],
    datosD: [],
    datosABC: [],
    datosBuscador: [],
    geojson: { type: 'FeatureCollection', features: [] },
    cargados: false,
    lugaresSeleccionados: [],
    limiteLugares: 5,
  }),

  actions: {
    seleccionarLugar(lugar: { id: number; nombre: string }) {
      if (this.lugaresSeleccionados.length <= this.limiteLugares - 1) {
        if (!this.lugaresSeleccionados.includes(lugar)) {
          if (this.lugaresSeleccionados.length < 4) {
            this.lugaresSeleccionados.push(lugar);
          } else {
            this.lugaresSeleccionados.shift();
            this.lugaresSeleccionados.push(lugar);
          }
        }
      }
    },

    async cargarDatos() {
      const datos = await pedirDatos<Geo>(`${import.meta.env.BASE_URL}/inclusion-municipios.json`);
      const lugares: DatosInclusion[] = [];
      datos.features.forEach((lugar) => {
        lugares.push({
          id: lugar.properties.id ? +lugar.properties.id : 0,
          valorRank: lugar.properties.valorRank,
          valorIndice: lugar.properties.valorIndice,
          poblacionTotal: lugar.properties.poblacionTotal,
          nombre: lugar.properties.nombre,
          dep: lugar.properties.dep,
        });
      });

      this.datosA = [...lugares];
      this.datosD = [...lugares.reverse()];
      this.datosABC = [
        ...lugares.sort((a, b) => {
          if (a.nombre < b.nombre) return -1;
          if (a.nombre > b.nombre) return 1;
          return 0;
        }),
      ];
      this.geojson = datos;
      this.cargados = true;
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
