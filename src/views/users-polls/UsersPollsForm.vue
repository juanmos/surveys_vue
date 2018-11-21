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
                  :rules="rules.emailRules"
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
                <v-autocomplete v-if="newData" v-bind:items="getRoles"
                item-text="name"
                item-value="_id"
                v-model="userPolls._rol_id" label="Seleccione rol:"
                ></v-autocomplete>
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
import {mapState, mapActions, mapGetters} from 'vuex'
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
      _rol_id: null,
      removed: false
    },
    newData: true,
    showPass: false,
    valid: false,
    rules: validations,
    confirmPasswordRules: [
      (confirmPassword) => confirmPassword === vm.userPolls.password || 'Contraseñas deben ser igual'
    ]
  }),
  methods: {
    ...mapActions('roles', { findRoles: 'find' }),
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
  computed: {
    ...mapState('roles', {loading: 'isFindPending'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    getRoles () {
      return this.findRolesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  watch: {
    values: function (dat) {
      this.setData(dat)
      if (dat) {
        this.newData = false
      }
    }
  },
  created () {
    this.findRoles({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.roles = response.data
    })
  }
}
</script>

<style>

</style>
