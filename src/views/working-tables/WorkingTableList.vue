<template>
<div>
    <loading-component v-if="loading"></loading-component>
    <v-container grid-list-md text-xs-center>
      <v-card flat>
        <v-subheader>Listado de Mesas de Trabajo</v-subheader>
        <v-layout row wrap>
          <v-flex v-for="wTable in getWorkingTables" :key="wTable._id" xs4>
              <v-card class="study-card" >
                <v-img
                  src="https://images.unsplash.com/photo-1502404679462-d669245fc482?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3ef5d7093916f0ff49461a52fe234703&auto=format&fit=crop&w=4050&q=80"
                  height="200px"
                >
                <v-layout
                  column
                  fill-height
                >
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <v-menu bottom left>
                      <v-btn
                        flat
                        slot="activator"
                        icon
                        color="indigo"
                      >
                        <v-icon>more_vert</v-icon>
                      </v-btn>

                      <v-list>
                        <v-list-tile @click="currentWTable = wTable; dialogConfirm = true">Borrar Mesa de Trabajo</v-list-tile>
                      </v-list>
                    </v-menu>
                  </v-card-title>

                  <v-spacer></v-spacer>

                  <v-card-title style="background:rgba(0,0,0,0.5);" class="white--text pl-2 pt-2">
                    <div class="display-1 pl-12 pt-12">{{ wTable.name }}</div>
                    <div>
                      <v-tooltip bottom>
                        <v-avatar
                          slot="activator"
                          class="tableType"
                          color="grey lighten-4"
                          >
                            <v-icon v-if="wTable.type === 'Matriz'" :class="`blue-grey lighten-1 white--text`">view_module</v-icon>
                            <v-icon v-if="wTable.type === 'Kanban'" :class="`teal lighten-1 white--text`">view_carousel</v-icon>
                            <v-icon v-if="wTable.type === 'Links'" :class="`lime lighten-1 white--text`">call_merge</v-icon>
                            <v-icon v-if="wTable.type === 'Espiral'" :class="`brown lighten-1 white--text`">sync</v-icon>
                        </v-avatar>
                        <span>{{wTable.type}}</span>
                      </v-tooltip>
                    </div>
                  </v-card-title>
                </v-layout>
                </v-img>
                  <v-list
                    subheader
                    three-line
                  >
                    <v-subheader>
                      <v-edit-dialog
                          align= "center"
                          lazy
                          @save="edit(wTable.name, wTable, 'name')"
                        > {{ wTable.name }}
                          <v-text-field
                            slot="input"
                            v-model="wTable.name"
                            label="Editar Nombre"
                            single-line
                            counter
                          ></v-text-field>
                      </v-edit-dialog>
                      {{wTable.type}}
                    </v-subheader>
                    <v-divider></v-divider>

                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-sub-title>
                          <p>
                            <v-edit-dialog
                              lazy
                              @save="edit(wTable.description, wTable, 'description')"
                            >  <v-list-tile-sub-title>{{ wTable.description }}</v-list-tile-sub-title>
                              <v-text-field
                                slot="input"
                                v-model="wTable.description"
                                label="Editar Descripcion"
                                single-line
                                counter
                              ></v-text-field>
                            </v-edit-dialog>
                          </p>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <div class="actions">
                      <v-btn @click="currentWTable = wTable; dialogConfirm = true" icon>
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </div>
                  </v-card-actions>
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
      </v-card>
      <v-dialog
      v-model="dialogConfirm"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">¿Esta usted completamente seguro?</v-card-title>

        <v-card-text>
          Al borrar una Mesa de trabajo estaria borrando todas las instancias relacionadas
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="grey darken-1"
            flat="flat"
            @click="dialogConfirm = false"
          >
            No
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click="del(currentWTable)"
          >
            Si
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
      query: {
      },
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
      user: [],
      message: '',
      showMsg: false,
      msgType: 'error',
      dialogConfirm: false,
      currentWTable: {}
    }
  },
  methods: {
    ...mapActions('working-tables', { findWorkingTables: 'find' }),
    ...mapActions([
      'setShowSnack',
      'setSnackMessage'
    ]),
    goToNew () {
      this.$router.push('/working-table-new')
    },
    edit (val, elem, field) {
      console.log(val, elem, field)
      const {WorkingTable} = this.$FeathersVuex
      const wTable = new WorkingTable(elem)
      wTable[field] = val
      wTable.patch().then((result) => {
        this.setShowSnack(true)
        this.setSnackMessage('Editada la Mesa de Trabajo')
      })
    },
    del (element) {
      const {WorkingTable} = this.$FeathersVuex
      const wTable = new WorkingTable(element)
      wTable.removed = true
      wTable.patch().then((result) => {
        this.dialogConfirm = false
        this.setShowSnack(true)
        this.setSnackMessage('Mesa de Trabajo Borrada')
      })
    },
    goToDetail (id) {
      this.$router.push(`mesa-trabajo/boards/${id}`)
    }
  },
  computed: {
    ...mapState('working-tables', {loading: 'isFindPending'}),
    ...mapGetters('working-tables', {findWorkingTablesInStore: 'find'}),
    getWorkingTables () {
      return this.findWorkingTablesInStore({query: {removed: false, ...this.query}}).data
    }
  },
  created () {
    this.findWorkingTables({ query: {removed: false} }).then(response => {
      const studies = response.data || response
      console.log(studies)
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>
  .actions {
    opacity: 0;
  }
  .study-card:hover .actions {
    opacity: 1;
  }
  .study-title{
    margin: 10px;
    text-align: center;
  }
  .study-content {
    text-align: center;
  }
  .tableType {
    margin: 40px;
  }
  v-card-title {

  }
</style>
