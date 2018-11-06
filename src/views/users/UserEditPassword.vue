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
                <v-btn type="submit"  :disabled="!valid" small color="info">Modificar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import LoadingComponent from '../../components/docaration/LoadingComponent'
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    valid: false,
    name: '',
    password: '',
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
    ...mapState('studies', {loading: 'isCreatePending'}),
    ...mapState('auth', {user: 'user'})
  },
  components: {LoadingComponent}
}
</script>

<style>

</style>
