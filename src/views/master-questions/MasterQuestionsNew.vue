<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">MASTER DE PREGUNTAS Crear
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/question-categories" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <master-questions-form @save="save"></master-questions-form>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import MasterQuestionsForm from './MasterQuestionsForm'
export default {
  computed: {
  },
  methods: {
    ...mapActions('master-questions', {saveMaster: 'save'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    save (question) {
      const {MasterQuestion} = this.$FeathersVuex
      let dataSave = new MasterQuestion(question)
      dataSave.save().then(result => {
        this.setSnackMessage('Pregunta master guardada.')
        this.setShowSnack(true)
        this.$router.push('/master-questions')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
  },
  components: {MasterQuestionsForm}
}
</script>

<style>

</style>
