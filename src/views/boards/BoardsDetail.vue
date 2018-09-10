<template>
   <v-container grid-list-md text-xs-center>
    <v-layout v-if="fullScreen" row wrap>
      <v-flex xs12>
        <v-card >
          <v-btn
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
            <component :is="diagramComponent"></component>
        </v-card>

      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs3 >
        <boards-categories @closeMenu="fullScreen = true" :boards="getBoards"></boards-categories>
      </v-flex>
      <v-flex xs9>
        <v-card >
            <component :is="diagramComponent"></component>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import BoardsCategories from './BoardsCategories'
import NodeDiagram from './../mindMaps/kanban/NodeDiagram'
export default {
  data () {
    return {
      fullScreen: false,
      diagramComponent: 'NodeDiagram'
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
    getBoards () {
      return this.findBoardsInStore({query: {removed: false, _study_id: this.$route.params.id}}).data
    }
  },
  mounted () {
    this.findBoards({ query: {removed: false, _study_id: this.$route.params.id} }).then(response => {
      const boards = response.data || response
      this.setStudyId(this.$route.params.id)
      console.log(boards)
    })
  },
  components: {BoardsCategories, NodeDiagram}
}
</script>

<style scoped>

</style>
