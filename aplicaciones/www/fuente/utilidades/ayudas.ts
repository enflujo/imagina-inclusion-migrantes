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
