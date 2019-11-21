<template>
<div>
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-card-title>
                  <span class="title text-sm-left">Proyecto de Encuestas
                  <!-- <v-text-field append-icon="search" label="Buscar ..." single-line hide-details  v-model="search"></v-text-field> -->
                </span>
                <v-spacer></v-spacer>
                <span class="title text-sm-left">
                 <!-- <v-autocomplete
                      :filter="customFilter"
                      label="Filtro por estado"
                      v-model="state_polls_filter"
                      :items="itemsestado"
                      item-text="name"
                      item-value="id"
                  ></v-autocomplete> -->
                </span>

                <v-spacer></v-spacer>
                <v-btn class="deep-orange darken-3" fab small dark  @click="goToNew()">
                  <v-icon>add</v-icon>
                </v-btn>
                <v-btn class="deep-orange darken-3" fab small dark :href="urlEnviroment + '/uploads/app-debug.apk'" target="_blank">
                  <v-icon>cloud_download</v-icon>
                </v-btn >
            </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="listPollsProjects"
                  hide-actions
                  item-key="name"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">

                      <td class="text-sm-left">
                          {{props.item.name}}
                      </td>
                      <td class="text-sm-left">
                          {{(props.item.company) ? props.item.company.name : ''}}
                      </td>
                      <td class="text-sm-left">
                         {{props.item.date_start | moment("add", "1 days", "subtract", "ddd",'YYYY-MM-DD') }}
                      </td>
                      <td class="text-sm-left">
                         {{ props.item.date_end | moment("add", "1 days", "subtract", "ddd",'YYYY-MM-DD') }}
                      </td>
                      <td class="text-sm-left">
                         {{props.item.date_deliver | moment("add", "1 days", "subtract", "ddd",'YYYY-MM-DD') }}
                      </td>
                         <td class="text-sm-left">
                         <v-chip label small :color="getColorByStatus(props.item.state_polls[0])" text-color="white" >{{itemsestado[props.item.state_polls[0]].name}}</v-chip>
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
                            <v-list-tile @click="ver(props.item)">
                              <v-icon>view_list</v-icon> <v-list-tile-title>Ver</v-list-tile-title>
                            </v-list-tile>
                            <!--<v-list-tile @click="goToListConfigPolls(props.item._id)">
                              <v-icon>view_list</v-icon> <v-list-tile-title>Encuesta</v-list-tile-title>
                            </v-list-tile> -->
                            <!-- <v-list-tile @click="openMembers(props.item._id)">
                              <v-icon>face</v-icon> <v-list-tile-title>Involucrados</v-list-tile-title>
                          </v-list-tile> -->
                            <!-- <v-list-tile @click="goToCategoriesSegmentationPolls(props.item._id)">
                              <v-icon>receipt</v-icon> <v-list-tile-title>Segmentación</v-list-tile-title>
                            </v-list-tile> -->
                            <v-list-tile @click="editar(props.item)">
                             <v-icon>edit</v-icon> <v-list-tile-title>Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true; itemSelected=props.item">
                              <v-icon>delete</v-icon> <v-list-tile-title>Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar Encuesta</v-card-title>

                                <v-card-text>
                                  Esta seguro que desea eliminar ítem ?
                                </v-card-text>

                                <v-card-actions>
                                  <v-spacer></v-spacer>

                                  <v-btn
                                    color="red darken-4"
                                    flat="flat"
                                    @click="dialog = false"
                                  >
                                    Cancelar
                                  </v-btn>

                                  <v-btn
                                    color="teal darken-3"
                                    flat="flat"
                                    @click="dialog = false, del()"
                                  >
                                    Aceptar
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
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
                <loading-component v-if="loading
                "></loading-component>
            </v-card>
        </v-flex>
        <v-dialog v-model="membersDialog" persistent max-width="900">
          <v-card>
            <v-card-title class="headline">Involucrados en proyecto <strong>&nbsp;{{selectedPoll.name}}</strong> </v-card-title>
             <search-autocomplete :multiple="true" @selected="saveMembers($event, '_user_id')" :service="`users`" label="Usuarios"></search-autocomplete>
              <v-card-text>
              <v-list>
                <v-list-tile
                  v-for="member in selectedPoll.userPolls"
                  :key="member._id"
                  avatar
                >
                  <v-list-tile-avatar>
                    <img :src="`${urlEnviroment}/images/avatar.png`">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-text="member.name"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
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
                            <v-list-tile>
                              <v-icon>delete</v-icon> <v-list-tile-title @click="deleteMember(member._id)">Quitar acceso a miembro</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider></v-divider>
              </v-list>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="membersDialog = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import SearchAutocomplete from './../../components/SearchAutocomplete'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
