<template>
  <v-flex class="view-container">
      <v-tabs
      color="secondary"
      centered
      dark
      slider-color="primary"
      icons-and-text
      >
          <v-tab
              ripple
          >
              Agregar Actores
              <v-icon>add_circle</v-icon>
          </v-tab>
          <v-tab-item
          >
            <v-card-text>
              <div class="question">
                <span style="font-weight: bold;">SELECCIONAR ACTORES</span>
              </div>
              <form>
                <v-autocomplete
                  :items="getActors"
                  v-model="selectedActor"
                  item-text="name"
                  label="Actores"
                  return-object
                  multiple
                ></v-autocomplete>
                <v-btn @click="sendData">Agregar actores</v-btn>
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
  data () {
    return {
      selectedActor: null,
      actors: [],
      active: true
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('actors', { findActors: 'find' }),
    ...mapActions('actors', {getActor: 'get'}),
    sendData () {
      this.$emit('getActors', this.selectedActor)
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
    this.findActors({ query: {removed: false, $limit: null, $skip: 0} })
  }
}
</script>

<style scoped>
.overflow {
  height: 300px;
  overflow: auto;
}
.question {
  margin-bottom: 30px;
}
</style>
