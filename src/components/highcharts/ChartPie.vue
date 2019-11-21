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
          type: 'pie',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: 'rgb(48, 48, 48)'
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
            data: this.question.columnChart
          }
        ],
        title: {
          text: '',
          style: {
            'color': '#fff'
          }
        },
        xAxis: {
          type: 'category',
          labels: {
            overflow: 'justify',
            style: {
              color: '#FFF',
              'font-weight': 'bold'
            }
          }
        },
        yAxis: {
          min: 0,
          style: {
            color: '#fff',
            'font-weight': 'bold'
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
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              connectorColor: 'silver'
            }
          }
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#FFF'
          }
        },
        tooltip: {
          //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <span style="color:{point.color}"><br/>'
        }
      } : {}
    },
    getType () {
      return this.dataChart
    }
  },
  watch: {},
  components: {}
}
</script>

<style scoped>
</style>
