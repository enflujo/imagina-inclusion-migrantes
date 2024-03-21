<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { type Map } from 'mapbox-gl';
import type { Feature, Point } from 'geojson';
import { ref, onMounted, type Ref, onUnmounted } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const mapa: Ref<Map | null> = ref(null);
const cerebroDatos = usarCerebroDatos();

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  const instanciaMapa = new mapboxgl.Map({
    container: contenedorMapa.value as HTMLDivElement,
    style: 'mapbox://styles/enflujo/cltixf9jp000h01pfdd2oby94',
    center: [-71.5810727, 4.116107698],
    zoom: 4.3,
  });

  instanciaMapa.on('load', () => {
    instanciaMapa.addSource('municipios', {
      type: 'geojson',
      data: cerebroDatos.geojson,
    });

    const zoomMax = 8;

    instanciaMapa.addLayer({
      id: 'municipios-areas',
      type: 'heatmap',
      source: 'municipios',
      maxzoom: zoomMax,
      //https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
      paint: {
        'heatmap-weight': {
          property: 'indice',
          type: 'exponential',
          stops: [
            [1, 0],
            [100, 1],
          ],
        },
        'heatmap-intensity': {
          stops: [
            [5, 0.1],
            [zoomMax, 0],
          ],
        },
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(51,255,51,0)',
          0.2,
          'rgb(60,179,113)', //Verde
          0.6,
          'rgb(255,255,51)', //Amarillo
          1,
          'rgb(255,0,0)', //Rojo
        ],
        'heatmap-radius': {
          stops: [
            [5, 60],
            [zoomMax, 10],
          ],
        },
        'heatmap-opacity': {
          default: 0.8,
          stops: [
            [8, 1],
            [zoomMax, 0],
          ],
        },
      },
    });

    instanciaMapa.addLayer({
      id: 'municipios-puntos',
      type: 'circle',
      source: 'municipios',
      minzoom: 7,

      paint: {
        'circle-radius': 10,
        'circle-color': {
          property: 'indice',
          stops: [
            [0, 'rgb(255, 0, 0)'],
            [50, 'rgb(255, 223, 0)'],
            [100, 'rgb(20, 165, 63)'],
          ],
        },

        'circle-stroke-color': 'white',
        'circle-stroke-width': 0,
      },
    });

    instanciaMapa.on('click', 'municipios-puntos', (evento) => {
      const punto = evento.features?.[0] as Feature<Point>;
      console.log(punto);
      if (punto && punto.properties) {
        const coords = punto.geometry.coordinates as [number, number];
        const indice = punto.properties.indice.toFixed(2) as number;

        const municipio = punto.properties.mun;
        const departamento = punto.properties.dep;

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(
            `<p class="nombreMunicipio">${municipio} (${departamento})</p>` +
              '<span class="yanaina">Índice de inclusión:</span> ' +
              indice
          )
          .addTo(instanciaMapa);
      }
    });
  });

  mapa.value = instanciaMapa;
});

onUnmounted(() => {
  mapa.value?.remove();
  mapa.value = null;
});
</script>

<template>
  <section class="seccionLado">
    <h2>Mapa de inclusión</h2>
    <div id="contenedorMapa" ref="contenedorMapa"></div>
  </section>
</template>

<style lang="scss" scoped>
#contenedorMapa {
  height: calc(100% - 30px);
}
</style>
