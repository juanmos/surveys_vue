<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
               <v-flex xs4>
                    <audio-upload @fileCreated="setCurrentImg" :url="currentImage"></audio-upload>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                        v-model="audioData.name"
                        label="Nombre"
                        box
                    ></v-text-field>
                    <v-textarea
                        v-model="audioData.description"
                        label="Descripcion"
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
        this.currentImage = val.audio
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
