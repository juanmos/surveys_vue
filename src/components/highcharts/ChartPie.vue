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
            data: this.question.columnChart
          }
        ],
        title: {
          text: '',
          style: {
            'color': '#000'
          }
        },
        legend: {
          enabled: true,
          itemStyle: {
            color: '#000'
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
            },
            showInLegend: true
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
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.percentage:.1f}%</b> <span style="color:{point.color}"><br/>'
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
