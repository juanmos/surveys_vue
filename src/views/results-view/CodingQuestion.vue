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
              Codificar
              <v-icon>blur_on</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              </div>
              <br />
              <br />
              <form>
                  <div
                  v-if="(element.option !== 'Ninguno' && element.option !== 'Nulo / Blanco' && element.option !== '-1')"
                    class=""
                    v-for="(element, index) in options" :key="index"
                  >
                    <span class="bold">Código: </span>{{ (element.option === undefined || element.option === null) ? 'Nulo' : element.option }}

                    <v-text-field
                        v-model="element.coding"
                        label=""
                        box
                    ></v-text-field>
                  </div>
                <br />
                <br />

                <v-btn @click="formatOptions">Codificar</v-btn>
                <v-btn @click="cancel">Cancelar</v-btn>
              </form>
            </v-card-text>
          </v-tab-item>
      </v-tabs>
  </v-flex>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  props: ['arrIndex', 'actors'],
  data () {
    return {
      enabled: true,
      dragging: false,
      active: null,
      currentPoll: {
        _polls_project_id: null,
        formatedConfiguration: []
      },
      selectedQuestion: null,
      actorsRelationsRR: [],
      options: [],
      dataResponse: {
        label: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('config-polls', {getPoll: 'get'}),
    formatOptions () {
      this.dataResponse.coding = this.options.map(option => {
        let codeCoding = (option.coding) ? option.coding : option.option
        option = {code: option.option, option: codeCoding}
        return option
      })
      this.dataResponse.options = this.options.map(option => {
        let codeCoding = (option.coding) ? option.coding : option.option
        return codeCoding
      })
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Las opciones han sido codificadas.')
    },
    save (values, close, message) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.coding = true
      config.index = this.arrIndex
      config.update().then(result => {
        this.currentPoll = result
        this.setSnackMessage(message)
        this.setShowSnack(true)
        if (close === true) {
          this.$emit('refresh', this.currentPoll)
        }
      }).catch(err => console.log('este es el error', err))
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },
  created () {
    this.actorsRelations = []
  },
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.options = this.dataResponse.options.map(option => {
        let data = {option: option}
        return data
      })
      /* if (this.dataResponse.relatedOptions) {
        this.options = this.dataResponse.relatedOptions
      } */
    })
  },
  components: {}
}
</script>

<style scoped>
.overflow {
  overflow: auto;
}
.formatOrder {
  font-weight: bold;
  font-size: 14px;
}
.question {
  margin-bottom: 30px;
}

.bold {
  font-weight: bold;
}

.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.relatedInfo {
  font-weight: bold;
}

.list-group-item {
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    color: black;
    border: 1px solid rgba(0,0,0,.125);
}
</style>
