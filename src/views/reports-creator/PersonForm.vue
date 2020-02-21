<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
      <v-form
      v-model="valid"
      @submit.prevent="sendData"
      @keydown.prevent.enter
      >
        <v-layout row wrap>
          <v-flex xs12>
                <v-text-field
                  v-model="personCurrent.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field
              :append-icon="'email'"
              v-model="personCurrent.email"
              :rules="rules.emailRules"
              label="Correo electrónico"
              color="blue-grey lighten-2"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              v-model="personCurrent.cedula"
              :rules="rules.nameRules"
              label="Cédula"
              color="blue-grey lighten-2"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs3>
            <v-text-field
              :append-icon="'phones'"
              v-model="personCurrent.movil"
              label="Móvil"
              color="blue-grey lighten-2"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs3>
            <v-select
              :items="listGenders"
              label="Género"
              outline
              v-model="personCurrent.gender"
            ></v-select>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="personCurrent.address"
              label="Dirección"
              color="blue-grey lighten-2"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <label style="padding-right:10px;">Fecha de nacimiento:</label>
            <v-date-picker v-model="personCurrent.birthdate" no-title scrollable actions/>
          </v-flex>

          <v-flex xs12>
            <v-btn type="submit" :disabled="!valid"  small color="info">Guarda Datos Personales</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      </v-container>
    </v-card>
</template>

<script>
// import {mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment
})
export default {
  props: ['person'],
  data: (vm) => ({
    personCurrent: {
      name: '',
      email: '',
      cedula: '',
      _companay_id: null,
      phones: '',
      removed: false
    },
    listGenders: ['FEMENINO', 'MASCULINO'],
    newData: true,
    showPass: false,
    valid: false,
    rules: validations,
    confirmPasswordRules: [
      (confirmPassword) => confirmPassword === vm.personCurrent.password || 'Contraseñas deben ser igual'
    ]
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.personCurrent.email = this.personCurrent.email.toLowerCase()
        this.$emit('dataSubmited', this.personCurrent)
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.personCurrent = obj
      this.personCurrent.password = null
      this.personCurrent.confirmPassword = null
    }
  },
  computed: {
  },
  watch: {
    person: function (dat) {
      this.personCurrent = Object.assign({}, dat)
      this.personCurrent.birthdate = moment.utc(dat.birthdate).format('YYYY-MM-DD')
    },
    'personCurrent._rol_id': function (val) {
      // let currentRol = this.getRoles.find(rol => rol._id === val)
      // this.personCurrent.permissions = [currentRol.code]
    }
  }
}
</script>

<style>

</style>
