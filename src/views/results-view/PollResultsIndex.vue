<template>
    <v-flex class="view-container">
      <v-toolbar color="transparent">
          <span class="headline">{{currentPoll ? currentPoll.name : ''}}</span>
          <v-spacer></v-spacer>
          <v-chip><span>Encuestas:</span> <b class="subheader"> {{getTableDataValues.length}} </b></v-chip>
          <v-menu bottom left>
            <v-btn
              slot="activator"
              dark
              icon
            >
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile
              >
                <v-list-tile-title @click="segmentationDialog = true">Definir Datos de Segmentacion</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
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
                Vista de Datos
                <v-icon>list</v-icon>

            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                    <poll-results-table :headers="getDataHeaders" :responses="getTableDataValues"></poll-results-table>
                </v-card>
            </v-tab-item>
            <v-tab
                ripple
            >
                Vista de Variables
                <v-icon>ballot</v-icon>

            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                    <poll-results-table @saveFormated="saveFormated" @refresh="refresh" :headers="getVariableHeaders" :responses="getTableVariableValues" :variablesMode="true"></poll-results-table>
                </v-card>
            </v-tab-item>
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
import QuestionsCodificator from './../questions-codificator/QuestionsCodificator'
import SegmentationFields from './../../components/SegmentationFields'

export default {
  props: ['id'],
  data () {
    return {
      active: null,
      resultPoll: null,
      segmentationDialog: false
    }
  },
  computed: {
    ...mapState('config-polls', { loading: 'isGetPending' }),
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
      return this.resultPoll && this.resultPoll.PollInstances ? this.resultPoll.PollInstances.map(poll => poll.response_received) : []
    },
    getVariableHeaders () {
      return [
        'Nombre',
        'Etiqueta',
        'Valores',
        'Codigo',
        'Perdido',
        'Categoria',
        'Actor',
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
        lost: -1,
        category: question.category,
        actor: question.actor,
        actors: question.actors
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
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions([
      'setCurrentPoll'
    ]),
    refresh () {
      this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
        this.resultPoll = Object.assign({}, result)
        console.log('resul--', result)
        this.setCurrentPoll(Object.assign({}, this.resultPoll))
      })
    },
    saveFormated (values) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(this.resultPoll)
      config.formatedConfiguration = values
      config.save().then(result => {
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
    this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
      this.resultPoll = Object.assign({}, result)
      this.setCurrentPoll(Object.assign({}, this.resultPoll))
    })
  },
  components: { PollResultsTable, ReportCreator, SegmentationFields, QuestionsCodificator }
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
</style>
