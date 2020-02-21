<template>
       <v-container fluid
       grid-list-lg>
           <v-layout row wrap>
             <v-flex xs12>
               <h1 style="color:white">Encuesta: {{configPoll.name}}</h1>
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
             </v-flex>
             <v-flex xs4>
               <stats-card
                 color="green"
                 icon="assignment"
                 title="PROYECTO:"
                 :value="projectname"
                 smallValue=""
                 sub-icon="mdi-calendar"
                 :sub-text="company"
               />
             </v-flex>
             <v-flex xs4>
               <stats-card
                 color="info"
                 icon="room"
                 @showMap="showMarkers()"
                 title="LUGAR DE ENCUESTA:"
                 value=""
                 smallValue=""
                 sub-icon="mdi-calendar"
                 :sub-text="company"
               />
             </v-flex>
             <v-flex xs4>
               <stats-card
                 color="orange"
                 icon="info"
                 title="TOTAL:"
                 :value="totalPolls"
                 smallValue=""
                 sub-icon="mdi-calendar"
                 :sub-text="company"
               />
             </v-flex>
             <v-flex xs12 v-for="(page, i) in pagesPoll"
             :key="i">
               <result-page
                 color="red"
                 icon="info"
                 @openModalQuestionDetail="openModal"
                 @openModalDerive="openModalDerive"
                 :questions="questions"
                 :title="page"
                 :value="totalPolls"
                 smallValue=""
                 sub-icon="mdi-calendar"
                 sub-text="Empresa Propraxis"
               />
             </v-flex>
           </v-layout>
           <v-dialog v-model="dialogMap" fullscreen v-if="dialogMap">
             <v-card>
               <v-card-title>UBICACIONES DE LAS ENCUESTAS REALIZADAS </v-card-title>
               <v-select
                   v-model="selectedUser"
                   v-bind:items="listUsers"
                   item-text="name"
                   item-value="_id"
                   label="Encuestador"
                   ></v-select>
                   <label>TOTAL: {{filtersMarkers.length}}</label>
                   <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1"
                           flat="flat"
                           style="background: #000;"
                           @click="dialogMap = false"
                             >
                             CERRAR
                    </v-btn>
                  </v-card-actions>
              <div v-if="loadMarkers === true">
                     <center>
                            <h3>Cargando ubicaciones de las encuestas. Espere por favor</h3>
                     </center>
              </div>
              <map-component v-else :markers="filtersMarkers" :gmapCenter="dataGmapCenter"></map-component>
             </v-card>
           </v-dialog>
           <v-dialog v-model="dialogQuestionDetail" fullscreen v-if="dialogQuestionDetail">
                  <v-card>
                         <v-layout row wrap>

                                <v-flex xs12 style="margin-bottom: 100px;">
                                       <div class="header">
                                       <span style="">
                                         <h4 style="font-weight: bold; margin-left: 10px;padding-top:10px; text-transform: uppercase;"
                                           class="title mb-2"
                                           v-text="currentQuestion.label"
                                         >
                                       </h4>
                                       </span>
                                       <span>
                                         <v-icon
                                           size="40"
                                         >
                                         equalizer
                                         </v-icon>
                                       </span>
                                       <v-btn color="dark darken-1"
                                              style="background: #000; float: right;"
                                              flat="flat"
                                              @click="dialogQuestionDetail = false"
                                                >
                                                CERRAR
                                       </v-btn>
                                </div>
                                </v-flex>
                                <v-flex xs12>
                                       <result-detail-question :question="currentQuestion"></result-detail-question>
                                </v-flex>
                         </v-layout>
                  </v-card>
           </v-dialog>
           <v-dialog v-model="dialogQuestionDerive" fullscreen v-if="dialogQuestionDerive">
                  <v-card>
                         <v-layout row wrap>

                                <v-flex xs12 style="margin-bottom: 100px;">
                                       <div class="header">
                                       <span style="">
                                         <h4 style="font-weight: bold; margin-left: 10px;padding-top:10px; text-transform: uppercase;"
                                           class="title mb-2"
                                           v-text="currentQuestion.label"
                                         >
                                       </h4>
                                       </span>
                                       <span>
                                         <v-icon
                                           size="40"
                                         >
                                         equalizer
                                         </v-icon>
                                       </span>
                                       <v-btn color="dark darken-1"
                                              style="background: #000; float: right;"
                                              flat="flat"
                                              @click="dialogQuestionDerive = false"
                                                >
                                                CERRAR
                                       </v-btn>
                                </div>
                                </v-flex>
                                <v-flex xs12 v-if="awaitDerive === true">
                                     <center>
                                            <v-img
                                                 src="/images/loader.gif"
                                                 img-alt="Image"
                                                 height="70"
                                                 width="70"
                                                 aspect-ratio="2.75"
                                                 ></v-img>
                                            <h2>Cargando datos. Espere por favor.</h2>
                                     </center>
                                </v-flex>
                                <v-flex xs12 v-else>
                                     <report-knowledge :question="currentQuestion" :resultDerive="dataDerive"></report-knowledge>
                                </v-flex>

                         </v-layout>
                  </v-card>
           </v-dialog>
       </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import StatsCard from './../../components/material/StatsCard'
