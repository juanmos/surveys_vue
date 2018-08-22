<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Usuarios</v-subheader>
            <v-data-table
                :headers="headers"
                :items="users"
                hide-actions
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.email }}</td>
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
                    <v-list-tile @click="edit(props.item)">
                      <v-list-tile-title>Editar</v-list-tile-title>
                    </v-list-tile>
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
                <loading-component v-if="pending"></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState} from 'vuex'

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
    goToNew () {
      this.$router.push('/new-user')
    },
    getData () {
      let params = {query: {removed: false}}
      return this.$store.dispatch('users/find', params)
    },
    edit (element) {
      console.log(element)
    },
    del (element) {
      const {User} = this.$FeathersVuex
      const user = new User(element)
      user.removed = true
      console.log(element)
      user.patch().then((result) => {
        this.showMsg = true
        this.message = 'USUARIO ELIMINADO'
        this.msgType = 'success'
      })
    }
  },
  computed: {
    ...mapState('users', {
      errCreate: 'errorOnCreate',
      errFind: 'errorOnFind',
      errGet: 'errorOnGet',
      errPatch: 'errorOnPatch',
      errRemove: 'errorOnRemove',
      errUpdate: 'errorOnUpdate',
      pending: 'isPatchPending'
    })
  },
  components: {LoadingComponent},
  created () {
    this.getData().then((res) => {
      console.log(res)
      this.users = res.data
    })
  }
}
</script>

<style scoped>

</style>
