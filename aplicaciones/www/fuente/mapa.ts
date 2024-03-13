import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
//import type { GeoJSONSource, Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

export default async function mapa() {
  const datos = await fetch('/inclusion-municipios.json').then((res) => res.json());
  const datos2 = await fetch('/trees.geojson').then((res) => res.json());
  console.log(datos);
  console.log(datos2);
  //let mapaCreado = false;
  //let mapaCargado = false;
  const geoJson: FeatureCollection = { type: 'FeatureCollection', features: [] };
  datos.forEach((lugar) => {
    // "type":"FeatureCollection","features":[{"type":"Feature","properties":{"dbh":0},"geometry":{"type":"Point","coordinates":[-79.91746,40.44356]}}
    geoJson.features.push({
      type: 'Feature',
      properties: { ranking: lugar.valor, poblacion: lugar.poblacionTotal },
      geometry: { type: 'Point', coordinates: [lugar.longitud, lugar.latitud] },
    });
  });
  console.log(geoJson);
  let map: Map;
  const contenedorMapa = document.getElementById('contenedorMapa') as HTMLDivElement;
  const estilo = 'mapbox://styles/enflujo/cltixf9jp000h01pfdd2oby94';
  mapboxgl.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  map = new mapboxgl.Map({
    container: contenedorMapa,
    style: estilo,
    center: [-74.1810727, 4.316107698],
    zoom: 5,
  });

  map.on('load', () => {
    map.addSource('municipios', {
      type: 'geojson',
      data: geoJson,
    });

    map.addLayer(
      {
        id: 'municipios-heat',
        type: 'heatmap',
        source: 'municipios',
        maxzoom: 15,
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
              [1, 2],
              [977, 1],
            ],
          },
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(236,222,239,0)',
            0.2,
            'rgb(208,209,230)',
            0.4,
            'rgb(166,189,219)',
            0.8,
            'rgb(28,144,153)',
          ],
          'heatmap-radius': {
            stops: [
              [11, 35],
              [977, 2],
            ],
          },
          'heatmap-opacity': {
            default: 1,
            stops: [
              [14, 1],
              [15, 0],
            ],
          },
        },
      },
      'waterway-label'
    );

    map.addLayer(
      {
        id: 'municipios-point',
        type: 'circle',
        source: 'municipios',
        minzoom: 14,
        paint: {
          'circle-radius': {
            property: 'ranking',
            type: 'exponential',
            stops: [
              [{ zoom: 15, value: 1 }, 5],
              [{ zoom: 15, value: 62 }, 10],
              [{ zoom: 22, value: 1 }, 20],
              [{ zoom: 22, value: 62 }, 50],
            ],
          },
          'circle-color': {
            property: 'ranking',
            type: 'exponential',
            stops: [
              [0, 'rgba(236,222,239,0)'],
              [10, 'rgb(236,222,239)'],
              [20, 'rgb(208,209,230)'],
              [30, 'rgb(166,189,219)'],
              [40, 'rgb(103,169,207)'],
              [50, 'rgb(28,144,153)'],
              [60, 'rgb(1,108,89)'],
            ],
          },
        },
      },
      'waterway-label'
    );
  });
}
