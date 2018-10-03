<template>
    <div>
      <v-card
      >
        <v-form
          @submit.prevent="sendData"
          @keydown.prevent.enter
          v-model="valid"
          >
          <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  box
                  label="Nombre"
                  :append-icon="'name'"
                  v-model="workingTable.name"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                 <v-textarea
                    v-model="workingTable.description"
                    label="Descripcion"
                    box
                    required
                  ></v-textarea>
              </v-flex>
              <v-flex xs12>
                <v-select
                  @change="changeComponent"
                  label="Seleccione Tipo de Grafico"
                  v-model="workingTable.type"
                  :items="getGraphTypes"
                  item-text="name"
                  item-value="name"
                  box
                  required
                ></v-select>
              </v-flex>
              <v-flex xs6 offset-xs3>
                <v-card color="grey"  class="lighten-2">
                  <v-card-text>
                    <v-img
                        :src="getCurrentImage"
                        aspect-ratio="0.5"
                        class="grey lighten-2"
                        max-height="400"
                      >
                        <v-layout
                          slot="placeholder"
                          fill-height
                          align-center
                          justify-center
                          ma-0
                        >
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                    </v-img>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="!valid" small color="info">Guardar Mesa</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
export default {
  data (vm) {
    return {
      workingTable: {
        name: null,
        description: null,
        type: null,
        component: null
      },
      valid: false,
      name: '',
      password: '',
      email: '',
      showPass: false,
      rules: validations,
      autoUpdate: true,
      isUpdating: false,
      title: 'The summer breeze'
    }
  },
  methods: {
    ...mapActions('users', { findUsers: 'find' }),
    ...mapActions('customers', { findClients: 'find' }),
    ...mapActions('countries', { findCountries: 'find' }),
    ...mapActions('cities', { findCities: 'find' }),
    ...mapActions('customer-contacts', { findContacts: 'find' }),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.workingTable)
      }
    },
    updateCities () {
      this.findCities({ query: {removed: false, _country_id: this.study._country_id} }).then(response => {
      })
      console.log(this.study._country_id)
    },
    changeComponent () {
      let graph = this.getGraphTypes.filter(graph => graph.name === this.workingTable.type)[0]
      this.workingTable.component = graph.component
      this.workingTable.icon = graph.icon
    }
  },
  computed: {
    ...mapGetters('users', {findUsersInStore: 'find'}),
    ...mapGetters('customers', {findCustomersInStore: 'find'}),
    ...mapGetters('cities', {findCitiesInStore: 'find'}),
    ...mapGetters('countries', {findCountriesInStore: 'find'}),
    ...mapGetters('customer-contacts', {findContactsInStore: 'find'}),
    getUsers () {
      return this.findUsersInStore({query: {removed: false}}).data
    },
    getClients () {
      return this.findCustomersInStore({query: {removed: false}}).data
    },
    getCities () {
      return this.findCitiesInStore({query: {removed: false, _country_id: this.study._country_id}}).data
    },
    getCountries () {
      return this.findCountriesInStore({query: {removed: false}}).data
    },
    getGraphTypes () {
      return [
        {
          name: 'Mapa mental con agrupaciones',
          image: require('./../../assets/group-chart.png'),
          component: 'NodeGroupDiagram',
          icon: 'aspect_ratio'
        },
        {
          name: 'Matriz Estrategica',
          image: require('./../../assets/matriz-estrategica.png'),
          component: 'MatrixComponent',
          icon: 'view_module'
        },
        {
          name: 'Kanban',
          image: require('./../../assets/kanban-chart.png')
        },
        {
          name: 'Serpentina',
          image: require('./../../assets/serpentina-chart.png')
        },
        {
          name: 'Mapa de Actores',
          image: require('./../../assets/org-chart.png')
        },
        {
          name: 'Espiral',
          image: require('./../../assets/espiral-chart.png'),
          component: 'SpiralLinkDiagram',
          icon: 'sync'
        }
      ]
    },
    getCurrentImage () {
      if (this.workingTable.type) {
        let image = this.getGraphTypes.filter(graph => graph.name === this.workingTable.type)[0]
        return image.image
      } else {
        return require('./../../assets/placeholder.png')
      }
    }
  },
  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    }
  },
  created () {
    this.findUsers({ query: {removed: false} }).then(response => {
    })
    this.findClients({ query: {removed: false} }).then(response => {
    })
    this.findCountries({ query: {removed: false} }).then(response => {
    })
    this.findContacts({ query: {removed: false} }).then(response => {
    })
  }
}
</script>

<style>

</style>
