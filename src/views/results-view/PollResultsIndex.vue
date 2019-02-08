<template>
    <v-flex class="view-container">
        <v-tabs
        v-model="active"
        color="secondary"
        centered
        dark
        slider-color="primary"
        icons-and-text
        >
            <v-tab
                ripple
            >
                Vista de Datos
                <v-icon>list</v-icon>

            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                    <poll-results-table :headers="getDataHeaders" :responses="getTableDataValues"></poll-results-table>
                </v-card>
            </v-tab-item>
            <v-tab
                ripple
            >
                Vista de Variables
                <v-icon>ballot</v-icon>

            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                    <poll-results-table :headers="getVariableHeaders" :responses="getTableVariableValues" :variablesMode="true"></poll-results-table>
                </v-card>
            </v-tab-item>
            <v-tab
                ripple
            >
                Creador de Reportes
                <v-icon>ballot</v-icon>

            </v-tab>
            <v-tab-item
            >
                <v-card flat>
                    <report-creator :id="this.id"></report-creator>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-flex>
</template>

<script>
import {mapActions} from 'vuex'
import PollResultsTable from './PollResultsTable'
import ReportCreator from './../reports-creator/ReportCreator'

export default {
  props: ['id'],
  data () {
    return {
      active: null,
      resultPoll: null
    }
  },
  computed: {
    getDataHeaders () {
      let headersFormated = []
      let jsonFormated = Object.assign({}, this.resultPoll ? this.resultPoll.originalJson[0] : {})
      if (jsonFormated) {
        for (let key in jsonFormated) {
          if (jsonFormated.hasOwnProperty(key)) {
            headersFormated.push({
              text: jsonFormated[key],
              align: 'left',
              sortable: false,
              value: key
            })
          }
        }
        return headersFormated
      }
    },
    getTableDataValues () {
      return this.resultPoll ? this.resultPoll.originalJson.slice(1, this.resultPoll.originalJson.length) : []
    },
    getVariableHeaders () {
      return [
        'Nombre',
        'Etiqueta',
        'Valores',
        'Perdidos'
      ].map(value => ({
        text: value,
        align: 'center',
        sortable: false
      }))
    },
    getTableVariableValues () {
      return this.resultPoll ? this.resultPoll.formatedConfiguration.map((question, key) => ({
        name: question.original,
        label: question.label,
        values: question.options,
        lost: -1
      })) : []
    },
    getPossibleValues () {
      let resultPossibleValues = []
      for (let key in this.getTableDataValues[0]) {
        resultPossibleValues.push([...new Set(Object.values(this.getTableDataValues.map(value => value[key])))])
      }
      return resultPossibleValues
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'})
  },
  mounted () {
    this.getPoll(this.id).then(result => {
      this.resultPoll = Object.assign({}, result)
    })
  },
  components: { PollResultsTable, ReportCreator }
}
</script>

<style scoped>
    .resultsTable {
      overflow: scroll
    }
</style>

<style scoped>
  .view-container {
    margin: 30px;
  }
</style>
