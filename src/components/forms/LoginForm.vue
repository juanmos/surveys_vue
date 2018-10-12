<template>
    <v-card>
      <div class="logo">
         <img height="100" src="@/assets/logo-propraxis.png" alt="Propraxis">
         <div class="title grey--text text--lighten-1 text-capitalize">ENCUESTAS</div>
      </div>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @keydown.prevent.enter
            >
                <v-text-field
                  :append-icon="'email'"
                  v-model="email"
                  :rules="rules.emailRules"
                  label="Email"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="showPass ? 'visibility_off' : 'visibility'"
                  v-model="password"
                  :rules="rules.passwordRules"
                  :type="showPass ? 'text' : 'password'"
                  label="Contraseña"
                  @click:append="showPass = !showPass"
                  required
                ></v-text-field>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" @click="sendData" flat small color="blue">Entrar</v-btn>
        <v-spacer></v-spacer>
        <a v-bind:href="getUrl">Single Sign-On</a>
      </v-card-actions>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
const enviroment = require('./../../../config/enviroment')
export default {
  data: () => ({
    valid: false,
    email: '',
    password: '',
    urlAuth: '',
    showPass: false,
    rules: validations
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', {
          email: this.email,
          password: this.password,
          strategy: 'local'
        })
      }
    }
  },
  computed: {
    getUrl () {
      return this.urlAuth
    }
  },
  created () {
    this.urlAuth = enviroment[enviroment.currentEnviroment].urlAuth
    console.log('url----', this.urlAuth)
  }
}
</script>

<style scoped>
  .logo {
    text-align: center;
  }
  .logo img {
    margin: 10px;
  }
</style>
