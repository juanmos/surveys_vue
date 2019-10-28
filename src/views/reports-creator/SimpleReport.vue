<template>
       <v-container fluid
       grid-list-lg>
           <v-layout row wrap>
             <v-flex xs12>
               <h1 style="color:white">Resultados de la encuesta: {{configPoll.name}}</h1>
             </v-flex>
               <v-autocomplete
                 :items="questions"
                 v-model="currenteQuestion"
                 item-text="label"
                 item-value="label"
                 return-object
                 label="Pregunta"
               ></v-autocomplete>
               <chart :question="currenteQuestion"></chart>
           </v-layout>
       </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Chart from './../../components/highcharts/Chart'
export default {
  props: [''],
  data: (state) => ({
    currenteQuestion: null,
    configPoll: {
      name: ''
    },
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
      this.questions = this.configPoll.formatedConfiguration
    }).catch(err => console.log('error', err))
  },
  watch: {
    currenteQuestion: function (val) {
      this.currenteQuestion = val
    }
  },
  components: {Chart}
}
</script>

<style scoped>
  .charge-chip {
    text-transform: capitalize;
  }
</style>
