<template>
<v-card color="white">
    <v-toolbar color="grey darken-3" class="elevation-1">
      <div class="title">{{question.label}}</div>
        <v-spacer></v-spacer>
        <v-btn @click="currentGraph = 'BarGraph'" flat><v-icon>bar_chart</v-icon></v-btn>
        <v-btn @click="currentGraph = 'PieGraph'"  flat><v-icon>pie_chart</v-icon></v-btn>
    </v-toolbar>
    <component :chart-data="{
        datasets: question.dataset
        }"
        :is="currentGraph"
        >
    </component>
</v-card>
</template>

<script>
import BarGraph from './BarGraph'
import PieGraph from './PieGraph'
import Map from './Map'

export default {
  props: ['type', 'chart-data', 'question'],
  data: () => ({
    currentGraph: 'BarGraph'
  }),
  components: {BarGraph, PieGraph, Map}
}
</script>

<style>

</style>
