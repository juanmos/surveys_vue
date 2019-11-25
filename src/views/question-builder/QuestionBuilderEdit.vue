<template>
<div id="app">
    <!-- If you want to show survey, uncomment the line below -->
    <!-- survey :survey="survey"></survey-->
    <!-- If you want to show survey editor, uncomment the line below -->
    <v-dialog v-model="dialogWait" max-width="900">
        <v-card v-if="dialogWait">
          <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
            <h4>GUARDANDO ENCUESTA</h4>
          </v-flex>
          <v-card-text>
              <center>
                  <v-img
                    src="/images/loader.gif"
                    img-alt="Image"
                    height="70"
                    width="70"
                    aspect-ratio="2.75"
                  ></v-img>
                <h5>LA ENCUESTA SE ESTA GUARDANDO. ESPERE POR FAVOR...</h5>
              </center>
          </v-card-text>
        </v-card>
    </v-dialog>
    <v-card color="white">
      <v-text-field
      v-model="nameConfigPolls"
      label="Nombre de la encuesta"
      single-line
      box
      hide-details
      :rules= "MyRules"
    ></v-text-field>
    </v-card>
    <survey-editor :jsonData = "PollId" @dataSubmited = "getData"></survey-editor>
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
import SurveyEditor from './../../components/surveyjs/SurveyEditorLoad'
import * as SurveyVue from 'survey-vue'
// import './../../localization/spanish.ts'
import 'bootstrap/dist/css/bootstrap.css'
import * as widgets from 'surveyjs-widgets'
import 'inputmask/dist/inputmask/phone-codes/phone.js'
import {mapState, mapGetters, mapActions} from 'vuex'
const Survey = SurveyVue.Survey
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
    var json = {
      title: 'Product Feedback Survey Example',
      showProgressBar: 'top',
      pages: [
        {
          questions: [{
            type: 'matrix',
            name: 'Quality',
            title: 'Please indicate if you agree or disagree with the following statements',
            columns: [{
              value: 1,
              text: 'Strongly Disagree'
            },
            {
              value: 2,
              text: 'Disagree'
            },
            {
              value: 3,
              text: 'Neutral'
            },
            {
              value: 4,
              text: 'Agree'
            },
            {
              value: 5,
              text: 'Strongly Agree'
            }
            ],
            rows: [{
              value: 'affordable',
              text: 'Product is affordable'
            },
            {
              value: 'does what it claims',
              text: 'Product does what it claims'
            },
            {
              value: 'better then others',
              text: 'Product is better than other products on the market'
            },
            {
              value: 'easy to use',
              text: 'Product is easy to use'
            }
            ]
          },
          {
            type: 'rating',
            name: 'satisfaction',
            title: 'How satisfied are you with the Product?',
            mininumRateDescription: 'Not Satisfied',
            maximumRateDescription: 'Completely satisfied'
          },
          {
            type: 'rating',
            name: 'recommend friends',
            visibleIf: '{satisfaction} > 3',
            title: 'How likely are you to recommend the Product to a friend or co-worker?',
            mininumRateDescription: 'Will not recommend',
            maximumRateDescription: 'I will recommend'
          },
          {
            type: 'comment',
            name: 'suggestions',
            title: 'What would make you more satisfied with the Product?'
          }
          ]
        }, {
          questions: [{
            type: 'radiogroup',
            name: 'price to competitors',
            title: 'Compared to our competitors, do you feel the Product is',
            choices: ['Less expensive', 'Priced about the same', 'More expensive', 'Not sure']
          },
          {
            type: 'radiogroup',
            name: 'price',
            title: 'Do you feel our current price is merited by our product?',
            choices: ['correct|Yes, the price is about right',
              'low|No, the price is too low for your product',
              'high|No, the price is too high for your product'
            ]
          },
          {
            type: 'multipletext',
            name: 'pricelimit',
            title: 'What is the... ',
            items: [{
              name: 'mostamount',
              title: 'Most amount you would every pay for a product like ours'
            },
            {
              name: 'leastamount',
              title: 'The least amount you would feel comfortable paying'
            }
            ]
          }
          ]
        }, {
          questions: [{
            type: 'text',
            name: 'email',
            title: 'Thank you for taking our survey. Please enter your email address, then press the "Submit" button.'
          }]
        }]
    }
    var model = new SurveyVue.Model(json)
    return {
      survey: model,
      dialogWait: false,
      PollId: '',
      _id: '',
      nameConfigPolls: '',
      _polls_project_id: '',
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
      this.dialogWait = true
      let data = { _id: this._id, name: this.nameConfigPolls, construct: value.trim() , _polls_project_id : this._polls_project_id}
      const {ConfigPoll} = this.$FeathersVuex
        let config = new ConfigPoll(data)
        config.patch().then((result) => {
          this.findConfigPolls({ query: {removed: false, _id: this._id} }).then(response => {
            const config = response.data || response
            // this.alertConfig('Registro Modificado', 'success')
            this.setSnackMessage('Registro modificado')
            this.setSnackColor('success')
            this.setShowSnack(true)
            this.dialogWait = false
            // this.gotoList(response.data[0]._polls_project_id) regresar
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          this.setSnackColor('error')
          console.log(err)
        })
    },
     getData (value) {
       if (value) {
        this.namePoll = JSON.parse(value).pages[0].name
        this.savePolls(value)
       }
     },
     gotoList (id) {
       this.$router.go(-1)
    }
  },
  created () {
    this.findConfigPolls({query: {_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
      this.PollId = response.data[0].construct
      this._id = response.data[0]._id
      this.nameConfigPolls = response.data[0].name
      this._polls_project_id = response.data[0]._polls_project_id
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
