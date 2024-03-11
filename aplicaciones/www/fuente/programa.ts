import mapa from './mapa';
import './scss/estilos.scss';
mapa();
fetch('/inclusion-municipios.json')
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    inicio(datos);
  });

function inicio(datos: { nombre: string; dep: string; valor: number; encuestado: boolean }[]) {
  const contenedor = document.getElementById('contenedor');
  const lista = document.createElement('ul');

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
    valor.innerText = `${lugar.valor}`;
    valor.className = 'valor';

    elemento.appendChild(municipio);
    elemento.appendChild(departamento);
    elemento.appendChild(valor);
    lista.appendChild(elemento);
  });

  contenedor?.appendChild(lista);
}
