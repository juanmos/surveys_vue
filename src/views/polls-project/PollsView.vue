<template>
    <v-flex class="view-container">
        <v-dialog v-model="dialogWait" persistent max-width="900">
            <v-card v-if="dialogWait">
              <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
                <h5>ENCUESTAS</h5>
              </v-flex>
              <v-card-text>
                  <center>
                      <v-img
                        src="/images/loader.gif"
                        img-alt="Image"
                        height="70"
                        width="70"
                        aspect-ratio="2.75"
                      ></v-img>
                    <h5>Cargando encuestas... Espere por favor.</h5>
                  </center>
              </v-card-text>
            </v-card>
        </v-dialog>
      <v-card>
        <v-tabs
        color="secondary"
        centered
        dark
        slider-color="primary"
        icons-and-text
        >
            <v-tab
                ripple>
                INFORMACIÓN DEL PROYECTO
                <v-icon>description</v-icon>
            </v-tab>
            <v-tab
                ripple>
                ENCUESTADORES
                <v-icon>supervised_user_circle</v-icon>
            </v-tab>
            <!-- <v-tab
                ripple>
                HISTORIAL
                <v-icon>ballot</v-icon>
            </v-tab> -->
            <v-tab-item
            >
                <v-card flat>
                    <v-card-title>
                        <v-list-tile-action class="title text-sm-left">
                              <v-icon color="success">poll</v-icon>
                        </v-list-tile-action>
                        <span class="title text-sm-left">{{poolsseg.name}}</span>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                          <v-btn :to="`/map/full/${this.$route.params.id}`" slot="activator" icon><v-icon large color="primary">map</v-icon></v-btn>
                          <span>Ver Mapa General</span>
                        </v-tooltip>
                      </v-card-title>
                    <v-divider inset></v-divider>
                    <v-list two-line>
                      <v-layout row wrap >
                        <v-flex md4 xs12>
                          <v-list-tile>
                            <v-list-tile-action>
                                  <v-icon color="indigo">perm_contact_calendar</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title>{{(poolsseg.clientes) ? poolsseg.clientes.name : '** NO ASIGNADO **'}}</v-list-tile-title>
                              <v-list-tile-sub-title>Nombre del Cliente</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-action>
                              <v-icon color="indigo">calendar_today</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title>{{poolsseg.date_start}}</v-list-tile-title>
                              <v-list-tile-sub-title>Fecha de Inicio</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-flex>
                        <v-flex md4 xs12>
                           <v-list-tile >
                            <v-list-tile-action>
                              <v-icon ></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title text-color="black">{{poolsseg.number_polls}}</v-list-tile-title>
                              <v-list-tile-sub-title>N° de Encuetas</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile >
                            <v-list-tile-action>
                              <v-icon></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title>{{poolsseg.date_end}}</v-list-tile-title>
                              <v-list-tile-sub-title>Fecha de Fin</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-flex>
                        <v-flex md4 xs12>
                          <v-list-tile>
                            <v-list-tile-action>
                              <v-icon ></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title class="text-xs-left"><v-chip label small :color="getColorByStatus(poolsseg.state_polls)" text-color="white" >{{poolsseg.state_polls_name}}</v-chip></v-list-tile-title>
                              <v-list-tile-sub-title>Estado</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile >
                            <v-list-tile-action>
                              <v-icon></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title>{{poolsseg.date_deliver}}</v-list-tile-title>
                              <v-list-tile-sub-title>Fecha de Entrega</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                      </v-flex>
                        <v-divider inset></v-divider>
                      </v-layout>
                    </v-list>
                </v-card>

                <v-card flat>
                    <v-card-title><strong>ENCUESTAS</strong></v-card-title>
                  <v-layout >
                    <v-flex xs2 sm2>
                     <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs4 sm8>
                      <v-data-table
                        :headers="headersConfigPolls"
                        :items="listConfigPolls"
                        hide-actions
                        item-key="_id"
                        outlined
                      >
                      <template slot="items" slot-scope="props">
                        <tr>
                          <td class="text-xs-left">
                            <v-edit-dialog
                              :return-value.sync="props.item.take"
                              lazy
                              @save="edit(props.item.take, props.item, 'take')"
                              @cancel="cancel"
                              @open="open"
                              @close="close"
                            > {{ props.item.take }}
                              <v-text-field
                                slot="input"
                                v-model="props.item.take"
                                label="Editar Toma"
                                single-line
                                counter
                              ></v-text-field>
                            </v-edit-dialog>
                          </td>
                          <td class="text-xs-left">
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
                                label="Editar Nombre"
                                single-line
                                counter
                              ></v-text-field>
                            </v-edit-dialog>
                          </td>
                          <td class="text-xs-left">
                            <v-edit-dialog
                              :return-value.sync="props.item.status"
                              lazy
                              @save="edit(props.item.status, props.item, 'status')"
                              @cancel="cancel"
                              @open="open"
                              @close="close"
                            > {{ props.item.status }}
                              <v-text-field
                                slot="input"
                                v-model="props.item.status"
                                label="Editar Status"
                                single-line
                                counter
                              ></v-text-field>
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
                                  <!-- <v-list-tile @click="goToResultConfigPolls(props.item._id)">
                                    <v-icon class="icon">assignment</v-icon>
                                    <v-list-tile-title>Resultados de Encuesta</v-list-tile-title>
                                  </v-list-tile> -->
                                  <v-list-tile @click="reportResult(props.item._id)">
                                    <v-icon class="icon">view_quilt</v-icon>
                                    <v-list-tile-title>Dashboard</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goToViewData(props.item._id)">
                                    <v-icon class="icon">line_weight</v-icon>
                                    <v-list-tile-title>Vista de datos</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goToViewCoding(props.item._id)">
                                    <v-icon class="icon">bookmark</v-icon>
                                    <v-list-tile-title>Codificar</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="duplicate(props.item)">
                                    <v-icon class="icon">file_copy</v-icon>
                                    <v-list-tile-title>Duplicar</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goToMobileResults(props.item._id)">
                                    <v-icon class="icon">assignment_ind</v-icon>
                                    <v-list-tile-title>Encuestas de involucrados</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goViewResultsMobile(props.item._id)">
                                    <v-icon class="icon">find_in_page</v-icon>
                                    <v-list-tile-title>Vista de encuestas realizadas</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile v-if="props.item.pathFileZip">
                                    <v-icon class="icon">save_alt</v-icon>
                                    <v-list-tile-title>
                                        <a :href="getPath(props.item.pathFileZip)"
                                          title="Descargar zip">
                                        Descargar archivo zip
                                        </a>
                                    </v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goToGenerateAll(props.item._id)">
                                    <v-icon class="icon">timelapse</v-icon>
                                    <v-list-tile-title>Generar archivo zip</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goToEditConfigPolls(props.item._id)">
                                    <v-icon class="icon">border_color</v-icon>
                                    <v-list-tile-title>Editar encuesta</v-list-tile-title>
                                  </v-list-tile>
                                  <!-- <v-list-tile @click="goToViewCreatorReport(props.item._id)">
                                    <v-icon class="icon">view_quilt</v-icon>
                                    <v-list-tile-title>Reportes de segmentos</v-list-tile-title>
                                </v-list-tile> -->
                                  <v-list-tile @click="goToViewConfigPolls(props.item._id)">
                                    <v-icon class="icon">ballot</v-icon>
                                    <v-list-tile-title>Llenar encuesta</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="processPollsApp(props.item._id)" v-if="getRol === '5a8f05d594f896e07ca5053d' || getRol === '5bf5900377870c707b0bb2f7'">
                                    <v-icon class="icon">sync</v-icon>
                                    <v-list-tile-title>Procesar encuestas</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="goToEditDataConfigPolls(props.item._id)">
                                    <v-icon class="icon">edit</v-icon>
                                    <v-list-tile-title>Editar información</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="dialogDeleteConfigPolls = true, ItemPollsConfigSelect = props.item">
                                    <v-icon class="icon">cancel</v-icon>
                                    <v-list-tile-title>Eliminar encuesta</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                                <v-dialog
                                v-model="dialogDeleteConfigPolls"
                                max-width="380"
                                max-heigth="500"
                              >
                                <v-card>
                                  <v-card-title class="headline">Está seguro que desea eliminar la encuesta</v-card-title>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                      color="red darken-1"
                                      flat="flat"
                                      @click="dialogDeleteConfigPolls = false"
                                    >
                                      NO
                                    </v-btn>

                                    <v-btn
                                      color="green darken-1"
                                      flat="flat"
                                      @click="dialogDeleteConfigPolls = false, deleteConfigPolls()"
                                    >
                                      SI
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                                </v-menu>
                            </td>
                              </tr>
                              </template>
                      </v-data-table>
                    </v-flex>
                    <v-flex xs4 sm2>
                     <v-btn
                              dark
                              fab
                              small
                              top
                              right
                              color="red"
                              @click="goToCreateConfigPolls"
                              >
                              <v-icon>add</v-icon>
                              </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card>
            </v-tab-item>
            <v-tab-item
            >

            <v-card>
               <search-autocomplete :multiple="true" @selected="saveMembers($event, '_user_id')" :service="`users`" label="usuario"></search-autocomplete>
                <v-card-text>

                    <v-list>
                            <v-list-item
                            v-for="member in poolsseg.userPolls"
                            :key="member._id"
                            :name="member._id"
                            >
                            <div class="itemList">
                                <v-list-tile>
                                    <v-list-tile-avatar>
                                      <img @click="getDataRoute(member)" :src="`${urlEnviroment}/images/avatar.png`">
                                    </v-list-tile-avatar>

                                    <v-list-tile-content @click="getDataRoute(member)">
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
                                              <v-list-tile class="actionItem">
                                                <v-icon color="red">my_location</v-icon> <v-list-tile-title @click="getDataRoute(member)">Ver ruta</v-list-tile-title>
                                              </v-list-tile>
                                              <v-list-tile class="actionItem">
                                                <v-icon color="red">delete</v-icon> <v-list-tile-title @click="deleteMember(member._id)">Quitar acceso a miembro</v-list-tile-title>
                                              </v-list-tile>
                                            </v-list>
                                          </v-menu>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </div>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <v-dialog v-model="dialogMap" fullscreen v-if="dialogMap">
              <v-card>
                <v-card-title>
                    <span class="title">RUTA DE {{surveyor.name}}</span>
                </v-card-title>
                    <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="dark darken-1"
                            flat="flat"
                            style="background: #000;"
                            @click="dialogMap = false"
                              >
                              CERRAR
                     </v-btn>
                   </v-card-actions>
                   <v-layout row wrap>
                       <v-flex xs3 justify="center">
                           <center>
                               <v-date-picker v-model="dateCurrent" locale="es-es"></v-date-picker>
                           </center>
                       </v-flex>
                       <v-flex xs9>
                           <map-polylines-component :markers="points" :gmapCenter="dataGmapCenter"></map-polylines-component>
                       </v-flex>
                   </v-layout>
              </v-card>
            </v-dialog>
      </v-card>
    </v-flex>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VWidget from './../../components/VWidget'
