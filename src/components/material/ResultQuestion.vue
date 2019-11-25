<template>
  <v-card
  >
  <v-card
    :color="color"
    class="v-card--material__header"
    dark
  >
  <span style="">
    <h4 style="font-weight: bold; margin-left: 10px;padding-top:10px;"
      class="title mb-2"
      v-text="text"
    >
  </h4>
  </span>
  <span style="margin-left: 10px;padding-top:10px;">
    <v-icon
      size="20"
    >
    dehaze
    </v-icon>
  </span>
  </v-card>
  <div style="margin-bottom: 20px;">
    <label style="margin-left: 20px;font-weight:bold;">
      <span style="margin-right: 10px;">
        <v-icon
          style="padding-top: 15px;"
          size="20"
          color="blue"
        >
        adjust
        </v-icon>
      </span>Pregunta: <span>{{currentQuestion.label}}</span>
      <v-radio-group v-model="graphicType" row label="Tipo de gráfico: " style="margin-left: 23px;">
        <v-radio label="Columna" value="column"></v-radio>
        <v-radio label="Pastel" value="pie"></v-radio>
        <v-radio label="Barras" value="bar"></v-radio>
        <v-radio label="Lineal" value="line"></v-radio>
      </v-radio-group>
    </label>
  </div>
  <chart v-if="graphicType === 'column'" :question="currentQuestion" :graphicType="graphicType"></chart>
  <chart-pie v-if="graphicType === 'pie'" :question="currentQuestion" :graphicType="graphicType"></chart-pie>
  <chart-bar v-if="graphicType === 'bar'" :question="currentQuestion" :graphicType="graphicType"></chart-bar>
  <chart-line v-if="graphicType === 'line'" :question="currentQuestion" :graphicType="graphicType"></chart-line>

  </v-card>
</template>

<script>
import Chart from './../../components/highcharts/Chart'
import ChartPie from './../../components/highcharts/ChartPie'
import ChartBar from './../../components/highcharts/ChartBar'
import ChartLine from './../../components/highcharts/ChartLine'
export default {
  inheritAttrs: false,
  props: {
    question: {
      type: Object
    }
  },
  data: (state) => ({
    currentQuestion: {},
    graphicType: 'column',
    color: '#858d8e',
    text: ''
  }),
  methods: {
    getQuestionsPage (questions) {
      // this.questionsPage = questions.filter(question => question.page === this.title)
    }
  },
  computed: {
    get () {
      return this.$slots.header ||
        this.$slots.offset ||
        this.title ||
        this.text
    }
  },
  created () {
    // console.log('questions--', this.questions);
    this.currentQuestion = this.question
  },
  watch: {
    question: function (val) {
      // console.log('va---', val);
    }
  },
  components: {Chart, ChartPie, ChartBar, ChartLine}
}
</script>

<style lang="scss">

</style>
