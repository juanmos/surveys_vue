<template>
<div >
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Encuestador: {{userCurrent.name}}</v-subheader>
              <v-card-title>
                <v-flex xs6>
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
                  :items="listMobileResults"
                  hide-actions
                  item-key="_id"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="justify-left">
                          <a :href="getUrlImage(props.item.path)"
                          title="Ver archivo"
                          target="_blank">
                          {{ props.item.filename }}
                      </a>
                      </td>
                      <td>
                        {{ props.item._loki }}
                      </td>
                      <td>
                        {{ props.item.fecha_inicio }}
                      </td>
                      <td>
                        {{ props.item.fecha_fin }}
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
                            <v-list-tile @click="dialog = true; itemSelected = props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
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
            </v-card>
        </v-flex>
        </v-layout>
        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">Eliminar archivo</v-card-title>

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
    </v-container>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
const enviroment = require('./../../../config/enviroment.json')
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre del Archivo',
          align: 'center',
          sortable: false,
          value: 'name'
        },
        { text: 'Loki',
          align: 'center',
          value: '_loki',
          sortable: true
        },
        { text: 'Fecha Inicio',
          align: 'center',
          value: '_loki',
          sortable: true
        },
        { text: 'Fecha Fin',
          align: 'center',
          value: '_loki',
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
      configPoll: null,
      user: null,
      userCurrent: {
        name: ''
      },
      rules: validations,
      dialog: false,
      total: 0,
      message: '',
      showMsg: false,
      search: '',
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
    ...mapActions('users', {getUser: 'get'}),
    getMobileSurvey () {
      this.findMobileSurvey({query: {removed: false, _config_poll_id: this.configPoll, _user_id: this.user, $skip: 0, $limit: null}}).then(response => {
        this.listMobileResults = response.data
        this.total = response.total
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
    getUrlImage (file) {
      file = (file) || 'uploads/construct/data_not_found.png'
      file = file.replace(/public/g, '')
      return enviroment[enviroment.currentEnviroment].backend.urlBase + file
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
        this.getMobileSurvey()
      })
    },
    getUserCurrent () {
      this.getUser(this.user).then(result => {
        this.userCurrent = result
      }).catch(err => console.log('este es el error', err))
    }
  },
  computed: {
    ...mapGetters('mobile-survey-results', {findMobileSurveyInStore: 'find'})
  },
  watch: {
  },
  created () {
    this.configPoll = this.$route.params.config
    this.user = this.$route.params.user
    this.getMobileSurvey()
    this.getUserCurrent()
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>
.justify-left {
    text-align: left;
}
</style>
