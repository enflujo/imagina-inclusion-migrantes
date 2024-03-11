import mapboxgl from 'mapbox-gl';
import type { GeoJSONSource, Map } from 'mapbox-gl';
import type { Feature, FeatureCollection, Point } from 'geojson';

export default async function mapa() {
  const datos = await fetch('/inclusion-municipios.json');
  console.log(datos);
}
