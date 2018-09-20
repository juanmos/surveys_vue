<template>
    <v-card
        flat
        >
        <v-toolbar
        flat
        >
        <!-- <mind-map-filter @sendFilters="applyFilters"></mind-map-filter> -->
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
                                    <draggable v-model="itemsFortaleza" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in itemsFortaleza">
                                                <v-flex :key="item.id">
                                                    <v-card color="primary lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.name}}
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
                                    <draggable v-model="itemsIncorporar" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in itemsIncorporar">
                                                <v-flex :key="item.id">
                                                    <v-card color="green lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.name}}
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
                                    <draggable v-model="itemsEliminar" :options="{group:'people'}" style="min-height: 100px">
                                            <template v-for="item in itemsEliminar">
                                                <v-flex :key="item.id">
                                                    <v-card color="red lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.name}}
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
                                        <draggable v-model="itemsDebilita" :options="{group:'people'}" style="min-height: 50px">
                                            <v-layout row wrap>
                                                <template v-for="item in itemsDebilita">
                                                    <v-flex xs4 :key="item.id">
                                                        <v-card color="lime lighten-4">
                                                            <v-card-title primary-title>
                                                                {{item.name}}
                                                            </v-card-title>
                                                        </v-card>
                                                    </v-flex>
                                                </template>
                                            </v-layout>

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
      itemsFortaleza: [
      ],
      itemsIncorporar: [
      ],
      itemsEliminar: [
      ],
      itemsDebilita: [
      ]
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentConstructId'
    ])
  },
  computed: {
    ...mapState('boards', {loading: 'isPatchPending'}),
    ...mapState(['currentMapId']),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapGetters(
      [
        'getCurrentDiagram'
      ]
    ),
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    constructs: {
      get () {
        return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0].constructs
      },
      set (val) {
        this.constructValues = val
      }
    }
  },
  watch: {
    getCurrentDiagram (val) {
      this.constructValues = this.constructs
    }
  },
  mounted () {
    this.findBoards({query: {removed: false}}).then(response => {
      const boards = response.data || response
      console.log(boards)
    })
    this.constructValues = this.constructs
  },
  components: {draggable}
}
</script>

<style>

</style>
