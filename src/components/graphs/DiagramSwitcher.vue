<template>
<v-card color="white">
    <v-toolbar color="grey darken-3" class="elevation-1">
      <div class="title">{{question.label}}</div>
        <v-spacer></v-spacer>

        <v-btn @click="move('back')" flat><v-icon>arrow_back</v-icon></v-btn>

        <v-btn @click="move('foward')" flat><v-icon>arrow_forward</v-icon></v-btn>

        <v-btn @click="currentGraph = 'BarGraph'" flat><v-icon>bar_chart</v-icon></v-btn>
        <v-btn @click="currentGraph = 'PieGraph'"  flat><v-icon>pie_chart</v-icon></v-btn>
    </v-toolbar>
    <component :chart-data="{
        datasets: question.dataset
        }"
        :is="currentGraph"
        :options="getOptions"
        >
    </component>
</v-card>
</template>

<script>
import BarGraph from './BarGraph'
import PieGraph from './PieGraph'
import Map from './Map'

export default {
  props: ['type', 'chart-data', 'question', 'index'],
  data: () => ({
    currentGraph: 'BarGraph'
  }),
  computed: {
    getOptions () {
      return this.currentGraph === 'PieGraph' ? {
        tooltips: {
          enabled: true,
          callbacks: {
            beforeLabel: (tooltipItems, data) => {
              let currentValue = data.datasets[0].data[tooltipItems.index]
              let totalValues = data.datasets[0].data.reduce((a, b) => {
                return a + b
              }, 0)
              return `${Math.floor(((currentValue / totalValues) * 100) + 0.5)} % `
            },
            label: (tooltipItems, data) => {
              let currentValue = data.datasets[0].data[tooltipItems.index]
              // this.showDetailModal = true
              // this.currentYear = tooltipItems.xLabel
              return `${currentValue}`
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            categoryPercentage: 0.5,
            barPercentage: 1,
            gridLines: {
              drawOnChartArea: false
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 10,
              stepSize: Math.ceil(this.maxVal / 10),
              max: this.maxVal
            },
            gridLines: {
              display: true
            }
          }]
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      } : {
        tooltips: {
          enabled: true
        }
      }
    }
  },
  methods: {
    move (direction) {
      this.$emit('move', {direction, index: this.index})
    }
  },
  components: { BarGraph, PieGraph, Map }
}
</script>

<style>

</style>
