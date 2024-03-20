import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import { pedirDatos } from '../../www/src/utilidades/ayudas';
import { DatosInclusion } from '../../../tipos/compartidos';

export default async function mapa() {
  const datos = await pedirDatos<DatosInclusion[]>('/inclusion-municipios.json');
  // console.log(datos);
  const geoJson: FeatureCollection = { type: 'FeatureCollection', features: [] };

  datos.forEach((lugar) => {
    geoJson.features.push({
      type: 'Feature',
      properties: { ranking: lugar.valorRank, poblacion: lugar.poblacionTotal, mun: lugar.nombre, dep: lugar.dep },
      geometry: { type: 'Point', coordinates: [lugar.longitud, lugar.latitud] },
    });
  });
  //  console.log(geoJson);
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

    const zoomMax = 15;

    map.addLayer({
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

    map.addLayer({
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

    map.on('click', 'municipios-puntos', (evento) => {
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
          .addTo(map);
      }
    });
  });
}
