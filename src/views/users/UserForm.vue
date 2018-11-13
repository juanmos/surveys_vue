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
                  :append-icon="'cedula'"
                  v-model="user.cedula"
                  :rules="rules.nameRules"
                  label="Cédula de identidad"
                  required
                ></v-text-field>
                <v-text-field
                  :append-icon="'phones'"
                  v-model="user.phones"
                  :rules="rules.nameRules"
                  label="Teléfono"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid" small color="info">Modificar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapActions} from 'vuex'
import LoadingComponent from '../../components/docaration/LoadingComponent'
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    valid: false,
    name: '',
    email: '',
    phones: '',
    showPass: false,
    rules: validations,
    confirmPasswordRules: [
      (confirmPassword) => confirmPassword === vm.user.password || 'Contraseñas deben ser igual'
    ]
  }),
  methods: {
    ...mapActions([
      'setShowSnack',
      'setSnackMessage',
      'setSnackColor'
    ]),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.user)
      }
    }
  },
  computed: {
    user () {
      return (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
    }
  },
  components: {LoadingComponent}
}
</script>

<style>

</style>
