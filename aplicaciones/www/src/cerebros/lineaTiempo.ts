import type { MomentoLinea } from '@/tipos';

export const datosLinea: MomentoLinea[] = [
  {
    año: 2008,
    numero: 21142,
    texto: 'comienza la crisis económica en Venezuela.',
    clase: 'extremo',
  },
  {
    año: 2014,
    numero: 23573,
    texto: 'solamente 11,429 migrantes están regularizados.',
  },
  {
    año: 2015,
    numero: 31471,
    texto: 'más de 22,000 colombianos que viven en Venezuela regresan a Colombia.',
  },
  {
    año: 2016,
    numero: 57747,
    texto: 'en promedio, 50,000 Venezolanos transitan entre Colombia y Venezuela.',
  },
  {
    año: 2017,
    numero: 403707,
    texto:
      'el gobierno Colombiano crea el PEP, con este permiso, 68,884 Venezolanos legalizan su estancia en Colombia.',
  },
  {
    año: 2018,
    numero: 1072432,
    texto: 'el gobierno Colombiano presenta el CONPES para atender la crisis migratoria.',
  },
  {
    año: 2019,
    numero: 1488373,
    texto: '750,918 están regularizados y 737,455 son irregulares.',
  },
  {
    año: 2020,
    numero: 1715831,
    texto:
      'la frontera cierra por la pandemia del COVID19 provocando un aumento en la migración irregular. El número de Venezolanos en Colombia desciende 6.2% - de 1,809,872 en Marzo a 1,715,831 en Septiembre.',
  },
  {
    año: 2021,
    numero: 1842390,
    texto: '...',
    clase: 'acento',
  },
  {
    año: 2022,
    numero: 2477588,
    texto: 'en promedio, 50,000 Venezolanos transitan entre Colombia y Venezuela.',
    clase: 'extremo',
  },
];

export const fechaInicial = datosLinea[0].año;
export const fechaFinal = datosLinea[datosLinea.length - 1].año;

let min = Infinity;
let max = 0;

datosLinea.forEach((punto) => {
  if (min > punto.numero) min = punto.numero;
  if (max < punto.numero) max = punto.numero;
});

export const numeroMin = min;
export const numeroMax = max;
