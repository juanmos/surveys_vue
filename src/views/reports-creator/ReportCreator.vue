<template>
  <div>
    <v-flex xs12>
      <v-card>
        <v-toolbar flat>
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
              <span>
                <b>Modo Simple Pregunta</b>
              </span>
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
              <span>
                <b>Modo Multiples Preguntas</b>
              </span>
            </v-tooltip>
          </v-toolbar-items>
        </v-toolbar>
        <v-layout row wrap>
          <v-flex class="questionsList" d-flex xs12 sm2 md2>
            <v-card>
              <v-card-title primary class="title">
                Preguntas
                <v-spacer></v-spacer>
              </v-card-title>
              <draggable v-model="questions" :options="{group:'questions'}">
                <template v-for="item in questions">
                  <v-flex :key="item.original">
                    <v-card class="mr-2 ml-2 mb-2 mt-2" dark :color="`primary`">
                      <v-card-title>{{item.label}}</v-card-title>
                    </v-card>
                  </v-flex>
                </template>
              </draggable>
            </v-card>
          </v-flex>
          <v-flex d-flex xs12 sm10 md10>
            <v-card v-if="multipleMode">
              <v-card-title primary class="title">
                Tabla de Resultados
                <v-spacer></v-spacer>
                <v-btn title="Procesar" slot="activator" @click="processData()" flat>
                  <v-icon>build</v-icon>
                </v-btn>
              </v-card-title>

              <v-flex xs12 v-if="showTableResult === false">
                <draggable v-model="xQuestions" :options="{group:'questions'}">
                  <v-card class="draggable" dark color="transparent">
                    <v-card-text class="px-0"></v-card-text>
                  </v-card>
                </draggable>
              </v-flex>
              <v-layout class="table-wrap" row wrap v-if="showTableResult === false">
                <v-flex xs1>
                  <draggable v-model="yQuestions" :options="{group:'questions'}">
                    <v-card dark class="draggable draggable-y" color="transparent">
                      <v-card-text class="px-0"></v-card-text>
                    </v-card>
                  </draggable>
                </v-flex>
                <v-flex class="table-wrap" xs11>
                  <cross-table :xQuestions="xQuestions" :yQuestions="yQuestions"></cross-table>
                </v-flex>
              </v-layout>
              <v-flex d-flex xs12 sm12 md12 v-if="showTableResult === true">
                <v-card>
                  <table-result :results="answers"></table-result>
                </v-card>
              </v-flex>
            </v-card>
            <v-card v-else>
              <v-card-title primary class="title">
                <v-chip v-for="q in uniqueQuestion" :key="q.label + Math.random()">
                  <v-btn @click="delElement(q)" icon>
                    <v-icon color="grey">cancel</v-icon>
                  </v-btn>
                  <div>{{q.label}}</div>
                </v-chip>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn slot="activator" @click="saveGraphs" flat>
                    <v-icon>save</v-icon>
                  </v-btn>
                  <span>Guardar en panel</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn slot="activator" @click="graphComponent = 'BarGraph'" flat>
                    <v-icon>bar_chart</v-icon>
                  </v-btn>
                  <span>Mostrar Graficos</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn slot="activator" @click="graphComponent = 'Map'" flat>
                    <v-icon>place</v-icon>
                  </v-btn>
                  <span>Mostrar Mapa</span>
                </v-tooltip>
              </v-card-title>

              <v-flex xs12>
                <draggable v-model="uniqueQuestion" :options="{group:'questions'}">
                  <v-card
                    class="draggable draggable-unique"
                    dark
                    :color="graphComponent === 'Map' ? '' : 'white'"
                  >
                    <v-card-text class="px-0"></v-card-text>
                    <diagram-layout
                      v-if="graphComponent !== 'Map'"
                      :questions="getLayoutUniqueQuestion"
                      :layout="1"
                    ></diagram-layout>
                    <component
                      v-else
                      :is="graphComponent"
                      :chart-data="getChartData"
                      :markers="mapMarkers"
                      :mapQuestions="mapQuestions"
                    ></component>
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
import { mapActions, mapState } from 'vuex'

import enviroment from './../../../config/enviroment'
import BarGraph from './../../components/graphs/BarGraph'
import PieGraph from './../../components/graphs/PieGraph'
import Map from './../../components/graphs/Map'
import DiagramLayout from './../../components/graphs/DiagramLayout'
import CrossTable from './../../components/crossQuestionTables/crossTable'
import TableResult from './../../components/crossQuestionTables/TableResult'
import colors from './colors.js'
import icons from './icons.js'

