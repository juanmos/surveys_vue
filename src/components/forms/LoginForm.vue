<template>
    <v-card>
      <div class="logo">
        <img src="https://via.placeholder.com/100x100" alt="Logo">
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
      </v-card-actions>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
export default {
  data: () => ({
    valid: false,
    email: '',
    password: '',
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
