<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Clientes </v-subheader>
            <v-data-table
                :headers="headers"
                :items="getCustomers"
                hide-actions
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                <td>
                  <editable-field @changeConfirmed="edit($event, props.item, 'name')"  :value="props.item.name" typeField="text"></editable-field>
                </td>
                <td>
                  <editable-field @changeConfirmed="edit($event, props.item, 'email')"  :value="props.item.email" typeField="text"></editable-field>
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
                    <v-list-tile @click="del(props.item)">
                      <v-list-tile-title>Eliminar</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                </td>
                </template>
            </v-data-table>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
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

import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'center',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Email',
          align: 'center',
          sortable: true,
          value: 'email'
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'email'
        }
      ],
      customers: [],
      message: '',
      showMsg: false,
      msgType: 'error'
    }
  },
  methods: {
    ...mapActions('customers', { findCustomers: 'find' }),
    goToNew () {
      this.$router.push('/new-customer')
    },
    getData () {
      let params = {query: {removed: false}}
      return this.$store.dispatch('customers/find', params)
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
    del (element) {
      const {Customer} = this.$FeathersVuex
      const customer = new Customer(element)
      customer.removed = true
      customer.patch().then((result) => {
        this.findCustomers({ query: {removed: false} }).then(response => {
          const customers = response.data || response
          console.log(customers)
        })
      })
    }
  },
  computed: {
    ...mapState('customers', {loading: 'isFindPending'}),
    ...mapGetters('customers', {findCustomersInStore: 'find'}),
    getCustomers () {
      return this.findCustomersInStore({query: {removed: false}}).data
    }
  },
  created () {
    this.findCustomers({ query: {removed: false} }).then(response => {
      const customers = response.data || response
      console.log(customers)
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
