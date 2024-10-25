<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { type Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, GeoJsonProperties, Point, Polygon, Position } from 'geojson';
import { ref, onMounted, type Ref, onUnmounted } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import { Delaunay } from 'd3';
import { colorMax, colorMedio, colorMin } from '@/cerebros/constantes';
import { pedirDatos } from '@/utilidades/ayudas';
mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const mapa: Ref<Map | null> = ref(null);
const cerebroDatos = usarCerebroDatos();

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  const coordenadas: [x: number, y: number][] = [];
  const propiedades: GeoJsonProperties = [];
  const lonMin = -82.2020433;
  const lonMax = -66.8;
  const latMin = -4.2167;
  const latMax = 12.9365903;

  // Borrar datos repetidos
  cerebroDatos.geojson.features.forEach((lugar, i) => {
    if (
      i ===
      cerebroDatos.geojson.features.findIndex(
        (registrado) =>
          lugar.geometry.coordinates[0] === registrado.geometry.coordinates[0] &&
          lugar.geometry.coordinates[1] === registrado.geometry.coordinates[1]
      )
    ) {
      const [x, y] = lugar.geometry.coordinates;
      coordenadas.push([x, y]);
      propiedades[i] = lugar.properties;
    }
  });

  const municipios = await pedirDatos<FeatureCollection>('https://enflujo.com/bodega/colombia/municipios.json');

  const delaunay = Delaunay.from(coordenadas);
  const voronoi = delaunay.voronoi([lonMin, latMin, lonMax, latMax]);
  const geojson: FeatureCollection<Polygon> = { type: 'FeatureCollection', features: [] };

  coordenadas.forEach((d, i) => {
    const trazo = voronoi.cellPolygon(i);

    if (trazo) {
      const respuesta: Feature<Polygon> = {
        type: 'Feature',
        properties: propiedades[i],
        geometry: { type: 'Polygon', coordinates: [trazo] },
      };

      if (!respuesta.properties) return;

      geojson.features.push(respuesta);
    } else {
      // console.log(d);
    }
  });

  const instanciaMapa = new mapboxgl.Map({
    container: contenedorMapa.value as HTMLDivElement,
    style: 'mapbox://styles/enflujo/cltixf9jp000h01pfdd2oby94',
    center: [-74.5810727, 4.116107698],
    zoom: 4.3,
    pitch: 60,
    bearing: 2,
  });

  // Agregar datos para puntos
  instanciaMapa.on('load', () => {
    instanciaMapa.addSource('municipios', {
      type: 'geojson',
      data: municipios, //cerebroDatos.geojson,
    });

    // Agregar datos para voronoi
    instanciaMapa.addSource('voronoi', {
      type: 'geojson',
      data: geojson,
    });

    instanciaMapa.addLayer({
      id: 'capa-municipios',
      type: 'fill',
      source: 'municipios',
      paint: {
        'fill-color': {
          property: 'indice',
          stops: [
            [25, colorMax],
            [50, colorMedio],
            [100, colorMin],
          ],
        },
      },
    });

    // Pintar polígonos
    /*    instanciaMapa.addLayer({
      id: 'voronoi-gononea',
      type: 'fill-extrusion',
      source: 'voronoi',
      paint: {
        'fill-extrusion-color': {
          property: 'indice',
          stops: [
            [25, colorMax],
            [50, colorMedio],
            [100, colorMin],
          ],
        },

        'fill-extrusion-opacity': 0.6,

        'fill-extrusion-height': {
          property: 'indice',
          stops: [
            [1, 600000],
            [5, 30000],
            [10, 0],
          ],
        },
      },
    }); */

    const leyenda = new mapboxgl.Popup();

    instanciaMapa.on('click', 'voronoi-gononea', (evento) => {
      const lugar = evento.features?.[0];

      if (lugar && lugar.properties) {
        const { lat, lng } = evento.lngLat;
        const coords: [number, number] = [lng, lat];
        const indice = lugar.properties.indice.toFixed(2) as number;

        const municipio = lugar.properties.mun;
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
  mapa.value = instanciaMapa;
});

onUnmounted(() => {
  mapa.value?.remove();
  mapa.value = null;
});
</script>

<template>
  <section class="seccionLado" id="contenedorCajaMapa">
    <h2 class="tituloSeccion">Mapa de inclusión</h2>
    <div class="seccion" id="contenedorMapa" ref="contenedorMapa"></div>
  </section>
</template>

<style lang="scss" scoped>
#contenedorCajaMapa {
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
