<template>
    <v-container>
     <v-layout row wrap>
        <v-flex xs12 sm12>
            {{getCurrentBoard}}
            <v-list>
                <v-list-group
                    v-for="item in getCurrentBoard.nodeDataArray "
                    v-model="item.active"
                    :key="item._id"
                    :prepend-icon="`center_focus_weak`"
                >
                    <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                    </v-list-tile-content>
                    </v-list-tile>
                        <v-flex xs12 sm8 offset-sm2>
                            <v-card flat>
                                <v-list two-line>
                                <template>
                                    <v-subheader>
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

                                    </v-subheader>

                                    <v-divider
                                    :inset="true"
                                    ></v-divider>

                                    <v-list-tile
                                    :key="item._category_id"
                                    avatar
                                    >
                                    <v-list-tile-avatar>
                                        <v-edit-dialog
                                            align= "center"
                                            @save="edit(item.color, item, 'color')"
                                        > <span v-if="item.color"><div class="color-displayer" :style="{backgroundColor: item.color}"></div></span>
                                        <span v-else><div class="color-displayer" :style="{backgroundColor: '#ccc'}"></div></span>
                                            <v-text-field
                                            slot="input"
                                            solo
                                            v-model="item.color"
                                            label="Editar Color"
                                            type="color"
                                            ></v-text-field>
                                        </v-edit-dialog>
                                    </v-list-tile-avatar>

                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <v-edit-dialog
                                                align= "center"
                                                @save="edit(item.description, item, 'description')"
                                            > <span v-if="item.description">{{ item.description }}</span> <span v-else>Escriba una descripcion...</span>
                                                <v-textarea
                                                slot="input"
                                                solo
                                                v-model="item.description"
                                                label="Editar Descripcion"
                                                ></v-textarea>
                                            </v-edit-dialog>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                                </v-list>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn icon>
                                        <v-icon @click="detailConstruct(item._id)" color="grey">visibility</v-icon>
                                    </v-btn>
                                    <v-btn icon>
                                        <v-icon @click="deleteConstruct(item)" :color="'grey'">delete</v-icon>
                                    </v-btn>
                                    <v-btn icon>
                                        <v-icon color="grey">share</v-icon>
                                    </v-btn>
                                    </v-card-actions>
                            </v-card>
                            </v-flex>
                </v-list-group>
                </v-list>
        </v-flex>
        <v-flex xs12 sm4>
            <v-text-field
            label="Nombre de Constructo"
            single-line
            box
            v-model="construct.name"
                @keyup.enter="addConstruct"
            ></v-text-field>
        </v-flex>
         <v-flex xs12 sm2>
            <v-layout row wrap>
                <v-flex xs12 sm10>
                    <v-text-field
                    @keyup.enter="addConstruct"
                    label="Color"
                    type="color"
                    box
                    v-model="construct.color"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 sm2>
                    <div :style="{backgroundColor: construct.color}" class="color-selector">
                    </div>
                </v-flex>
            </v-layout>
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
  data () {
    return {
      construct: {
      },
      showDetail: false
    }
  },
  computed: {
    ...mapState('boards', {loading: 'isPatchPending'}),
    ...mapState(['currentMapId']),
    ...mapGetters('main-constructs', {findConstructsInStore: 'find'}),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getMainConstructsBoard () {
      return this.findConstructsInStore({query: {removed: false, _board_id: this.currentMapId}}).data
    }
  },
  methods: {
    ...mapActions('main-constructs', { findMainConstructs: 'find' }),
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentConstructId'
    ]),
    addConstruct () {
      this.construct._board_id = this.currentMapId
      const {MainConstruct} = this.$FeathersVuex
      const mainConstruct = new MainConstruct(this.construct)
      mainConstruct.save().then(result => {
        this.construct = {}
      })
    },
    edit (val, elem, field) {
      console.log(val, elem, field)
      const {MainConstruct} = this.$FeathersVuex
      const mainConstruct = new MainConstruct(elem)
      mainConstruct[field] = val
      mainConstruct.patch().then((result) => {
      })
    },
    deleteConstruct (item) {
      const {MainConstruct} = this.$FeathersVuex
      const mainConstruct = new MainConstruct(item)
      mainConstruct.removed = true
      mainConstruct.patch().then(result => {
        console.log(result)
      })
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
