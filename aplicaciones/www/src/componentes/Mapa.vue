<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { type Map } from 'mapbox-gl';
import { ref, onMounted, type Ref, onUnmounted, watch } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import { colorMax, colorMax2, colorMedio, colorMedio2, colorMin, colorMin2 } from '@/cerebros/constantes';
import { storeToRefs } from 'pinia';
import Lista from '@/componentes/Lista.vue';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const mapa: Ref<Map | null> = ref(null);
const cerebroDatos = usarCerebroDatos();
const mapaCreado = ref(false);
const { geojson } = storeToRefs(cerebroDatos);

watch(geojson, (datos) => {
  if (!datos) return;

  if (mapaCreado.value) {
    mapa.value?.remove();
    mapa.value = null;
    cargarMapa();
    console.log('recreando mapa');
  }
});

onMounted(async () => {
  cargarMapa();
});

onUnmounted(() => {
  mapa.value?.remove();
  mapa.value = null;
});

function cargarMapa() {
  const instanciaMapa = new mapboxgl.Map({
    container: contenedorMapa.value as HTMLDivElement,
    style: 'mapbox://styles/enflujo/cltixf9jp000h01pfdd2oby94',
    center: [-73.1, 3],
    zoom: 4.4,
  });

  mapa.value = instanciaMapa;

  // Agregar datos para puntos
  instanciaMapa.on('load', () => {
    instanciaMapa.addSource('municipios', {
      type: 'geojson',
      data: geojson.value,
    });

    instanciaMapa.addLayer({
      id: 'capa-base',
      type: 'fill',
      source: 'municipios',
      paint: {
        'fill-color': {
          property: 'valorIndice',
          stops: [
            [25, colorMax2],
            [50, colorMedio2],
            [100, colorMin2],
          ],
        },
      },
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
    leyenda.addTo(instanciaMapa);

    instanciaMapa.on('mouseenter', 'capa-municipios', () => {
      leyenda.addTo(instanciaMapa);
      instanciaMapa.getCanvas().style.cursor = 'pointer';
    });

    instanciaMapa.on('mouseleave', 'capa-municipios', () => {
      leyenda.remove();
    });

    instanciaMapa.on('mousemove', 'capa-municipios', (evento) => {
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
              '<span class="infoLeyenda">Tasa de afiliación:</span> ' +
              indice +
              '</div>'
          );
      }
    });

    mapaCreado.value = true;
  });
}
</script>

<template>
  <div id="contenedorGeneral">
    <section class="seccionLado" id="contenedorCajaMapa">
      <div class="seccion" id="contenedorMapa" ref="contenedorMapa"></div>
    </section>

    <section id="columnaCentral">
      <Lista :mapa="mapa" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss/constantes' as *;

#contenedorGeneral {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  margin-top: 2em;
  width: 75vw;

  #columnaCentral {
    margin-top: 2em;
    width: 50vw;
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
