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
                 @showMap="dialogMap = !dialogMap"
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
             <v-flex xs12 v-for="(page, i) in pages"
             :key="i">
               <result-page
                 color="red"
                 icon="info"
                 :questions="questions"
                 :title="page"
                 :value="totalPolls"
                 smallValue=""
                 sub-icon="mdi-calendar"
                 sub-text="Empresa Propraxis"
               />
             </v-flex>
           </v-layout>
           <v-dialog v-model="dialogMap">
             <v-card>
               <v-card-title>titulo</v-card-title>
               <map-component :markers="mapMarkers" :gmapCenter="dataGmapCenter"></map-component>
               <v-card-actions>
                 <v-spacer></v-spacer>
                 <v-btn color="dark darken-1"
                        flat="flat"
                        @click="dialogMap = false"
                          >
                          CERRAR
                 </v-btn>
               </v-card-actions>
             </v-card>
           </v-dialog>
       </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import StatsCard from './../../components/material/StatsCard'
import ResultPage from './../../components/material/ResultPage'
import MapComponent from './../../components/graphs/Map'
export default {
  props: [''],
  data: () => ({
    currenteQuestion: null,
    graphicType: 'column',
    configPoll: {
      name: ''
    },
    dialogMap: false,
    projectname: '',
    pages: [],
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
    setCurrentImg (data) {
      this.audioData.audio = data.path
      this.audioData.filename = data.filename
    },
    gotoList (id) {
      this.$router.go(-1)
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
      this.totalPolls = (this.configPoll.originalJson) ? `${this.configPoll.originalJson.length - 1} encuestas` : '0 encuentas'
      this.pages = this.configPoll.pages
      this.projectname = this.configPoll.PollsProjectNames.name
      this.questions = this.configPoll.formatedConfiguration
      this.dataGmapCenter = this.configPoll.gmapCenter
      this.mapMarkers = this.configPoll.markers
    }).catch(err => console.log('error', err))
  },
  watch: {
    currenteQuestion: function (val) {
      this.currenteQuestion = val
    }
  },
  components: {StatsCard, ResultPage, MapComponent}
}
</script>

<style scoped>
  .charge-chip {
    text-transform: capitalize;
  }
</style>
