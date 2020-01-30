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
  <div v-if="currentQuestion.questionCombination" style="margin-bottom: 20px;">
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
      <div class="">
        <v-btn v-if="!isViewDetail" @click="goToDetail">Detalle</v-btn>
      </div>
  </div>
  <div v-else style="margin-bottom: 20px;">
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
      <v-menu
        bottom
        transition="slide-y-transition"
      >
        <v-btn
          slot="activator"
          dark
          fab
          small
        >
        <v-icon>keyboard_arrow_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="sortOriginal()">
            <v-icon color="primary">trending_flat</v-icon> <v-list-tile-title>Orden de la encuesta</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="sortMinorToMajor()">
           <v-icon color="primary">trending_up</v-icon> <v-list-tile-title>Ordenar de menor a mayor</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="sortMajorToMinor()">
            <v-icon color="primary">trending_down</v-icon> <v-list-tile-title>Ordenar de mayor a menor</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn v-if="!isViewDetail" @click="goToDetail">Detalle</v-btn>
  </div>
  <div v-if="currentQuestion.questionCombination">
    <chart-spline-column :graphicType="graphicType" :question="currentQuestion"></chart-spline-column>
  </div>
  <div v-else>
    <div v-if="graphicType === 'column'">
      <chart v-if="original === true" :question="currentQuestion" :graphicType="graphicType"></chart>
      <chart-sort-minor v-if="sortMinor === true && original === false" :question="currentQuestion" :graphicType="graphicType"></chart-sort-minor>
      <chart-sort-major v-if="sortMinor === false  && original === false" :question="currentQuestion" :graphicType="graphicType"></chart-sort-major>
    </div>

    <div v-if="graphicType === 'bar'">
      <chart-bar  v-if="original === true" :question="currentQuestion" :graphicType="graphicType"></chart-bar>
      <chart-bar-sort-minor  v-if="sortMinor === true && original === false" :question="currentQuestion" :graphicType="graphicType"></chart-bar-sort-minor>
      <chart-bar-sort-major  v-if="sortMinor === false && original === false" :question="currentQuestion" :graphicType="graphicType"></chart-bar-sort-major>
    </div>
    <div v-if="graphicType === 'line'">
      <chart-line v-if="original === true" :question="currentQuestion" :graphicType="graphicType"></chart-line>
      <chart-line-sort-minor v-if="sortMinor === true && original === false" :question="currentQuestion" :graphicType="graphicType"></chart-line-sort-minor>
      <chart-line-sort-major v-if="sortMinor === false && original === false" :question="currentQuestion" :graphicType="graphicType"></chart-line-sort-major>
    </div>

    <chart-pie v-if="graphicType === 'pie'" :question="currentQuestion" :graphicType="graphicType"></chart-pie>
  </div>
  </v-card>
</template>

<script>
import Chart from './../../components/highcharts/Chart'
import ChartSortMinor from './../../components/highcharts/ChartSortMinor'
import ChartSortMajor from './../../components/highcharts/ChartSortMajor'
import ChartPie from './../../components/highcharts/ChartPie'
import ChartBar from './../../components/highcharts/ChartBar'
import ChartBarSortMajor from './../../components/highcharts/ChartBarSortMajor'
import ChartBarSortMinor from './../../components/highcharts/ChartBarSortMinor'
import ChartLine from './../../components/highcharts/ChartLine'
import ChartLineSortMinor from './../../components/highcharts/ChartLineSortMinor'
import ChartLineSortMajor from './../../components/highcharts/ChartLineSortMajor'
import ChartSplineColumn from './../../components/highcharts/ChartSplineColumn'
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
    sortMinor: false,
    original: true,
    graphicType: 'column',
    color: '#858d8e',
    text: ''
  }),
  methods: {
    goToDetail () {
      this.$emit('openModalQuestionDetail', this.currentQuestion)
    },
    sortOriginal () {
      this.original = true
      this.sortMinor = false
    },
    sortMinorToMajor () {
      this.original = false
      this.sortMinor = true
    },
    sortMajorToMinor () {
      this.original = false
      this.sortMinor = false
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
  components: {Chart, ChartPie, ChartBar, ChartLine, ChartSortMinor, ChartSortMajor, ChartBarSortMajor, ChartBarSortMinor, ChartLineSortMinor, ChartLineSortMajor, ChartSplineColumn}
}
</script>

<style lang="scss">

</style>
