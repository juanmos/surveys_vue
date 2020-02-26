<template>
<div >
    <v-container fluid grid-list-lg text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Administración de Empresas</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <v-text-field
                      v-model="search"
                      append-icon="search"
                      label="Buscar por nombre"
                      single-line
                      hide-details
                    ></v-text-field>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="getCompanies"
                  hide-actions
                  item-key="name"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>
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
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.ruc"
                          lazy
                          @save="edit(props.item.ruc, props.item, 'ruc')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.ruc }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.ruc"
                            label="Editar ruc"
                            single-line
                            counter
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.address"
                          lazy
                          @save="edit(props.item.address, props.item, 'address')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.address }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.address"
                            label="Editar address"
                            single-line
                            counter
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
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
                            <v-list-tile @click="goToEdit(props.item._id)">
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
                                  Esta seguro que desea eliminar la categoría?
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
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'RUC',
          value: 'ruc',
          sortable: false
        },
        { text: 'Dirección',
          value: 'address',
          sortable: false
        },
        { text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      rules: validations,
      message: '',
      showMsg: false,
      search: '',
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('companies', { findCompanies: 'find' }),
    goToNew (code) {
      this.$router.push('/company-new')
    },
    goToEdit (code) {
      this.$router.push('/company-edit/' + code)
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
    close (val) {
      // console.log('Dialog closed', val)
    },
    edit (val, elem, field) {
      if (val !== '') {
        const {Company} = this.$FeathersVuex
        const company = new Company(elem)
        company[field] = val
        company.patch().then((result) => {
          this.findCompanies({ query: {removed: false} }).then(response => {
            return response.data || response
          })
        })
      }
    },
    del () {
      const {Company} = this.$FeathersVuex
      const company = new Company(this.itemSelected)
      company.removed = true
      company.patch().then((result) => {
        this.findCompanies({ query: {removed: false} }).then(response => {
          return response.data || response
        })
      })
    }
  },
  computed: {
    ...mapState('companies', {loading: 'isFindPending'}),
    ...mapState('companies', { paginationVal: 'pagination' }),
    ...mapGetters('companies', {findCompaniesInStore: 'find'}),
    getCompanies () {
      return this.findCompaniesInStore({query: {removed: false, ...this.query}}).data
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
      this.findCompanies({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findCompanies({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.categories = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>

</style>
