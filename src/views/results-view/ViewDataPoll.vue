<template>
    <v-flex class="view-container">
       <h4 style="color:white">{{resultPoll.name}}</h4>
       <h5 style="color:white">Número de encuestas: {{getViewData.length}}</h5>
       <v-btn style="margin-top: 50px;"
       absolute
       dark
       fab
       small
       top
       right
       color="primary"
       @click="gotoList"
       >
           <v-icon>list</v-icon>
       </v-btn>
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
                    <poll-results-table :headers="getDataHeaders" :responses="getViewData" :name="resultPoll.name"></poll-results-table>
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
      viewTypeData: 'coding',
      resultPoll: {
        name: '',
        originalJson: [],
        formatedConfiguration: []
      },
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
    getFields () {
      let objectHeaders = {}
      if (this.responses.length > 0) {
        let object = this.responses[0]
        Object.entries(object).forEach(entry => {
          let key = entry[0]
          let title = this.headers.find(q => q.code === key)
          if (title) {
            objectHeaders[title.text] = key
          }
        })
      }
      return objectHeaders
    },
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
    },
    gotoList () {
      this.$router.go(-1)
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
