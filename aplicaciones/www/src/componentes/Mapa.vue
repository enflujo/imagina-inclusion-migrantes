<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { type Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson';
import { ref, onMounted, type Ref, onUnmounted } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import { Delaunay } from 'd3';
mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const contenedorCajaMapa: Ref<HTMLDivElement | null> = ref(null);
const mapa: Ref<Map | null> = ref(null);
const cerebroDatos = usarCerebroDatos();

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  const coordenadas: [lat: number, lon: number][] = [];

  let lonMin = -82.2020433;
  let lonMax = -66.8;
  let latMin = -4.2167;
  let latMax = 12.9365903;

  // Borrar datos repetidos
  const datosUnicos: any = cerebroDatos.geojson.features.filter((lugar, indice) => {
    return (
      indice ===
      cerebroDatos.geojson.features.findIndex(
        (registrado) =>
          lugar.geometry.coordinates[0] === registrado['geometry']['coordinates'][0] &&
          lugar['geometry']['coordinates'][1] === registrado['geometry']['coordinates'][1]
      )
    );
  });

  // Guardar coordenadas de los datos no repetidos
  for (let i = 0; i < datosUnicos.length; i++) {
    const coo = datosUnicos[i]['geometry']['coordinates'];

    coordenadas.push(coo);
  }

  const delaunay = Delaunay.from(coordenadas);
  const voronoi = delaunay.voronoi([lonMin, latMin, lonMax, latMax]);
  const geojson: FeatureCollection<Polygon> = { type: 'FeatureCollection', features: [] };

  coordenadas.forEach((d, i) => {
    const trazo = voronoi.cellPolygon(i);
    if (trazo) {
      const respuesta: Feature<Polygon> = {
        type: 'Feature',
        properties: datosUnicos[i].properties,
        geometry: { type: 'Polygon', coordinates: [trazo] },
      };

      if (!respuesta.properties) return;
      geojson.features[i] = respuesta;
    } else {
      console.log(d);
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
      data: cerebroDatos.geojson,
    });

    // Agregar datos para voronoi
    instanciaMapa.addSource('voronoi', {
      type: 'geojson',
      data: geojson,
    });

    // Pintar polígonos
    instanciaMapa.addLayer({
      id: 'voronoi-gononea',
      type: 'fill-extrusion',
      source: 'voronoi',
      paint: {
        'fill-extrusion-color': {
          property: 'indice',
          stops: [
            [0.1, '#c22f20'],
            [50, '#ff9800'],
            [100, '#80ffa1'],
          ],
        },

        'fill-extrusion-opacity': 0.6,

        //['get', 'altura'],
        'fill-extrusion-height': {
          property: 'indice',
          stops: [
            [0, 600000],
            [50, 30000],
            [100, 0],
          ],
        },
      },
    });

    // Borde de voronoi
    instanciaMapa.addLayer({
      id: 'borde',
      type: 'line',
      source: 'voronoi',
      paint: {
        'line-color': 'rgba(0, 0, 0, 0.3)',
        'line-width': 0,
      },
    });

    // instanciaMapa.addLayer({
    //   id: 'municipios-puntos',
    //   type: 'circle',
    //   source: 'municipios',
    //   minzoom: 5,

    //   paint: {
    //     'circle-radius': 3,
    //     'circle-color': {
    //       property: 'indice',
    //       stops: [
    //         [3, '#c22f20'],
    //         [50, '#ff9800'],
    //         [100, '#00ff00'],
    //       ],
    //     },

    //     'circle-stroke-color': 'black',
    //     'circle-stroke-width': 0,
    //   },
    // });

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
              '<span class="yanaina">Índice de inclusión:</span> ' +
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
    <h2>Mapa de inclusión</h2>
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
    height: calc(100% - 30px);
  }
}
</style>
