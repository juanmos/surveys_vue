<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Regiones</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="regions"
                  hide-actions
                  item-key="name"
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
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td class="text-xs-left">
                        {{ props.item.country.name }}
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
                            <v-list-tile @click="del(props.item)">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
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
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Pais perteneciente',
          value: '_country_id',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      regions: []
    }
  },
  methods: {
    ...mapActions('regions', { findRegions: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-region')
    },
    edit (val, elem, field) {
      const {Region} = this.$FeathersVuex
      const region = new Region(elem)
      region[field] = val
      region.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Region Editada')
        this.setShowSnack(true)
      })
    },
    del (element) {
      const {Region} = this.$FeathersVuex
      const region = new Region(element)
      region.removed = true
      region.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Region Eliminada')
        this.setShowSnack(true)
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
    },
    getData () {
      this.findRegions({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.regions = response.data
        console.log('estas son las regiones', this.regions)
      })
    }
  },
  computed: {
    ...mapState('regions', {loading: 'isFindPending'}),
    ...mapState('regions', { paginationVal: 'pagination' }),
    ...mapGetters('regions', {findRegionsInStore: 'find'}),
    getLength () {
      return Math.round((this.total / this.limit))
    }
  },
  watch: {
    page (val) {
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