const enviroment = require('./../../../config/enviroment.json')
Vue.use(VueMoment, {
  moment
})
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Empresa',
          align: 'left',
          sortable: false,
          value: '_company_id'
        },
        {
          text: 'Fecha Inicio',
          value: 'date_start',
          type: 'date',
          sortable: false
        },
        {
          text: 'Fecha Fin',
          value: 'date_end',
          type: 'date',
          sortable: false
        },
        {
          text: 'Fecha de Entrega',
          value: 'date_deliver',
          type: 'date',
          sortable: false
        },
        {
          text: 'Estado',
          value: 'state_polls',
          type: 'string',
          sortable: false
        },
        {
          text: 'Acciones',
          sortable: false
        }
      ],
      membersDialog: false,
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      listPollsProjects: [],
      state_polls_filter: '',
      itemSelected: null,
      rules: validations,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      Pollsprojects: [],
      usersProjects: [],
      query: {},
      user: {rol: null},
      dialog: false,
      search: '',
      itemsestado: [
        { name: 'Todos', id: 0 },
        { name: 'Creada', id: 1 },
        { name: 'Edición', id: 2 },
        { name: 'Recolección de datos', id: 3 },
        { name: 'Validación', id: 4 },
        { name: 'En informe', id: 5 },
        { name: 'Completa', id: 6 },
        { name: 'Cancelada', id: 7 }
      ],
      colors: {
        0: 'green',
        1: 'green',
        2: 'green',
        3: 'green',
        4: 'green',
        5: 'blue',
        6: 'blue',
        7: 'red'
      },
      selectedPoll: {},
      urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase
    }
  },
  methods: {
    ...mapActions('polls-project', { findPolls: 'find' }),
    ...mapActions('polls-project', { getSelectedPoll: 'get' }),
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions('users-projects', { findUsersProjects: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setSnackColor',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-polls-project')
    },
    editar (item) {
      this.$router.push({ name: 'EditPollsprojects', params: { id: item._id } })
    },
    ver (item) {
      this.$router.push({ name: 'ViewPollsprojects', params: { id: item._id } })
    },
    goToUsersProjects (id) {
      this.$router.push('/users-projects/' + id)
    },
    goToCategoriesSegmentationPolls (id) {
      this.$router.push('/category-segmentation-polls/' + id)
    },
    del () {
      const {PollsProject} = this.$FeathersVuex
      let pollsp = new PollsProject(this.itemSelected)
      pollsp.removed = true
      pollsp.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Encuesta Eliminada')
        this.setShowSnack(true)
      })
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
    getData () {
      this.query = {}
      this.findPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.listPollsProjects = response.data
      })
    },
    customFilter (item, queryText, itemText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.indexOf(searchText) > -1
    },
    getColorByStatus (status) {
      return this.colors[status]
    },
    goToListConfigPolls (id) {
      this.$router.push({ name: 'QuestionBuilderList', params: { id: id } })
    },
    getUserCurrent () {
      return (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
    },
    openMembers (id) {
      this.getSelectedPoll(id).then(result => {
        this.selectedPoll = Object.assign({}, result)
        this.membersDialog = true
      }).catch(err => console.log('este es el error', err))
    },
    deleteMember (id) {
      const {PollsProject} = this.$FeathersVuex
      let pollProject = new PollsProject(this.selectedPoll)
      this.selectedPoll.userPolls = this.selectedPoll.userPolls.filter(userPoll => userPoll._id !== id)
      pollProject.members = pollProject.members.length === 1 ? [] : pollProject.members.filter(member => member !== id)
      pollProject.save().then(result => {
        this.setSnackMessage('Eliminado Involucrado')
        this.setShowSnack(true)
      })
    },
    saveMembers (event, userId) {
      const {PollsProject} = this.$FeathersVuex
      let pollsProject = new PollsProject(this.selectedPoll)
      pollsProject.members = [...new Set(this.selectedPoll.members.concat(event))]
      pollsProject.save()
        .then(response => {
          this.selectedPoll = Object.assign({}, response)
          this.setSnackMessage('Agregados involucrados en proyecto')
          this.setShowSnack(true)
        }).catch(err => {
          this.setSnackColor('danger')
          this.setSnackMessage(`Agregados involucrados en proyecto ${err}`)
          this.setShowSnack(true)
        })
      console.log('esto se va a guardar', pollsProject)
    }
  },
  computed: {
    ...mapState('polls-project', {loading: 'isFindPending'}),
    ...mapState('polls-project', { paginationVal: 'pagination' }),
    ...mapGetters('polls-project', {findPollsInStore: 'find'}),
    ...mapGetters('users-projects', {findUsersProjectsInStore: 'find'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page () {
      this.findPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.getData()
      })
    }
  },
  created () {
    this.user = this.getUserCurrent()
    this.getData()
  },
  components: {LoadingComponent, EditableField, SearchAutocomplete}
}
</script>

<style >
.v-datatable{
    overflow: hidden;
  }
</style>
