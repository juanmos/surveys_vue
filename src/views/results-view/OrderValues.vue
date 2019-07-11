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
              Ordenar Valores
              <v-icon>unfold_more</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              </div>
              <label><span style="font-weight: bold;">Por favor arrastrate con el mouse y suelte para ordenar los valores.</span></label>
              <br />
              <br />
              <form>
                <draggable
                  :list="options"
                  :disabled="!enabled"
                  class="list-group"
                  ghost-class="ghost"
                  :move="checkMove"
                  @start="dragging = true"
                  @end="dragging = false"
                >
                  <div
                    class="list-group-item"
                    v-for="element in options"
                    :key="element"
                  >
                    {{ element }}
                  </div>
                </draggable>
                <br />
                <br />

                <v-btn @click="formatOptions">Ordenar valores</v-btn>
                <v-btn @click="cancel">Cancelar</v-btn>
              </form>
            </v-card-text>
          </v-tab-item>
      </v-tabs>
  </v-flex>
</template>

<script>
import {mapActions} from 'vuex'
import draggable from 'vuedraggable'
export default {
  props: ['arrIndex'],
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
      this.dataResponse.options = this.options
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Se actualizo el orden.')
    },
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    save (values, close, message) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.update().then(result => {
        this.setSnackMessage(message)
        this.setShowSnack(true)
        if (close === true) {
          this.$emit('refresh')
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
  created () {},
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.options = this.dataResponse.options
    })
  },
  components: { draggable }
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

.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
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
