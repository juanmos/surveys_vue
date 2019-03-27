<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Actores nuevo
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/actors" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <actors-form @saveActor="saveActor"></actors-form>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import ActorsForm from './ActorsForm'
export default {
  computed: {
  },
  methods: {
    ...mapActions('actors', {saveActor: 'save'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    saveActor (actorData) {
      const {Actor} = this.$FeathersVuex
      let actor = new Actor(actorData)
      actor.save().then(result => {
        this.setSnackMessage('Actor Guardado')
        this.setShowSnack(true)
        this.$router.push('/actors')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
  },
  components: {ActorsForm}
}
</script>

<style>

</style>
