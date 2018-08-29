<template>
   <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs2>
        <boards-categories :boards="getBoards"></boards-categories>
      </v-flex>
      <v-flex xs10>
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
import NodeDiagram from './../mindMaps/NodeDiagram'
export default {
  data () {
    return {
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
