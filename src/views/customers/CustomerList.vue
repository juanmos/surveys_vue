<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Clientes</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <v-text-field
                      v-model="search"
                      append-icon="search"
                      label="Buscar..."
                      single-line
                      hide-details
                    ></v-text-field>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="getCustomers"
                  hide-actions
                  item-key="name"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
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
                            label="Editar Ruc"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td class="text-xs-left">{{props.item.company.name}}</td>
                      <td class="text-xs-left">
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
                            label="Editar Direccion"
                            single-line
                            counter
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
                            <v-list-tile @click="goToView(props.item._id)">
                                <v-list-tile-title>Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
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
        <v-dialog
            v-model="dialog"
            max-width="290"
            >
            <v-card>
            <v-card-title class="headline">Eliminar cliente</v-card-title>

            <v-card-text>
            Esta seguro que desea eliminar cliente?
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
import {mapState, mapGetters, mapActions} from 'vuex'

import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Ruc',
          value: 'ruc',
          sortable: false
        },
        { text: 'Empresa',
          value: 'company',
          sortable: false
        },
        {
          text: 'Direccion',
          value: 'address',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      customers: [],
      message: '',
      search: '',
      itemSelected: null,
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 20,
      dialog: false,
      total: 1,
      loaded: false,
      clients: [],
      query: {}
    }
  },
  methods: {
    ...mapActions('customers', { findCustomers: 'find' }),
    goToNew () {
      this.$router.push('/new-customer')
    },
    goToView (codigo) {
      // console.log('mi codigo es ', codigo)
      this.$router.push('/customer-view/' + codigo)
    },
    goToEdit (element) {
      const {Customer} = this.$FeathersVuex
      const customer = new Customer(element)
      // window.open('http://localhost:8081/#/edit-client?_id=' + customer._id, '_blank')
      window.open('http://gestion.propraxis.ec/#/edit-client?_id=' + customer._id, '_blank')
    },
    edit (val, elem, field) {
      const {Customer} = this.$FeathersVuex
      const customer = new Customer(elem)
      customer[field] = val
      customer.patch().then((result) => {
        this.findCustomers({ query: {removed: false} }).then(response => {
          const customers = response.data || response
          console.log(customers)
        })
      })
    },
    del () {
      const {Customer} = this.$FeathersVuex
      const customer = new Customer(this.itemSelected)
      customer.removed = true
      customer.patch().then((result) => {
        this.findCustomers({ query: {removed: false} }).then(response => {
          const customers = response.data || response
          console.log(customers)
        })
      })
    },
    save (val) {
      console.log(val)
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
      console.log('Dialog closed', val)
    }
  },
  computed: {
    ...mapState('customers', {loading: 'isFindPending'}),
    ...mapState('customers', { paginationVal: 'pagination' }),
    ...mapGetters('customers', {findCustomersInStore: 'find'}),
    getCustomers () {
      return this.findCustomersInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findCustomers({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findCustomers({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
