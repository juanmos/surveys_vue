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
                <v-flex xs6>
                  <v-textarea
                     v-model="user.description"
                    label="Descripcion"
                  ></v-textarea>
                </v-flex>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar Estudio</v-btn>
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
