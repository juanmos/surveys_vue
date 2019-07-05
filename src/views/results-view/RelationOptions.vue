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
              Relacionar opciones
              <v-icon>swap_horizontal_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
              </div>
              <label><span style="font-weight: bold;">{{actorsRelations}}</span></label>
              <br />
              <br />
              <form>
                  <div
                  v-if="(element.option !== 'Ninguno' && element.option !== 'Nulo / Blanco' && element.option !== '-1')"
                    class="list-group-item"
                    v-for="(element, index) in options" :key="index"
                  >
                    {{ element.option }}

                    <v-chip color="grey-darken-4" v-if="element.code" class="font-weight-bold subCategory">
                                      {{element.code}}
                    </v-chip>
                    <v-autocomplete v-else
                      :items="actors"
                      background-color="#424242"
                      item-text="name"
                      v-model="element.selected"
                      return-object
                      label="Actor"
                    ></v-autocomplete>
                  </div>
                <br />
                <br />

                <v-btn @click="formatOptions">Relacionar con los actores</v-btn>
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
      this.dataResponse.relatedOptions = this.options.map(option => {
        if (option.selected) {
          option = {option: option.option, code: option.selected.code, name: option.selected.name}
        }
        return option
      })
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, true, 'Se relaciono las opciones.')
    },
    searchActor (nameActor) {
      let actorFound = null
      let str = nameActor.toUpperCase().split(' ').join('_')
      let codeActor = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      let foundActor = this.actors.filter(actor => actor.code === codeActor)
      if (foundActor.length > 0) {
        actorFound = foundActor[0]
      }
      return actorFound
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
        let actorData = this.searchActor(option)
        let data = {option: option}
        if (actorData !== null) {
          data = {...data, ...actorData}
        }
        return data
      })
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
