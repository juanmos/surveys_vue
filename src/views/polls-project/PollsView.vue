<template>
    <v-flex class="view-container">
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
                INVOLUCRADOS
                <v-icon>supervised_user_circle</v-icon>
            </v-tab>
            <v-tab
                ripple>
                CATEGORIAS
                <v-icon>ballot</v-icon>
            </v-tab>
            <v-tab
                ripple>
                ENCUESTAS
                <v-icon>library_books</v-icon>
            </v-tab>
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
                              <v-list-tile-title>{{poolsseg.clientes.name}}</v-list-tile-title>
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
            </v-tab-item>
            <v-tab-item
            >

            <v-card>
               <search-autocomplete :multiple="true" @selected="saveMembers($event, '_user_id')" :service="`users`" label="usuario"></search-autocomplete>
                <v-card-text>
                <v-list>
                  <v-list-tile
                    v-for="member in poolsseg.userPolls"
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
            </v-card>
          </v-tab-item>
            <v-tab-item
            >
                <v-card flat>
                    <v-flex >
                       <v-btn class="text-xs-left" color="success" small @click="dialog = true; selectcategory ='';">Agregar</v-btn>
                       <!--<v-btn class="text-xs-left" color="success" small @click="dialog = true; selectcategory ='';">Nuevo</v-btn>-->
                      <v-dialog  v-model="dialog"  max-width="400" >
                          <v-card>
                            <v-card-title class="headline">Agregar categoria</v-card-title>
                            <v-container fluid grid-list-md>
                              <v-layout row wrap>
                                <v-flex xs12 md12>
                                  <v-autocomplete
                                      :filter="customFilter"
                                      label="Categoria"
                                      v-model="selectcategory"
                                      :items="itemsegmento"
                                      item-text="name"
                                      item-value="_id"
                                  ></v-autocomplete>
                                </v-flex>
                              </v-layout>
                            </v-container>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn  color="red darken-4" flat="flat" @click="dialog = false">
                                Cancelar
                              </v-btn>
                              <v-btn color="teal darken-3" flat="flat" @click="dialog = false, savecategory()">
                                Aceptar
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-divider class="mx-3" inset vertical></v-divider>
                      <v-card>
                          <v-card-title><strong>CATEGORIAS</strong></v-card-title>
                          <v-layout >
                            <v-flex xs2 sm2>
                             <v-spacer></v-spacer>
                            </v-flex>
                            <v-flex xs4 sm8>
                                  <v-data-table
                                      :headers="headers"
                                      :items="getCategorySegmentationPolls"
                                      hide-actions
                                      class="elevation-1"
                                      ref="table"
                                    >
                                      <template slot="items" slot-scope="props">
                                        <td class="text-xs-left">{{ props.item.name }}</td>
                                        <td class="text-xs-left">{{props.item.description}}</td>
                                      </template>
                                    </v-data-table>
                            </v-flex>
                          </v-layout>
                      </v-card>
                    </v-flex>
                </v-card>
            </v-tab-item>
            <v-tab-item>
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
        </v-tabs>
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
        sortable: true,
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
    addConfigPolls: false,
    dialogDeleteConfigPolls: false,
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
    SearchAutocomplete
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('category-segmantation-polls', { findCategorySegmentationPolls: 'find' }),
    ...mapActions('polls-project', { getPoll: 'get' }),
    ...mapActions('customers', {findcustomers: 'find'}),
    ...mapActions('poll-category', { findpollcateg: 'find' }),
    ...mapActions('category-segmentation', { findsegmentos: 'find' }),
    ...mapActions('config-polls', { findConfigPolls: 'find' }),
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
      // console.log('el nombre ', arrayData.name)
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
      // value.elements = addJson
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
        // config['name'] = this.nameConfigPolls
        config.patch().then((result) => {
          this.findConfigPolls({ query: {removed: false} }).then(response => {
            // this.alertConfig('Registro Modificado', 'success')
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          // this.setSnackColor('error')
          console.log(err)
        })
      }
    },
    getDatasend () {
      this.findsegmentos({query: {removed: false, _id: this.items2._categorySegmentation_id}}).then(response => {

      })
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
        this.setSnackMessage('Registro Eliminado')
        this.setShowSnack(true)
      }, (err) => {
        console.log(err)
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
      this.findConfigPolls({query: {$sort: { dateFinished: '-1' }, _polls_project_id: this.$route.params.id}}).then(response => {
        this.listConfigPolls = response.data
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
    if (this.$route.params.id) {
      this.cargaredicion(this.$route.params.id)
    } else {
    }
  },
  created () {
    this.findcustomers({ query: {removed: false} }).then(response => {
    })
    // this.findConfigPolls({ query: {removed: false, _polls_project_id: this.$route.params.id, $skip: 0, $limit: null} })
    this.getDataCategorySegmentationPolls()
    this.getConfigPolls()
  }
}
</script>
<style scoped>
  .view-container {
    margin: 30px;
  }

  .icon {
      color: red;
  }
</style>
