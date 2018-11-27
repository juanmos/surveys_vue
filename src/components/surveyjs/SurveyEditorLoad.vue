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
widgets.nouislider(SurveyKo)
widgets.select2tagbox(SurveyKo)
// widgets.signaturepad(SurveyKo)
widgets.sortablejs(SurveyKo)
widgets.ckeditor(SurveyKo)
widgets.autocomplete(SurveyKo)
widgets.bootstrapslider(SurveyKo)
export default {
  props: ['jsonData'],
  name: 'survey-editor',
  data () {
    return {
      dataValue: '',
      miJson: "{'pages': [{'name': 'primerito'}]}",
      loaded: false
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
    let editorOptions = { showEmbededSurveyTab: true }
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

    // this.editor.loadSurvey('d5220f76-4802-40cf-ad67-61d7e55608e5')
  },
  created () {
    let editorOptions = { showEmbededSurveyTab: true }
    this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)
    // console.log('mi data recibida ', this.jsonData)
    // this.editor.text = this.jsonData
  },
  watch: {
    jsonData (dat) {
      // console.log('mi data recibida ', dat)
      this.changeData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
