import type { Cita } from '@/tipos';

const citas: {
  totalPoblacion: Cita[];
  regularizadas: Cita[];
  afiliadas: Cita[];
  utilizacion: Cita[];
  utilizacionA: Cita[];
  utilizacionB: Cita[];
} = {
  totalPoblacion: [
    {
      tipo: 'positivo',
      texto:
        'Sí me quiero quedar acá, no me quiero ir para ningún otro lado, para qué si aquí estoy bien, trabajo, como, mis hijos se visten, aquí hay muchas ayudas',
    },
    {
      tipo: 'positivo',
      texto:
        'Yo no me quiero regresar, aquí estoy bien, tengo lo que necesito, trabajo, mis hijos van al colegio, hay comida',
    },
    {
      tipo: 'negativo',
      texto:
        'Yo pasé por la trocha con mis hijos porque me dijeron que me los quitaban si pasaba por el puente, pero es horrible, hay gente muy fea, uno paga para que lo ayuden a pasar',
    },
  ],
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
        'Yo siempre he querido tener un trabajo formal para dejar de ser independiente, pero el PPT no sirve para eso, es como si el permiso no existiera',
    },
    {
      tipo: 'negativo',
      texto:
        'La doctora venezolana que estaba vendiendo cosas en la calle me vio a la niña, no me cobró, me dijo que le comprara hidrocortisona y ya con eso se puso mejor, porque no me la atendieron en ninguna parte, luego de eso me dio miedo ir a otro lugar porque no tenía papeles',
    },
    {
      tipo: 'negativo',
      texto:
        'Me enfermé mientras no tenía papeles, pero no fui al médico porque no sabía a dónde tenía que ir, me mantuve con pastas, con guarapo caliente, y se me pasó',
    },
    {
      tipo: 'negativo',
      texto:
        'Cuando estuvimos sin papeles me daba miedo ir al hospital porque ya venía con la idea de cómo era en Bogotá y me daba miedo que me pasara lo mismo aquí, que no me querían atender, que si quería que me atendieran me tocaba pagar la mitad, la trabajadora social fue la que me ayudó',
    },
    {
      tipo: 'negativo',
      texto:
        'Cuando llegué no lo hice (sacar el documento de regularización), estaba trabajando, no le saqué tiempo y la verdad se me pasó, pero ahora sí lo quiero sacar porque a veces uno se enferma',
    },
    {
      tipo: 'negativo',
      texto:
        'Ahorita el colegio me pide el Sisbén del niño, pero yo no le puedo sacar el Sisbén a él porque yo no tengo ningún documento, y yo soy su representante legal',
    },
    {
      tipo: 'positivo',
      texto:
        'Sí me quiero quedar acá, no me quiero ir para ningún otro lado, para qué si aquí estoy bien, trabajo, como, mis hijos se visten, aquí hay muchas ayudas',
    },
    {
      tipo: 'positivo',
      texto:
        'Yo no me quiero regresar, aquí estoy bien, tengo lo que necesito, trabajo, mis hijos van al colegio, hay comida',
    },
    {
      tipo: 'negativo',
      texto:
        'Me dijeron que me iban a ayudar, pero cuando me llamaron me dijeron que no me podían afiliar a ninguna EPS porque no tengo ningún papel, yo quisiera que alguien me revise la herida porque tengo mis hijos y si me pasa algo es fuerte',
    },
    {
      tipo: 'negativo',
      texto:
        'El niño me tuvo un accidente, una fractura de cráneo. No me dijeron qué tenía que hacer, me dijeron que el cráneo iba a sanar solo, él no tenía documentos, lo llevé a urgencias y me lo atendieron porque el dueño de la moto tenía el SOAT, sino no sé qué hubiera pasado',
    },
    {
      tipo: 'negativo',
      texto:
        'Ahorita estoy trabajando en un restaurante los fines de semana y los días feriados. El horario empieza a las 7:00 a.m., pero no hay hora de salida',
    },
    {
      tipo: 'negativo',
      texto:
        'No tengo permiso porque eso no lo están sacando ahora, solo se lo dan a menores de edad, y cuando había estado aquí, cuando había oportunidad para sacar el plástico (documento regulatorio) nunca estaba aquí, estaba en Venezuela o en Ecuador, entonces nunca logré sacarlo',
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
    {
      tipo: 'negativo',
      texto:
        'Por ejemplo, la odontología a mí no me la atienden, hace un mes tenía un dolor de muela horrible y me tocó pagar la calza, eso no me lo revisan ni nada',
    },
    {
      tipo: 'positivo',
      texto:
        'Mi amiga mantiene enterada de todo, de todos los trámites, en grupos de Facebook, ella sabe todo, entonces me cuenta y me dice que vaya a afiliarme',
    },
    {
      tipo: 'negativo',
      texto:
        'Me dijeron que me iban a ayudar, pero cuando me llamaron me dijeron que no me podían afiliar a ninguna EPS porque no tengo ningún papel, yo quisiera que alguien me revise la herida porque tengo mis hijos y si me pasa algo es fuerte',
    },
    {
      tipo: 'negativo',
      texto: 'A uno en Venezuela lo atienden solo por ser un ser humano, aquí a uno le piden muchos papeles',
    },
    {
      tipo: 'positivo',
      texto:
        'Fuera del hospital una muchacha me dijo que fuera a la Alcaldía, que allá me iban a ayudar a afiliarme a salud para que no tuviera que pagar nada porque estaba embarazada',
    },
  ],
  utilizacionA: [
    {
      tipo: 'positivo',
      texto:
        'Fui al hospital porque una amiga me dijo que fuera por urgencias y que así me atendían, yo estaba embarazada y sabía que me tenía que hacer los controles (prenatales). A ella le cobraron los exámenes, pero a mí no, a mí no me cobraron nada, me hicieron todos mis controles por urgencias, no sé por qué',
    },
    {
      tipo: 'positivo',
      texto:
        'Mi hijo tuvo dengue recién llegamos aquí, estaba muy enfermo y por eso fuimos a urgencias. Me atendieron bien, pero me pidieron llevar las jeringas.',
    },
    {
      tipo: 'positivo',
      texto:
        'Cuando no había salido el PPT mi hijo mayor tuvo un accidente, lo atendieron sin papeles ni nada, lo llevé por urgencias, pensé que me iban a cobrar, pero no, nada, obviamente los medicamentos que le pusieron los pagué yo',
    },
  ],
  utilizacionB: [
    {
      tipo: 'negativo',
      texto:
        'La doctora venezolana que estaba vendiendo cosas en la calle me vio a la niña, no me cobró, me dijo que le comprara hidrocortisona y ya con eso se puso mejor, porque no me la atendieron en ninguna parte, luego de eso me dio miedo ir a otro lugar porque no tenía papeles',
    },
    {
      tipo: 'negativo',
      texto:
        'Me enfermé mientras no tenía papeles, pero no fui al médico porque no sabía a dónde tenía que ir, me mantuve con pastas, con guarapo caliente, y se me pasó',
    },
  ],
  utilizacion: [
    {
      tipo: 'negativo',
      texto:
        'Cuando estuvimos sin papeles me daba miedo ir al hospital porque ya venía con la idea de cómo era en Bogotá y me daba miedo que me pasara lo mismo aquí, que no me querían atender, que si quería que me atendieran me tocaba pagar la mitad, la trabajadora social fue la que me ayudó',
    },
    {
      tipo: 'positivo',
      texto:
        'Por ejemplo, si yo voy por urgencias, a mí me atienden, me toca esperar unas horas, pero me atienden, pero, por ejemplo, la medicina no me la dan, me toca comprarla, los exámenes también me toca pagarlos, todo eso, en cambio uno con el permiso (PPT) ya le dan todo eso',
    },
    {
      tipo: 'positivo',
      texto:
        'El niño me tuvo un accidente, una fractura de cráneo. No me dijeron qué tenía que hacer, me dijeron que el cráneo iba a sanar solo, él no tenía documentos, lo llevé a urgencias y me lo atendieron porque el dueño de la moto tenía el SOAT, sino no sé qué hubiera pasado',
    },
    {
      tipo: 'positivo',
      texto:
        'Para que me lo atendieran más rápido fui por urgencias, lo vio el doctor y le pedí que me lo mandara a crecimiento y desarrollo, voy por urgencias para que lo vean más rápido, me dan la orden, autorizo la cita y luego la pido, pero a veces no hay citas, es un proceso largo',
    },
    {
      tipo: 'negativo',
      texto:
        'Yo no quiero tener más hijos, ahorita el dispositivo del brazo me está fallando, yo quisiera que me esterilicen (liguen las trompas de Falopio). Me pusieron el dispositivo en una jornada aquí en Colombia',
    },
  ],
};

export default citas;