import ResultPage from './../../components/material/ResultPage'
import MapComponent from './../../components/graphs/Map'
import ResultDetailQuestion from './ResultDetailQuestion'
import ReportKnowledge from './ReportKnowledge'
import axios from 'axios'
const enviroment = require('./../../../config/enviroment.json')
export default {
  props: [''],
  data: () => ({
    currentQuestion: {
      label: ''
    },
    graphicType: 'column',
    configPoll: {
      name: '',
      users: []
    },
    dataDerive: null,
    awaitDerive: false,
    positionPage: 0,
    loadMarkers: true,
    selectedUser: null,
    listUsers: [],
    dialogMap: false,
    dialogQuestionDetail: false,
    dialogQuestionDerive: false,
    projectname: '',
    pages: [],
    pagesPoll: [],
    filtersMarkers: [],
    mapMarkers: [],
    dataGmapCenter: {
      lat: 0,
      lng: 0
    },
    totalPolls: '',
    types: [{name: 'Columna', value: 'column'}, {name: 'Pastel', value: 'pie'}],
    questions: []
  }),
  methods: {
    ...mapActions('config-polls', { getConfigPoll: 'get' }),
    ...mapActions('marker-polls', { findMarkerPolls: 'find' }),
    setCurrentImg (data) {
      this.audioData.audio = data.path
      this.audioData.filename = data.filename
    },
    gotoList (id) {
      this.$router.go(-1)
    },
    openModal (question) {
      this.currentQuestion = question
      this.dialogQuestionDetail = true
    },
    openModalDerive (question) {
      this.currentQuestion = question
      this.dialogQuestionDerive = true
      // this.questionDerive()
      this.questionDerive2()
    },
    questionDerive () {
      const {ConfigPoll} = this.$FeathersVuex
      const config = new ConfigPoll(this.currentQuestion)
      config.derive = true
      config.configPollId = this.$route.params.id
      config.save().then((result) => {
        console.log('enviando dta')
      })
    },
    questionDerive2 () {
      this.awaitDerive = true
      let axiosIntance = axios.create({
        baseURL: enviroment[enviroment.currentEnviroment].backend.urlBase
      })
      this.currentQuestion.configPollId = this.$route.params.id
      axiosIntance.defaults.headers.common['Content-Type'] = 'application/json'
      axiosIntance.defaults.headers.common['Authorization'] = this.accessToken
      let params = new URLSearchParams()
      // params.append('speech', true)
      axiosIntance.post('derive-questions', this.currentQuestion, {
        headers: {'Content-Type': 'application/json'}, params}).then(result => {
        if (result) {
          this.dataDerive = result.data
          console.log('data derive--', this.dataDerive)
          this.awaitDerive = false
        }
      })
    },
    getMarkers () {
      this.loadMarkers = true
      this.findMarkerPolls({query: {_config_poll_id: this.$route.params.id, $limit: null, $skip: 0}}).then((result) => {
        if (result.data.length > 0) {
          this.listUsers = result.data.map(data => data.user)
          this.listUsers = [...this.listUsers, {_id: null, name: 'TODOS'}]
          this.mapMarkers = result.data
          this.filtersMarkers = [...result.data]
          this.loadMarkers = false
        }
      })
    },
    showMarkers () {
      this.dialogMap = true
      this.getMarkers()
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight / 2)
        if (bottomOfWindow && this.positionPage < this.pages.length - 1) {
          this.positionPage += 1
          this.pagesPoll = [...this.pagesPoll, this.configPoll.pages[this.positionPage]]
        }
      }
    }
  },
  watch: {
    selectedUser: function (val) {
      if (val) {
        this.filtersMarkers = this.mapMarkers.filter(marker => marker._user_id === val)
      } else {
        this.filtersMarkers = [...this.mapMarkers]
      }
    }
  },
  computed: {
    ...mapState([
      'currentEnv'
    ]),
    company () {
      let user = (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
      return `Empresa ${user.company.name}`
    }
  },
  created () {
    this.getConfigPoll(this.$route.params.id).then(result => {
      this.configPoll = Object.assign({}, result)
      this.totalPolls = (this.configPoll.total) ? `${this.configPoll.total} encuestas` : '0 encuentas'
      this.pages = this.configPoll.pages
      this.pagesPoll = [...this.pagesPoll, this.configPoll.pages[this.positionPage]]
      this.projectname = this.configPoll.PollsProjectNames.name
      this.questions = this.configPoll.formatedConfiguration
      this.dataGmapCenter = this.configPoll.gmapCenter
    }).catch(err => console.log('error', err))
  },
  mounted () {
    this.scroll()
  },
  components: {StatsCard, ResultPage, MapComponent, ResultDetailQuestion, ReportKnowledge}
}
</script>

<style scoped>
  .charge-chip {
    text-transform: capitalize;
  }

  .header {
   z-index: 100!important;
   width: 100%;
   background: #228c7d;
   position: fixed;
 }
</style>
