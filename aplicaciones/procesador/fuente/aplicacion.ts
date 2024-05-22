import { resolve } from 'path';
import { departamentos, municipios } from './utilidades/lugaresColombia';
import { getXlsxStream } from 'xlstream';
import { guardarJSON, normalizarTexto } from './utilidades/ayudas';
import { DatosBuscador, DatosInclusion } from '../../www/tipos/compartidos';
import type { Fila, FilaMunicipioBDJuan, MunicipioCoordenadas } from '../tipos';
import datosMunicipiosAlgunos from '../datos/municipios.json';
const nombreArchivo = 'Inclusion scores nationwide180324';
const nombreArchivoPoblacion = 'Censo_nacional_de_poblacion_2018_mun';

const municipiosBDJuan: FilaMunicipioBDJuan[] = [];
const mapaPoblacionMunicipios = new Map();
let cantidadMunFaltantes = 0;

inicio().catch(console.error);

async function inicio() {
  await preProcesarLugares();
  await procesarPoblacion();
  const datosInclusion = await procesarInclusion();
  const datosBuscador = procesarDatosBuscador(datosInclusion);

  datosBuscador.sort((a, b) => {
    if (a.nombre < b.nombre) return -1;
    if (a.nombre > b.nombre) return 1;
    return 0;
  });

  const maxValorRanking = Math.max(...datosInclusion.map((lugar) => lugar.valorRank));
  // Invertir sentido del ranking para que 1 sea el "mejor"
  datosInclusion.forEach((lugar) => {
    lugar.valorRank = maxValorRanking - lugar.valorRank + 1;
  });

  datosInclusion.sort((a, b) => {
    if (a.valorIndice < b.valorIndice) return -1;
    if (a.valorIndice > b.valorIndice) return 1;
    return 0;
  });

  if (cantidadMunFaltantes) {
    console.log(cantidadMunFaltantes);
  }

  guardarJSON(datosInclusion, 'inclusion-municipios');
  guardarJSON(datosBuscador, 'buscador');

  console.log('FIN');
}

async function procesarPoblacion() {
  let numeroFila = 1;
  let total = 0;

  const flujoPob = await getXlsxStream({
    filePath: resolve(__dirname, `../datos/${nombreArchivoPoblacion}.xlsx`),
    sheet: 'Hoja1',
    withHeader: true,
    ignoreEmpty: true,
  });

  flujoPob.on('data', (fila) => {
    if (numeroFila === 1) {
      total = fila.totalSheetSize;
    }

    numeroFila++;
    const datosFila = fila.raw.arr;
    const codigo = datosFila[0];
    const poblacionT = datosFila[5];
    mapaPoblacionMunicipios.set(codigo, poblacionT);
  });
}

async function procesarInclusion(): Promise<DatosInclusion[]> {
  const ruta = resolve(__dirname, `../datos/${nombreArchivo}.xlsx`);
  let numeroFila = 1;
  let total = 0;
  const datos: DatosInclusion[] = [];

  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: 'Nationwide',
    withHeader: true,
    ignoreEmpty: true,
  });

  return new Promise((resolver) => {
    flujo.on('data', (fila) => {
      if (numeroFila === 1) {
        total = fila.totalSheetSize;
      }

      // Contador para saber en que fila de Excel estamos, útil para buscar errores directo en el Excel.
      numeroFila++;
      procesarFila(fila.formatted.arr, numeroFila);
    });

    flujo.on('close', () => {
      resolver(datos);
    });
  });

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
      console.log(
        nombreMun,
        '-',
        nombreDep,
        municipiosBDJuan.find((m) => normalizarTexto(m[0]) == normalizarTexto(nombreMun)),
        normalizarTexto(nombreMun),
        normalizarTexto(mun[1])
      );
      cantidadMunFaltantes++;
      return;
    }

    datos.push({
      id: numeroFila - 1,
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

async function preProcesarLugares(): Promise<void> {
  datosMunicipiosAlgunos.collections[0].data.forEach((mun) => {
    let lugar = mun.name.split(',');

    if (mun.name.includes('Archipiélago')) {
      lugar = ['Archipiélago de San Andrés, Providencia y Santa Catalina', lugar[2]];
    }

    if (mun.name.includes('Bogotá')) {
      lugar = ['Bogotá, D.C.', 'Bogotá, D.C.'];
    }

    const lat = mun.lat;
    const lon = mun.lon;
    const nombre = lugar[1] ? lugar[1] : '';
    const nombreDepto = lugar[0];

    municipiosBDJuan.push([nombre, nombreDepto, lat, lon]);
  });

  const flujo = await getXlsxStream({
    filePath: resolve(__dirname, '../datos/municipios_colombia.xlsx'),
    sheet: 'Sheet2',
    withHeader: true,
    ignoreEmpty: true,
  });

  return new Promise((resolver) => {
    flujo.on('data', (fila) => {
      const [nombre, lat, lon, dep] = fila.raw.arr;

      if (dep) {
        const datosDep = departamentos.datos.find((d) => +d[0] === +dep);
        if (!datosDep) {
          console.error('No existe departamento con código', dep);
        } else {
          const existe = municipiosBDJuan.find(
            (m) =>
              normalizarTexto(m[0]) === normalizarTexto(nombre) &&
              normalizarTexto(m[1]) === normalizarTexto(datosDep[1])
          );

          if (existe) {
          } else {
            municipiosBDJuan.push([nombre, datosDep[1], lat, lon]);
          }
        }
      } else {
        console.error('No se encontró departamento', dep);
      }

      // console.log(nombre, lat, lon, dep);
    });

    flujo.on('close', () => {
      resolver();
    });
  });
}

function procesarDatosBuscador(datos: DatosInclusion[]): DatosBuscador[] {
  return datos.map((lugar) => {
    return { id: lugar.id, nombre: `${lugar.nombre} (${lugar.dep})` };
  });
}
