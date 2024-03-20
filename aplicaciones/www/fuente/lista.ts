export default async function lista() {
  fetch('/inclusion-municipios.json')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      datosCargados = datos;
      inicio(datos);
    });

  let datosCargados: { nombre: string; dep: string; valorRank: number; encuestado: boolean }[] = [];

  const contenedorLista = document.getElementById('contenedorLista');
  const botonAlfabetico = document.getElementById('alfabetico');
  const botonAscendente = document.getElementById('ascendente');
  const botonDescendente = document.getElementById('descendente');

  botonAlfabetico?.addEventListener('click', () => {
    ordenarLista(datosCargados, 'alfabetico');
    inicio(datosCargados);
  });

  botonAscendente?.addEventListener('click', () => {
    ordenarLista(datosCargados, 'ascendente');
  });

  botonDescendente?.addEventListener('click', () => {
    ordenarLista(datosCargados, 'descendente');
  });

  function ordenarLista(
    datos: { nombre: string; dep: string; valorRank: number; encuestado: boolean }[],
    criterioOrden: string
  ) {
    if (!contenedorLista) return;
    if (criterioOrden === 'ascendente') {
      datosCargados = datos.sort((a, b) => a.valorRank - b.valorRank);
      contenedorLista.innerHTML = '';
      inicio(datosCargados);
    } else if (criterioOrden === 'descendente') {
      datosCargados = datos.sort((a, b) => b.valorRank - a.valorRank);
      contenedorLista.innerHTML = '';
      inicio(datosCargados);
    } else if (criterioOrden === 'alfabetico') {
      contenedorLista.innerHTML = '';
      datos.sort(function (a, b) {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });
    }
  }

  function inicio(datos: { nombre: string; dep: string; valorRank: number; encuestado: boolean }[]) {
    const lista = document.createElement('ul');
    datosCargados = datos;

    datos.forEach((lugar) => {
      const elemento = document.createElement('li');
      elemento.className = 'lugar';

      if (lugar.encuestado) {
        elemento.classList.add('encuestado');
      }
      const municipio = document.createElement('span');
      municipio.innerText = `${lugar.nombre}, `;
      municipio.className = 'municipio';

      const departamento = document.createElement('span');
      departamento.innerText = `${lugar.dep}: `;
      departamento.className = 'departamento';

      const valor = document.createElement('span');
      valor.innerText = `${lugar.valorRank}`;
      valor.className = 'valor';

      elemento.appendChild(municipio);
      elemento.appendChild(departamento);
      elemento.appendChild(valor);
      lista.appendChild(elemento);
    });

    contenedorLista?.appendChild(lista);
  }
}
