<template>
  <div class="">
    <highcharts :options="getChartOptions"
                :update-args="updateArgs"></highcharts>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    graphicType: {
      type: String,
      required: true
    }
  },
  data: () => ({
    dataChart: [],
    currentQuestion: {}
  }),
  methods: {},
  computed: {
    updateArgs () {
      return [true, true, { duration: 1000 }]
    },
    getChartOptions () {
      return (this.question) ? {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: 'Agrado y Conocimiento'
        },
        xAxis: [{
          categories: this.question.categories
        }],
        yAxis: {
          title: {
            text: ''
          }
        },
        tooltip: {
          shared: true,
          valueSuffix: ' %'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              inside: true,
              enabled: true,
              format: '{point.y:.1f}%'
            }
          }
        },
        series: this.question.series
      } : {}
    },
    getType () {
      return this.dataChart
    }
  },
  watch: {
    /* graphicType: function (val) {
      console.log('val--', val)
      this.type = val
    } */
  },
  components: {}
}
</script>

<style scoped>
</style>
