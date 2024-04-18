<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { type Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson';
import { ref, onMounted, type Ref, onUnmounted } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import * as alquimia from '@enflujo/alquimia';
import * as d3 from 'd3';
import { escalaColores, escalaCoordenadas } from '@enflujo/alquimia';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const mapa: Ref<Map | null> = ref(null);
const cerebroDatos = usarCerebroDatos();

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  const coordenadas: [lat: number, lon: number][] = [];
  let lonMin = Infinity;
  let lonMax = -Infinity;
  let latMin = Infinity;
  let latMax = -Infinity;

  // Borrar datos repetidos
  const datosUnicos: any = cerebroDatos.geojson.features.filter((lugar, indice) => {
    return (
      indice ===
      cerebroDatos.geojson.features.findIndex(
        (registrado) =>
          lugar['geometry']['coordinates'][0] === registrado['geometry']['coordinates'][0] &&
          lugar['geometry']['coordinates'][1] === registrado['geometry']['coordinates'][1]
      )
    );
  });

  // Guardar coordenadas de los datos no repetidos
  for (let i = 0; i < datosUnicos.length; i++) {
    const coo = datosUnicos[i]['geometry']['coordinates'];
    lonMin = Math.min(lonMin, coo[0]);
    lonMax = Math.max(lonMax, coo[0]);
    latMin = Math.min(latMin, coo[1]);
    latMax = Math.max(latMax, coo[1]);
    coordenadas.push(coo);
  }

  const delaunay = d3.Delaunay.from(coordenadas);
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
      geojson.features[i] = respuesta;
    } else {
      console.log(d);
    }
  });

  const instanciaMapa = new mapboxgl.Map({
    container: contenedorMapa.value as HTMLDivElement,
    style: 'mapbox://styles/enflujo/cltixf9jp000h01pfdd2oby94',
    center: [-71.5810727, 4.116107698],
    zoom: 4.3,
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
      type: 'fill',
      source: 'voronoi',
      paint: {
        'fill-color': {
          property: 'indice',
          stops: [
            [0.1, '#c22f20'],
            [50, '#ff9800'],
            [100, '#fef6bc'],
          ],
        },

        'fill-opacity': 0.5,
      },
    });

    // Borde de voronoi
    instanciaMapa.addLayer({
      id: 'borde',
      type: 'line',
      source: 'voronoi',
      paint: {
        'line-color': 'rgba(0, 0, 0, 0.3)',
        'line-width': 1,
      },
    });

    // instanciaMapa.addLayer(
    //   {
    //     id: 'municipios-areas',
    //     type: 'heatmap',
    //     source: 'municipios',
    //     maxzoom: zoomMax,
    //     //https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
    //     //  paint:
    //     paint: {
    //       // Increase the heatmap weight based on frequency and property magnitude
    //       'heatmap-weight': ['interpolate', ['linear'], ['get', 'indice'], 0, 0, 100, 1],
    //       // Increase the heatmap color weight weight by zoom level
    //       // heatmap-intensity is a multiplier on top of heatmap-weight
    //       'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
    //       // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    //       // Begin color ramp at 0-stop with a 0-transparancy color
    //       // to create a blur-like effect.
    //       'heatmap-color': [
    //         'interpolate',
    //         ['linear'],
    //         ['heatmap-density'],
    //         0,
    //         'rgba(0,0,0,0)',
    //         0.1,
    //         'rgba(194, 47, 32, 1)',
    //         0.5,
    //         '#ff9800',
    //         1,
    //         '#fef6bc',
    //       ],
    //       // Adjust the heatmap radius by zoom level
    //       'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
    //       // Transition from heatmap to circle layer by zoom level
    //       'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
    //     },
    //   }

    //   // {
    //   //   'heatmap-weight': {
    //   //     property: 'indice',
    //   //     type: 'exponential',
    //   //     stops: [
    //   //       [1, 0],
    //   //       [100, 1],
    //   //     ],
    //   //   },
    //   //   'heatmap-intensity': {
    //   //     stops: [
    //   //       [5, 0.1],
    //   //       [zoomMax, 0],
    //   //     ],
    //   //   },
    //   //   'heatmap-color': [
    //   //     'interpolate',
    //   //     ['linear'],
    //   //     ['heatmap-density'],
    //   //     0,
    //   //     'rgba(51,255,51,0)',
    //   //     0.2,
    //   //     'rgb(60,179,113)', //Verde
    //   //     0.6,
    //   //     'rgb(255,255,51)', //Amarillo
    //   //     1,
    //   //     'rgb(255,0,0)', //Rojo
    //   //   ],
    //   //   'heatmap-radius': {
    //   //     stops: [
    //   //       [8, 50],
    //   //       [zoomMax, 5],
    //   //     ],
    //   //   },
    //   //   'heatmap-opacity': {
    //   //     default: 0.8,
    //   //     stops: [
    //   //       [7, 1],
    //   //       [zoomMax, 0],
    //   //     ],
    //   //   },
    //   // },
    //   //  }
    // );

    instanciaMapa.addLayer({
      id: 'municipios-puntos',
      type: 'circle',
      source: 'municipios',
      minzoom: 5,

      paint: {
        'circle-radius': 3,
        'circle-color': {
          property: 'indice',
          stops: [
            [3, '#c22f20'],
            [50, '#ff9800'],
            [100, '#fef6bc'],
          ],
        },

        'circle-stroke-color': 'black',
        'circle-stroke-width': 0,
      },
    });

    let leyenda: mapboxgl.Popup;

    instanciaMapa.on('click', 'municipios-puntos', (evento) => {
      const punto = evento.features?.[0] as Feature<Point>;
      // console.log(punto);
      if (punto && punto.properties) {
        const coords = punto.geometry.coordinates as [number, number];
        const indice = punto.properties.indice.toFixed(2) as number;

        const municipio = punto.properties.mun;
        const departamento = punto.properties.dep;

        new mapboxgl.Popup()
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
