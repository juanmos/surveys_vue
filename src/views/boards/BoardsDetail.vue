<template>
   <v-container grid-list-md text-xs-center>
    <v-layout v-if="fullScreen" row wrap>
      <v-flex xs12>
        <v-card >
          <v-tooltip bottom>
          <v-btn
            slot="activator"
            absolute
            dark
            fab
            small
            top
            left
            color="pink"
            @click="fullScreen = !fullScreen"
            >
                <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
          <span>Mostrar Tematicas</span>
        </v-tooltip>
            <component :is="getCurrentDiagram"></component>
        </v-card>

      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs3 >
        <boards-categories @closeMenu="fullScreen = true" :boards="getBoards"></boards-categories>
      </v-flex>
      <v-flex xs9>
        <v-card >
            <component :is="getCurrentDiagram"></component>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import BoardsCategories from './BoardsCategories'
import NodeDiagram from './../mindMaps/graphLinks/NodeDiagram'
import KanbanDiagram from './../mindMaps/kanban/KanbanDiagram'
import MatrixComponent from './../mindMaps/matrixTable/MatrixComponent'
import NodeGroupDiagram from './../mindMaps/graphGroupLinks/NodeGroupDiagram'
import SpiralLinkDiagram from './../mindMaps/spiralGraphLinks/SpiralLinkDiagram'
export default {
  data () {
    return {
      fullScreen: false
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setStudyId'
    ])
  },
  computed: {
    ...mapState('boards', {loading: 'isFindPending'}),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapGetters([
      'getCurrentDiagram'
    ]),
    getBoards () {
      return this.findBoardsInStore({query: {removed: false, _study_id: this.$route.params.id}}).data
    }
  },
  mounted () {
    this.findBoards({ query: {removed: false, _study_id: this.$route.params.id} }).then(response => {
      this.setStudyId(this.$route.params.id)
    })
  },
  components: {BoardsCategories, NodeDiagram, KanbanDiagram, MatrixComponent, NodeGroupDiagram, SpiralLinkDiagram}
}
</script>

<style scoped>

</style>
