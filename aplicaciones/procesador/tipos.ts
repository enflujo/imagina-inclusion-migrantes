import { municipiosCoordenadas } from './fuente/utilidades/lugaresColombia';
export type Departamento = [codigo: string, nombre: string, latitud: number, longitud: number];

export type Municipio = [
  /** Código de municipio (sin departamento): ### */
  codigo: string,
  /** Nombre de la ciudad o municipio */
  nombre: string,
  /** Código del departamento al que pertenece la ciudad o municipio: ## */
  codigoDepartamento: string,
  /** Código de la ciudad o municipio (incluyendo su departamento): ##### */
  codigoCompleto: string,
];

export type MunicipioCoordenadas = [nombre: string, codigoDepto: number, latitud: number, longitud: number];

export type ObjetoDepartamentos = {
  llaves: string[];
  datos: Departamento[];
};

export type ObjetoMunicipios = {
  llaves: string[];
  datos: Municipio[];
};

export type ObjetoMunicipioCoord = {
  llaves: string[];
  datos: MunicipioCoordenadas[];
};
