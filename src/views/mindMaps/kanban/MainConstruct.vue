<template>
    <v-container style="margin-top: -18px;">
        <v-layout>
            <v-flex xs12 sm6>
              <v-text-field
              label="Solo"
              single-line
              placeholder="+ Agregar constructo madre"
              solo
              v-model="construct.text"
                  @keyup.enter="addConstruct"
            ></v-text-field>
            </v-flex>
            <v-flex xs12 sm2>
                <v-btn @click="addConstruct" title="Agregar" icon>
                <v-icon>send</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    <construct-detail @closed="showDetail = false" :dialog="showDetail"></construct-detail>
    </v-container>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import ConstructDetail from './../components/ConstructDetail'
export default {
  data () {
    return {
      construct: {
        loc: '0 0'
      },
      showDetail: false,
      cards: [
        { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 },
        { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
        { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 }
      ]
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
    },
    getMainBuilder () {
      return this.getCurrentBoard.kanbanNodeDataArray.filter(nodeData => nodeData.isGroup === true)
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
      this.$emit('addNode', mutableConstruct)
      this.$emit('saveBoardChanges', mutableConstruct)
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
