<template>
    <v-flex class="view-container">
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
                Vista de Codificación Datos
                <v-icon>list</v-icon>

            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                    <poll-coding-results :headers="getDataHeaders" :responses="getViewData" @saveOriginal="updateConfigPoll"></poll-coding-results>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-flex>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import PollCodingResults from './PollCodingResults'
export default {
  props: ['id'],
  data () {
    return {
      active: null,
      resultPoll: null,
      originalHeaders: null,
      originalCopy: [],
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
      })).filter(q => q.type === 'text') : []
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    updateConfigPoll (newOriginalJson) {
      // console.log(newOriginalJson);
      for (let [key, value] of newOriginalJson.entries()) {
        this.originalCopy[key + 1] = {...this.originalCopy[key + 1], ...value}
      }
      const {ConfigPoll} = this.$FeathersVuex
      this.resultPoll.originalJson = this.originalCopy
      let config = new ConfigPoll(this.resultPoll)
      config.codingProcess = true
      config.patch({process: true}).then(result => {
        this.setSnackMessage('Pregunta Editada')
        this.setShowSnack(true)
        // this.refresh()
      }).catch(err => console.log('este es el error', err))
    },
    gotoList () {
      this.$router.go(-1)
    },
    refresh () {
      this.getPoll([this.id, {query: {withInstances: true}}]).then(result => {
        this.resultPoll = Object.assign({}, result)
        this.originalHeaders = this.resultPoll.originalJson[0]
        this.originalCopy = this.resultPoll.originalJson
      }).catch(err => console.log('este es el error', err))
    }
  },
  mounted () {
    this.refresh()
  },
  components: {PollCodingResults}
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
