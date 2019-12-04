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
      </label>
      <v-radio-group v-model="graphicType" row label="Tipo de gráfico: " style="margin-left: 23px;">
        <v-radio label="Columna" value="column"></v-radio>
        <v-radio label="Pastel" value="pie"></v-radio>
        <v-radio label="Barras" value="bar"></v-radio>
        <v-radio label="Lineal" value="line"></v-radio>
      </v-radio-group>
      <v-btn
        class="menuFloat"
        dark
        fab
        small
        title="IMAGEN SECUNDARIA"
        @click="sort = !sort">
        <v-icon>keyboard_arrow_down</v-icon>
      </v-btn>
      <v-btn v-if="!isViewDetail" @click="goToDetail">Detalle</v-btn>
  </div>
  <div v-if="graphicType === 'column'">
    <chart v-if="sort === true" :question="currentQuestion" :graphicType="graphicType" :sort="sort"></chart>
    <chart-sort v-if="sort === false" :question="currentQuestion" :graphicType="graphicType" :sort="sort"></chart-sort>
  </div>

  <div v-if="graphicType === 'bar'">
    <chart-bar  v-if="sort === true" :question="currentQuestion" :graphicType="graphicType"></chart-bar>
    <chart-bar-sort  v-if="sort === false" :question="currentQuestion" :graphicType="graphicType"></chart-bar-sort>
  </div>
  <div v-if="graphicType === 'line'">
    <chart-line v-if="sort === true" :question="currentQuestion" :graphicType="graphicType"></chart-line>
    <chart-line-sort v-if="sort === false" :question="currentQuestion" :graphicType="graphicType"></chart-line-sort>
  </div>

  <chart-pie v-if="graphicType === 'pie'" :question="currentQuestion" :graphicType="graphicType"></chart-pie>
  </v-card>
</template>

<script>
import Chart from './../../components/highcharts/Chart'
import ChartSort from './../../components/highcharts/ChartSort'
import ChartPie from './../../components/highcharts/ChartPie'
import ChartBar from './../../components/highcharts/ChartBar'
import ChartBarSort from './../../components/highcharts/ChartBarSort'
import ChartLine from './../../components/highcharts/ChartLine'
import ChartLineSort from './../../components/highcharts/ChartLineSort'
export default {
  inheritAttrs: false,
  props: {
    question: {
      type: Object
    },
    index: {
      type: Number
    },
    isViewDetail: {
      type: Boolean
    }
  },
  data: (state) => ({
    currentQuestion: {
      columnChart: []
    },
    sort: true,
    graphicType: 'column',
    color: '#858d8e',
    text: ''
  }),
  methods: {
    goToDetail () {
      this.$emit('openModalQuestionDetail', this.currentQuestion)
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
    this.currentQuestion = this.question
    this.currentQuestion.type = 'column'
  },
  watch: {
    question: function (val) {
      this.currentQuestion = val
      this.currentQuestion.type = 'column'
    }
  },
  components: {Chart, ChartPie, ChartBar, ChartLine, ChartSort, ChartBarSort, ChartLineSort}
}
</script>

<style lang="scss">

</style>
