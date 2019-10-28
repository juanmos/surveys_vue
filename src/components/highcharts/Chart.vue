<template>
       <v-container>
           <v-layout xs12>
             <div id="highCharts" ></div>
           </v-layout>
       </v-container>
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
    itemStyle: {
      color: '#FFF',
      fontWeight: 'bold'
    }
  },
  labels: {
    style: {
      color: '#F5F5F5',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      textOverflow: 'ellipsis',
      'text-shadow': '2px 2px #000'
    }
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
  credits: {
    enabled: false
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
                color: '#FFF'
              }
            }
          },
          yAxis: {
            min: 0,
            style: {
              color: '#FFF'
            },
            title: {
              text: 'Porcentaje de votos',
              align: 'high',
              style: {
                color: '#FFF'
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
          ]
        })
      }
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
