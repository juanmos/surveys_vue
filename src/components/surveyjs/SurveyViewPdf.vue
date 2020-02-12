<template>
  <div id="pdfSurvey">
    <v-layout row wrap >
                 <v-flex md2 xs12>
                   <h2 style="color: white">ENCUESTA NUMERO: {{indexPoll}}</h2>
                 </v-flex>
                 <v-flex md2 xs12>
                   <v-btn
                   dark
                   small
                   color="primary"
                   @click="saveToPdf"
                   >
                       DESCARGAR
                   </v-btn>
                 </v-flex>
    </v-layout>
    <survey :survey="survey"></survey>
  </div>
</template>
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>
<script>
import * as SurveyVue from 'survey-vue'
import 'survey-vue/survey.css'
import * as widgets from 'surveyjs-widgets'
import * as SurveyPDF from 'survey-pdf'
widgets.signaturepad(SurveyVue)
SurveyVue.StylesManager.applyTheme('default')
var Survey = SurveyVue.Survey

export default {
  props: ['jsonData', 'dataResponse', 'indexPoll'],
  components: {
    Survey
  },
  data () {
    // model = new SurveyVue.Model({ pages: this.jsonData.pages})
    return {
      survey: new SurveyVue.Model({}),
      model: null,
    }
  },
  methods: {
    saveToPdf () {
      console.log('pdf print');
      var options = {
          fontSize: 14,
          margins: {
              left: 10,
              right: 10,
              top: 10,
              bot: 10
          },
        //  format: [595, 792]
      }
      var surveyPDF = new SurveyPDF.SurveyPDF(this.jsonData, options)
    /*   surveyPDF.onRenderHeader.add(function (_, canvas) {
        canvas.drawText({
            // text: 'ENCUESTAS REALIZADO POR PROPRAXIS S.A.',
            fontSize: 10
        });
    }) */
      surveyPDF.data = this.model.data;
      surveyPDF.save(this.jsonData.title)
      // saveSurveyToPdf('surveyResult.pdf', this.survey, 595 * 2, 792 * 2);
    }
  },
  created () {
    this.model = new SurveyVue.Model({pages: this.jsonData.pages})
    this.model.data = this.dataResponse
    this.survey = this.model
    this.survey.mode = 'display'
  },
  watch: {
     jsonData (val) {
      // console.log('mi data recibida ', val)
      this.model = new SurveyVue.Model({ pages: val.pages})
      this.model.data = this.dataResponse
      this.survey = this.model
      this.survey.mode = 'display'
     },
     dataResponse (val) {
      this.model.data = this.dataResponse
    }
  }
}
</script>
