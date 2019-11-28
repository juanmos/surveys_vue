<template>
    <v-flex class="view-container">
       <h5 style="color:white">Número de encuestas: {{getViewData.length}}</h5>
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
                    <poll-results-table :headers="getDataHeaders" :responses="getViewData"></poll-results-table>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-flex>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import PollResultsTable from './PollResultsTable'
import ViewVariables from './ViewVariables'
import ReportCreator from './../reports-creator/ReportCreator'
import QuestionsCodificator from './../questions-codificator/QuestionsCodificator'
import SegmentationFields from './../../components/SegmentationFields'
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
    getViewData () {
      return (this.resultPoll) ? this.resultPoll.originalJson.slice(1, this.resultPoll.originalJson.length) : []
    },
    getDataHeaders () {
      return this.resultPoll ? this.resultPoll.formatedConfiguration.map((q, key) => ({
        text: q.label ? q.label : q.original,
        align: 'left',
        sortable: false,
        code: q.code,
        edit: false,
        type: q.type,
        value: key,
        open: q.open
      })) : []
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    refresh () {
      this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
        this.resultPoll = Object.assign({}, result)
      })
    },
    saveFormated (values) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(this.resultPoll)
      config.formatedConfiguration = values
      config.update().then(result => {
        this.setSnackMessage('Pregunta Editada')
        this.setShowSnack(true)
        this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
          // this.resultPoll = Object.assign({}, result)
        })
      }).catch(err => console.log('este es el error', err))
    }
  },
  created () {
    this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
      this.resultPoll = Object.assign({}, result)
    }).catch(err => console.log('este es el error', err))
    this.refresh()
  },
  components: { PollResultsTable, ReportCreator, SegmentationFields, QuestionsCodificator, ViewVariables }
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
