<template>
<div id="surveyEditorContainer" class="surveyContainer">
</div>
</template>

<script>
import * as SurveyEditor from 'surveyjs-editor'
import 'surveyjs-editor/surveyeditor.css'
import * as SurveyKo from 'survey-knockout'
import * as widgets from 'surveyjs-widgets'
import {mapGetters, mapActions} from 'vuex'
import 'inputmask/dist/inputmask/phone-codes/phone.js'
widgets.icheck(SurveyKo)
widgets.select2(SurveyKo)
widgets.inputmask(SurveyKo)
widgets.jquerybarrating(SurveyKo)
widgets.jqueryuidatepicker(SurveyKo)
// widgets.nouislider(SurveyKo)
widgets.select2tagbox(SurveyKo)
// widgets.signaturepad(SurveyKo)
// widgets.sortablejs(SurveyKo)
widgets.ckeditor(SurveyKo)
widgets.autocomplete(SurveyKo)
// widgets.bootstrapslider(SurveyKo)

export default {
  name: 'survey-editor',
  listQuestionCategories: [
    {
      value: '0',
      text: 'Seleccionar'
    }
  ],
  listGraphics: [
    {
      value: 'column',
      text: 'Columna'
    },
    {
      value: 'pie',
      text: 'Pastel'
    },
    {
      value: 'bar',
      text: 'Barra'
    },
    {
      value: 'line',
      text: 'Lineal'
    }
  ],
  data () {
    return {
      dataValue: ''
    }
  },
  methods: {
    ...mapActions('question-categories', { findQuestionCategories: 'find' }),
    sendData (data) {
      this.$emit('dataSubmited', data)
    },
    configPoll () {
      /* SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'category',
        default: 0,
        choices: this.listQuestionCategories
      }) */
      SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'grafico',
        default: 0,
        choices: [
          {
            value: '0',
            text: 'Seleccionar'
          },
          {
            value: 'column',
            text: 'Columna'
          },
          {
            value: 'pie',
            text: 'Pastel'
          },
          {
            value: 'bar',
            text: 'Barra'
          },
          {
            value: 'line',
            text: 'Lineal'
          }
        ]
      })
      SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'segmentacion:boolean',
        default: false
      })
      SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'audio:boolean',
        default: false
      })
      SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'derivado:boolean',
        default: false
      })
      SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'notoriedad:boolean',
        default: false
      })
      SurveyEditor.editorLocalization.currentLocale = 'es'
      // SurveyEditor.StylesManager.applyTheme('winterstone')
      let editorOptions = { showEmbededSurveyTab: true, questionTypes: ['text', 'checkbox', 'radiogroup', 'file', 'dropdown', 'comment', 'boolean', 'multipletext', 'matrix', 'matrixdropdown', 'matrixdynamic'] }
      this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)
      this.dataValue = this.editor.saveSurveyFunc = function () {
        this.dataValue = JSON.parse(this.text)
        send(this.text)
      }
      let send = (data) => this.sendData(data)
    }
  },
  computed: {
    ...mapGetters('question-categories', {findQuestionCategoriesInStore: 'find'})
  },
  mounted () {
    this.findQuestionCategories({$skip: 0, $limit: null, removed: false}).then(response => {
      if (response.data.length > 0) {
        let list = response.data.map(category => {
          return { 'value': category.code, 'text': category.name }
        })
        this.listQuestionCategories = [ ...[{
          value: '0',
          text: 'Ninguno'
        }], ...list]
      }
      this.configPoll()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .surveyContainer >>> .svd_commercial_container {
    display: none;
  }
</style>
