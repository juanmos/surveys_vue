<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Audio
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/audios" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <audios-form @saveAudio="saveAudio" :audio="currentAudio"></audios-form>
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
  data () {
    return {
      actor_id: null,
      currentAudio: null
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('audios', { getSelectAudio: 'get' }),
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
  created () {
    this.actor_id = this.$route.params.id
    this.getSelectAudio(this.$route.params.id).then(result => {
      this.currentAudio = Object.assign({}, result)
    }).catch(err => console.log('este es el error', err))
  },
  mounted () {
  },
  components: {AudiosForm}
}
</script>

<style>

</style>
