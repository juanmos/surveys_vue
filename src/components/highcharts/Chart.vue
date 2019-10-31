<template>
  <highcharts :options="getChartOptions"></highcharts>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['question', 'graphicType'],
  data: (state) => ({
    dataChart: [],
    type: 'column',
    chartOptions: {
      series: [{
        data: [1, 2, 3] // sample data
      }]
    },
    currentQuestion: {}
  }),
  methods: {},
  computed: {
    ...mapState([
      'currentEnv'
    ]),
    getChartOptions () {
      return {
        chart: {
          type: this.type,
          backgroundColor: 'rgb(48, 48, 48)'
        },
        title: {
          text: '',
          style: {
            'color': '#fff'
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          min: 0,
          style: {
            color: '#fff'
          },
          title: {
            text: '',
            align: 'high',
            style: {
              color: '#fff'
            }
          },
          labels: {
            overflow: 'justify',
            style: {
              color: '#FFF'
            }
          }
        },
        legend: {
          enabled: false,
          itemStyle: {
            color: '#FFF'
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y:.1f}%'
            }
          }
        },
        series: [
          {
            name: this.currentQuestion.label,
            colorByPoint: true,
            data: this.currentQuestion.columnChart
          }
        ],
        labels: {
          overflow: 'justify',
          style: {
            color: '#FFF'
          }
        },
        tooltip: {
          //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <span style="color:{point.color}"> Total:</span><b>{point.total}</b><br/>'
        }
      }
    },
    getType () {
      return this.dataChart
    }
  },
  created () {
    // console.log('questions--', this.questions);
    this.currentQuestion = this.question
  },
  watch: {
    question: function (val) {
      this.currentQuestion = val
      this.draw()
    },
    graphicType: function (val) {
      this.type = val.value
      this.draw()
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
