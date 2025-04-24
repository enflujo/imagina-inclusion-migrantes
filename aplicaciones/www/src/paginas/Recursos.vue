<script setup lang="ts">
import { baseUrl } from '@/utilidades/ayudas';
</script>

<template>
  <main class="creditos">
    <div id="contenedorVideos">
      <div class="elementoVideo">
        <h2>Accede a atención en salud en Colombia</h2>
        <h3>Esto es lo que debes saber</h3>
        <video :src="`${baseUrl}/videos/video1.mp4`" controls></video>
      </div>

      <div class="elementoVideo">
        <h2>¿Tienes PPT?</h2>
        <h3>Así puedes afiliarte al sistema de salud colombiano</h3>
        <video :src="`${baseUrl}/videos/video2.mp4`" controls></video>
      </div>

      <div class="elementoVideo">
        <h2>¿Necesitas el PPT para un menor de edad?</h2>
        <h3>Así puedes tramitarlo</h3>
        <video :src="`${baseUrl}/videos/video3.mp4`" controls></video>
      </div>

      <div class="elementoVideo">
        <h2>¿Eres solicitante de refugio en Colombia?</h2>
        <h3>Aprende cómo obtener tu salvoconducto</h3>
        <video :src="`${baseUrl}/videos/video4.mp4`" controls></video>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '../scss/constantes' as *;

main {
  width: 70vw;
  margin: 0 auto;
}

p {
  font-size: 1.2em;
}

#tituloPagina {
  margin-top: 1em;
  font-size: 3em;
}

#contenedorVideos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;

  .elementoVideo {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 1em;

    h2 {
      font-size: 1.5em;
      margin-bottom: 0.5em;
    }

    h3 {
      font-size: 1.2em;
      margin-bottom: 1em;
    }

    video {
      width: 100%;
      height: auto;
      border-radius: 0.5em;
    }
  }
}

@media screen and (min-width: $minPantallaGigante) {
  main {
    width: 50vw;
    margin: 0 auto;
  }
  #tituloPagina {
    margin-top: 1em;
    font-size: 4.5em;
  }
  p {
    font-size: 1.7em;
  }
}
</style>
