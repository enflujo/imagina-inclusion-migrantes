<script setup lang="ts">
import type { Cita } from '@/tipos';
import { baseUrl, truncarTexto } from '@/utilidades/ayudas';

interface Esquema {
  mostrarCita: (cita: Cita) => void;
  esconderCita: () => void;
  citas: Cita[];
}

defineProps<Esquema>();
</script>

<template>
  <div class="botonRecurso" v-for="cita in citas" @click="mostrarCita(cita)">
    <div class="contenedorIconos">
      <span class="iconoRecurso" :style="{ backgroundImage: `url(${baseUrl}/imgs/burbuja.svg)` }"></span>
      <span :class="`tipo ${cita.tipo}`"></span>
    </div>
    <span class="fragmentoCita">{{ truncarTexto(cita.texto) }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import '../estaticos/constantes';

$dimFlechaX: 7px;
$dimFlechaAlto: 13px;

.fragmentoCita {
  margin-left: 0.3em;
  font-style: italic;
  font-size: 0.85em;
  line-height: 1.4em;
}

.contenedorIconos {
  display: inline-flex;
  flex-direction: column;
  padding-top: 0.3em;
  margin-right: 0.2em;
  align-items: center;
}

.iconoRecurso {
  margin-right: 0.3em;
}

.tipo {
  border-left: $dimFlechaX solid transparent;
  border-right: $dimFlechaX solid transparent;
  border-bottom: $dimFlechaAlto solid var(--colorPositivo);
  margin-top: 0.5em;

  &.negativo {
    border-bottom: 0;
    border-top: $dimFlechaAlto solid var(--colorNegativo);
  }
}

// Dispositivos grandes y pantallas medianas: 992px;
@media (min-width: $minTablet) {
  .fragmentoCita {
    font-size: 1em;
    align-items: end;
  }
  .contenedorIconos {
    flex-direction: row;
  }
}
</style>
