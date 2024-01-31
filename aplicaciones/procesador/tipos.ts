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

export type ObjetoDepartamentos = {
  llaves: string[];
  datos: Departamento[];
};

export type ObjetoMunicipios = {
  llaves: string[];
  datos: Municipio[];
};
