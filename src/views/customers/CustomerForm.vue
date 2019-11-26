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
                :append-icon="'name'"
                v-model="customer.name"
                :rules="rules.nameRules"
                label="Cliente"
                required
              ></v-text-field>
              <v-text-field
                :append-icon="'ruc'"
                v-model="customer.ruc"
                :rules="rules.nameRules"
                label="R.U.C"
                required
              ></v-text-field>
              <v-text-field
                :append-icon="'email'"
                v-model="customer.email"
                :rules="rules.nameRules"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="customer.address"
                :rules="rules.nameRules"
                label="Dirección"
                required
              ></v-text-field>
              <v-text-field
                :append-icon="'phones'"
                v-model="customer.phones"
                :rules="rules.nameRules"
                label="Teléfono"
                required
              ></v-text-field>
              <v-autocomplete v-bind:items="getCompanies" v-if="getRol === '5a8f05d594f896e07ca5053d'"
              item-text="name"
              item-value="_id"
              v-model="customer._company_id" label="Empresa:"
              ></v-autocomplete>
              <v-btn type="submit" :disabled="!valid" small color="info">GUARDAR</v-btn>
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
  props: ['values'],
  data: (vm) => ({
    customer: {
      name: '',
      ruc: '',
      address: '',
      email: '',
      phones: ''
    },
    valid: false,
    rules: validations
  }),
  methods: {
    ...mapActions('companies', { findCompanies: 'find' }),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.customer)
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.customer = obj
    }
  },
  computed: {
    ...mapGetters('companies', {findCompaniesInStore: 'find'}),
    getCompanies () {
      return this.findCompaniesInStore({query: {removed: false, ...this.query}}).data
    },
    getRol () {
      let user = (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
      return (user) ? user._rol_id : ''
    }
  },
  watch: {
    values: function (dat) {
      this.setData(dat)
    }
  },
  created () {
    this.findCompanies({query: {removed: false, $skip: 0, $limit: null, ...this.query}})
  }
}
</script>

<style>

</style>
