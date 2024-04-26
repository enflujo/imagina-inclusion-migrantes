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

export type MunicipioCoordenadas = [nombre: string, depto: string, latitud: number, longitud: number];

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

export type FilaMunicipioBDJuan = [nombre: string, nombreDepto: string, lat: number, lon: number];

export type Fila = [
  /** Nombre del municipio */
  municipio: string,
  /** Código del municipio */
  codigoMun: number,
  /** Nombre del departamento */
  departamento: string,
  /** Código del departamento */
  codigoDep: number,
  /** Número de personas venezolanas por municipio */
  pobVenMun: number,
  /** Porcentaje de venezolanxs regularizadxs por municipio */
  porcentRegularMun: number,
  /** Porcentaje de venezolanxs afiliadxs por depto */
  porcentAfiliadDep: number,
  /** Ranking de inclusión */
  valorRank: number,
  /** Índice de inclusión */
  valorIndice: number,
  /** Índice de encuestados */
  indiceEncuestado: number,
];

export type FilaPoblacion = [
  codigo: string,
  departamento: string,
  municipio: string,
  poblacionHogares: number,
  poblacionLEA: number,
  poblacionTotal: string,
];
