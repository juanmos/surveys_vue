<template>
    <v-card
        flat
        >
        <v-toolbar
        flat
        >
        <!-- <mind-map-filter @sendFilters="applyFilters"></mind-map-filter> -->
          <v-toolbar-title>{{getCurrentTable.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
        </v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
             <v-layout row wrap>
                    <v-flex d-flex xs12 sm2 md2>
                        <v-card color="grey lighten-5">
                        <v-card-title primary class="title">Constructos</v-card-title>
                        <draggable v-model="constructValues" :options="{group:'people'}" style="min-height: 50px">
                            <template v-for="item in constructValues">
                                <v-flex :key="item.id">
                                    <v-card color="grey lighten-3">
                                        <v-card-title primary-title>
                                            {{item.name}}
                                        </v-card-title>
                                    </v-card>
                                </v-flex>
                            </template>
                        </draggable>
                        </v-card>
                    </v-flex>
                    <v-flex d-flex xs12 sm10 md10>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 md6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                    <v-toolbar
                                    flat
                                    >
                                     <v-toolbar-title >Fortalezas</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-toolbar-items class="hidden-sm-and-down">
                                    </v-toolbar-items>
                                    </v-toolbar>
                                    <draggable v-model="getCurrentStrengths" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in getCurrentStrengths">
                                                <v-flex :key="item.id">
                                                     <v-card class="item-card" color="primary lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.name}}
                                                            <v-spacer></v-spacer>
                                                            <v-tooltip class="delete-icon" bottom>
                                                              <v-icon @click="deleteItem(item, 'strengths')" slot="activator" color="grey">cancel</v-icon>
                                                              <span>Eliminar {{item.name}}</span>
                                                            </v-tooltip>
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6 sm6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                     <v-toolbar
                                        flat
                                        >
                                        <v-toolbar-title >Incorporar</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-toolbar-items class="hidden-sm-and-down">
                                        </v-toolbar-items>
                                      </v-toolbar>
                                    <draggable v-model="getCurrentIncorporates" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in getCurrentIncorporates">
                                                <v-flex :key="item.id">
                                                    <v-card class="item-card" color="green lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.name}}
                                                            <v-spacer></v-spacer>
                                                            <v-tooltip class="delete-icon" bottom>
                                                              <v-icon @click="deleteItem(item, 'incorporates')" slot="activator" color="grey">cancel</v-icon>
                                                              <span>Eliminar {{item.name}}</span>
                                                            </v-tooltip>
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6 sm6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                    <v-toolbar
                                    flat
                                    >
                                        <v-toolbar-title >Eliminar</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-toolbar-items class="hidden-sm-and-down">
                                        </v-toolbar-items>
                                    </v-toolbar>
                                    <draggable v-model="getCurrentDeletes" :options="{group:'people'}" style="min-height: 100px">
                                            <template v-for="item in getCurrentDeletes">
                                                <v-flex :key="item.id">
                                                    <v-card class="item-card" color="red lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.name}}
                                                            <v-spacer></v-spacer>
                                                            <v-tooltip class="delete-icon" bottom>
                                                              <v-icon  @click="deleteItem(item, 'deletes')" slot="activator" color="grey">cancel</v-icon>
                                                              <span>Eliminar {{item.name}}</span>
                                                            </v-tooltip>
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6 sm6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                         <v-toolbar
                                            flat
                                            >
                                            <v-toolbar-title >Debilita</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-toolbar-items class="hidden-sm-and-down">
                                            </v-toolbar-items>
                                        </v-toolbar>
                                        <draggable v-model="getCurrentWeakens" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in getCurrentWeakens">
                                                <v-flex :key="item.id">
                                                    <v-card class="item-card" color="lime lighten-4">
                                                    <v-card-title primary-title>
                                                        {{item.name}}
                                                        <v-spacer></v-spacer>
                                                        <v-tooltip class="delete-icon" bottom>
                                                          <v-icon  @click="deleteItem(item, 'weakens')" slot="activator" color="grey">cancel</v-icon>
                                                          <span>Eliminar {{item.name}}</span>
                                                        </v-tooltip>
                                                    </v-card-title>
                                                </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
        </v-container>
    </v-card>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import draggable from 'vuedraggable'
export default {
  data () {
    return {
      constructValues: [],
      itemsStrengths: [
      ],
      itemsIncorporates: [
      ],
      itemsDeletes: [
      ],
      itemsWeakens: [
      ]
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentConstructId',
      'setShowSnack',
      'setSnackMessage'
    ]),
    saveField (field, data) {
      const {TableInstance} = this.$FeathersVuex
      const tableInstance = new TableInstance(this.getCurrentTable)
      tableInstance['field'] = data
      tableInstance.save().then(res => {
        console.log('esta es la respuesta', res)
      })
    },
    deleteItem (item, field) {
      const {TableInstance} = this.$FeathersVuex
      const tableInstance = new TableInstance(this.getCurrentTable)
      tableInstance[field] = [
        item
      ]
      tableInstance.save({query: { field, method: 'pull' }}).then((result) => {
        this.setSnackMessage('Elemento Borrado')
        this.setShowSnack(true)
      })
    }
  },
  computed: {
    ...mapState('boards', {loading: 'isPatchPending'}),
    ...mapState(['currentMapId']),
    ...mapState(['currentTableInstanceId']),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapGetters('table-instances', {findTablesInStore: 'find'}),
    ...mapGetters(
      [
        'getCurrentDiagram'
      ]
    ),
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getCurrentTable () {
      return this.findTablesInStore({query: {removed: false, _id: this.currentTableInstanceId}}).data[0]
    },
    getCurrentDeletes: {
      get () {
        return this.getCurrentTable.deletes
      },
      set (newVal) {
        const {TableInstance} = this.$FeathersVuex
        const tableInstance = new TableInstance(this.getCurrentTable)
        tableInstance.deletes = newVal
        console.log('esta sera la consulta...', tableInstance)
        tableInstance.save().then(res => {
          console.log('esta es la respuesta', res)
        })
      }
    },
    getCurrentStrengths: {
      get () {
        return this.getCurrentTable.strengths
      },
      set (newVal) {
        const {TableInstance} = this.$FeathersVuex
        const tableInstance = new TableInstance(this.getCurrentTable)
        tableInstance.strengths = newVal
        console.log('esta sera la consulta...', tableInstance)
        tableInstance.save().then(res => {
          console.log('esta es la respuesta', res)
        })
      }
    },
    getCurrentIncorporates: {
      get () {
        return this.getCurrentTable.incorporates
      },
      set (newVal) {
        const {TableInstance} = this.$FeathersVuex
        const tableInstance = new TableInstance(this.getCurrentTable)
        tableInstance.incorporates = newVal
        console.log('esta sera la consulta...', tableInstance)
        tableInstance.save().then(res => {
          console.log('esta es la respuesta', res)
        })
      }
    },
    getCurrentWeakens: {
      get () {
        return this.getCurrentTable.weakens
      },
      set (newVal) {
        const {TableInstance} = this.$FeathersVuex
        const tableInstance = new TableInstance(this.getCurrentTable)
        tableInstance.weakens = newVal
        console.log('esta sera la consulta...', tableInstance)
        tableInstance.save().then(res => {
          console.log('esta es la respuesta', res)
        })
      }
    },
    constructs: {
      get () {
        return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0].constructs
      },
      set (val) {
        this.constructValues = val
      }
    },
    deletes: {
      get () {
        return this.getCurrentTable.deletes
      },
      set (val) {
        this.itemsDeletes = val
      }
    }
  },
  watch: {
    getCurrentDiagram (val) {
      this.constructValues = this.constructs
    },
    currentTableInstanceId (val) {
      this.itemsDeletes = this.deletes
    }
  },
  created () {
    this.findBoards({query: {removed: false}}).then(response => {
      const boards = response.data || response
      console.log(boards)
    })
    this.constructValues = this.constructs
    this.itemsDeletes = this.deletes
  },
  updated () {
  },
  components: {draggable}
}
</script>

<style scoped>
  .delete-icon {
    opacity: 0
  }
  .item-card:hover .delete-icon {
    opacity: 1
  }
</style>
