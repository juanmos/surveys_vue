<template>
    <v-flex class="view-container">
      <v-dialog v-model="dialogWait" persistent max-width="900">
          <v-card v-if="dialogWait">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h5>ENCUESTAS</h5>
            </v-flex>
            <v-card-text>
                <center>
                    <v-img
                      src="/images/loader.gif"
                      img-alt="Image"
                      height="70"
                      width="70"
                      aspect-ratio="2.75"
                    ></v-img>
                  <h5>Cargando encuestas... Espere por favor.</h5>
                </center>
            </v-card-text>
          </v-card>
      </v-dialog>
       <h4 style="color:white">{{resultPoll.name}}</h4>
       <h5 style="color:white">Número de encuestas: {{pollInstances.length}}</h5>
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
                    <poll-results-table @setAudio="getAudio" :headers="getDataHeaders" :responses="pollInstances" :name="resultPoll.name" ></poll-results-table>
                </v-card>
            </v-tab-item>
        </v-tabs>
        <v-dialog v-model="dialogAudio" v-if="dialogAudio" persistent max-width="900">
          <v-card v-if="dialogAudio">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h4 style="font-weight: bold;">Audio - Fila: {{dataAudio.row}}</h4>
            </v-flex>
            <v-card-text>
                <v-container fluid grid-list-md text-xs-center>
                  <v-layout row wrap>
                    <v-flex xs12>
                        <center>
                            <span style="font-weight: bold;">{{dataAudio.text}}</span>
                        </center>
                    </v-flex>
                    <v-flex xs12>
                        <center>
                            <video controls="" autoplay="" name="media" v-if="dataAudio.currentPath">
                                <source :src="dataAudio.currentPath" type="audio/x-wav">
                            </video>
                            <span v-else style="font-weight: bold;color: red;">{{dataAudio.textModal}}</span>
                        </center>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn @click="dialogAudio = false">Cerrar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
            </v-card-text>
          </v-card>
       </v-dialog>
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
      dialogWait: false,
      viewTypeData: 'coding',
      resultPoll: {
        name: '',
        originalJson: [],
        formatedConfiguration: []
      },
      dialogAudio: false,
      dataAudio: {
        text: '',
        currentPath: null,
        textModal: '',
        row: 0
      },
      pollInstances: [],
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
        width: '50px',
        sortable: false,
        name: q.name,
        code: q.code,
        audio: (q.audio === true) ? q.audio : false,
        edit: false,
        type: q.type,
        value: key,
        open: q.open
      })) : []
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions('poll-instances', { findPollInstances: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    getAudio (data) {
      this.dataAudio = data
      this.dialogAudio = true
    },
    refresh () {
      this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
        this.resultPoll = Object.assign({}, result)
      })
    },
    getDataResponses () {
      this.dialogWait = true
      this.findPollInstances({query: {$select: ['answers', '_config_poll_id', 'row'], _config_poll_id: this.$route.params.id, $limit: null, $skip: 0}}).then((result) => {
        if (result.length > 0) {
          this.pollInstances = result.map(data => data.answers)
          this.dialogWait = false
        }
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
    this.getDataResponses()
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
