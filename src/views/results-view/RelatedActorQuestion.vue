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
              Seleccione actor
              <v-icon>add_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              <form>
                <v-autocomplete
                  :items="getActors"
                  v-model="selectedActor"
                  item-text="name"
                  item-value="_id"
                  label="Actores"
                ></v-autocomplete>
                <v-btn @click="format">Relacionar</v-btn>
                <v-btn @click="cancel">Cancelar</v-btn>
              </form>
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
      selectedActor: null,
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
    ...mapActions('actors', { findActors: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions('actors', {getActor: 'get'}),
    format () {
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Actor realacionado a la pregunta.')
    },
    deleteQuestion (value) {
      /* this.dataResponse.related = this.dataResponse.related.filter(item => (value !== item))
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, false, 'Pregunta relacionada eliminada.') */
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
  computed: {
    ...mapGetters('actors', {findActorsInStore: 'find'}),
    getActors () {
      return this.findActorsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  created () {
    this.findActors({ query: {removed: false} })
  },
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
    })
  },
  watch: {
    selectedActor (value) {
      this.getActor(value).then(result => {
        let resultActor = Object.assign({}, result)
        this.dataResponse.actor = resultActor
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
