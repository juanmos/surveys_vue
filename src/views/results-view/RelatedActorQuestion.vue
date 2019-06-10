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
              Agregar {{dataText}}
              <v-icon>add_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              </div>
              <div class="question" v-if="dataResponse.category ==='INTENCION'">
                <span style="font-weight: bold;">LISTADO DE ACTORES</span>
              </div>
              <form>
              <!--  <v-autocomplete v-if="dataResponse.category !=='INTENCION'"
                  :items="getActors"
                  v-model="selectedActor"
                  item-text="name"
                  item-value="_id"
                  label="Actores"
                ></v-autocomplete> -->
                <div class="overflow">
                  <v-autocomplete
                    :items="getActors"
                    v-model="selectedActorsList"
                    item-text="name"
                    label="Actores"
                    return-object
                    multiple
                  ></v-autocomplete>
                </div>
                <!-- <v-btn @click="format" v-if="dataResponse.category !=='INTENCION'">Relacionar</v-btn> -->
                <v-btn @click="formatActors">Relacionar actores</v-btn>
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
          text: 'Nombre',
          align: 'left',
          value: 'name'
        },
        { text: 'Acciones',
          value: ''
        }
      ],
      headersOptions: [
        {
          text: 'Nombre',
          align: 'left',
          value: 'name'
        },
        {
          text: 'Relacionar',
          align: 'left',
          value: 'name'
        },
        { text: 'Acciones',
          value: ''
        }
      ],
      dataText: '',
      active: null,
      selectedActor: null,
      selectedActorsList: [],
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
    ...mapActions('actors', { findActors: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions('actors', {getActor: 'get'}),
    format () {
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Actor realacionado a la pregunta.')
    },
    formatActors () {
      this.dataResponse.actors = this.selectedActorsList.map(data => data.code)
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Actor realacionado a la pregunta.')
    },
    formatOptions () {
      this.dataResponse.actors = this.actors
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
      config.construct = 'test'
      config.imported = true
      config.save().then(result => {
        this.setSnackMessage(message)
        this.setShowSnack(true)
        if (close === true) {
          this.$emit('refresh')
        }
      }).catch(err => console.log('este es el error', err))
    },
    getCodeActor (id) {
      return this.getActors.filter(data => id === data._id)[0]
    },
    changeActorsExists (props) {
      let actor = this.getCodeActor(props.item._id)
      this.dataResponse.options[props.index] = {
        name: props.item.name,
        _id: props.item._id,
        code: actor.code,
        image: actor.image
      }
      this.addActor(actor)
    },
    getOptionsFormat () {
      this.options = this.dataResponse.options.map(data => {
        if (data.constructor === Object) {
          return data
        } else {
          return {_id: null, name: data, code: null}
        }
      })
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {
    ...mapGetters('actors', {findActorsInStore: 'find'}),
    getActors () {
      return [{'name': 'Ninguno', '_id': 0}, ...this.findActorsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data]
    }
  },
  created () {
    this.findActors({ query: {removed: false, $limit: null, $skip: 0} })
  },
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.dataText = (this.dataResponse.category !== 'INTENCION') ? 'actor' : 'actores'
      if (this.dataResponse.hasOwnProperty('actors')) {
        this.actors = this.dataResponse.actors
      }
      this.getOptionsFormat()
    })
  },
  watch: {
    selectedActor (value) {
      if (value === 0) {
        this.dataResponse.actors = []
      } else {
        this.getActor(value).then(result => {
          let resultActor = Object.assign({}, result)
          this.dataResponse.actors = [resultActor.code]
        })
      }
    }
  }
}
</script>

<style scoped>
.overflow {
  overflow: auto;
}
.question {
  margin-bottom: 30px;
}
</style>
