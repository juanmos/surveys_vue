<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Asignar rol a usuarios </v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getUsers"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.email"
                          lazy
                          @save="edit(props.item.email, props.item, 'email')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.email }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.email"
                            label="Editar email"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.name"
                          lazy
                          @save="edit(props.item.name, props.item, 'name')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.name }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.name"
                            label="Editar Nombres"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>

                      <td>
                          <v-autocomplete v-bind:items="getRoles"
                          item-text="name"
                          item-value="_id"
                          v-model="props.item._rol_id" label=""
                          ></v-autocomplete>
                      </td>

                       <td class="justify-center layout px-0">
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
                            <v-list-tile @click="edita(props.item._id)">
                              <v-list-tile-title>Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="del(props.item)">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
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
     <confirm-dialog :dialog="dialog" :dialogTitle="dialogTitle"  :dialogText="dialogText" @onConfirm="onConfirm" @onCancel="onCancel" ></confirm-dialog>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import ConfirmDialog from './../../components/ConfirmDialog.vue'
export default {

  data () {
    return {
      dialog: false,
      dialogTitle: 'Eliminar Rol',
      dialogText: 'Desea eliminar este Rol?',
      headers: [
        { text: 'Usuario',
          value: 'name',
          sortable: true
        },
        {
          text: 'Nombres',
          value: 'description',
          sortable: false
        },
        {
          text: 'Rol',
          value: 'rol',
          sortable: false
        },
        { text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      rules: validations,
      message: '',
      selectedRol: null,
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      usersPolls: [],
      query: {},
      rolId: ''
    }
  },
  methods: {
    ...mapActions('users-polls', { findUsersPolls: 'find' }),
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-roles')
    },
    edita (id) {
      this.$router.push('/edit-roles/' + id)
    },
    del (element) {
      this.dialogTitle = 'Eliminar Rol : ' + element.name
      this.dialog = true
      this.rolId = element
    },
    onConfirm () {
      const {Role} = this.$FeathersVuex
      let rolesdelete = new Role(this.rolId)
      rolesdelete.removed = true
      rolesdelete.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Rol Eliminado')
        this.setShowSnack(true)
      })
      this.dialog = false
    },
    onCancel () {
      this.rolId = ''
      this.dialog = false
    },
    save (val) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close (val) {
    },
    getData () {
      this.findUsersPolls({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.roles = response.data
        console.log('estas son los roles', this.roles)
      })
    }
  },
  computed: {
    ...mapState('users-polls', {loading: 'isFindPending'}),
    ...mapState('users-polls', { paginationVal: 'pagination' }),
    ...mapGetters('users-polls', {findUsersPollsInStore: 'find'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    ...mapState('auth', { user: 'user' }),
    getUsers () {
      return this.findUsersPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    },
    getRoles () {
      return this.findRolesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findUsersPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findUsersPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.usersPolls = response.data
    })
    this.findRoles({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.usersPolls = response.data
    })
  },
  components: {LoadingComponent, EditableField, ConfirmDialog}
}
</script>

<style scoped>

</style>
