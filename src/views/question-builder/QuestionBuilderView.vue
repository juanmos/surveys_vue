<template>
<div id="app" class="white" >
    <div id="surveyElement">
            <survey :survey='survey'/>
    </div>
    <div id="surveyResult"></div>
    <v-btn
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
  </div>
</template>
<script src="https://unpkg.com/vue@2.5.13/dist/vue.js"></script>
<script>
import SurveyEditor from './../../components/surveyjs/SurveyEditorView'
import * as SurveyVue from 'survey-vue'
// import './../../localization/spanish.ts'
import 'bootstrap/dist/css/bootstrap.css'
import * as widgets from 'surveyjs-widgets'
import 'inputmask/dist/inputmask/phone-codes/phone.js'
import {mapState, mapGetters, mapActions} from 'vuex'
var Survey = SurveyVue.Survey
Survey.cssType = 'bootstrap'
Survey.locale = 'es'
// SurveyEditor.locale = 'es'
// Survey.render()
widgets.icheck(SurveyVue)
widgets.select2(SurveyVue)
widgets.inputmask(SurveyVue)
// widgets.jquerybarrating(SurveyVue)
// widgets.jqueryuidatepicker(SurveyVue)
widgets.nouislider(SurveyVue)
widgets.select2tagbox(SurveyVue)
// widgets.signaturepad(SurveyVue)
widgets.sortablejs(SurveyVue)
widgets.ckeditor(SurveyVue)
widgets.autocomplete(SurveyVue)
widgets.bootstrapslider(SurveyVue)

export default {
  name: 'app',
  components: {
    Survey,
    SurveyEditor
  },
  data () {
    var model = new SurveyVue.Model();
    return {
      survey: model,
      PollId: '',
      _id: '',
      webResponse: {
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        answers: {},
        _user_id: (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')._id) : this.$store.state.auth.user._id,
        _config_poll_id: null
      },
      _polls_id: '',
      nameConfigPolls: '',
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ]
    }
    namePoll = ''
  },
  methods: {
    ...mapActions('config-polls', { findConfigPolls: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    saveResultPoll (data) {
      this.webResponse.fecha_fin = new Date()
      this.webResponse.answers = data
      this.webResponse._config_poll_id = this.$route.params.id
      const {WebSurveyResult} = this.$FeathersVuex
      const webResultAnswers = new WebSurveyResult(this.webResponse)
      let that = this
      webResultAnswers.save().then((result) => {
        that.goToViewPolls()
      }, (err) => {
        console.log(err)
      })
    },
     gotoList (id) {
      let name = ''
      let direccion = this.$route.params.id
       if (!this.$route.params.data) {
         name = 'view-polls-project'
       } else {
         direccion =  this._polls_id
         name = 'question-builder'
       }
       this.$router.push('/' + name +'/' + direccion)
    },
    goToViewPolls () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.findConfigPolls({query: {_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
      this.PollId = response.data[0].construct
      this.survey = new SurveyVue.Model(this.PollId)
      this._polls_id = response.data[0]._polls_project_id
      this._id = response.data[0]._id
      this.nameConfigPolls = response.data[0].name
      let that = this
      this.survey.onComplete.add(function(result) {
        that.saveResultPoll(result.data)
      })
      this.survey.onValueChanged.add(function (sender, options) {
          var mySurvey = sender;
          var questionName = options.title;
          var newValue = options.value;
      });
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
