<template>
  <v-card>
    <v-card color="black">
      <label for="">PDF EXPORT</label>
    </v-card>
    <survey-view-pdf :jsonData="configPollCurrent.construct"></survey-view-pdf>
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
      }
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
