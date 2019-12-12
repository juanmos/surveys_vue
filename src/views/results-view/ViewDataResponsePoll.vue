<template>
  <v-card>
    <v-btn
    absolute
    dark
    fab
    small
    top
    right
    color="primary"
    @click="gotoList()"
    >
        <v-icon>list</v-icon>
    </v-btn>
    <v-card>
      <label for="">ENCUESTA N: {{indexPoll}}</label>
    </v-card>
    <survey-view-pdf :jsonData="configPollCurrent.construct" :dataResponse="dataResponse"></survey-view-pdf>
  </v-card>
</template>
<script>
import {mapActions} from 'vuex'
import SurveyViewPdf from './../../components/surveyjs/SurveyViewPdf'
export default {
  components: {SurveyViewPdf},
  data () {
    return {
      configPollCurrent: {
        construct: {}
      },
      indexPoll: 0,
      dataResponse: null
    }
  },
  methods: {
    ...mapActions('config-polls', { getConfigPoll: 'get' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    gotoList (id) {
      this.$router.go(-1)
    }
  },
  created () {
    this.getConfigPoll(this.$route.params.id).then(response => {
      this.configPollCurrent = response
      this.configPollCurrent.construct = JSON.parse(response.construct)
      this.indexPoll = Number(this.$route.params.index)
      this.dataResponse = this.configPollCurrent.formatAnswersMobile[this.indexPoll]
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
