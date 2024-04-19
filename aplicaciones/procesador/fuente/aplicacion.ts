import { resolve } from 'path';
import { departamentos, municipios } from './utilidades/lugaresColombia';
import { getXlsxStream } from 'xlstream';
import { guardarJSON, normalizarTexto } from './utilidades/ayudas';
import { DatosInclusion } from '../../www/tipos/compartidos';
import { MunicipioCoordenadas } from '../tipos';
import datosMunicipiosAlgunos from '../datos/municipios.json';
const nombreArchivo = 'Inclusion scores nationwide180324';
const nombreArchivoPoblacion = 'Censo_nacional_de_poblacion_2018_mun';
const municipiosBDJuan: FilaMunicipioBDJuan[] = [];

type FilaMunicipioBDJuan = [nombre: string, nombreDepto: string, lat: number, lon: number];

type Fila = [
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

type FilaPoblacion = [
  codigo: string,
  departamento: string,
  municipio: string,
  poblacionHogares: number,
  poblacionLEA: number,
  poblacionTotal: string,
];

datosMunicipiosAlgunos.collections[0].data.forEach((mun) => {
  let lugar = mun.name.split(',');
  if (mun.name.includes('Archipiélago')) {
    lugar = ['Archipiélago de San Andrés, Providencia y Santa Catalina', lugar[2]];
  }

  const lat = mun.lat;
  const lon = mun.lon;
  const nombre = lugar[1] ? lugar[1] : '';
  const nombreDepto = lugar[0];

  municipiosBDJuan.push([nombre, nombreDepto, lat, lon]);
});

inicio().catch(console.error);

async function inicio() {
  const ruta = resolve(__dirname, `../datos/${nombreArchivo}.xlsx`);
  let numeroFila = 1;
  let total = 0;
  const datos: DatosInclusion[] = [];
  let mapaPoblacionMunicipios = new Map();

  //Cargar población:
  numeroFila = 1;
  total = 0;
  const flujoPob = await getXlsxStream({
    filePath: resolve(__dirname, `../datos/${nombreArchivoPoblacion}.xlsx`),
    sheet: 'Hoja1',
    withHeader: true,
    ignoreEmpty: true,
  });

  flujoPob.on('data', (fila2) => {
    if (numeroFila === 1) {
      total = fila2.totalSheetSize;
    }

    numeroFila++;
    procesarFilaPoblacion(fila2.raw.arr, numeroFila);
  });

  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: 'Nationwide',
    withHeader: true,
    ignoreEmpty: true,
  });

  flujo.on('data', (fila) => {
    if (numeroFila === 1) {
      total = fila.totalSheetSize;
    }

    // Contador para saber en que fila de Excel estamos, útil para buscar errores directo en el Excel.
    numeroFila++;
    procesarFila(fila.formatted.arr, numeroFila);
  });

  flujo.on('close', () => {
    guardarJSON(datos, 'inclusion-municipios');
    console.log('FIN');
  });

  function procesarFilaPoblacion(fila: FilaPoblacion, numeroFila: number) {
    const codigo = fila[0];
    const poblacionT = fila[5];
    mapaPoblacionMunicipios.set(codigo, poblacionT);
  }
  let i = 0;
  function procesarFila(fila: Fila, numeroFila: number) {
    const [
      nombreMun,
      codMun,
      nombreDep,
      codDep,
      pobVenMun,
      porcentRegularMun,
      porcentAfiliadDep,
      valorRank,
      valorIndice,
      indiceEncuestado,
    ] = fila;

    const mun = municipios.datos.find((municipio) => +municipio[3] === codMun);

    if (!mun) {
      console.log(`El municipio ${nombreMun} no existe en la fuente de lugaresColombia.ts`);
      return;
    }

    const dep = departamentos.datos.find((departamento) => +departamento[0] === codDep);

    if (!dep) {
      console.log(`El departamento ${nombreDep} no existe en la fuente de lugaresColombia.ts`);
      return;
    }

    const munCoordenadas = municipiosBDJuan.find((municipio: MunicipioCoordenadas) => {
      return (
        normalizarTexto(municipio[1]) === normalizarTexto(dep[1]) &&
        normalizarTexto(municipio[0]) === normalizarTexto(mun[1])
      );
    });

    if (!munCoordenadas) {
      i++;
      // console.log(i, dep[1], ' - ', mun[1]);
      return;
    }

    datos.push({
      nombre: mun[1],
      dep: dep[1],
      pobVenMun,
      porcentRegularMun,
      porcentAfiliadDep,
      valorRank,
      valorIndice,
      encuestado: !!indiceEncuestado,
      latitud: munCoordenadas ? +munCoordenadas[2] : dep[2],
      longitud: munCoordenadas ? +munCoordenadas[3] : dep[3],
      poblacionTotal: +mapaPoblacionMunicipios.get(mun[3]),
    });
  }
}
