<template>
<div id="app">
    <!-- If you want to show survey, uncomment the line below -->
    <!-- survey :survey="survey"></survey-->
    <!-- If you want to show survey editor, uncomment the line below -->
    <v-tabs
      color="black"
      show-arrows
      dark
      icons-and-text
    >
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab
        @click="newMode = false"
      >
        Importar desde spss
        <v-icon>cloud_upload</v-icon>
      </v-tab>
    </v-tabs>
    <polls-upload @editConfigPoll="saveConfigPoll" :currentConfigPoll="currentConfigPoll" :edit="edit" v-show="!newMode" @pollImported="saveImportedPoll"></polls-upload>

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
import {validations} from './../../utils/validations'
import PollsUpload from './PollsUpload'
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
  props: ['pollsProjectId'],
  name: 'app',
  components: {
    Survey,
    PollsUpload
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
      newMode: false,
      currentConfigPoll: null,
      edit: true,
      survey: model,
      searchPollsProject: '',
      nameConfigPolls: '',
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      valid: false,
      rules: validations,
      segmentations : {
        name: '',
        description: '',
        datos: {}
      }
    }
    namePoll = ''
  },
  methods: {
    ...mapActions('config-polls', { getConfigPolls: 'get' }),
    ...mapActions('category-segmantation-polls', { findCategorySegmantationPolls: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    saveConfigPoll (data) {
      const {ConfigPoll} = this.$FeathersVuex
        let config = new ConfigPoll(data)
        config.save().then((result) => {
          this.setSnackMessage('Registro modificado')
          this.setSnackColor('success')
          this.setShowSnack(true)
          this.$router.go(-1)
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          this.setSnackColor('error')
          console.log(err)
        })
    },
    saveImportedPoll (data) {
      let id  = data._id
      let fileKey = data.spss ? Object.keys(data.spss)[0] : ''
      const { ConfigPoll } = this.$FeathersVuex
      data.spss[fileKey].map(data => {
        Object.keys(data).forEach(function (key) {
          let str = data[key].toString()
          data[key]=str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        })
      })
      let configPoll = new ConfigPoll({
        construct : 'test',
        originalJson: data.spss[fileKey] ? data.spss[fileKey] : [],
        imported: true,
        take: data.take,
        name: data.name,
        dateFinished: data.dateFinished,
        status: data.status,
        country: data.country,
        province: data.province,
        canton: data.canton,
        _polls_project_id: this.$route.params.id
      });
      configPoll._id = id
      configPoll.save().then(result => {
        this.setSnackMessage('Registro editado')
        this.setSnackColor('success')
        this.setShowSnack(true)
        this.$router.go(-1)
      }).catch(err => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        this.setSnackColor('error')
        console.log(err)
      })
    },
    getDataConfig (id) {
      this.getConfigPolls(id).then(result => {
        this.currentConfigPoll = Object.assign({}, result)
      }).catch(err => console.log('este es el error', err))
    },
    getData (value) {
       if (value) {
        this.savePolls(JSON.parse(value).pages[0].name, value)
       }
    },
    gotoList () {
       let name = ''
       if (!this.$route.params.data) {
         name = 'view-polls-project'
       } else {
         name = 'question-builder'
       }
       this.$router.push('/' + name +'/' + this.$route.params.id)
    },
    NameChange () {
      if (this.nameConfigPolls !== '') {
        this.valid = true
      }
    }
  },
  created () {
    this.getDataConfig(this.$route.params.id)
  },
  computed: {
    ...mapGetters('polls-project', {findPollsProjectInStore: 'find'})
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
