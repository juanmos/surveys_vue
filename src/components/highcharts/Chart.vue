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
    type: 'column'
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
    enabled: false
  },
  plotOptions: {
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
            text: val.label
          },
          series: [
            {
              name: val.label,
              colorByPoint: true,
              data: val.columnChart
            }
          ],
          credits: {
            enabled: false
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
