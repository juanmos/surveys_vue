<template>
<div id="surveyEditorContainer">
</div>
</template>

<script>
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
  name: 'survey-editor',
  data () {
    return {
      dataValue: ''
    }
  },
  methods: {
    sendData (data) {
      this.$emit('dataSubmited', data)
    }
  },
  mounted () {
    // questionTypes: ['text', 'checkbox', 'radiogroup', 'dropdown', 'comment', 'rating', 'boolean', 'html', 'matrix']
    let editorOptions = { showEmbededSurveyTab: true, questionTypes: ['text', 'checkbox', 'radiogroup', 'dropdown', 'comment', 'rating', 'boolean', 'html', 'matrix', 'matrixdropdown', 'matrixdynamic'] }
    this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)
    // this.editor.saveSurveyFunc = () => {
    this.dataValue = this.editor.saveSurveyFunc = function () {
      console.log('mi json ', JSON.parse(this.text))
      // dats = JSON.parse(this.text)
      // this.sendData(dats)
      this.dataValue = JSON.parse(this.text)
      send(this.text)
      // return this.text
      // datamu(JSON.parse(this.text))
      // this.sendData(JSON.stringify(this.text))
    }
    let send = (data) => this.sendData(data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
