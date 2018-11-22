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
            <v-autocomplete v-bind:items="getRoles"
            item-text="name"
            item-value="_id"
            v-model="userPollsRol._rol_id" label="Seleccione rol:"
            ></v-autocomplete>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  props: ['values'],
  data: (vm) => ({
    userPollsRol: {
      _user_id: null,
      _rol_id: '',
      removed: false
    },
    userPolls: null,
    valid: false,
    roles: null
  }),
  methods: {
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions('users-roles', { findUsersRoles: 'find' }),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.userPollsRol)
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.userPolls = obj
      this.getUserRol()
    },
    getUserRol () {
      this.findUsersRoles({query: {_user_id: this.userPolls['_id'], removed: false, ...this.query}}).then(response => {
        if (response.data.length > 0) {
          this.userPollsRol = response.data[0]
        } else {
          this.userPollsRol._user_id = this.userPolls['_id']
        }
      })
    }
  },
  computed: {
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    getRoles () {
      return this.findRolesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  watch: {
    values: function (dat) {
      this.setData(dat)
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
