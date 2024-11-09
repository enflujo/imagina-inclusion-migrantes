import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
export interface DatosInclusion {
  id: number;
  nombre: string;
  dep: string;
  pobVenMun?: number;
  porcentRegularMun?: number;
  porcentAfiliadDep?: number;
  valorRank: number;
  valorIndice: number;
  encuestado?: boolean;
  latitud?: number;
  longitud?: number;
  poblacionTotal?: number;
}

export interface DatosBuscador {
  id: number;
  nombre: string;
}

export type Geo = FeatureCollection<Polygon | MultiPolygon, DatosInclusion>;
