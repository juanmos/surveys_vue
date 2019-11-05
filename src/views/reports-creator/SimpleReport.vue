<template>
       <v-container fluid
       grid-list-lg>
           <v-layout row wrap>
             <v-flex xs12>
               <h1 style="color:white">Encuesta: {{configPoll.name}}</h1>
             </v-flex>
             <v-flex xs4>
               <stats-card
                 color="green"
                 icon="assignment"
                 title="PROYECTO:"
                 :value="projectname"
                 smallValue=""
                 sub-icon="mdi-calendar"
                 sub-text="Empresa Propraxis"
               />
             </v-flex>
             <v-flex xs4>
               <stats-card
                 color="info"
                 icon="room"
                 title="LUGAR DE ENCUESTA:"
                 value="República Dominicana"
                 smallValue=""
                 sub-icon="mdi-calendar"
                 sub-text="Empresa Propraxis"
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
                 sub-text="Empresa Propraxis"
               />
             </v-flex>
             <v-flex xs6 v-for="(page, i) in pages"
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
       </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import StatsCard from './../../components/material/StatsCard'
import ResultPage from './../../components/material/ResultPage'
export default {
  props: [''],
  data: (state) => ({
    currenteQuestion: null,
    graphicType: 'column',
    configPoll: {
      name: ''
    },
    projectname: '',
    pages: [],
    totalPolls: '',
    types: [{name: 'Columna', value: 'column'}, {name: 'Pastel', value: 'pie'}],
    questions: []
  }),
  methods: {
    ...mapActions('config-polls', { getConfigPoll: 'get' }),
    setCurrentImg (data) {
      this.audioData.audio = data.path
      this.audioData.filename = data.filename
    }
  },
  computed: {
    ...mapState([
      'currentEnv'
    ])
  },
  created () {
    this.getConfigPoll(this.$route.params.id).then(result => {
      this.configPoll = Object.assign({}, result)
      this.totalPolls = (this.configPoll.originalJson) ? `${this.configPoll.originalJson.length - 1} encuestas` : '0 encuentas'
      this.pages = this.configPoll.pages
      this.projectname = this.configPoll.PollsProjectNames.name
      this.questions = this.configPoll.formatedConfiguration
    }).catch(err => console.log('error', err))
  },
  watch: {
    currenteQuestion: function (val) {
      this.currenteQuestion = val
    }
  },
  components: {StatsCard, ResultPage}
}
</script>

<style scoped>
  .charge-chip {
    text-transform: capitalize;
  }
</style>
