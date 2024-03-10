export default async function mapa() {
  const datos = await fetch('/inclusion-municipios.json');
  console.log(datos);
}
