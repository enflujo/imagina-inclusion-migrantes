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
    center: [-74.1810727, 4.316107698],
    zoom: 5,
  });

  instanciaMapa.on('load', () => {
    instanciaMapa.addSource('municipios', {
      type: 'geojson',
      data: cerebroDatos.geojson,
    });

    const zoomMax = 15;

    instanciaMapa.addLayer({
      id: 'municipios-areas',
      type: 'heatmap',
      source: 'municipios',
      maxzoom: zoomMax,

      paint: {
        'heatmap-weight': {
          property: 'ranking',
          type: 'exponential',
          stops: [
            [1, 0],
            [977, 1],
          ],
        },
        'heatmap-intensity': {
          stops: [
            [5, 0.1],
            [zoomMax, 0.4],
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
            [zoomMax, 70],
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
        'circle-color': 'yellow',
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
      },
    });

    instanciaMapa.on('click', 'municipios-puntos', (evento) => {
      const punto = evento.features?.[0] as Feature<Point>;

      if (punto && punto.properties) {
        const coords = punto.geometry.coordinates as [number, number];
        const ranking = punto.properties.ranking as number;
        const municipio = punto.properties.mun;
        const departamento = punto.properties.dep;
        //  console.log(punto);
        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(
            `<p class="nombreMunicipio">${municipio} (${departamento})</p>` +
              '<span class="yanaina">Ranking de inclusión:</span> ' +
              ranking
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
  <div id="contenedorMapa" ref="contenedorMapa"></div>
</template>

<style lang="scss" scoped>
#contenedorMapa {
  width: 80vw;
  height: 100vh;
  margin: auto;

  canvas {
    display: block;
    width: 580px;
    height: 580px;
    margin: auto;
  }
}
</style>
