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
                  color="blue-grey lighten-2"
                  label="Nombre"
                  :append-icon="'name'"
                  v-model="study.name"
                  :rules="rules.nameRules"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  label="Pais"
                  v-model="study._country_id"
                  :items="getCountries"
                  item-text="name"
                  item-value="_id"
                  @change="updateCities"
                  box
                ></v-select>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  label="Ciudad"
                  v-model="study._city_id"
                  :items="getCities"
                  item-text="name"
                  item-value="_id"
                  box
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  label="Cliente"
                  v-model="study._customer_id"
                  :items="getClients"
                  item-text="name"
                  item-value="_id"
                  box
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-card-title primary-title>
                  <h3 class="text--secondary body-2">Fecha de estudio</h3>
                </v-card-title>
                <v-date-picker
                  :first-day-of-week="1"
                  v-model="study.date"
                  locale="es"
                  full-width
                  landscape
                  class="mt-3"
                  required
                ></v-date-picker>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="study.memberIds"
                  :items="getUsers"
                  box
                  chips
                  color="blue-grey lighten-2"
                  label="Miembros del Estudio"
                  item-text="name"
                  item-value="name"
                  multiple
                >
                  <template
                    slot="selection"
                    slot-scope="data"
                  >
                    <v-chip
                      :selected="data.selected"
                      close
                      class="chip--select-multi"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar">
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template
                    slot="item"
                    slot-scope="data"
                  >
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img :src="data.item.avatar">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex xs12>
                 <v-textarea
                    v-model="study.description"
                    label="Descripcion"
                    box
                    color="blue-grey lighten-2"
                  ></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-switch
              v-model="autoUpdate"
              :disabled="isUpdating"
              class="mt-0"
              color="blue lighten-2"
              hide-details
              label="Notificar a Miembros"
            ></v-switch>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="!valid"  small color="info">Guardar Estudio</v-btn>
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
      study: {
        name: '',
        description: '',
        _user_id: '',
        memberIds: ['Sandra Adams', 'Britta Holt'],
        sub_studies: [],
        geographical_scope: '',
        _customer_id: ''
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
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.study)
      }
    },
    updateCities () {
      this.findCities({ query: {removed: false, _country_id: this.study._country_id} }).then(response => {
        const cities = response.data || response
        console.log(cities)
      })
      console.log(this.study._country_id)
    }
  },
  computed: {
    ...mapGetters('users', {findUsersInStore: 'find'}),
    ...mapGetters('customers', {findCustomersInStore: 'find'}),
    ...mapGetters('cities', {findCitiesInStore: 'find'}),
    ...mapGetters('countries', {findCountriesInStore: 'find'}),
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
      const users = response.data || response
      console.log(users)
    })
    this.findClients({ query: {removed: false} }).then(response => {
      const clients = response.data || response
      console.log(clients)
    })
    this.findCountries({ query: {removed: false} }).then(response => {
      const countries = response.data || response
      console.log(countries)
    })
  }
}
</script>

<style>

</style>
