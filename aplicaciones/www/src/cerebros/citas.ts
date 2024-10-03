import type { Cita } from '@/tipos';

const citas: { embarazadas: Cita[]; regularizadas: Cita[]; afiliadas: Cita[]; controles: Cita[] } = {
  embarazadas: [],
  regularizadas: [
    {
      tipo: 'positivo',
      texto:
        'Sacar los documentos no es tampoco tan difícil, hay brigadas para hacer todo con mesas con Migración Colombia, la EPS y el Sisbén para programar la encuesta.',
    },
    {
      tipo: 'negativo',
      texto:
        'Yo trabajo, pero por turnos, no es un trabajo estable, me pagan por día, sin permiso te dan trabajo solo por turnos',
    },
    {
      tipo: 'negativo',
      texto:
        'Cuando no había salido el PPT mi hijo mayor tuvo un accidente, lo atendieron sin papeles ni nada, lo llevé por urgencias, pensé que me iban a cobrar, pero no, nada, obviamente los medicamentos que le pusieron los pagué yo.',
    },
  ],
  afiliadas: [
    {
      tipo: 'positivo',
      texto:
        'Mi hijo tuvo dengue recién llegamos aquí, estaba muy enfermo y por eso fuimos a urgencias. Me atendieron bien, pero me pidieron llevar las jeringas.',
    },
    {
      tipo: 'negativo',
      texto: 'Por ahora no me he enfermado, pero, por ejemplo, para sacarme la muela me tocó pagar',
    },
  ],
  controles: [
    {
      tipo: 'positivo',
      texto:
        'Fui al hospital porque una amiga me dijo que fuera por urgencias y que así me atendían, yo estaba embarazada y sabía que me tenía que hacer los controles (prenatales). A ella le cobraron los exámenes, pero a mí no, a mí no me cobraron nada, me hicieron todos mis controles por urgencias, no sé por qué',
    },
  ],
};

export default citas;
