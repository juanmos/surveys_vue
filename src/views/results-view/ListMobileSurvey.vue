<template>
<div >
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Encuestas para procesar</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <v-select
                     v-model="selectedUser"
                     v-bind:items="users"
                     item-text="name"
                     item-value="_id"
                     label="Encuestador"
                     ></v-select>
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
                    <label for="">TOTAL: {{listMobileResults.length}}</label>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="listMobileResults"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>
                        {{ props.item.filename }}
                      </td>
                      <td>
                        {{ props.item._loki }}
                      </td>
                      <td class="text-xs-left">
                          <!-- {{ props.item._user_id }} -->
                          {{ (props.item.user) ? props.item.user.name : '' }}
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
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
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
                color="primary"
                @click="goToList()"
                >
                    <v-icon>list</v-icon>
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
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre del Archivo',
          align: 'center',
          sortable: true,
          value: 'name'
        },
        { text: 'loki',
          align: 'center',
          value: '_loki',
          sortable: true
        },
        { text: 'Encuestador',
          value: 'user.name',
          sortable: false
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
      message: '',
      showMsg: false,
      search: '',
      users: [],
      listMobileResults: [],
      cloneListMobileResults: [],
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      query: {},
      dia: false
    }
  },
  methods: {
    ...mapActions('mobile-survey-results', { findMobileSurvey: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    getMobileSurvey () {
      this.findMobileSurvey({query: {removed: false, _config_poll_id: this.id, $skip: this.getSkip, $limit: this.limit}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.listMobileResults = response.data
        this.loaded = true
      })
    },
    getFilterMobileSurvey (userId) {
      this.findMobileSurvey({query: {removed: false, _config_poll_id: this.id, _user_id: userId, $skip: this.getSkip, $limit: this.limit}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.listMobileResults = response.data
        this.loaded = true
      })
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    goToList () {
      this.$router.go(-1)
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dia opened'
    },
    close (val) {
      // console.('Dia closed', val)
    },
    del () {
      const {MobileSurveyResult} = this.$FeathersVuex
      const mobileResult = new MobileSurveyResult(this.itemSelected)
      mobileResult.removed = true
      mobileResult.patch().then((result) => {
        if (this.selectedUser) {
          this.getFilterMobileSurvey(this.selectedUser)
        } else {
          this.getMobileSurvey()
        }
      })
    },
    getDataConfig () {
      this.getPoll([this.id, {query: {withInstances: false}}]).then(result => {
        this.users = [...result.users, {_id: null, name: 'TODOS'}]
      }).catch(err => console.log('este es el error', err))
    }
  },
  computed: {
    ...mapState('mobile-survey-results', {loading: 'isFindPending'}),
    ...mapState('mobile-survey-results', { paginationVal: 'pagination' }),
    ...mapGetters('mobile-survey-results', {findMobileSurveyInStore: 'find'}),
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page () {
      if (this.selectedUser) {
        this.findMobileSurvey({query: {removed: false, _config_poll_id: this.id, _user_id: this.selectedUser, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
          this.limit = response.limit
          this.total = response.total
          this.listMobileResults = response.data
        })
      } else {
        this.findMobileSurvey({query: {removed: false, _config_poll_id: this.id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
          this.limit = response.limit
          this.total = response.total
          this.listMobileResults = response.data
        })
      }
    },
    selectedUser: function (val) {
      this.page = 0
      if (val) {
        this.getFilterMobileSurvey(val)
      } else {
        this.getMobileSurvey()
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getMobileSurvey()
    this.getDataConfig()
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>

</style>
