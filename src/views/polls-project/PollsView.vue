<template>
    <v-card>
       <v-card-title>
          <v-list-tile-action>
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
    <v-flex md4 xs12>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon color="indigo">calendar_today</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{poolsseg.date_start}}</v-list-tile-title>
          <v-list-tile-sub-title>Fecha de Inicio</v-list-tile-sub-title>
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
          <v-icon color="indigo">view_module</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="text-xs-left"><v-chip label small :color="getColorByStatus(poolsseg.state_polls)" text-color="white" >{{poolsseg.state_polls_name}}</v-chip></v-list-tile-title>
          <v-list-tile-sub-title>Estado</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile >
         <v-list-tile-action>
          <v-icon ></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title text-color="black">{{poolsseg.number_polls}}</v-list-tile-title>
          <v-list-tile-sub-title>N° de Encuetas</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-flex>
    <v-divider inset></v-divider>
  </v-layout>
</v-list>
    </v-card>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment
})
export default {
  data: (vm) => ({
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
    fechainicio: false,
    fechafin: false,
    fechaentrega: false,
    pollssegver: [],
    valid: false,
    rules: validations,
    dialog: false,
    dialog2: false,
    itemSelected2: null,
    titulo: '',
    titulosave: '',
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
    }
  }),
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('polls-project', { findcatItems: 'find' }),
    ...mapActions('customers', {findcustomers: 'find'}),
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
    },
    customFilter (item, queryText, itemText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.indexOf(searchText) > -1
    }
  },
  computed: {
    ...mapGetters('customers', {findcustomerslist: 'find'}),
    getcustomer () {
      return this.findcustomerslist({query: {removed: false}}).data
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
  }
}
</script>
