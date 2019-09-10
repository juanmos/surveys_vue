<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
               <v-flex xs4>
                    <audio-upload v-if="!currentAudio" @fileCreated="setCurrentImg" :url="currentImage"></audio-upload>
                    <div v-if="currentAudio">
                        <div class="ghettoplayer">
                            <audio ref="player" controls>
                                <source v-bind:src="currentAudio">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                        v-model="audioData.name"
                        label="Nombre"
                        box
                    ></v-text-field>
                    <v-text-field
                        v-model="audioData.description"
                        label="Descripcion"
                        box
                    ></v-text-field>
                    <v-textarea
                        height="400"
                        v-model="audioData.transcription"
                        label="Texto del audio"
                        box
                    ></v-textarea>
                    <v-btn @click="saveAudio">Guardar Audio</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
import { mapState } from 'vuex'
import AudioUpload from './AudioUpload'
export default {
  props: ['audio'],
  data: (state) => ({
    currentImage: null,
    currentAudio: null,
    audioData: {
      name: null,
      description: null,
      filename: null,
      audio: null
    }
  }),
  methods: {
    setCurrentImg (data) {
      this.audioData.audio = data.path
      this.audioData.filename = data.filename
    },
    playSound () {
      let sound = this.currentAudio
      if (sound) {
        var audio = new Audio(sound)
        audio.play()
      }
    },
    saveAudio () {
      this.$emit('saveAudio', Object.assign({}, this.audioData))
    }
  },
  computed: {
    ...mapState([
      'currentEnv'
    ])
  },
  watch: {
    audio: function (val) {
      if (val) {
        val.audio = val.audio.replace('public', '')
        this.currentAudio = this.currentEnv + val.audio
        this.audioData = val
      }
    }
  },
  components: {AudioUpload}
}
</script>

<style scoped>
  .charge-chip {
    text-transform: capitalize;
  }
</style>
