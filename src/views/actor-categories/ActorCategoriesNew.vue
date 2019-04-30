<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Categoría de actor nuevo
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/actors" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <actor-categories-form @saveActor="saveActor"></actor-categories-form>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import ActorCategoriesForm from './ActorCategoriesForm'
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
      const {ActorCategory} = this.$FeathersVuex
      let actorCategory = new ActorCategory(actorData)
      actorCategory.save().then(result => {
        this.setSnackMessage('Categoría de actor Guardado')
        this.setShowSnack(true)
        this.$router.push('/actor-categories')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
  },
  components: {ActorCategoriesForm}
}
</script>

<style>

</style>
