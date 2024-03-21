export interface DatosInclusion {
  id?: number;
  nombre: string;
  dep: string;
  pobVenMun: number;
  porcentRegularMun: number;
  porcentAfiliadDep: number;
  valorRank: number;
  valorIndice: number;
  encuestado: boolean;
  latitud: number;
  longitud: number;
  poblacionTotal?: number;
}
