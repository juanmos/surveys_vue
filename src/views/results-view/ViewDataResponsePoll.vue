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
    <survey-view-pdf :jsonData="currentConstruct" :dataResponse="dataResponse" :indexPoll="indexPoll"></survey-view-pdf>
  </v-card>
</template>
<script>
import {mapActions} from 'vuex'
import SurveyViewPdf from './../../components/surveyjs/SurveyViewPdf'
export default {
  components: {SurveyViewPdf},
  data () {
    return {
      currentConstruct: [],
      indexPoll: 0,
      dataResponse: {}
    }
  },
  methods: {
    ...mapActions('config-polls', { getConfigPoll: 'get' }),
    ...mapActions('poll-instances', { findPollInstances: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    gotoList (id) {
      this.$router.go(-1)
    },
    getDataResponses () {
      this.findPollInstances({query: {_config_poll_id: this.$route.params.id, row: this.$route.params.index, formatSurvey: true, $limit: null, $skip: 0}}).then((result) => {
        if (result.length > 0) {
          this.indexPoll = Number(this.$route.params.index)
          this.dataResponse = result[0].formatSurvey
        }
      })
    }
  },
  mounted () {
    this.getConfigPoll(this.$route.params.id).then(response => {
      this.currentConstruct = JSON.parse(response.construct)
      this.indexPoll = Number(this.$route.params.index)
      this.getDataResponses()
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
