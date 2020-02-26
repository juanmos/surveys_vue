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
                  v-model="dataCompany.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="dataCompany.ruc"
                  label="R.U.C"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="dataCompany.address"
                  label="Dirección"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="'phones'"
                  v-model="dataCompany.phone"
                  label="Teléfono"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
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
    dataCompany: {
      name: '',
      ruc: '',
      address: '',
      phone: '',
      removed: false
    },
    newData: true,
    valid: false,
    rules: validations
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.dataCompany)
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.dataCompany = obj
    }
  },
  computed: {},
  watch: {
    values: function (dat) {
      this.setData(dat)
      if (dat) {
        this.newData = false
      }
    }
  },
  created () {
  }
}
</script>

<style>

</style>
