import Bola from './Bola';

export const posNeg = () => Math.pow(-1, Math.floor(Math.random() * 2));

export function validarNuevaBola(bolas: Bola[], ball: Bola, dim: number) {
  if (ball.p.x - ball.r <= 0 || ball.p.x + ball.r >= dim || ball.p.y - ball.r <= 0 || ball.p.y + ball.r >= dim) {
    return false;
  }

  for (let i = 0; i < bolas.length; i++) {
    const dx = bolas[i].p.x - ball.p.x;
    const dy = bolas[i].p.y - ball.p.y;
    const r = bolas[i].r + ball.r;
    if (dx * dx + dy * dy <= r * r) {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param params {n: cantidad de partículas}
 * @returns
 */
export function generarBolas(cantidadBolas: number, cantidadMuros: number, dim: number) {
  /* Crear muro */
  const bolas = [];
  const m = 41; //debe ser impar. A menor número, mayor diámetro de los círculos del muro
  const h = dim / m; // longitud del canvas / m
  // el valor que se suma a i define la distancia entre los círculos que forman el muro
  for (let i = 0; i < cantidadMuros; i++) {
    // if (i === Math.floor((m - 1) / 2) || i === Math.floor((m - 1) / 2) - 1) {
    //   continue;
    // }

    const x = Math.floor(Math.random() * (dim * 0.6));
    const y = Math.floor(Math.random() * dim);
    bolas.push(
      new Bola(
        x,
        // 0.5 * CANVAS_LENGTH, // distancia del borde izquierdo al muro
        //(h + 0.5) * (i - 5),
        y,
        0,
        0,
        h,
        200000,
        '#222',
        true
      )
    );
  }

  // Generar partículas
  let particulasMalas = 0;

  for (let i = 0; i < cantidadBolas; i++) {
    const bola = new Bola(
      0.1 * Math.floor(Math.random() * dim),
      Math.floor(Math.random() * dim),
      posNeg() * Math.floor(Math.random() * 200), // El último número es la velocidad de las partículas
      posNeg() * Math.floor(Math.random() * 200),
      2, // Radio de las partículas. Tiene un límite
      0.00001
    );
    if (validarNuevaBola(bolas, bola, dim)) {
      bolas.push(bola);
      particulasMalas = 0;
    } else {
      if (++particulasMalas > 99) {
        console.log('Demasiadas bolas');
        return [];
      }
      i--;
    }
  }
  return bolas;
}
