<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Preguntas</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getConfigPolls"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="text-xs-left">
                        {{ props.item.name }}
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
                              <v-list-tile-title>Ver encuesta</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="goToEdit(props.item._id)">
                              <v-list-tile-title>Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true; itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar encuesta</v-card-title>
                                <v-card-text>
                                  Esta seguro que desea eliminar la encuesta {{ props.item.name }}?
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
                color="pink"
                @click="goToNew()"
                >
                    <v-icon>add</v-icon>
                </v-btn>
                <v-btn
    absolute
    dark
    fab
    small
    top
    right
    color="pink"
    @click="gotoList"
    >
        <v-icon>list</v-icon>
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
      regions: [],
      dialog: false,
      itemSelected: ''
    }
  },
  methods: {
    ...mapActions('config-polls', { findPolls: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push({ name: 'QuesBuildIndex', params: { id: this.$route.params.id, data: 'data' } })
    },
    goToEdit (id) {
      this.$router.push('/question-builder-edit/' + id)
    },
    goToView (id) {
      this.$router.push({ name: 'QuestionBuilderView', params: { id: id, data: 'data' } })
    },
    gotoList () {
      this.$router.push('/polls-project')
    },
    del () {
      const {ConfigPoll} = this.$FeathersVuex
      const Config = new ConfigPoll(this.itemSelected)
      Config.removed = true
      Config.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Registro Eliminada')
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
      this.findPolls({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.regions = response.data
        // console.log('estas son las regiones', this.regions)
      })
    }
  },
  computed: {
    ...mapState('config-polls', {loading: 'isFindPending'}),
    ...mapState('config-polls', { paginationVal: 'pagination' }),
    ...mapGetters('config-polls', {findConfigPollsInStore: 'find'}),
    getConfigPolls () {
      return this.findConfigPollsInStore({query: {removed: false, _polls_project_id: this.$route.params.id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style >
.v-datatable{
    overflow: hidden;
  }
</style>
