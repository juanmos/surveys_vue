<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Categorias de Preguntas
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/master-questions" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <master-questions-form @save="save" :masterCurrent="current"></master-questions-form>
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
  props: ['id'],
  data () {
    return {
      current: null
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('master-questions', {saveMaster: 'save'}),
    ...mapActions('master-questions', { getMasterQuestion: 'get' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    save (question) {
      const {MasterQuestion} = this.$FeathersVuex
      let dataSave = new MasterQuestion(question)
      dataSave.save().then(result => {
        this.setSnackMessage('Pregunta master actualizada.')
        this.setShowSnack(true)
        // this.$router.push('/master-questions')
        this.$router.go(-1)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getMasterQuestion(this.id).then(result => {
      this.current = Object.assign({}, result)
    }).catch(err => console.log('este es el error', err))
  },
  components: {MasterQuestionsForm}
}
</script>

<style>

</style>
