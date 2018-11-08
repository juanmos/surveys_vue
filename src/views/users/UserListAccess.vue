<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Usuarios con acceso</v-subheader>
              <v-card-title>
                <v-subheader>Listado de Ítems</v-subheader>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar usuario"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
            <v-data-table
                :headers="headers"
                :items="getUsers"
                hide-actions
                class="elevation-1"
                item-key="name"
                :search="search"
            >
                <template slot="items" slot-scope="props">
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.name"
                    lazy
                    @save="edit(props.item.name, props.item, 'name')"
                  > {{ props.item.name }}
                  </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.email"
                    lazy
                    @save="edit(props.item.email, props.item, 'email')"
                  > {{ props.item.email }}
                  </v-edit-dialog>
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
                    <v-list-tile @click="changeAccess(props.item)">
                      <v-list-tile-title>Cambiar acceso</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                </td>
                </template>
            </v-data-table>
            <v-layout justify-center>
              <v-flex xs8>
                <v-card flat>
                  <v-card-text>
                    <v-pagination
                      v-model="page"
                      :length="getLength"
                    ></v-pagination>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
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
import {validations} from './../../utils/validations'
export default {
  data () {
    return {
      page: 1,
      limit: 20,
      total: 1,
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
      accessFilter: { application_permissions: {polls: true} },
      showMsg: false,
      msgType: 'error',
      search: '',
      rules: validations
    }
  },
  methods: {
    ...mapActions('users', { findUsers: 'find' }),
    goToNew () {
      this.$router.push('/new-user')
    },
    getData () {
      let params = {query: {removed: false, application_permissions: true}}
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
    changeAccess (element) {
      const {User} = this.$FeathersVuex
      const user = new User(element)
      window.open('http://gestion.propraxis.ec/#/users-edit?_id=' + user._id, '_blank')
    }
  },
  computed: {
    ...mapState('users', {loading: 'isFindPending'}),
    ...mapGetters('users', {findUsersInStore: 'find'}),
    getUsers () {
      return this.findUsersInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.accessFilter}}).data
    },
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page () {
      this.findUsers({ query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.accessFilter} }).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findUsers({ query: {removed: false} }).then(response => {
      this.limit = response.limit
      this.total = response.total
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
