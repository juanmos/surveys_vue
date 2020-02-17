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
        /* tooltip: {
          //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <span style="color:{point.color}"> Total:</span><b>{point.total}</b><br/>'
        }, */
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
