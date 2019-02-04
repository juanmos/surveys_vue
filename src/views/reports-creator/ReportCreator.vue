<template>
    <div>
        <v-flex xs12>
            <v-card>
                <v-toolbar
                  flat
                >
                    <v-spacer></v-spacer>
                    <v-toolbar-items class="hidden-sm-and-down">
                        <v-tooltip bottom>
                        <v-btn
                            dark
                            flat
                            slot="activator"
                            @click="multipleMode = !multipleMode"
                            :color="!multipleMode ? 'primary' : 'grey'"
                        >
                            <v-icon right dark>crop_din</v-icon>
                        </v-btn>
                        <span><b>Modo Simple Pregunta</b></span>
                        </v-tooltip>
                        <v-tooltip bottom>
                        <v-btn
                            dark
                            flat
                            slot="activator"
                            @click="multipleMode = !multipleMode"
                            :color="multipleMode ? 'primary' : 'grey'"
                        >
                            <v-icon right dark>filter_none</v-icon>
                        </v-btn>
                        <span><b>Modo Multiples Preguntas</b></span>
                        </v-tooltip>
                    </v-toolbar-items>
                </v-toolbar>
                <v-layout  row wrap>
                    <v-flex class="questionsList" d-flex xs12 sm2 md2>
                        <v-card>
                            <v-card-title
                              primary class="title">
                                Preguntas
                              <v-spacer></v-spacer>
                            </v-card-title>
                            <draggable v-model="questions" :options="{group:'questions'}">
                                <template v-for="(item, key) in questions">
                                    <v-flex :key="item">
                                        <v-card class="mr-2 ml-2 mb-2 mt-2" dark :color="`primary`">
                                            <v-card-title>{{item}}{{key}}</v-card-title>
                                        </v-card>
                                    </v-flex>
                                </template>
                            </draggable>
                        </v-card>
                    </v-flex>
                    <v-flex d-flex xs12 sm10 md10>
                        <v-card v-if="multipleMode">
                            <v-card-title
                              primary class="title">
                                Tabla de Resultado
                              <v-spacer></v-spacer>
                            </v-card-title>

                            <v-flex xs12>
                                <draggable v-model="yQuestions" :options="{group:'questions'}">
                                    <v-card class="draggable" dark color="transparent">
                                        <v-card-text class="px-0"></v-card-text>
                                    </v-card>
                                </draggable>
                            </v-flex>
                            <v-flex xs1>
                                <draggable v-model="xQuestions" :options="{group:'questions'}">
                                    <v-card dark class="draggable draggable-x" color="transparent">
                                        <v-card-text class="px-0"></v-card-text>
                                    </v-card>
                                </draggable>
                            </v-flex>
                        </v-card>
                        <v-card v-else>
                            <v-card-title
                              primary class="title">
                                Tabla de Resultado
                              <v-spacer></v-spacer>
                            </v-card-title>

                            <v-flex xs12>
                                <draggable v-model="uniqueQuestion" :options="{group:'questions'}">
                                    <v-card class="draggable draggable-unique" dark color="white">
                                        <v-card-text class="px-0"></v-card-text>
                                        <component :is="graphComponent" :chart-data="getChartData"></component>
                                    </v-card>
                                </draggable>
                            </v-flex>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'

import BarGraph from './../../components/graphs/BarGraph'
import colors from './colors.js'

export default {
  props: ['id'],
  data: () => ({
    resultPoll: null,
    yQuestions: [],
    xQuestions: [],
    uniqueQuestion: [],
    questions: [],
    multipleMode: false,
    graphComponent: 'BarGraph',
    chartData: {},
    labels: [],
    datasets: [],
    colors
  }),
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    getQuestionOptions (alias) {
      console.log('obtengo el alis', alias)
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    getPossibleResponses (key) {
      let resultPossibleValues = []
      resultPossibleValues.push([...new Set(Object.values(this.getTableDataValues.map(value => value[key])))])
      return resultPossibleValues
    },
    getRandomColor () {
      return this.colors[Math.floor((Math.random() * 25) + 1)]
    }
  },
  computed: {
    getTableVariableValues () {
      return this.resultPoll ? Object.values(this.resultPoll.originalJson)[0] : []
    },
    getTableDataValues () {
      return this.resultPoll ? this.resultPoll.originalJson.slice(1, this.resultPoll.originalJson.length) : []
    },
    getChartData () {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    }
  },
  watch: {
    yQuestions (val) {
      console.log('nuevo Valor', val)
    },
    uniqueQuestion (val) {
      console.log(val)
      let responses = []
      let keySelected = 'A'
      for (let key in this.getTableVariableValues) {
        if (this.getTableVariableValues[key] === val[0]) {
          keySelected = key
          responses = this.getPossibleResponses(key)
        }
      }
      console.log(responses[0].map(response => ({
        label: response,
        backgroundColor: this.getRandomColor(),
        data: [this.getTableDataValues.map(data => data[keySelected]).filter(responseRow => responseRow === response).length]
      })))
      this.labels = []
      this.datasets = responses[0].map(response => ({
        label: response,
        backgroundColor: this.getRandomColor(),
        data: [this.getTableDataValues.map(data => data[keySelected]).filter(responseRow => responseRow === response).length, this.getTableDataValues.map(data => data[keySelected]).filter(responseRow => responseRow === response).length]
      }))
    }
  },
  components: {
    draggable,
    BarGraph
  },
  mounted () {
    this.getPoll(this.id).then(result => {
      this.resultPoll = Object.assign({}, result)
      this.questions = this.resultPoll ? Object.values(Object.values(this.resultPoll.originalJson)[0]) : []
    })
  }
}
</script>

<style scoped>
    .draggable {
        border: 1px dotted #ccc !important;
    }
    .draggable-x {
        min-height: 600px;
    }
    .draggable-unique {
        min-height: 1000px;
    }
    .questionsList {
      max-height: 1000px;
      overflow: scroll;
    }
</style>
