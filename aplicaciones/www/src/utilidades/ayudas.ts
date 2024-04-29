import { convertirEscala, hexARGB } from '@enflujo/alquimia';

/**
 * Permite definir el los tipos (Typescript) al pedir los datos
 *
 * @ejemplo
 * ```
 * const datos = pedirDatos<AlgunTipoOInterface>('...');
 * ```
 * @param url URL donde están los datos en formato JSON
 * @param config Opciones de `fetch()` https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
 * @returns Datos en JSON
 */
export async function pedirDatos<Respuesta>(url: string, config: RequestInit = {}): Promise<Respuesta> {
  const res = await fetch(url, config);
  const datos = await res.json();
  return datos as Respuesta;
}

export async function normarlizar(texto: string) {
  return texto.toLowerCase;
}

export const escalaColores = (valorMin: number, valorMax: number, color1: string, color2: string, opacidad: number) => {
  const colorMin = hexARGB(color1);
  const colorMax = hexARGB(color2);

  const [rMin, gMin, bMin] = colorMin ? colorMin : [255, 255, 255];
  const [rMax, gMax, bMax] = colorMax ? colorMax : [0, 0, 0];
  /**
   * @param {number} valor Cualquier número de la escala que se quiere mapear.
   */
  return (valor: number) => {
    const r = convertirEscala(valor, valorMin, valorMax, rMin, rMax);
    const g = convertirEscala(valor, valorMin, valorMax, gMin, gMax);
    const b = convertirEscala(valor, valorMin, valorMax, bMin, bMax);
    return `rgba(${r},${g},${b}, ${opacidad})`;
  };
};
