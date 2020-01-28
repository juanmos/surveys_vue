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
      return [true, true, { duration: 0 }]
    },
    getColumnChart () {
      return (this.question.columnChartMajorToMinor) ? this.question.columnChartMajorToMinor : []
    },
    getChartOptions () {
      return (this.question) ? {
        chart: {
          type: 'column',
          backgroundColor: 'white'
        },
        pane: {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90
        },
        series: [
          {
            name: this.question.label,
            colorByPoint: true,
            data: this.getColumnChart // this.question.columnChart
          }
        ],
        title: {
          text: '',
          style: {
            'color': '#000'
          }
        },
        xAxis: {
          type: 'category',
          labels: {
            overflow: 'justify',
            style: {
              color: '#000',
              'font-weight': 'bold'
            }
          }
        },
        yAxis: {
          min: 0,
          style: {
            color: '#000',
            'font-weight': 'bold'
          },
          title: {
            text: '',
            align: 'high',
            style: {
              color: '#000'
            }
          },
          labels: {
            overflow: 'justify',
            style: {
              color: '#000'
            }
          }
        },
        legend: {
          enabled: false,
          itemStyle: {
            color: '#000'
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
        labels: {
          overflow: 'justify',
          style: {
            color: '#000'
          }
        },
        tooltip: {
          //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <span style="color:{point.color}"> Total:</span><b>{point.total}</b><br/>'
        }
      } : {}
    },
    getType () {
      return this.dataChart
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
