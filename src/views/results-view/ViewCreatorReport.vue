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
                Creador de Reportes
                <v-icon>ballot</v-icon>
            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                  <report-creator :id="this.id" :responses="getTableDataValues" :variables="getTableVariableValues"></report-creator>
                </v-card>
            </v-tab-item>
            <v-tab
              ripple
              v-if="resultPoll && !resultPoll.imported"
            >
                Codificar Preguntas
                <v-icon>grain</v-icon>

            </v-tab>
            <v-tab-item
              v-if="resultPoll && !resultPoll.imported"
            >
                <v-card flat>
                  <questions-codificator :headers="getDataHeaders" :responses="getTableDataValues" :variables="getTableVariableValues"></questions-codificator>
                </v-card>
            </v-tab-item>
        </v-tabs>
        <v-dialog
          v-model="segmentationDialog"
          width="800"
        >
        <v-card>
          <v-toolbar>
            <v-card-title
              class="headline"
              primary-title
            >
              Asignar campos de segmentacion
            </v-card-title>
            <v-spacer>
            </v-spacer>
            <v-btn @click="segmentationDialog = false" icon>
                <v-icon>
                  close
                </v-icon>
            </v-btn>
          </v-toolbar>
        <v-card-text>
          <v-spacer></v-spacer>

          <segmentation-fields :questions="this.resultPoll ? this.resultPoll.formatedConfiguration : []"></segmentation-fields>
        </v-card-text>
           <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="dialog = false"
              >
                Cerrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogProcess" max-width="290">
            <v-card>
            <v-card-title class="headline">Información</v-card-title>
            <v-card-text>
                La encuesta ya fue procesada, Quiere volver a procesar la encuesta?
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            color="red darken-4"
            flat="flat"
            @click="dialogProcess = false"
            >
            Cancelar
            </v-btn>

            <v-btn
            color="teal darken-3"
            flat="flat"
            @click="dialogProcess = false, initialProcessConsolidate()"
            >
            Aceptar
            </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
          v-model="loading"
          hide-overlay
          persistent
          width="300"
        >
          <v-card
            color="primary"
            dark
          >
            <v-card-text>
              Cargando respuestas...
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import PollResultsTable from './PollResultsTable'
import ReportCreator from './../reports-creator/ReportCreator'
import SegmentationFields from './../../components/SegmentationFields'
import axios from 'axios'
const enviroment = require('./../../../config/enviroment.json')
export default {
  props: ['id'],
  data () {
    return {
      active: null,
      resultPoll: null,
      segmentationDialog: false,
      viewData: [],
      dialogProcess: false,
      dialogProcessdata: false
    }
  },
  computed: {
    ...mapState('config-polls', { loading: 'isGetPending' }),
    ...mapState('config-polls', { loading: 'isGetPending' }),
    ...mapState('auth', { accessToken: 'accessToken' }),
    ...mapState([
      'currentPoll'
    ]),
    getDataHeaders () {
      return this.resultPoll ? this.resultPoll.formatedConfiguration.map((q, key) => ({
        text: q.label ? q.label : q.original,
        align: 'left',
        sortable: false,
        value: key,
        open: q.open
      })) : []
    },
    getTableDataValues () {
      let data = (this.resultPoll && this.resultPoll.PollInstances) ? this.resultPoll.PollInstances.map(poll => poll.response_received) : []
      return data
    },
    getVariableHeaders () {
      return [
        'Nombre',
        'Etiqueta',
        'Valores',
        'Codigo',
        // 'Perdido',
        // 'Sub-Categoría',
        'Actor',
        'Master',
        'Acciones'
      ].map(value => ({
        text: value,
        align: 'center',
        sortable: false
      }))
    },
    getTableVariableValues () {
      return this.resultPoll ? this.resultPoll.formatedConfiguration.map((question, key) => ({
        name: question.original,
        label: question.label,
        values: question.options,
        code: question.code,
        questionMaster: (question.questionMaster) ? question.questionMaster.text : '<< No asignado >>',
        subcategory: (question.questionMaster && question.subCategoryQuestion) ? (question.subCategoryQuestion.name) ? question.subCategoryQuestion.name.toUpperCase() : '<< No asignado >>' : '<< No asignado >>',
        actors: (question.actors) ? question.actors : [],
        category: (question.questionMaster && question.categoryQuestion) ? (question.categoryQuestion.name) ? question.categoryQuestion.name.toUpperCase() : '<< No asignado >>' : '<< No asignado >>'
      })) : []
    },
    getPossibleValues () {
      let resultPossibleValues = []
      for (let key in this.getTableDataValues[0]) {
        resultPossibleValues.push([...new Set(Object.values(this.getTableDataValues.map(value => value[key])))])
      }
      return resultPossibleValues
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions('consolidates', {findConsolidate: 'find'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions([
      'setCurrentPoll'
    ]),
    processData () {
      this.checkExistData()
    },
    checkExistData () {
      this.findConsolidate({query: {_config_poll_id: this.id}}).then(response => {
        if (response.data.length > 0) {
          this.dialogProcess = true
        } else {
          this.initialProcessConsolidate()
        }
      })
    },
    initialProcessConsolidate () {
      this.dialogProcessdata = true
      let axiosIntance = axios.create({
        baseURL: enviroment[enviroment.currentEnviroment].backend.urlBase
      })
      axiosIntance.defaults.headers.common['Content-Type'] = 'application/json'
      axiosIntance.defaults.headers.common['Authorization'] = this.accessToken
      let params = new URLSearchParams()
      params.append('bigdata', true)
      params.append('_id', this.id)
      axiosIntance.get('/config-polls', { params }).then((result) => {
        this.setShowSnack(true)
        this.dialogProcessdata = false
        this.setSnackMessage('Data procesada correctamente.')
      }).catch(err => {
        this.setShowSnack(true)
        this.dialogProcessdata = false
        this.setSnackMessage('Error al Guardar. Revise que la encuestra este asignado con el master de preguntas.')
        console.log(err)
      })
    },
    refresh () {
      this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
        this.resultPoll = Object.assign({}, result)
        this.setCurrentPoll(Object.assign({}, this.resultPoll))
      })
    },
    saveFormated (values) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(this.resultPoll)
      config.formatedConfiguration = values
      config.update().then(result => {
        this.setSnackMessage('Pregunta Editada')
        this.setShowSnack(true)
        this.getPoll(this.id).then(result => {
          this.resultPoll = Object.assign({}, result)
          this.setCurrentPoll(Object.assign({}, this.resultPoll))
        })
      }).catch(err => console.log('este es el error', err))
    }
  },
  mounted () {
    this.getPoll(this.id).then(result => {
      this.viewData = result.PollInstances.map(poll => poll.response_received)
      this.resultPoll = Object.assign({}, result)
      this.setCurrentPoll(Object.assign({}, this.resultPoll))
    }).catch(err => console.log('este es el error', err))
  },
  watch: {
    resultPoll: function (value) {
      this.viewData = value.PollInstances.map(poll => poll.response_received)
    }
  },
  components: { PollResultsTable, ReportCreator, SegmentationFields }
}
</script>

<style scoped>
    .resultsTable {
      overflow: scroll
    }
</style>

<style scoped>
  .view-container {
    margin: 30px;
  }
  .pointer:hover {
      cursor: pointer;
      background-color: #fa000b;
  }
</style>
