<template>
  <v-flex class="view-container">
      <v-tabs
      v-model="active"
      color="secondary"
      centered
      dark
      slider-color="primary"
      icons-and-text
      >
          <v-tab
              ripple
          >
              MIGRACIÓN DE VOTO
              <v-icon>add_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              </div>
              <div class="question">
                <span style="font-weight: bold;">LISTADO DE PREGUNTAS</span>
              </div>
              <form>
                <div class="overflow">
                  <v-autocomplete
                    :items="questions"
                    v-model="selectedIntentionQuestion"
                    item-text="label"
                    label="Preguntas de la encuesta"
                    return-object
                  ></v-autocomplete>
                </div>
                <!-- <v-btn @click="format" v-if="dataResponse.category !=='INTENCION'">Relacionar</v-btn> -->
                <v-btn @click="formatMigrationQuestion">Relacionar pregunta</v-btn>
                <v-btn @click="cancel">Cancelar</v-btn>
              </form>
            </v-card-text>
          </v-tab-item>
      </v-tabs>
  </v-flex>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  props: ['arrIndex'],
  data () {
    return {
      dataText: '',
      active: null,
      selectedIntentionQuestion: {},
      currentPoll: {
        _polls_project_id: null,
        formatedConfiguration: []
      },
      dataResponse: {
        label: ''
      },
      questions: []
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('config-polls', {getPoll: 'get'}),
    formatMigrationQuestion () {
      this.dataResponse.intention = this.selectedIntentionQuestion
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Prgenuta de migración relacionada con intención.')
    },
    deleteQuestion (value) {
      /* this.dataResponse.related = this.dataResponse.related.filter(item => (value !== item))
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, false, 'Pregunta relacionada eliminada.') */
    },
    save (values, close, message) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.update().then(result => {
        this.setSnackMessage(message)
        this.setShowSnack(true)
        if (close === true) {
          this.$emit('refresh', this.currentPoll)
        }
      }).catch(err => console.log('este es el error', err))
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.questions = this.currentPoll.formatedConfiguration.filter(data => data.subCategoryQuestion).filter(data => data.subCategoryQuestion._id === '5cc85b6815cd62575fb03082').map(data => ({
        code: data.code,
        label: data.questionMaster.text,
        masterQuestion: data.questionMaster._id
      }))
    })
  },
  watch: {}
}
</script>

<style scoped>
.overflow {
  overflow: auto;
}
.question {
  margin-bottom: 30px;
}
</style>
