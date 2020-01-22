<template>
  <!--<v-btn @click="SaveData">Guardar</v-btn>-->
    <div id="surveyElement">
            <survey :survey='survey'/>
        </div>
</template>

<script>
import {mapActions} from 'vuex'
//  import * as SurveyEditor from 'surveyjs-editor'
import * as SurveyVue from 'survey-vue'
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
  el: 'surveyElement',
  data () {
    return {
      dataValue: '',
      miJson: "{'pages': [{'name': 'primerito'}]}",
      loaded: false,
      survey: SurveyVue
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
    this.editor = new SurveyVue.Model({'pages': [{'name': 'primerito'}]})
  },
  created () {
    // let editorOptions = { showEmbededSurveyTab: true }
    // SurveyEditor.editorLocalization.currentLocale = 'es'
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
    this.editor = new SurveyVue.Model({'pages': [{'name': 'primerito'}]})
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
