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
              <v-flex xs12>
                <v-select
                  label="Seleccione Tipo de Grafico"
                  v-model="study._contact_id"
                  :items="getContacts"
                  item-text="name"
                  item-value="_id"
                  box
                  required
                ></v-select>
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
        description: ''
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
    getContacts () {
      return this.findContactsInStore({query: {removed: false}}).data
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
    this.findContacts({ query: {removed: false} }).then(response => {
      const contacts = response.data || response
      console.log(contacts)
    })
  }
}
</script>

<style>

</style>
