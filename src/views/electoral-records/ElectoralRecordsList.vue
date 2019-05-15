<template>
<div >
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Actas Registradas</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getRecords"
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
                                <v-card-title class="headline">Eliminar categoría</v-card-title>

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
          sortable: true,
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
          sortable: false
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
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      projects: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('electoral-records', { findRecords: 'find' }),
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
    del () {
      const {ElectoralRecord} = this.$FeathersVuex
      const electoralRecord = new ElectoralRecord(this.itemSelected)
      electoralRecord.removed = true
      electoralRecord.patch().then((result) => {
        this.findRecords({ query: {removed: false} }).then(response => {
          return response.data || response
        })
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
      })
    }
  },
  created () {
    this.project_id = this.$route.params.id
    this.findRecords({$skip: this.getSkip, _electoral_project_id: this.project_id, $limit: this.limit, removed: false}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.projects = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>
.justify-left {
    text-align: left;
}
</style>
