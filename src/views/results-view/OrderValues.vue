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
              <v-icon>add_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
                <br />
                <br />
                <label>Orden:<span class="formatOrder">{{selectedValues}}</span></label>
              </div>
              <form>
                <div class="overflow">
                  <v-checkbox
                    v-for="(option, index) in options"
                    v-model="selectedValues"
                    :key="index"
                    :label="option"
                    :value="option"/>
                </div>
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
export default {
  props: ['arrIndex'],
  data () {
    return {
      active: null,
      selectedActor: null,
      selectedValues: [],
      currentPoll: {
        _polls_project_id: null,
        formatedConfiguration: []
      },
      selectedQuestion: null,
      actors: [],
      options: [],
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
    ...mapActions('config-polls', {getPoll: 'get'}),
    formatOptions () {
      if (this.dataResponse.options.length === this.selectedValues.length) {
        this.dataResponse.options = this.selectedValues
        this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
        this.save(this.currentPoll, true, 'Se actualizo el orden.')
      } else {
        this.setSnackMessage('Complete el orden, hay valores no seleccionados')
      }
    },
    save (values, close, message) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.save().then(result => {
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
  computed: {},
  created () {},
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.options = this.dataResponse.options
    })
  },
  watch: {}
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
</style>
