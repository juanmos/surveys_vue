<template>
    <v-card>
       <v-card-title>
         <span class="title">{{titulo}}</span>
          <v-spacer></v-spacer>
          &nbsp;
          <v-btn fab small class="error" @click.native="goToList()">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-card-title>
      <v-container fluid grid-list-md >
            <v-layout row wrap >
                <v-flex md4 xs12>
                  <v-text-field name="nombre" label="Nombre" hint="Nombre de la Encuesta"  v-model="poolsseg.name"
                    class="input-group--focused" required></v-text-field>
                </v-flex>

                <v-flex md4 xs12>
                  <v-menu lazy :close-on-content-click="false" v-model="fechainicio" transition="v-scale-transition" offset-y full-width
                    :nudge-left="40" max-width="290px">
                    <v-text-field slot="activator" label="Fecha de Inicio" v-model="poolsseg.date_start" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="poolsseg.date_start" no-title scrollable>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex md4 xs12>
                  <v-menu lazy :close-on-content-click="false" v-model="fechafin" transition="v-scale-transition" offset-y full-width
                    :nudge-left="40" max-width="290px">
                    <v-text-field slot="activator" label="Fecha Fin" v-model="poolsseg.date_end" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="poolsseg.date_end" no-title scrollable>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex md4 xs12>
                  <v-select
                    label="Clientes"
                    v-model="poolsseg._customer_id"
                    :items="getcustomer"
                    item-text="name"
                    item-value="_id"
                    persistent-hint
                    return-object
                  ></v-select>
                </v-flex>
                <v-flex md4 xs12>
                <v-text-field name="quantity" v-model="poolsseg.number_polls" label="Cantidad de encuestas" hint="Cantidad de Encuestadores" class="input-group--focused"
                  ></v-text-field>
                </v-flex>
                 <v-flex md4 xs12>
                      <v-autocomplete
                      :filter="customFilter"
                      label="Estado"
                      v-model="poolsseg.state_polls"
                      :items="itemsestado"
                      item-text="name"
                      item-value="id"
                  ></v-autocomplete>
                </v-flex>
                <div class="text-xs-center pt-2">
                  <v-btn v-if="!this.$route.params.id" @click.native="sendData(poolsseg)" color="primary">Guardar</v-btn>
                  <v-btn v-else color="primary" @click.native="actualizar(poolsseg)">Actualizar</v-btn>
                </div>
            </v-layout>
          </v-container>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
let state = {
  datostemp: []
}
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
    pollssegver: [],
    valid: false,
    rules: validations,
    dialog: false,
    dialog2: false,
    opcion: '',
    valor1: '',
    valor2: '',
    itemSelected2: null,
    titulo: '',
    itemsestado: [
      { name: 'Creada', id: 1 },
      { name: 'Edición', id: 2 },
      { name: 'Recolección de datos', id: 3 },
      { name: 'Validación', id: 4 },
      { name: 'En informe', id: 5 },
      { name: 'Completa', id: 6 },
      { name: 'Cancelada', id: 7 }
    ]
  }),
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('polls-project', { findcatItems: 'find' }),
    ...mapActions('customers', {findcustomers: 'find'}),
    sendData (values) {
      const {PollsProject} = this.$FeathersVuex
      let saveCategorySegmentation = new PollsProject(values)
      saveCategorySegmentation.save().then((result) => {
        this.setSnackMessage('Encuesta Guardado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    actualizar (values) {
      const {PollsProject} = this.$FeathersVuex
      let saveCategorySegmentation = new PollsProject(values)
      saveCategorySegmentation.save().then((result) => {
        this.setSnackMessage('Encuesta Guardado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/polls-project')
    },
    cargaredicion (elementid) {
      this.findcatItems({query: {_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
        this.Listcat = response.data
        this.poolsseg._id = this.$route.params.id
        this.poolsseg.name = this.Listcat[0].name
        this.poolsseg.date_start = this.Listcat[0].date_start
        this.poolsseg.date_end = this.Listcat[0].date_end
        this.poolsseg.date_delivery = this.Listcat[0].date_delivery
        this.poolsseg._customer_id = this.Listcat[0]._customer_id
        this.poolsseg.number_polls = this.Listcat[0].number_polls
        this.poolsseg.state_polls = this.Listcat[0].state_polls[0]
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
      this.titulo = 'Editar encuesta'
      state.datostemp = []
      this.cargaredicion(this.$route.params.id)
    } else {
      this.titulo = 'Nueva encuesta'
      state.datostemp = []
    }
  },
  created () {
    this.findcustomers({ query: {removed: false} }).then(response => {
    })
  }
}
</script>
