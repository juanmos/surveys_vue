<template>
    <v-container>
    <v-layout justify-center>
            <v-flex xs12 sm12>
            <v-card flat>
                <v-container
                fluid
                grid-list-md
                >
                <v-layout row wrap>
                 <!-- convertir esto en dos componentes !-->
                  <v-flex
                    v-for="item in getChildsSwitchMode"
                    xs3
                    :key="item._id"
                    >
                    <v-card color="blue-grey lighten-4">
                        <v-card-title primary-title>
                            <div class="headline">
                                <v-edit-dialog
                                    align= "center"
                                    @save="edit(item.text, item, 'text')"
                                > {{ item.text }}
                                    <v-text-field
                                    slot="input"
                                    v-model="item.text"
                                    label="Editar Nombre"
                                    single-line
                                    ></v-text-field>
                                </v-edit-dialog>
                            </div>
                            <v-flex xs12 offset-sm2>
                                <span class="grey--text">
                                    <v-edit-dialog
                                        align= "center"
                                        @save="edit(item.description, item, 'description')"
                                    >   <span v-if="item.description">{{ item.description }}</span>
                                        <span v-else>Escriba una descripcion...</span>
                                        <v-text-field
                                        slot="input"
                                        v-model="item.description"
                                        label="Editar Descripcion"
                                        single-line
                                        ></v-text-field>
                                    </v-edit-dialog>
                                </span><br>
                            </v-flex>
                        </v-card-title>

                        <div>
                        </div>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon @click="detailConstruct(item._id)" color="grey">visibility</v-icon>
                        </v-btn>
                        <v-btn icon>
                            <v-icon @click="deleteConstruct(item)" :color="'grey'">delete</v-icon>
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
                </v-container>
            </v-card>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm4>
                <v-text-field
                label="Nombre de Constructo"
                single-line
                box
                v-model="construct.text"
                    @keyup.enter="addConstruct"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm2>
                <v-btn @click="addConstruct" icon>
                <v-icon>send</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>

   <!-- <v-card flat>
        <v-card-actions>
            <v-flex xs12 md6>
            <v-text-field
                box
                color="blue-grey lighten-2"
                v-model.lazy="currentNodeText"
                v-bind:disabled="currentNode === null"
            ></v-text-field>
            </v-flex>
            <v-btn @click="addNode" flat color="primary">Agregar Nodo</v-btn>
            <v-btn @click="modifyStuff" flat color="primary">Modificar view model data</v-btn>
        </v-card-actions>
    </v-card> !-->
    <construct-detail @closed="showDetail = false" :dialog="showDetail"></construct-detail>
    </v-container>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import ConstructDetail from './components/ConstructDetail'
export default {
  props: ['constructDetailMode'],
  data () {
    return {
      construct: {
        loc: '0 0'
      },
      showDetail: false
    }
  },
  computed: {
    ...mapState('boards', {loading: 'isPatchPending'}),
    ...mapState(['currentMapId']),
    ...mapGetters('main-constructs', {findConstructsInStore: 'find'}),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapGetters([
      'getCurrentConstruct'
    ]),
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getChildConstructs () {
      // Returned different Values depending on constructDetailModel (childs for an specific mother)
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0].nodeDataArray.filter(node => !node.mother && !node.main)
    },
    getCurrentChilds () {
      return this.getCurrentBoard.linkDataArray.filter(link => Number(link.from) === Number(this.getCurrentConstruct.key)).map((link) => {
        return this.getChildConstructs.filter(construct => Number(construct.key) === Number(link.to))[0]
      })
    },
    getChildsSwitchMode () {
      if (this.constructDetailMode) {
        return this.getCurrentChilds
      } else {
        return this.getChildConstructs
      }
    }
  },
  methods: {
    ...mapActions('main-constructs', { findMainConstructs: 'find' }),
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentConstructId'
    ]),
    addConstruct () {
      let mutableConstruct = Object.assign({}, this.construct)
      mutableConstruct.color = 'rgba(128,128,128,0.2)'
      this.$emit('addNode', mutableConstruct)
      this.construct = {}
    },
    edit (val, elem, field) {
      let request = elem
      request[field] = val
      request.field = field
      this.$emit('editNode', request)
    },
    deleteConstruct (item) {
      this.$emit('deleteNode', item)
    },
    detailConstruct (id) {
      this.showDetail = !this.showDetail
      this.setCurrentConstructId(id)
    }
  },
  components: {ConstructDetail},
  mounted () {
    this.findMainConstructs({query: {removed: false}}).then(response => {
      const constructs = response.data || response
      console.log(constructs)
    })
    this.findBoards({query: {removed: false}}).then(response => {
      const boards = response.data || response
      console.log(boards)
    })
  }
}
</script>

<style scoped>
    .color-selector {
        width: 60px;
        height: 60px;
    }
    .color-displayer {
        width: 30px;
        height: 30px;
    }
</style>
