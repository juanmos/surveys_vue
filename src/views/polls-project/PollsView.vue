<template>
  <div>
    <v-container grid-list-md text-xs-center>
      <v-card>
        <v-card-title>
            <v-list-tile-action class="title text-sm-left">
                  <v-icon color="success">poll</v-icon>
            </v-list-tile-action>
            <span class="title text-sm-left">{{poolsseg.name}}</span>
            <v-spacer></v-spacer>
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
                  <v-list-tile-title>{{poolsseg.nomcliente}}</v-list-tile-title>
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
              </v-list-tile>            </v-flex>
            <v-divider inset></v-divider>
          </v-layout>
        </v-list>
          <v-flex >
             <v-btn class="text-xs-left" color="success" small @click="dialog = true; selectcategory ='';">Agregar</v-btn>
             <v-btn class="text-xs-left" color="success" small @click="dialog = true; selectcategory ='';">Nuevo</v-btn>
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
            <v-card color="white" >
            <v-card-title><strong>CATEGORÍAS</strong></v-card-title>
            <v-layout >
      <v-flex xs2 sm2>
       <v-spacer></v-spacer>
      </v-flex>
      <v-flex xs4 sm8>
            <v-data-table
                :headers="headers"
                :items="items"
                hide-actions
                class="elevation-1"
                ref="table"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.categorysegment.name }}</td>
                  <!-- <td>
                    <v-icon
                      small
                      class="mr-2"
                      @click="dialog = true; opcion =props.item.opciones; valor1 =props.item.valor1; itemSelected3=props.item"
                    >
                      edit
                    </v-icon>
                    <v-icon
                      small
                      @click="dialog2 = true; itemSelected2=props.item"
                    >
                      delete
                    </v-icon>
                    <v-dialog  v-model="dialog2"  max-width="290">
                        <v-card>
                          <v-card-title class="headline">Eliminar:</v-card-title>
                          <v-card-text>
                            Esta seguro que desea eliminar ítem ?
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red darken-4" flat="flat" @click="dialog2 = false">
                              Cancelar
                            </v-btn>
                            <v-btn
                              color="teal darken-3"
                              flat="flat"
                              @click="dialog2 = false, delcateg()"
                            >
                              Aceptar
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                  </td> -->
                </template>
              </v-data-table>
            <!-- <v-widget title="Categoria segmento" >
              <div slot="widget-content">
                <v-btn class="text-xs-left" color="success" small @click="dialog = true; selectcategory ='';">Agregar</v-btn>
                <v-btn class="text-xs-left" color="success" small @click="dialog = true; selectcategory ='';">Nuevo</v-btn>

              <v-expansion-panel focusable>
                <v-expansion-panel-content v-for="(item,i) in items" :key="i">
                  <div slot="header">{{item.categorysegment.name}}</div>

                  <v-card>
                    <v-card-text></v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              </div>
            </v-widget>
               -->
      </v-flex>
            </v-layout>
            </v-card>
               <v-divider class="mx-3" inset vertical></v-divider>
            <v-card color="white" >
      <v-card-title><strong>ENCUESTAS</strong></v-card-title>
    <v-layout >
      <v-flex xs2 sm2>
       <v-spacer></v-spacer>
      </v-flex>
      <v-flex xs4 sm8>
        <v-data-table
                  :headers="headersConfigPolls"
                  :items="getConfigPolls"
                  hide-actions
                  item-key="_id"
                  striped hover
                  outlined
                >
        <template slot="items" slot-scope="props">
          <tr>
                    <td class="text-xs-left">
                      {{ props.item.name }}
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
                            <v-list-tile @click="goToEditConfigPolls(props.item._id)">
                              <v-list-tile-title>Editar encuesta</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialogDeleteConfigPolls = true, ItemPollsConfigSelect = props.item">
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
          </v-flex>
      </v-card>
        </v-container>
  </div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VWidget from './../../components/VWidget'
import QuestionBuildIndex from '../question-builder/QuesBuildIndex'
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
      {text: 'Valor1', value: 'name'}

    ],
    headersConfigPolls: [
      {
        text: 'Nombre',
        align: 'left',
        sortable: false,
        value: 'name'
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
      number_polls: '',
      state_polls: [],
      removed: false
    },
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
    dialogEditConfiPolls: false,
    addConfigPolls: false,
    dialogDeleteConfigPolls: false,
    items: [],
    items2: {
      _polls_project_id: '',
      _categorySegmentation_id: '',
      removed: false
    },
    itemsegmento: []
  }),
  components: {
    VWidget,
    QuestionBuildIndex
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('polls-project', { findcatItems: 'find' }),
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
      this.findcatItems({query: {_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
        this.Listcat = response.data
        this.poolsseg._id = this.$route.params.id
        this.poolsseg.name = this.Listcat[0].name
        this.poolsseg.date_start = moment.tz(this.Listcat[0].date_start, 'America/Guayaquil').add(1, 'd').format('YYYY-MM-DD')
        this.poolsseg.date_end = moment.tz(this.Listcat[0].date_end, 'America/Guayaquil').add(1, 'd').format('YYYY-MM-DD')
        this.poolsseg.date_deliver = moment.tz(this.Listcat[0].date_deliver, 'America/Guayaquil').add(1, 'd').format('YYYY-MM-DD')
        this.poolsseg._customer_id = this.Listcat[0]._customer_id
        this.poolsseg.nomcliente = this.Listcat[0].clientes.name
        this.poolsseg.number_polls = this.Listcat[0].number_polls
        this.poolsseg.state_polls = this.Listcat[0].state_polls[0]
        this.poolsseg.state_polls_name = this.itemsestado[this.Listcat[0].state_polls[0] - 1].name
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
    savecategory () {
      this.items2._polls_project_id = this.$route.params.id
      this.items2._categorySegmentation_id = this.selectcategory.toString()
      const {PollCategory} = this.$FeathersVuex
      let savePolls = new PollCategory(this.items2)
      savePolls.save().then((result) => {
        this.setSnackMessage('Categoria Guardado')
        this.setShowSnack(true)
        this.cargaredicion()
      }, (err) => {
        console.log(err)
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
      this.$router.push({ name: 'QuesBuildIndex', params: { id: this.$route.params.id } })
    },
    goToEditConfigPolls (id) {
      this.$router.push({ name: 'QuestionBuilderEdit', params: { id: id } })
    }
  },
  computed: {
    ...mapGetters('customers', {findcustomerslist: 'find'}),
    ...mapGetters('config-polls', {findConfigPollsInStore: 'find'}),
    getcustomer () {
      return this.findcustomerslist({query: {removed: false}}).data
    },
    getConfigPolls () {
      // console.log('deeeee ', this.findConfigPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data)
      return this.findConfigPollsInStore({query: {removed: false, _polls_project_id: this.$route.params.id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
    this.findConfigPolls({ query: {removed: false} })
  }
}
</script>
