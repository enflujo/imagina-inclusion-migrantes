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
  padding-top: 0.3em;
}

.tipo {
  // margin-left: 0.5em;
  border-left: $dimFlechaX solid transparent;
  border-right: $dimFlechaX solid transparent;
  border-bottom: $dimFlechaAlto solid var(--colorPositivo);

  &.negativo {
    border-bottom: 0;
    border-top: $dimFlechaAlto solid var(--colorNegativo);
  }
}
</style>
