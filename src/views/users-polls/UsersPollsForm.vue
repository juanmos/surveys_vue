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
                  v-model="userPolls.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="'email'"
                  v-model="userPolls.email"
                  label="Correo electrónico"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="userPolls.cedula"
                  :rules="rules.nameRules"
                  label="Cédula"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="'phones'"
                  v-model="userPolls.phones"
                  label="Teléfono"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
              <v-text-field
                  :append-icon="showPass ? 'visibility_off' : 'visibility'"
                  v-model="userPolls.password"
                  :rules="rules.passwordRules"
                  :type="showPass ? 'text' : 'password'"
                  label="Contraseña"
                  @click:append="showPass = !showPass"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="showPass ? 'visibility_off' : 'visibility'"
                  v-model="userPolls.confirmPassword"
                  :rules="confirmPasswordRules"
                  :type="showPass ? 'text' : 'password'"
                  label="Repita contraseña"
                  @click:append="showPass = !showPass"
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
    userPolls: {
      name: '',
      email: '',
      cedula: '',
      password: null,
      confirmPassword: null,
      phones: '',
      removed: false
    },
    showPass: false,
    valid: false,
    rules: validations,
    confirmPasswordRules: [
      (confirmPassword) => confirmPassword === vm.userPolls.password || 'Contraseñas deben ser igual'
    ]
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.userPolls)
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.userPolls = obj
      this.userPolls.password = null
      this.userPolls.confirmPassword = null
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
