import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

export default async function mapa() {
  const datos = await fetch('/inclusion-municipios.json').then((res) => res.json());
  console.log(datos);
  const geoJson: FeatureCollection = { type: 'FeatureCollection', features: [] };
  datos.forEach((lugar) => {
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
              [5, 0.1],
              [15, 0.4],
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
              [15, 70],
            ],
          },
          'heatmap-opacity': {
            default: 0.8,
            stops: [
              [8, 1],
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
        minzoom: 7,
        paint: {
          'circle-radius': {
            property: 'ranking',
            type: 'exponential',
            stops: [
              [{ zoom: 7, value: 1 }, 10],
              [{ zoom: 7, value: 977 }, 15],
              [{ zoom: 15, value: 1 }, 20],
              [{ zoom: 15, value: 977 }, 50],
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
              [60, 'rgb(238,130,238)'],
            ],
          },
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': {
            stops: [
              [7, 0],
              [15, 1],
            ],
          },
        },
      },
      'waterway-label'
    );

    map.on('click', 'municipios-point', (evento) => {
      const feature = evento.features?.[0] as Feature<Point>;
      if (feature && feature.properties) {
        const coords = feature.geometry.coordinates as [number, number];
        const ranking = feature.properties.ranking as number;
        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML('<strong>Ranking de inclusión:</strong> ' + ranking)
          .addTo(map);
      }
    });
  });
}
