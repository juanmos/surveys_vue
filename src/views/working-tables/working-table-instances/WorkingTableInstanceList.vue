<template>
    <div>
        <v-list-tile
            v-for="table in getTables"
            :key="table._id"
            class="action"
            @click="selectCurrentDiagram(table.workingTable.component, table._board_id, table._id)"
            >
            <v-list-tile-avatar>
                <v-icon v-if="table.workingTable" v-html="table.workingTable.icon" :class="`blue-grey lighten-1 white--text`"></v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title >{{table.name}} - <span v-if="table.workingTable" class="caption blue-grey--text">{{table.workingTable.name}}</span></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.stop="dialogConfirm = true; currentItem = table" class="delete-btn" icon ripple>
                <v-icon color="grey lighten-1">cancel</v-icon>
              </v-btn>
            </v-list-tile-action>

        </v-list-tile>
        <v-dialog
            v-model="dialogConfirm"
            max-width="290"
            >
            <v-card>
                <v-card-title class="headline">¿Esta usted completamente seguro?</v-card-title>
                <v-card-text>
                    Si borra esta mesa de trabajo perdera todo el trabajo realizado
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
                    @click="deleteTable()"
                >
                    Si
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  props: [
    'boardId'
  ],
  data: () => ({
    currentItem: {},
    dialogConfirm: false
  }),
  computed: {
    ...mapGetters('table-instances', {findTablesInStore: 'find'}),
    getTables () {
      return this.findTablesInStore({query: {removed: false, _board_id: this.boardId}}).data
    }
  },
  methods: {
    ...mapActions('table-instances', { findTables: 'find' }),
    ...mapActions([
      'setCurrentDiagram',
      'setCurrentMapId',
      'setCurrentTableInstanceId'
    ]),
    deleteTable () {
      const {TableInstance} = this.$FeathersVuex
      const tableInstance = new TableInstance(this.currentItem)
      tableInstance.removed = true
      tableInstance.save().then(result => {
        this.dialogConfirm = false
      })
    },
    selectCurrentDiagram (typeDiagram, idMap, id) {
      this.setCurrentDiagram(typeDiagram)
      this.setCurrentMapId(idMap)
      this.setCurrentTableInstanceId(id)
    }
  },
  created () {
    this.findTables({ query: {removed: false, _board_id: this.boardId} }).then(response => {
    })
  }
}
</script>

<style scoped>
.delete-btn {
 opacity: 0;
}
.action:hover .delete-btn {
  opacity: 1;
}

</style>
