<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-card-title>
                <span class="title text-sm-left">Proyecto Encuestas
                  <v-text-field append-icon="search" label="Buscar ..." single-line hide-details  v-model="search"></v-text-field>
                </span>
                <v-spacer></v-spacer>
                <v-btn class="deep-orange darken-3" fab small dark  @click="goToNew()">
                  <v-icon>add</v-icon>
                </v-btn>
            </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="getpools"
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
                          {{props.item.clientes.name}}
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
                            <v-list-tile @click="editar(props.item)">
                              <v-list-tile-title>Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true; itemSelected=props.item">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
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
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
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
          text: 'Cliente',
          align: 'left',
          sortable: false,
          value: '_customer_id'
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
          text: 'Acciones',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
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
      query: {},
      dialog: false,
      search: ''
    }
  },
  methods: {
    ...mapActions('polls-project', { findPolls: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-polls-project')
    },
    editar (item) {
      this.$router.push({ name: 'EditPollsprojects', params: { id: item._id } })
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
      this.findPolls({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.pools = response.data
      })
    }
  },
  computed: {
    ...mapState('polls-project', {loading: 'isFindPending'}),
    ...mapState('polls-project', { paginationVal: 'pagination' }),
    ...mapGetters('polls-project', {findPollsInStore: 'find'}),
    getpools () {
      return this.findPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.pools = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
