<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Usuarios </v-subheader>
            <v-data-table
                :headers="headers"
                :items="getUsers"
                hide-actions
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                <td>
                  <editable-field @changeConfirmed="edit($event, props.item, 'name')"  :value="props.item.name" typeField="text"></editable-field>
                </td>
                <td>
                  <editable-field @changeConfirmed="edit($event, props.item, 'email')"  :value="props.item.email" typeField="text"></editable-field>
                </td>
                <td>
                  <v-menu
                  bottom
                  transition="slide-y-transition"
                >
                  <v-btn
                    slot="activator"
                    color="primary"
                    flat
                    icon
                  >
                   <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile @click="del(props.item)">
                      <v-list-tile-title>Eliminar</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                </td>
                </template>
            </v-data-table>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
                @click="goToNew()"
                >
                    <v-icon>add</v-icon>
                </v-btn>
                <loading-component v-if="loading
                "></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'center',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Email',
          align: 'center',
          sortable: true,
          value: 'email'
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'email'
        }
      ],
      users: [],
      message: '',
      showMsg: false,
      msgType: 'error'
    }
  },
  methods: {
    ...mapActions('users', { findUsers: 'find' }),
    goToNew () {
      this.$router.push('/new-user')
    },
    getData () {
      let params = {query: {removed: false}}
      return this.$store.dispatch('users/find', params)
    },
    edit (val, elem, field) {
      const {User} = this.$FeathersVuex
      const user = new User(elem)
      user[field] = val
      user.patch().then((result) => {
        this.findUsers({ query: {removed: false} }).then(response => {
          const users = response.data || response
          console.log(users)
        })
      })
    },
    del (element) {
      const {User} = this.$FeathersVuex
      const user = new User(element)
      user.removed = true
      user.patch().then((result) => {
        this.findUsers({ query: {removed: false} }).then(response => {
          const users = response.data || response
          console.log(users)
        })
      })
    }
  },
  computed: {
    ...mapState('users', {loading: 'isFindPending'}),
    ...mapGetters('users', {findUsersInStore: 'find'}),
    getUsers () {
      return this.findUsersInStore({query: {removed: false}}).data
    }
  },
  created () {
    this.findUsers({ query: {removed: false} }).then(response => {
      const users = response.data || response
      console.log(users)
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
