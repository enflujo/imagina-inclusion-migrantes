import { writeFileSync } from 'fs';

/**
 * Guardar datos localmente en archivo .json
 * @param {Object} json Datos que se quieren guardar en formato JSON.
 * @param {String} nombre Nombre del archivo, resulta en ${nombre}.json
 */
export const guardarJSON = (json: any, nombre: string) => {
  writeFileSync(`../www/public/${nombre}.json`, JSON.stringify(json));
};

export const normalizarTexto = (texto: string): string => {
  return texto
    .toLocaleLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
};