export default {
  props: ['id'],
  data: () => ({
    resultPoll: null,
    yQuestions: [],
    xQuestions: [],
    answers: null,
    showTableResult: false,
    uniqueQuestion: [],
    questions: [],
    multipleMode: false,
    graphComponent: 'BarGraph',
    chartData: {},
    labels: [],
    datasets: [],
    mapMarkers: [],
    mapQuestions: [],
    urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase,
    colors,
    icons,
    dataKeys: ['direccion', 'telefono', 'nombres'],
    personalDataKeys: [],
    chip2: true
  }),
  methods: {
    ...mapActions('config-polls', { getPoll: 'get' }),
    ...mapActions(['setSnackMessage', 'setShowSnack']),
    getQuestionOptions (alias) {
      console.log('obtengo el alis', alias)
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    getPossibleResponses (key) {
      let resultPossibleValues = []
      resultPossibleValues.push([
        ...new Set(
          Object.values(this.getTableDataValues.map(value => value[key]))
        )
      ])
      return resultPossibleValues
    },
    getRandomColor () {
      return this.colors[Math.floor(Math.random() * 25 + 1)]
    },
    getRandomIcon () {
      return `${this.urlEnviroment}/images/map-icons/${
        this.icons[Math.floor(Math.random() * 19 + 1)]
      }`
    },
    getCrossValue (q1, q2) {
      console.log(q1, q2)
      return 0
    },
    delElement (el) {
      this.uniqueQuestion = this.uniqueQuestion.filter(q => q.code !== el.code)
      this.questions.push(el)
    },
    processData () {
      const { ConfigPoll } = this.$FeathersVuex
      let config = new ConfigPoll(this.resultPoll)
      config.xQuestions = this.xQuestions
      config.yQuestions = this.yQuestions
      config.reportCreator = true
      config
        .save()
        .then(result => {
          console.log('listo---', result.data)
          this.showTableResult = true
          this.answers = result.data
          // this.setSnackMessage('Pregunta Editada')
          // this.setShowSnack(true)
        })
        .catch(err => console.log('este es el error', err))
    },
    saveGraphs () {
      const { PanelElement } = this.$FeathersVuex
      let panel = new PanelElement({
        questions: [],
        _poll_id: this.id
      })
      panel
        .save()
        .then(result => {
          this.setSnackMessage('Graficos Guardados en Panel')
          this.setShowSnack(true)
        })
        .catch(err => {
          console.log(err)
        })
      console.log('Este servicio', panel)
      console.log('questions', this.getLayoutUniqueQuestion)
    }
  },
  computed: {
    getTableVariableValues () {
      return this.resultPoll
        ? Object.values(this.resultPoll.originalJson)[0]
        : []
    },
    getTableDataValues () {
      return this.resultPoll
        ? this.resultPoll.originalJson.slice(
          1,
          this.resultPoll.originalJson.length
        )
        : []
    },
    getChartData () {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },
    getDataVariables () {
      return this.resultPoll.formatedConfiguration
    },
    getLayoutUniqueQuestion () {
      console.log('uniqueee', this.uniqueQuestion[0])
      let questionValues = this.uniqueQuestion[0]
        ? this.uniqueQuestion[0].total
        : {}
      console.log('question values', questionValues)
      let unique = this.uniqueQuestion.map((q, index) => {
        let result = {
          ...q,
          dataset: q.options
            ? q.options.map(response => {
              return {
                label: response,
                backgroundColor: this.getRandomColor(),
                data: [q.total[response].percentage]
              }
            })
            : []
        }
        console.log('result', result)
        return result
      })

      return unique
    },
    getDataKeys () {
      return this.dataKeys.concat(
        this.currentPoll
          ? this.currentPoll.segmentationFields.map(field => field.original)
          : []
      )
    },
    ...mapState(['currentPoll']),
    getPersonalDataKeys () {
      return []
    }
  },
  watch: {
    yQuestions (val) {
      console.log('nuevo Valor', val)
    },
    uniqueQuestion (val) {
      let responses = val[0] ? val[0].options : []
      let questionValues = val[0] ? val[0].total : {}
      let keySelected = val[0] ? val[0].code : []
      this.labels = val.map(l => l.label)
      this.datasets = responses
        ? responses.map(response => ({
          label: response,
          backgroundColor: this.getRandomColor(),
          data: [
            questionValues[response].percentage,
            questionValues[response].percentage
          ]
        }))
        : []
      this.mapMarkers = this.getTableDataValues.map(res => ({
        answer: res[keySelected],
        personalData: this.personalDataKeys.map(dataKey => res[dataKey.key])
        // position: {
        //   lat: Number(res['latLong'].lat),
        //   lng: Number(res['latLong'].lng)
        // }
      }))
      this.mapQuestions = this.getDataVariables
        .filter(variable => variable.code === keySelected)
        .map(filtered =>
          filtered.options.map(opt => ({
            name: opt,
            icon: this.getRandomIcon()
          }))
        )
        .slice()[0]
      console.log('map questions', this.mapQuestions)
    },
    currentPoll (val) {
      for (let key in val.originalJson[0]) {
        if (this.getDataKeys.includes(val.originalJson[0][key])) {
          if (
            !this.personalDataKeys
              .map(p => p.name)
              .includes(val.originalJson[0][key])
          ) {
            this.personalDataKeys.push({
              name: val.originalJson[0][key],
              key
            })
          }
        }
      }
    }
  },
  components: {
    draggable,
    BarGraph,
    PieGraph,
    DiagramLayout,
    Map,
    CrossTable,
    TableResult
  },
  mounted () {
    this.getPoll(this.id).then(result => {
      this.resultPoll = Object.assign({}, result)
      this.questions = this.resultPoll
        ? this.resultPoll.formatedConfiguration
        : []
    })
  }
}
</script>

<style scoped>
.draggable {
  border: 1px dotted #ccc !important;
}
.draggable-y {
  min-height: 600px;
}
.draggable-unique {
  min-height: 1000px;
}
.questionsList {
  max-height: 1000px;
  overflow: scroll;
}
table {
  width: 800px;
  border-collapse: collapse;
  overflow: scroll;
}
/* Zebra striping */
tr:nth-of-type(odd) {
  background: #eee;
}

th {
  color: white;
  font-weight: bold;
}

td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  font-size: 18px;
  color: #000;
}

/*
    Max width before this PARTICULAR table gets nasty
    This query will take effect for any screen smaller than 760px
    and also iPads specifically.
    */
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table {
    width: 100%;
  }

  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    /* Label the data */
    content: attr(data-column);

    color: #000;
    font-weight: bold;
  }
  .table-wrap {
    overflow: scroll;
  }
}
</style>
