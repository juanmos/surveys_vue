<template>
  <v-layout row>
    <v-flex xs12>
      <v-toolbar>
        <v-toolbar-title>Mapas</v-toolbar-title>
        <v-spacer></v-spacer>
        <boards-create-dialog></boards-create-dialog>
      </v-toolbar>
      <v-card>
        <v-list two-line subheader>
          <v-list-group
            v-for="item in getBoards"
            v-model="item.active"
            :key="item.title"
            no-action
          >
            <v-list-tile  slot="activator">
              <v-list-tile-avatar>
                <v-icon :class="`grey lighten-1 white--text`">folder</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.name }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
              <v-list-tile
              @click="setCurrentMapId(item._id)"
              >
                <v-list-tile-avatar>
                  <v-icon :class="`grey lighten-1 white--text`">category</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Mapa Mental</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
              <v-list-tile
              @click="setCurrentMapId(item._id)"
              >
                <v-list-tile-avatar>
                  <v-icon :class="`grey lighten-1 white--text`">link</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Links</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
              <v-list-tile
              >
                <v-list-tile-avatar>
                  <v-icon :class="`grey lighten-1 white--text`">merge_type</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Conexiones</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
              >
                <v-list-tile-avatar>
                  <v-icon :class="`grey lighten-1 white--text`">show_chart</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Graficos</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

          </v-list-group>

          <v-divider inset></v-divider>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'

import BoardsCreateDialog from './BoardsCreateDialog'
export default {
  props: ['boards'],
  data () {
    return {
      dialog: false,
      items: [
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Categoria 1', subtitle: 'descripcion' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Categoria 2', subtitle: 'descripcion' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Categoria 3', subtitle: 'descripcion' }
      ],
      items2: [
        { icon: 'assignment', iconClass: 'blue white--text', title: 'Archivo 1', subtitle: 'descripcion' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: 'Archivo 2', subtitle: 'descripcion' }
      ],
      mutableBoards: []
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentMapId'
    ]),
    edit (val, elem, field) {
      console.log(val, elem, field)
      const {Board} = this.$FeathersVuex
      const board = new Board(elem)
      board[field] = val
      board.patch().then((result) => {
        this.find({ query: {removed: false} }).then(response => {
          const boards = response.data || response
          console.log(boards)
        })
      })
    }
  },
  watch: {
  },
  created () {
    this.findBoards({ query: {removed: false, _study_id: this.getStudyId} }).then(response => {
      const boards = response.data || response
      console.log(boards)
    })
  },
  computed: {
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapGetters(
      [
        'getStudyId'
      ]
    ),
    getBoards () {
      return this.findBoardsInStore({query: {removed: false, _study_id: this.getStudyId}}).data
    }
  },
  components: {BoardsCreateDialog}
}
</script>
<style>
</style>
