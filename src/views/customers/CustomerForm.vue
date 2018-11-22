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
                <v-text-field
                  v-model="customer.ruc"
                  label="Ruc"
                  box
                  color="blue-grey lighten-2"
                  required
                  type="number"
                ></v-text-field>
                <v-text-field
                  :append-icon="'email'"
                  v-model="customer.email"
                  box
                  color="blue-grey lighten-2"
                  label="Email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="customer.phones"
                  label="Telefonos"
                  box
                  color="blue-grey lighten-2"
                ></v-text-field>
                <v-text-field
                  v-model="customer.address"
                  label="Direccion"
                  box
                  color="blue-grey lighten-2"
                ></v-text-field>
                <v-text-field
                  v-model="customer.economic_group"
                  label="Grupo Empresarial"
                  box
                  color="blue-grey lighten-2"
                ></v-text-field>
                <v-select
                  label="Tipo de Cliente"
                  v-model="customer.type"
                  :items="['premium', 'vip', 'normal']"
                  box
                ></v-select>
                <v-switch
                  v-model="customer.special_ruc"
                  class="mt-0"
                  color="blue lighten-2"
                  hide-details
                  label="Consumidor final o extranjero?"
                ></v-switch>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
export default {
  props: ['values'],
  data: (vm) => ({
    customer: {
      code: '',
      count: '333',
      name: '',
      ruc: '',
      economic_group: '',
      address: '',
      email: '',
      phones: '',
      type: '',
      special_ruc: '',
      _city_id: '',
      _type_company: '',
      _representative_user_id: '',
      removed: false
    },
    valid: false,
    rules: validations
  }),
  methods: {
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
  watch: {
    values: function (dat) {
      this.setData(dat)
    }
  }
}
</script>

<style>

</style>
