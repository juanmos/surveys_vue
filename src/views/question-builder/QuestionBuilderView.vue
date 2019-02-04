<template>
<div id="app" class="white" >
    <!-- If you want to show survey, uncomment the line below -->
    <survey :survey="survey"></survey>
    <!-- If you want to show survey editor, uncomment the line below -->
    <!--<v-card color="white">
      <v-text-field
      v-model="nameConfigPolls"
      label="Nombre de la encuesta"
      single-line
      box
      hide-details
      :rules= "MyRules"
      readonly
    ></v-text-field>
    </v-card>
    <survey-editor :jsonData = "PollId" @dataSubmited = "getData"></survey-editor>-->
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
    return {
      survey: '',
      PollId: '',
      _id: '',
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
    savePolls (value) {
      let data = { _id: this._id, name: this.nameConfigPolls, construct: value.trim()}
      // console.log('esta es mi data ', data)
      const {ConfigPoll} = this.$FeathersVuex
        let config = new ConfigPoll(data)
        config.patch().then((result) => {
          this.findConfigPolls({ query: {removed: false, _id: this._id} }).then(response => {
            const config = response.data || response
            console.log('edit ', config)
            // this.alertConfig('Registro Modificado', 'success')
            this.setSnackMessage('Registro modificado')
            this.setSnackColor('success')
            this.setShowSnack(true)
            this.gotoList(response.data[0]._polls_project_id)
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          this.setSnackColor('error')
          console.log(err)
        })
    },
     getData (value) {
       // console.log('value ', value)
       if (value) {
        // console.log('mi data recibida ', JSON.parse(value))
        this.namePoll = JSON.parse(value).pages[0].name
        this.savePolls(value)
       }
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
    }
  },
  created () {
    this.findConfigPolls({query: {_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
      this.PollId = response.data[0].construct
      this.survey = new SurveyVue.Model(this.PollId)
      // ========================================
      this._polls_id = response.data[0]._polls_project_id
      this._id = response.data[0]._id
      this.nameConfigPolls = response.data[0].name
      // console.log('dats ', this.PollId)
    })
    // console.log('adessssss ', this.survey)
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
