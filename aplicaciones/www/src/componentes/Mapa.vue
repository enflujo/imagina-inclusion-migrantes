<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { type Map } from 'mapbox-gl';
import { ref, onMounted, type Ref, onUnmounted, watch } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import { colorMax, colorMedio, colorMin } from '@/cerebros/constantes';
import { storeToRefs } from 'pinia';
import Lista from '@/componentes/Lista.vue';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const mapa: Ref<Map | null> = ref(null);
const cerebroDatos = usarCerebroDatos();
const { geojson } = storeToRefs(cerebroDatos);

watch(geojson, () => {
  const instanciaMapa = mapa.value;
  if (!instanciaMapa) return;

  // Agregar datos para puntos
  instanciaMapa.on('load', () => {
    instanciaMapa.addSource('municipios', {
      type: 'geojson',
      data: geojson.value,
    });

    instanciaMapa.addLayer({
      id: 'capa-municipios',
      type: 'fill',
      source: 'municipios',
      paint: {
        'fill-color': {
          property: 'valorIndice',
          stops: [
            [25, colorMax],
            [50, colorMedio],
            [100, colorMin],
          ],
        },
      },
    });

    instanciaMapa.addLayer({
      id: 'línea',
      type: 'line',
      source: 'municipios',
      paint: {
        'line-color': '#fef6bc',
        'line-width': 0.2,
      },
    });

    const leyenda = new mapboxgl.Popup();

    instanciaMapa.on('click', 'capa-municipios', (evento) => {
      const lugar = evento.features?.[0];

      if (lugar && lugar.properties) {
        const { lat, lng } = evento.lngLat;
        const coords: [number, number] = [lng, lat];
        const indice = lugar.properties.valorIndice.toFixed(2) as number;

        const municipio = lugar.properties.nombre;
        const departamento = lugar.properties.dep;

        leyenda
          .setLngLat(coords)
          .setHTML(
            `<div id='leyenda'><p class="nombreMunicipio">${municipio} (${departamento})</p>` +
              '<span class="yanaina">Ranking de inclusión:</span> ' +
              indice +
              '</div>'
          )
          .addTo(instanciaMapa);
      }
    });
  });
});

onMounted(async () => {
  const instanciaMapa = new mapboxgl.Map({
    container: contenedorMapa.value as HTMLDivElement,
    style: 'mapbox://styles/enflujo/cltixf9jp000h01pfdd2oby94',
    center: [-73.1, 3],
    zoom: 4.4,
  });

  mapa.value = instanciaMapa;
});

onUnmounted(() => {
  mapa.value?.remove();
  mapa.value = null;
});
</script>

<template>
  <div id="contenedorGeneral">
    <section class="seccionLado" id="contenedorCajaMapa">
      <h2 class="tituloSeccion">Mapa de inclusión</h2>
      <div class="seccion" id="contenedorMapa" ref="contenedorMapa"></div>
    </section>

    <section id="columnaCentral">
      <Lista />
      <!--  <Comparacion /> -->
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '../estaticos/constantes';
#contenedorGeneral {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  margin-top: 2em;
  width: 75vw;

  #columnaCentral {
    margin-top: 2em;
    width: 75vw;
    height: auto;
  }
}

// $minTablet: 768px;
@media (min-width: $minTablet) {
  #contenedorGeneral {
    flex-direction: row;
    width: 70vw;
    #columnaCentral {
      height: 70vh;
      margin-top: 0em;
    }
  }
}

#contenedorCajaMapa {
  content-visibility: auto;
  overflow: hidden;
  padding: 0;

  h2 {
    z-index: 4;
    padding: 0 1.2em;
  }

  #contenedorMapa {
    height: 70vh;
  }
}
</style>
