<template>
       <v-flex x12>
         <div id="highCharts"></div>
       </v-flex>
</template>

<script>
import { mapState } from 'vuex'
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)
Highcharts.setOptions({
  chart: {
    type: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.0)'
  },
  subtitle: {
    text: ''
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: ''
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
  tooltip: {
  //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <span style="color:{point.color}"> Total:</span><b>{point.total}</b><br/>'
  }
})
export default {
  props: ['question'],
  data: (state) => ({
    dataChart: []
  }),
  methods: {
    draw () {

    }
  },
  mounted () {
    this.draw()
  },
  computed: {
    ...mapState([
      'currentEnv'
    ]),
    getChart () {
      return this.dataChart
    }
  },
  watch: {
    question: function (val) {
      if (val.columnChart) {
        this.dataChart = val.columnChart
        this.highcharts = new Highcharts.Chart('highCharts', {
          title: {
            text: val.label,
            style: {
              'color': '#fff'
            }
          },
          xAxis: {
            labels: {
              overflow: 'justify',
              style: {
                color: '#FFF'
              }
            },
            title: {
              style: {
                color: '#fff'
              }
            }
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
          series: [
            {
              name: val.label,
              colorByPoint: true,
              data: val.columnChart
            }
          ],
          labels: {
            overflow: 'justify',
            style: {
              color: '#FFF'
            }
          }
        })
      }
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
