export type PasosEscalera = [embarazadas: number, regularizadas: number, afiliadas: number, controles: number];

export interface DimsGraficaMonte {
  anchoTotal: number;
  altoTotal: number;
  ancho: number;
  alto: number;
  piso: number;
  techo: number;
  anchoSeccion: number;
  centroMonte: number;
}

export type MomentoLinea = {
  año: number;
  numero: number;
  texto: string;
  clase?: string;
};

export interface Cita {
  tipo: 'positivo' | 'negativo';
  texto: string;
}

export type PuntoSimple = [x: number, y: number];
