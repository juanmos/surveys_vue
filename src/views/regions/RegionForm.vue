<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
                <v-text-field
                  v-model="customer.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-select
                  label="Pais"
                  v-model="customer._country_id"
                  :items="getCountries"
                  item-text="name"
                  item-value="_id"
                  box
                ></v-select>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar Region</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    customer: {
      name: '',
      _country_id: ''
    },
    valid: false,
    rules: validations
  }),
  methods: {
    ...mapActions('countries', {findCountries: 'find'}),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.customer)
      }
    }
  },
  computed: {
    ...mapGetters('countries', {findCountriesInStore: 'find'}),
    getCountries () {
      return this.findCountriesInStore({query: {removed: false}}).data
    }
  },
  created () {
    this.findCountries({ query: {removed: false} }).then(response => {
      const countries = response.data || response
      console.log(countries)
    })
  }
}
</script>

<style>

</style>
