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
              Nuevo
              <v-icon>add_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              <form>
                <v-autocomplete
                  :items="getConfigPolls"
                  v-model="selectedPoll"
                  item-text="name"
                  item-value="_id"
                  label="Encuesta"
                ></v-autocomplete>
                <v-autocomplete
                  :items="questions"
                  v-model="selectedQuestion"
                  item-text="label"
                  item-value="code"
                  label="Pregunta"
                ></v-autocomplete>
                <v-btn @click="format">Relacionar</v-btn>
                <v-btn @click="cancel">Cancelar</v-btn>
              </form>
            </v-card-text>
          </v-tab-item>
          <v-tab
              ripple
          >
              Relaciones
              <v-icon>list</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              <v-data-table
                    :headers="headers"
                    :items="dataResponse.related"
                    hide-actions
                    style="overflow-y: auto !important;height: 350px !important;"
                  >
                    <template slot="items" slot-scope="props">
                      <tr>
                        <td>{{getNamePoll(props.item.poll)}}</td>
                        <td>{{getLabelQuestion(props.item.poll, props.item.question)}}</td>
                        <td class="justify-center layout px-0">
                          <v-menu
                            bottom
                            transition="slide-y-transition"
                          >
                            <v-btn
                              slot="activator"
                              color="primary"
                              flat
                              icon
                            >
                            <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list>
                              <v-list-tile @click="deleteQuestion(props.item)">
                                  <v-list-tile-title>Eliminar</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                  <div>
                    <v-btn @click="cancel">Cancelar</v-btn>
                  </div>
            </v-card-text>
          </v-tab-item>
      </v-tabs>
  </v-flex>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  props: ['arrIndex'],
  data () {
    return {
      headers: [
        {
          text: 'Encuesta',
          align: 'left',
          value: 'poll'
        },
        { text: 'Código',
          value: 'question',
          sortable: true
        },
        { text: '',
          value: ''
        }
      ],
      active: null,
      selectedPoll: null,
      currentPoll: {
        _polls_project_id: null,
        formatedConfiguration: []
      },
      selectedQuestion: null,
      dataResponse: {
        label: ''
      },
      questions: []
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('config-polls', { findConfigPolls: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    format () {
      if (this.selectedPoll && this.selectedQuestion) {
        let relation = {
          poll: this.selectedPoll,
          question: this.selectedQuestion
        }
        this.dataResponse.related.push(relation)
        this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
        this.save(this.currentPoll, true, 'Pregunta relacionada almacenada.')
      }
    },
    deleteQuestion (value) {
      this.dataResponse.related = this.dataResponse.related.filter(item => (value !== item))
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, false, 'Pregunta relacionada eliminada.')
    },
    save (values, close, message) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.update().then(result => {
        this.setSnackMessage(message)
        this.setShowSnack(true)
        if (close === true) {
          this.$emit('close')
        }
      }).catch(err => console.log('este es el error', err))
    },
    getNamePoll (value) {
      let data = this.findConfigPollsInStore({query: {_id: value}}).data
      let name = ''
      if (data.length > 0 && data[0].name) {
        name = data[0].name
      }
      return name
    },
    getLabelQuestion (id, code) {
      let data = this.findConfigPollsInStore({query: {_id: id}}).data
      let label = ''
      if (data.length > 0 && data[0].formatedConfiguration) {
        label = data[0].formatedConfiguration.filter(item => (item.code === code))[0].label
      }
      return label
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {
    ...mapGetters('config-polls', {findConfigPollsInStore: 'find'}),
    getConfigPolls () {
      return this.findConfigPollsInStore({query: {removed: false, _polls_project_id: this.currentPoll._polls_project_id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  created () {
    this.findConfigPolls({ query: {removed: false} })
  },
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.dataResponse.related = (this.dataResponse.related) ? this.dataResponse.related : []
    })
  },
  watch: {
    selectedPoll (value) {
      this.selectedQuestion = null
      this.getPoll(value).then(result => {
        let resultPoll = Object.assign({}, result)
        this.questions = resultPoll.formatedConfiguration
      })
    }
  }
}
</script>

<style scoped>
.v-table__overflow {
    overflow-x: auto;
}
</style>
