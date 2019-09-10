<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Audio nuevo
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/audios" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <audios-form @saveAudio="saveAudio"></audios-form>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import AudiosForm from './AudiosForm'
export default {
  computed: {
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    saveAudio (audioData) {
      const {Audio} = this.$FeathersVuex
      let audio = new Audio(audioData)
      audio.save().then(result => {
        this.setSnackMessage('Audio Guardado')
        this.setShowSnack(true)
        this.$router.push('/audios')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
  },
  components: {AudiosForm}
}
</script>

<style>

</style>
