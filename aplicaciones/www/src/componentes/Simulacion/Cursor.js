let posicionCursor = { x: 0, y: 0 };
let movimientoCursor = false;
let movimientoCursorTimeout;
let circulos = [];
let removerIntervaloCirculos;

const cursor = document.getElementById('principal');

document.addEventListener('mousemove', (e) => {
  posicionCursor.x = e.clientX;
  posicionCursor.y = e.clientY;
  cursor.style.left = e.clientX - cursor.offsetWidth / 2 + 'px';
  cursor.style.top = e.clientX - cursor.offsetHeight / 2 + 'px';

  movimientoCursor = true;

  clearTimeout(movimientoCursorTimeout);

  movimientoCursorTimeout = setTimeout(() => {
    movimientoCursor = false;
    setTimeout(() => {
      clearInterval(removerIntervaloCirculos);
      removerIntervaloCirculos = setInterval(() => {
        if (circulos.length > 0) {
          let circulo = circulos.shift();
          circulo.remove();
        } else {
          clearInterval(removerIntervaloCirculos);
        }
      }, 25);
    }, 1000);
  }, 100);
});

setInterval(() => {
  if (movimientoCursor) {
    const circulo = document.createElement('div');
    circulo.classList.add('circulo');
    document.body.appendChild(circulo);

    circulo.style.left = posicionCursor.x - circulo.offsetWidth / 2 + 'px';
    circulo.style.top = posicionCursor.y - circulo.offsetHeight / 2 + 'px';

    circulos.push(circulo);
  }
}, 10);
