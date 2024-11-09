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
      <span
        :class="`iconoRecurso ${cita.tipo}`"
        :style="{
          backgroundImage: `url(${baseUrl}/imgs/${cita.tipo === 'negativo' ? 'cara_triste.png' : 'cara_feliz.png'})`,
        }"
      ></span>
    </div>
    <span class="fragmentoCita">{{ truncarTexto(cita.texto) }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss/constantes' as *;

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
  border-radius: 50%;
  &.negativo {
    background-color: var(--colorNegativo);
  }
  &.positivo {
    background-color: var(--colorPositivo);
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
