<template>
  <!--<v-btn @click="SaveData">Guardar</v-btn>-->
  <div id="surveyEditorContainer">
</div>
</template>

<script>
import {mapActions} from 'vuex'
import * as SurveyEditor from 'surveyjs-editor'
import 'surveyjs-editor/surveyeditor.css'

import * as SurveyKo from 'survey-knockout'
import * as widgets from 'surveyjs-widgets'
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
  props: ['jsonData'],
  name: 'survey-editor',
  data () {
    return {
      dataValue: '',
      miJson: "{'pages': [{'name': 'primerito'}]}",
      loaded: false,
      flag: 0
    }
  },
  methods: {
    ...mapActions('config-polls', { findConfigPolls: 'find' }),
    sendData (data) {
      this.$emit('dataSubmited', data)
    },
    changeData () {
      this.editor.text = this.jsonData
    }
  },
  mounted () {
    // console.log('tengo la siguiente data ', this.jsonData)
    if (this.flag === 0) {
      let editorOptions = { showEmbededSurveyTab: true, questionTypes: ['text', 'checkbox', 'radiogroup', 'file', 'dropdown', 'comment', 'boolean', 'multipletext', 'matrix', 'matrixdropdown', 'matrixdynamic'] }
      this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)
      /* this.editor.survey = function () {
        this.surveyValue()['setJsonObject'](this.jsonData)
      } */
      /* this.editor.initSurvey = function (json = this.jsonData) {
      } */
      // this.editor.text = "{'pages': [{'name': 'asde'}]}"
      // this.editor.text = this.jsonData
      // this.editor.saveSurveyFunc = () => {
      this.editor.saveSurveyFunc = function () {
        // console.log('mi json ', JSON.parse(this.text))
        // dats = JSON.parse(this.text)
        // this.sendData(dats)
        // this.dataValue = JSON.parse(this.text)
        // this.text = "{pages: [{'name': 'bla blae'}]}"
        send(this.text)
        // return this.text
        // datamu(JSON.parse(this.text))
        // this.sendData(JSON.stringify(this.text))
      }
      // let enviar = this.miJson
      /* this.dataJson =
        "{pages: [{'name': 'bla blae'}]}"
      } */
      let send = (data) => this.sendData(data)
      // this.editor.text = this.jsonData
    }
    this.flag = 1
    // this.editor.loadSurvey('d5220f76-4802-40cf-ad67-61d7e55608e5')
  },
  created () {
    let editorOptions = { showEmbededSurveyTab: true }
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
    this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)
  },
  watch: {
    jsonData (dat) {
      this.changeData()
    }
  }
}
</script>

<style scoped>
</style>
