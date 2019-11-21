<template>
  <v-card
  >
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
      </v-radio-group>
    </label>
  </div>
  <chart v-if="graphicType === 'column'" :question="currentQuestion" :graphicType="graphicType"></chart>
  <chart-pie v-if="graphicType === 'pie'" :question="currentQuestion" :graphicType="graphicType"></chart-pie>

  </v-card>
</template>

<script>
import Chart from './../../components/highcharts/Chart'
import ChartPie from './../../components/highcharts/ChartPie'
export default {
  inheritAttrs: false,
  props: {
    question: {
      type: Object
    }
  },
  data: (state) => ({
    currentQuestion: {},
    graphicType: 'column'
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
  components: {Chart, ChartPie}
}
</script>

<style lang="scss">

</style>
