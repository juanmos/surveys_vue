<template>
<div >
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Actas Registradas</v-subheader>
              <v-flex xs12>
                <v-text-field
                  v-model="filter.province.name"
                  disabled
                  hide-no-data
                  hide-details
                  label="Provincia"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
              </v-flex>
              <v-layout
                  row
                  wrap>
                  <v-flex xs6>

                        <v-autocomplete
                                :items="cantones"
                                item-text="name"
                                item-value="name"
                                v-model="filter.canton"
                                hide-no-data
                                hide-details
                                label="Buscar cantón..."
                                solo-inverted
                                @change="selectedCanton"
                              ></v-autocomplete>
                      </v-flex>
                      <v-flex xs6>
                          <v-autocomplete class="background: #333;"
                            :items="parroquias"
                            item-text="name"
                            item-value="name"
                            v-model="filter.parroquia"
                            hide-no-data
                            hide-details
                            label="Buscar parroquias..."
                            solo-inverted
                            @change="selectedParroquia"
                          ></v-autocomplete>
                      </v-flex>

              </v-layout>
            <v-data-table
                  :headers="headers"
                  :items="recordsList"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="justify-left">
                        {{props.item.number}}
                      </td>
                      <td class="justify-left">
                        {{props.item.position}}
                      </td>
                      <td class="justify-left">
                        {{props.item.province}}
                      </td>
                      <td class="justify-left">
                        {{props.item.canton}}
                      </td>
                      <td class="justify-left">
                        {{props.item.parroquia}}
                      </td>
                      <td class="justify-left">
                        {{props.item.table}}
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
                            <v-list-tile @click="goToEdit(props.item)">
                              <v-list-tile-title >Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar el acta</v-card-title>

                                <v-card-text>
                                  Esta seguro que desea eliminar el acta?
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
                title="Agregar nueva acta"
                color="primary"
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
          text: 'Acta',
          align: 'left',
          sortable: false,
          value: 'number'
        },
        { text: 'Cargo',
          value: 'position',
          sortable: false
        },
        { text: 'Provincia',
          value: 'province',
          sortable: false
        },
        { text: 'Canton',
          value: 'canton',
          sortable: false
        },
        { text: 'Parroquia',
          value: 'parroquia',
          sortable: true
        },
        { text: 'Mesa',
          value: 'table',
          sortable: false
        },
        { text: 'Acciones',
          value: '',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      rules: validations,
      project_id: null,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      provinces: [],
      cantones: [],
      parroquias: [],
      filter: {
        province: {name: ''},
        canton: '',
        parroquia: '',
        table: ''
      },
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      project: null,
      projects: [],
      recordsList: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('electoral-records', { findRecords: 'find' }),
    ...mapActions('electoral-projects', { getProject: 'get' }),
    ...mapActions('provinces', { getProvince: 'get' }),
    goToNew () {
      this.$router.push('/electoral-records-new/' + this.project_id)
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
    goToEdit (record) {
      this.$router.push('/electoral-records-edit/' + record._id)
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    orderCantones () {
      let orderCantones = this.cantones.sort(function (a, b) {
        var x = a.name
        var y = b.name
        if (x < y) { return -1 }
        if (x > y) { return 1 }
        return 0
      })
      this.cantones = [{name: 'TODOS'}, ...orderCantones]
    },
    orderParroquias () {
      if (this.parroquias) {
        let orderParroquias = this.parroquias.sort(function (a, b) {
          var x = a.name
          var y = b.name
          if (x < y) { return -1 }
          if (x > y) { return 1 }
          return 0
        })
        this.parroquias = [{name: 'TODOS'}, ...orderParroquias]
      }
    },
    del () {
      const {ElectoralRecord} = this.$FeathersVuex
      const electoralRecord = new ElectoralRecord(this.itemSelected)
      electoralRecord.removed = true
      electoralRecord.patch().then((result) => {
        this.loadData()
      })
    },
    selectedCanton () {
      this.parroquias = []
      let currentCanton = this.cantones.filter(canton => canton.name === this.filter.canton)[0]
      if (currentCanton) {
        this.parroquias = currentCanton.parish
        this.orderParroquias()
        this.filter.parroquia = ''
      }
      this.filterByCanton()
    },
    selectedParroquia () {
      this.query.parroquia = this.filter.parroquia
      if (this.query.parroquia === '') {
        delete this.query.parroquia
      }
      this.filterByParroquia()
    },
    filterByCanton () {
      this.query.canton = this.filter.canton
      if (this.query.canton === '' || this.query.canton === 'TODOS') {
        delete this.query.canton
      }
      this.getData()
    },
    filterByParroquia () {
      this.query.parroquia = this.filter.parroquia
      if (this.query.parroquia === '' || this.query.parroquia === 'TODOS') {
        delete this.query.parroquia
      }
      this.getData()
    },
    getData () {
      this.findRecords({query: {removed: false, _electoral_project_id: this.project_id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.recordsList = response.data
      })
    },
    loadData () {
      let that = this
      this.getProvince(this.project.province).then(result => {
        that.filter.province = result
        this.cantones = result.canton
        this.orderCantones()
      }).catch(err => console.log('este es el error', err))
      this.findRecords({query: {removed: false, _electoral_project_id: this.project_id, $skip: this.getSkip, $limit: this.limit}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.recordsList = response.data
      })
    }
  },
  computed: {
    ...mapState('electoral-records', {loading: 'isFindPending'}),
    ...mapState('electoral-records', { paginationVal: 'pagination' }),
    ...mapGetters('electoral-records', {findElectoralRecords: 'find'}),
    getRecords () {
      return this.findElectoralRecords({query: {removed: false, _electoral_project_id: this.project_id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findRecords({query: {removed: false, _electoral_project_id: this.project_id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.recordsList = response.data
      })
    }
  },
  created () {
    this.project_id = this.$route.params.id
    this.getProject(this.$route.params.id).then(result => {
      this.project = result
      this.loadData()
    }).catch(err => console.log('este es el error', err))
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>
.justify-left {
    text-align: left;
}
.v-input--is-disabled:not(.v-input--is-readonly) {
    pointer-events: none;
    background: #b25050;
}
</style>
