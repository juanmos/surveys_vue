<template>
<div >
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Encuestas para procesar</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <span class="title">
                      <v-text-field append-icon="search" label="Buscar..." single-line hide-details  v-model="search"></v-text-field>
                    </span>
                    <!-- <v-select
                     v-model="selectedUser"
                     v-bind:items="users"
                     item-text="name"
                     item-value="_id"
                     label="Encuestador"
                     ></v-select> -->
                    <!-- <v-text-field
                            v-model="search"
                            @keyup.enter="searchUserName"
                            @keyup.space="searchUserName"
                            append-icon="search"
                            label="Buscar por nombre..."
                            single-line
                            hide-details
                          ></v-text-field> -->
                </v-flex>
                <v-flex xs6>
                    <label>TOTAL DE ENCUESTAS: {{total}}</label>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="users"
                  hide-actions
                  item-key="_id"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="justify-left"  @click="goToDetailUser(props.item._id)" style="cursor:pointer;">
                        {{ props.item.name }}
                      </td>
                      <td @click="goToDetailUser(props.item._id)" style="cursor:pointer;">
                        {{ (props.item.totalPolls) ? props.item.totalPolls : 0 }}
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
                            <v-list-tile @click="goToDetailUser(props.item._id)">
                              <v-list-tile-title >Detalles</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar usuario</v-card-title>

                                <v-card-text>
                                  Esta seguro que desea eliminar la encuesta?
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
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
                @click="goToList()"
                >
                    <v-icon>list</v-icon>
                </v-btn>
                <loading-component v-if="loading"></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'ENCUESTADOR',
          align: 'center',
          sortable: true,
          value: 'name'
        },
        { text: 'Total de encuestas',
          align: 'center',
          value: 'totalPolls',
          sortable: true
        },
        { text: 'Acciones',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      filterRol: null,
      id: null,
      roles: null,
      rules: validations,
      dialog: false,
      selectedUser: null,
      total: 0,
      pollProjectId: null,
      message: '',
      showMsg: false,
      search: '',
      users: [],
      configPollCurrent: null,
      listMobileResults: [],
      msgType: 'error',
      itemSelected: null,
      loaded: false,
      query: {},
      dia: false
    }
  },
  methods: {
    ...mapActions('mobile-survey-results', { findMobileSurvey: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions('polls-project', {getPollsProject: 'get'}),
    getMobileSurvey () {
      this.findMobileSurvey({query: {removed: false, _config_poll_id: this.id, $skip: 0, $limit: null}}).then(response => {
        this.listMobileResults = [...response.data]
        this.users = this.users.map(user => {
          user.totalPolls = this.listMobileResults.filter(mobileResult => mobileResult._user_id === user._id).length
          this.total += user.totalPolls
          this.loaded = true
          return user
        })
      })
    },
    goToDetailUser (userId) {
      this.$router.push({ path: `/view-detail-mobile-results/${this.id}/${userId}` })
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    goToList () {
      this.$router.go(-1)
    },
    getDataConfig () {
      this.getPoll([this.id, {query: {withInstances: false}}]).then(result => {
        // this.users = [...result.users]
        this.pollProjectId = result._polls_project_id
        this.getDataProject()
      }).catch(err => console.log('este es el error', err))
    },
    getDataProject () {
      this.getPollsProject(this.pollProjectId).then(result => {
        this.users = [...result.userPolls]
        this.getMobileSurvey()
      }).catch(err => console.log('este es el error', err))
    }
  },
  computed: {
    ...mapGetters('mobile-survey-results', {findMobileSurveyInStore: 'find'}),
    ...mapState('mobile-survey-results', {loading: 'isFindPending'})
  },
  watch: {
  },
  mounted () {
    this.id = this.$route.params.id
    this.getDataConfig()
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>
.justify-left {
    text-align: left;
}
</style>
