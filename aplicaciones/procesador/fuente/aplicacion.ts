import { resolve } from 'path';
import { departamentos, municipios } from './utilidades/lugaresColombia';
import { getXlsxStream } from 'xlstream';
import { guardarJSON } from './utilidades/ayudas';

const nombreArchivo = 'Inclusion scores nationwide';
const nombreArchivoPoblacion = 'Censo_nacional_de_poblacion_2018_mun';

type Fila = [
  /** Nombre del municipio */
  municipio: string,
  /** Código del municipio */
  codigoMun: number,
  /** Nombre del departamento */
  departamento: string,
  /** Código del departamento */
  codigoDep: number,
  /** Índice de inclusión */
  valor: number,
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

interface DatosInclusion {
  nombre: string;
  dep: string;
  valor: number;
  encuestado: boolean;
  latitud: number;
  longitud: number;
  poblacionTotal?: number;
}

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
  //console.log(fila2.raw.arr)
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
    const [codigo, departamentoNombre, municipioNombre, poblacionH, poblacionL, poblacionT] = fila;

    const mun = municipios.datos.find((municipio) => {
     return +municipio[3] === +codigo
    });

    mapaPoblacionMunicipios.set(codigo, poblacionT);
  }

  function procesarFila(fila: Fila, numeroFila: number) {
    const [nombreMun, codMun, nombreDep, codDep, valor, indiceEncuestado] = fila;
    const mun = municipios.datos.find((municipio) => +municipio[3] === codMun);

    if (!mun) {
      console.log(nombreMun);
      return;
    }

    const dep = departamentos.datos.find((departamento) => +departamento[0] === codDep);

    if (!dep) {
      console.log(nombreDep);
      return;
    }

    datos.push({
      nombre: mun[1],
      dep: dep[1],
      valor,
      encuestado: !!indiceEncuestado,
      latitud: dep[2],
      longitud: dep[3],
      poblacionTotal: +mapaPoblacionMunicipios.get(mun[3]),
    });
  }

}
