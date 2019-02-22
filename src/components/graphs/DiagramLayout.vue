<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-actions>
          <v-select v-model="columns" :items="items" label="Columnas"></v-select>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-container v-bind="{ [`grid-list-${size}`]: true }" fluid>
          <v-layout row wrap>
            <v-flex
              v-for="q in questions"
              :key="q.code"
              :xs4="getCols.x4"
              :xs6="getCols.x6"
              :xs12="getCols.x12"
            >
              <v-card flat tile>
                <diagram-switcher :question="q">
                </diagram-switcher>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import BarGraph from './BarGraph'
import PieGraph from './PieGraph'
import DiagramSwitcher from './DiagramSwitcher'
export default {
  props: ['questions', 'layout'],
  data: () => ({
    columns: 1,
    size: 'md',
    items: [1, 2, 3]
  }),
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  },
  computed: {
    getCols () {
      return {
        x4: this.columns === 3,
        x6: this.columns === 2,
        x12: this.columns === 1
      }
    }
  },
  components: {BarGraph, PieGraph, DiagramSwitcher}
}
</script>

<style>

</style>