import QuestionBuildIndex from '../question-builder/QuesBuildIndex'
import SearchAutocomplete from './../../components/SearchAutocomplete'
import MapPolylinesComponent from './../../components/graphs/MapPolylines'
const enviroment = require('./../../../config/enviroment.json')
Vue.use(VueMoment, {
  moment
})
export default {
  data: (vm) => ({
    headers: [
      {
        text: 'Nombre',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {text: 'Descripción', value: 'name'}

    ],
    headersConfigPolls: [
      {
        text: 'Toma',
        align: 'left',
        sortable: false,
        value: 'take'
      },
      {
        text: 'Nombre',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Estatus',
        align: 'left',
        sortable: false,
        value: 'status'
      },
      {
        text: 'Acciones',
        value: 'name',
        sortable: false
      }
    ],
    dialogWait: false,
    poolsseg: {
      name: '',
      date_start: '',
      date_end: '',
      date_deliver: '',
      _customer_id: '',
      clientes: {
        name: ''
      },
      number_polls: '',
      state_polls: [],
      removed: false
    },
    listConfigPolls: [],
    selectcategory: '',
    dialog: false,
    fechainicio: false,
    fechafin: false,
    fechaentrega: false,
    pollssegver: [],
    valid: false,
    itemSelected2: null,
    titulo: '',
    titulosave: '',
    ItemPollsConfigSelect: '',
    itemsestado: [
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
    urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase,
    dialogEditConfiPolls: false,
    dateCurrent: new Date().toISOString().substr(0, 10),
    addConfigPolls: false,
    dialogDeleteConfigPolls: false,
    surveyor: null,
    dialogMap: false,
    points: [],
    dataGmapCenter: {
      lat: 0,
      lng: 0
    },
    items: [],
    items2: {
      name: '',
      description: '',
      _project_poll_id: '',
      _categorySegmentation_id: '',
      datos: {},
      removed: false
    },
    itemsegmento: []
  }),
  components: {
    VWidget,
    QuestionBuildIndex,
    SearchAutocomplete,
    MapPolylinesComponent
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('route-surveyors', { findRouteSurveyors: 'find' }),
    ...mapActions('category-segmantation-polls', { findCategorySegmentationPolls: 'find' }),
    ...mapActions('polls-project', { getPoll: 'get' }),
    ...mapActions('customers', {findcustomers: 'find'}),
    ...mapActions('poll-category', { findpollcateg: 'find' }),
    ...mapActions('category-segmentation', { findsegmentos: 'find' }),
    ...mapActions('config-polls', { findConfigPolls: 'find' }),
    ...mapActions('config-polls', { getConfigPoll: 'get' }),
    goToList () {
      this.$router.push('/polls-project')
    },
    getColorByStatus (status) {
      return this.colors[status]
    },
    cargaredicion (elementid) {
      this.getPoll(this.$route.params.id).then(response => {
        this.poolsseg = response
        this.poolsseg.date_start = moment.tz(response.date_start, 'America/Guayaquil').add(1, 'd').format('YYYY-MM-DD')
        this.poolsseg.date_end = moment.tz(response.date_end, 'America/Guayaquil').add(1, 'd').format('YYYY-MM-DD')
        this.poolsseg.date_deliver = moment.tz(response.date_deliver, 'America/Guayaquil').add(1, 'd').format('YYYY-MM-DD')
        this.poolsseg.state_polls = response.state_polls[0]
        // this.poolsseg.state_polls_name = this.itemsestado[response.state_polls[0] - 1].name
      })
      this.findpollcateg({query: {_polls_project_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
        this.items = response.data
      })
      this.findsegmentos({query: {removed: false, ...this.query}}).then(response => {
        this.itemsegmento = response.data
      })
    },
    customFilter (item, queryText, itemText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.indexOf(searchText) > -1
    },
    EditCategoryJson (arrayData, value, idConfigPolls, names) {
      let addJson = []
      let name = names
      let choices = []
      arrayData.map((value, key) => {
        choices.push(value.valor1)
      })
      addJson =
        {
          'name': name,
          'elements': [
            {
              'type': 'radiogroup',
              'name': name,
              'choices': choices
            }
          ]
        }
      let flagRepeat = 0
      let jsonSend = value
      jsonSend.pages.map((value, key) => {
        if (value.name === name) {
          flagRepeat = 1
        }
      })
      if (flagRepeat === 0) {
        let pages = jsonSend.pages.length
        jsonSend.pages[(pages)] = addJson
        let data = {_id: idConfigPolls, name: name, construct: JSON.stringify(jsonSend)}
        const {ConfigPoll} = this.$FeathersVuex
        let config = new ConfigPoll(data)
        config['_polls_project_id'] = this.$route.params.id
        config.patch().then((result) => {
          this.findConfigPolls({ query: {removed: false} }).then(response => {
            // this.alertConfig('Registro Modificado', 'success')
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          console.log(err)
        })
      }
    },
    deleteMember (id) {
      const {PollsProject} = this.$FeathersVuex
      let pollProject = new PollsProject(this.poolsseg)
      this.poolsseg.userPolls = this.poolsseg.userPolls.filter(userPoll => userPoll._id !== id)
      pollProject.members = pollProject.members.length === 1 ? [] : pollProject.members.filter(member => member !== id)
      pollProject.save().then(result => {
        this.setSnackMessage('Eliminado Involucrado')
        this.setShowSnack(true)
      })
    },
    saveMembers (event, userId) {
      const {PollsProject} = this.$FeathersVuex
      let pollsProject = new PollsProject(this.poolsseg)
      pollsProject.members = [...new Set(this.poolsseg.members.concat(event))]
      let that = this
      pollsProject.save()
        .then(response => {
          that.cargaredicion(this.$route.params.id)
          that.setSnackMessage('Agregados involucrados en proyecto')
          that.setShowSnack(true)
        }).catch(err => {
          that.setSnackColor('danger')
          that.setSnackMessage(`Agregados involucrados en proyecto ${err}`)
          that.setShowSnack(true)
        })
    },
    savecategory () {
      this.items2._project_poll_id = this.$route.params.id
      this.items2._categorySegmentation_id = this.selectcategory.toString()
      this.findsegmentos({query: {removed: false, _id: this.items2._categorySegmentation_id}}).then(responseData => {
        this.items2.name = responseData.data[0].name
        this.items2.description = responseData.data[0].description
        this.items2.datos = responseData.data[0].datos
        const {CategorySegmantationPoll} = this.$FeathersVuex
        let savePolls = new CategorySegmantationPoll(this.items2)
        savePolls.save().then((result) => {
          this.setSnackMessage('Categoria Guardada')
          this.setShowSnack(true)
          this.cargaredicion()
        }, (err) => {
          console.log(err)
        })
      })
    },
    deleteConfigPolls () {
      const {ConfigPoll} = this.$FeathersVuex
      const Config = new ConfigPoll(this.ItemPollsConfigSelect)
      Config.removed = true
      Config.patch().then((result) => {
        this.getConfigPolls()
        this.setSnackMessage('Registro Eliminado')
        this.setShowSnack(true)
      }, (err) => {
        console.log(err)
      })
    },
    getDataRoute (user) {
      this.surveyor = user
      this.dialogMap = true
      this.getRouteSurveyors()
    },
    getRouteSurveyors () {
      this.findRouteSurveyors({query: {_user_id: this.surveyor._id, date: this.dateCurrent, $sort: { date: '1' }, $limit: null, $skip: 0}}).then(response => {
        this.points = response.data.map(point => {
          return {
            lat: point.latitude,
            lng: point.longitude
          }
        })
      })
    },
    goToCreateConfigPolls () {
      this.$router.push({ path: `/QuesBuildIndex/${this.$route.params.id}` })
    },
    goToEditConfigPolls (id) {
      this.$router.push({ name: 'QuestionBuilderEdit', params: { id: id } })
    },
    goToEditDataConfigPolls (id) {
      this.$router.push({ path: `/QuestionBuilderIndexEdit/${id}` })
    },
    goToViewConfigPolls (id) {
      this.$router.push({ name: 'QuestionBuilderView', params: { id: id } })
    },
    processPollsApp (id) {
      this.findConfigPolls({ query: {surveyApp: true, _id: id} })
      this.getConfigPolls()
    },
    reportResult (id) {
      this.$router.push({ path: `/simple-report/${id}` })
    },
    goToResultConfigPolls (id) {
      this.$router.push({ path: `/poll-results/${id}` })
    },
    goToViewData (id) {
      this.$router.push({ path: `/view-data-poll/${id}` })
    },
    goToViewCoding (id) {
      this.$router.push({ path: `/view-data-coding-poll/${id}` })
    },
    goToMobileResults (id) {
      this.$router.push({ path: `/view-mobile-results/${id}` })
    },
    goViewResultsMobile (id) {
      this.$router.push({ path: `/list-data-response-mobile/${id}` })
    },
    getPath (path) {
      path = (path) || 'uploads/construct/data_not_found.png'
      path = path.replace(/public/g, '')
      return enviroment[enviroment.currentEnviroment].backend.urlBase + path
    },
    goToGenerateAll (id) {
      this.getConfigPoll([id, {query: {generateAllPdf: true}}]).then(result => {
        console.log('listo', result)
      }).catch(err => console.log('este es el error', err))
      // this.$router.push({ path: `/list-data-response-mobile/${id}` })
    },
    duplicate (configPoll) {
      let newConfigPoll = {
        name: `${configPoll.name}-DUPLICADO***`,
        _polls_project_id: configPoll._polls_project_id,
        construct: configPoll.construct,
        formatedConfiguration: [],
        originalJson: [],
        country: configPoll.country,
        province: configPoll.province,
        canton: configPoll.canton,
        status: configPoll.status,
        take: configPoll.take,
        markers: configPoll.markers,
        dateFinished: configPoll.dateFinished
      }
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(newConfigPoll)
      config.save().then((result) => {
        this.getConfigPolls()
      }, (err) => {
        console.log(err)
      })
    },
    goToViewCreatorReport (id) {
      this.$router.push({ path: `/view-creator-report/${id}` })
    },
    getDataCategorySegmentationPolls () {
      this.findCategorySegmentationPolls({query: {removed: false, _project_poll_id: this.$route.params.id}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
      })
    },
    edit (val, elem, field) {
      const {ConfigPoll} = this.$FeathersVuex
      const configPoll = new ConfigPoll(elem)
      configPoll[field] = val
      configPoll.patch().then((result) => {
        this.setSnackMessage('Encuesta Editada')
        this.setShowSnack(true)
      })
    },
    getConfigPolls () {
      this.dialogWait = true
      this.findConfigPolls({query: {$sort: { dateFinished: '-1' }, removed: false, _polls_project_id: this.$route.params.id}}).then(response => {
        this.listConfigPolls = response.data
        this.dialogWait = false
      })
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
    }
  },
  computed: {
    ...mapGetters('customers', {findcustomerslist: 'find'}),
    ...mapGetters('category-segmantation-polls', {findCategorySegmentationPollsInStore: 'find'}),
    ...mapGetters('config-polls', {findConfigPollsInStore: 'find'}),
    getcustomer () {
      return this.findcustomerslist({query: {removed: false}}).data
    },
    getCategorySegmentationPolls () {
      return this.findCategorySegmentationPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, _project_poll_id: this.$route.params.id, ...this.query}}).data
    },
    getRol () {
      let user = (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
      return (user) ? user._rol_id : ''
    }
  },
  mounted () {
    this.cargaredicion(this.$route.params.id)
  },
  created () {
    this.findcustomers({ query: {removed: false} }).then(response => {
    })
    // this.findConfigPolls({ query: {removed: false, _polls_project_id: this.$route.params.id, $skip: 0, $limit: null} })
    this.getDataCategorySegmentationPolls()
    this.getConfigPolls()
  },
  watch: {
    dateCurrent: function (val) {
      this.dateCurrent = val
      this.getRouteSurveyors()
    }
  }
}
</script>
<style scoped>
  .itemList {
      cursor: pointer;
      color: white;
  }
  .itemList:hover{
      background-color: #949393d9 !important;
      color: white;
  }
  .actionItem{
      cursor: pointer;
      color: white;
  }
  .actionItem:hover{
      background-color: #949393d9;
      color: white;
  }
  .view-container {
    margin: 30px;
  }

  .icon {
      color: red;
  }
</style>
