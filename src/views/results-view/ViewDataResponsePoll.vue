<template>
  <v-card>
    <v-card color="black">
      <label for="">PDF EXPORT</label>
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
      this.dataResponse = this.configPollCurrent.formatAnswersMobile[0]
      console.log('config--', this.dataResponse)
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
