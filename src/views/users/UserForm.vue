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
                  v-model="user.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="'email'"
                  v-model="user.email"
                  :rules="rules.emailRules"
                  label="Email"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="showPass ? 'visibility_off' : 'visibility'"
                  v-model="user.password"
                  :rules="rules.passwordRules"
                  :type="showPass ? 'text' : 'password'"
                  label="Contraseña"
                  @click:append="showPass = !showPass"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="showPass ? 'visibility_off' : 'visibility'"
                  v-model="user.confirmPassword"
                  :rules="confirmPasswordRules"
                  :type="showPass ? 'text' : 'password'"
                  label="Repita contraseña"
                  @click:append="showPass = !showPass"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar Usuario</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    user: {
      name: '',
      email: '',
      password: ''
    },
    valid: false,
    name: '',
    password: '',
    email: '',
    showPass: false,
    rules: validations,
    confirmPasswordRules: [
      (confirmPassword) => confirmPassword === vm.user.password || 'Contraseñas deben ser igual'
    ]
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.user)
      }
    }
  }
}
</script>

<style>

</style>
