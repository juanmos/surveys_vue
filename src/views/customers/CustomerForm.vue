<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-card flat>
            <v-card-text>
              <v-layout align-center mb-3>
                <v-avatar color="blue">
                  <v-icon dark>account_circle</v-icon>
                </v-avatar>
                <strong style="margin-left: 10px;" class="title">Cliente: {{customer.name}}</strong>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </v-layout>

              <p style="text-align: justify;">
                <strong>RUC:</strong> {{customer.ruc}}
              </p>
              <p style="text-align: justify;">
                <strong>Correo electrónico:</strong> {{customer.email}}
              </p>
              <p style="text-align: justify;">
                <strong>Teléfono:</strong> {{customer.phones}}
              </p>
              <p style="text-align: justify;">
                <strong>Dirección:</strong> {{customer.address}}
              </p>
              <p style="text-align: justify;">
                <strong>Grupo empresarial:</strong> {{customer.economic_group}}
              </p>
              <p style="text-align: justify;">
                <strong>Tipo Cliente:</strong> {{customer.type}}
              </p>
              <v-switch
                v-model="customer.special_ruc"
                readonly="true"
                class="mt-0"
                color="blue lighten-2"
                hide-details
                label="Consumidor final o extranjero?"
              ></v-switch>
            </v-card-text>
          </v-card>
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
