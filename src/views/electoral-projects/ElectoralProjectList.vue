<template>
<div >
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Proyectos de control electoral</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getProjects"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="justify-left">
                          {{props.item.date | moment("add", "1 days", "subtract", "ddd",'YYYY-MM-DD') }}
                      </td>
                      <td class="justify-left">
                        {{props.item.name}}
                      </td>
                      <td class="justify-left">
                        {{props.item.position}}
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
                            <v-list-tile @click="getRecords(props.item)">
                              <v-list-tile-title >Agregar Acta</v-list-tile-title>
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
                                  Esta seguro que desea eliminar el projecto?
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
                title="Agregar nuevo proyecto"
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
          text: 'Fecha',
          align: 'left',
          sortable: true,
          value: 'date'
        },
        { text: 'Nombre',
          value: 'name',
          sortable: false
        },
        { text: 'Cargo',
          value: 'position',
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
    ...mapActions('electoral-projects', { findElectoralProjects: 'find' }),
    goToNew () {
      this.$router.push('/electoral-projects-new')
    },
    getRecords (project) {
      console.log('project', project._id)
      this.$router.push('/electoral-projects/' + project._id)
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
    del () {
      const {ElectoralProject} = this.$FeathersVuex
      const electoralproject = new ElectoralProject(this.itemSelected)
      electoralproject.removed = true
      electoralproject.patch().then((result) => {
        this.findElectoralProjects({ query: {removed: false} }).then(response => {
          return response.data || response
        })
      })
    }
  },
  computed: {
    ...mapState('electoral-projects', {loading: 'isFindPending'}),
    ...mapState('electoral-projects', { paginationVal: 'pagination' }),
    ...mapGetters('electoral-projects', {findElectoralProjectsInStore: 'find'}),
    getProjects () {
      return this.findElectoralProjectsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findElectoralProjects({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findElectoralProjects({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
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
