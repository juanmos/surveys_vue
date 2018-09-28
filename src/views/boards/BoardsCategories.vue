<template>
  <v-layout row>
    <v-flex xs12>
      <v-toolbar>
        <v-toolbar-title>Tematicas</v-toolbar-title>
        <v-spacer></v-spacer>
        <boards-create-dialog></boards-create-dialog>
        <v-tooltip bottom>
          <v-btn slot="activator" dark color="blue-grey lighten-4" @click="$emit('closeMenu')" icon>
            <v-icon>keyboard_arrow_up</v-icon>
          </v-btn>
          <span>Ocultar Tematicas</span>
        </v-tooltip>

      </v-toolbar>
      <v-card flat>
        <v-list two-line subheader>
          <v-list-group
            v-for="item in getBoards"
            v-model="item.active"
            :key="item.title"
            no-action
          >
            <v-list-tile  slot="activator">
              <v-list-tile-avatar>
                <v-icon :class="`light-blue accent-1 white--text`">folder</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <span v-show="!editMapName">{{item.name}}</span>
                  <v-edit-dialog
                      :ref="item._id"
                      v-show="editMapName"
                      align= "center"
                      @save="edit(item.name, item, 'name')"
                      @cancel="editMapName = false"
                      @close="editMapName = false"
                  > {{ item.name }}
                      <v-text-field
                      slot="input"
                      v-model="item.name"
                      label="Editar Nombre"
                      single-line
                      ></v-text-field>
                  </v-edit-dialog>
                  <v-tooltip :color="'grey'" bottom>
                    <v-icon slot="activator" small @click.stop="enableEditName(item._id)" class="ml-3">edit</v-icon>
                    <span>Editar nombre de mapa</span>
                  </v-tooltip>
                </v-list-tile-title>

              </v-list-tile-content>
            </v-list-tile>
              <v-list-tile
              @click="selectCurrentDiagram('KanbanDiagram', item._id)"
              >
                <v-list-tile-avatar>
                  <v-icon :class="`green lighten-1 white--text`">view_column</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Mesa de Trabajo</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
              <v-list-tile
                @click="selectCurrentDiagram('NodeDiagram', item._id)"
              >
                <v-list-tile-avatar>
                  <v-icon :class="`yellow lighten-1 white--text`">category</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Mapa Mental</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
              <v-subheader class="grey lighten-5">Mesas Personalizadas  <working-table-create-dialog :boardId="item._id"></working-table-create-dialog> </v-subheader>
              <working-table-instance-list :boardId="item._id"></working-table-instance-list>
              <v-divider ></v-divider>
              <v-list-tile
              @click="dialogConfirm = true; currentItem = item"
              >
                <v-list-tile-avatar>
                  <v-icon :class="`red lighten-1 white--text`">cancel</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Eliminar Tematica</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>

          </v-list-group>
        </v-list>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="dialogConfirm"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">¿Esta usted completamente seguro?</v-card-title>

        <v-card-text>
          Al borrar una tematica estaria borrando todo el trabajo de grafico realizado
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
            @click="deleteBoard(currentItem)"
          >
            Si
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import BoardsCreateDialog from './BoardsCreateDialog'
import WorkingTableCreateDialog from './../working-tables/working-table-instances/WorkingTableCreateDialog'
import WorkingTableInstanceList from './../working-tables/working-table-instances/WorkingTableInstanceList'
export default {
  props: ['boards'],
  data () {
    return {
      dialogConfirm: false,
      currentItem: {},
      mutableBoards: [],
      dialog: false,
      editMapName: false
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions('table-instances', { findTables: 'find' }),
    ...mapActions([
      'setCurrentMapId',
      'setCurrentDiagram'
    ]),
    edit (val, elem, field) {
      const {Board} = this.$FeathersVuex
      const board = new Board(elem)
      board[field] = val
      board.patch().then((result) => {
        this.editMapName = false
      })
    },
    selectCurrentDiagram (typeDiagram, id) {
      this.setCurrentDiagram(typeDiagram)
      this.setCurrentMapId(id)
    },
    deleteBoard (item) {
      const {Board} = this.$FeathersVuex
      const board = new Board(item)
      board.removed = true
      board.patch().then((result) => {
        this.setCurrentDiagram = ''
        this.dialogConfirm = false
      })
    },
    enableEditName (id) {
      this.editMapName = true
      this.$refs[id][0].$el.firstChild.click()
    }
  },
  watch: {
  },
  created () {
    this.findBoards({ query: {removed: false, _study_id: this.getStudyId} }).then(response => {
    })
    this.findTables({ query: {removed: false, _study_id: this.getStudyId} }).then(response => {
    })
  },
  computed: {
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapGetters('table-instances', {findTablesInStore: 'find'}),
    ...mapGetters(
      [
        'getStudyId'
      ]
    ),
    getBoards () {
      return this.findBoardsInStore({query: {removed: false, _study_id: this.getStudyId}}).data
    },
    getTables () {
      return this.findTablesInStore({query: {removed: false, _study_id: this.getStudyId}}).data
    }
  },
  components: {BoardsCreateDialog, WorkingTableCreateDialog, WorkingTableInstanceList}
}
</script>
<style>
</style>
