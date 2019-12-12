<template>
  <div id="pdfSurvey">
    <button @click="saveToPdf">Save to PDF</button>
    <survey :survey="survey"></survey>
  </div>
</template>
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>
<script>
import * as SurveyVue from 'survey-vue'
import 'survey-vue/survey.css'
import * as widgets from 'surveyjs-widgets'
import * as SurveyPDF from 'survey-pdf';
widgets.signaturepad(SurveyVue)
SurveyVue.StylesManager.applyTheme('default')
var Survey = SurveyVue.Survey

export default {
  props: ['jsonData', 'answers'],
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
          // format: [440, 500]
      };
      var surveyPDF = new SurveyPDF.SurveyPDF(this.jsonData, options)
      surveyPDF.data = this.model.data;
      surveyPDF.save(this.jsonData.title)
      // saveSurveyToPdf('surveyResult.pdf', this.survey, 595 * 2, 792 * 2);
    }
  },
  mounted () {
    this.model = new SurveyVue.Model({pages: this.jsonData.pages})
    this.model.data =
      {
        "pregunta1" : "01",
        "pregunta2" : "No",
        "pregunta3" : "Si",
        "pregunta4" : "Si",
        "pregunta5" : "2",
        "pregunta62" : {
            "Satisfacción con su proveedor de servicio de agua potable" : "2",
            "Satisfacción con su proveedor de servicio de telefonía fija" : "4",
            "Satisfacción con su proveedor de servicio de telefonía celular" : "5",
            "Satisfacción con su proveedor de servicios bancarios (institución con la que más opera)" : "4",
            "Satisfacción con su proveedor de servicio de internet" : "4"
        },
        "pregunta10" : "tete",
        "pregunta6" : "5",
        "pregunta11" : "4",
        "pregunta9" : "2",
        "pregunta13" : "5",
        "pregunta14" : "4",
        "pregunta15" : "5",
        "pregunta7" : "4",
        "pregunta16" : "5",
        "pregunta17" : "5",
        "pregunta18" : "4",
        "pregunta19" : "6",
        "pregunta20" : "8",
        "pregunta21" : "5",
        "pregunta22" : "3",
        "pregunta23" : "4",
        "pregunta24" : "1",
        "pregunta25" : "3",
        "pregunta26" : "5",
        "pregunta27" : "7",
        "pregunta28" : "4",
        "pregunta29" : "3",
        "pregunta30" : "4",
        "pregunta31" : "4",
        "pregunta32" : "5",
        "pregunta33" : "10",
        "pregunta34" : "4",
        "pregunta35" : "3",
        "pregunta36" : "3",
        "pregunta37" : "1",
        "pregunta40" : "4",
        "pregunta41" : "3",
        "pregunta42" : "3",
        "pregunta43" : "5",
        "pregunta44" : "respuesta de 41",
        "pregunta45" : "respues de 42",
        "pregunta46" : "respuesta de 43",
        "pregunta47" : "res 44",
        "pregunta48" : "res 45",
        "pregunta49" : "res 46",
        "pregunta50" : "res 47",
        "pregunta51" : "Femenino",
        "pregunta52" : "res 49",
        "pregunta53" : "res 50",
        "pregunta54" : "res 51",
        "pregunta55" : "11",
        "pregunta56" : "res 53",
        "pregunta57" : "res 54",
        "pregunta58" : "res 55",
        "pregunta59" : "res 56",
        "pregunta60" : "res 57"
    }
    this.survey = this.model
  },
  created () {
  },
  watch: {
    jsonData (val) {
      // console.log('mi data recibida ', dat)
      this.model = new SurveyVue.Model({ pages: val.pages})
      this.model.data =
        {
          "pregunta1" : "01",
          "pregunta2" : "No",
          "pregunta3" : "Si",
          "pregunta4" : "Si",
          "pregunta5" : "2",
          "pregunta62" : {
              "Satisfacción con su proveedor de servicio de agua potable" : "2",
              "Satisfacción con su proveedor de servicio de telefonía fija" : "4",
              "Satisfacción con su proveedor de servicio de telefonía celular" : "5",
              "Satisfacción con su proveedor de servicios bancarios (institución con la que más opera)" : "4",
              "Satisfacción con su proveedor de servicio de internet" : "4"
          },
          "pregunta10" : "tete",
          "pregunta6" : "5",
          "pregunta11" : "4",
          "pregunta9" : "2",
          "pregunta13" : "5",
          "pregunta14" : "4",
          "pregunta15" : "5",
          "pregunta7" : "4",
          "pregunta16" : "5",
          "pregunta17" : "5",
          "pregunta18" : "4",
          "pregunta19" : "6",
          "pregunta20" : "8",
          "pregunta21" : "5",
          "pregunta22" : "3",
          "pregunta23" : "4",
          "pregunta24" : "1",
          "pregunta25" : "3",
          "pregunta26" : "5",
          "pregunta27" : "7",
          "pregunta28" : "4",
          "pregunta29" : "3",
          "pregunta30" : "4",
          "pregunta31" : "4",
          "pregunta32" : "5",
          "pregunta33" : "10",
          "pregunta34" : "4",
          "pregunta35" : "3",
          "pregunta36" : "3",
          "pregunta37" : "1",
          "pregunta40" : "4",
          "pregunta41" : "3",
          "pregunta42" : "3",
          "pregunta43" : "5",
          "pregunta44" : "respuesta de 41",
          "pregunta45" : "respues de 42",
          "pregunta46" : "respuesta de 43",
          "pregunta47" : "res 44",
          "pregunta48" : "res 45",
          "pregunta49" : "res 46",
          "pregunta50" : "res 47",
          "pregunta51" : "Femenino",
          "pregunta52" : "res 49",
          "pregunta53" : "res 50",
          "pregunta54" : "res 51",
          "pregunta55" : "11",
          "pregunta56" : "res 53",
          "pregunta57" : "res 54",
          "pregunta58" : "res 55",
          "pregunta59" : "res 56",
          "pregunta60" : "res 57"
      }
      this.survey = this.model
    }
  }
}
</script>
