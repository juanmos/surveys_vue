<template>
<v-container>
  <v-card>
        <v-list subheader>
          <v-subheader>Constructos</v-subheader>
          <v-list-tile
            v-for="item in getCategories"
            :key="item.name"
            avatar
          >
            <v-list-tile-avatar>
              <div class="color-displayer" :style="{backgroundColor: item.color}"></div>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-edit-dialog
                  align= "center"
                  lazy
                  @save="editCategory(item.name, item, 'name')"
                > {{ item.name }}
                  <v-text-field
                    slot="input"
                    v-model="item.name"
                    label="Editar Nombre"
                    single-line
                  ></v-text-field>
              </v-edit-dialog>
              <v-list-tile-title v-html="item.name"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon @click="deleteCategory(item)" :color="item.active ? 'teal' : 'grey'">delete</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

      </v-card>
      <v-layout row wrap>
        <v-flex xs12 sm4>
            <v-text-field
            label="Nombre de Categoria"
            single-line
            box
            v-model="category.name"
            ></v-text-field>
        </v-flex>
        <v-flex xs12 sm2>
            <v-layout row wrap>
                <v-flex xs12 sm10>
                    <v-text-field
                    label="Color"
                    type="color"
                    box
                    v-model="category.color"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 sm2>
                    <div :style="{backgroundColor: category.color}" class="color-selector">
                    </div>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex xs12 sm2>
            <v-btn @click="addCategory" icon>
              <v-icon>send</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</v-container>

</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      valid: false,
      category: {
        name: null,
        color: null
      },
      headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Color',
          align: 'left',
          value: 'color'
        }
      ]
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    addCategory () {
      const {Board} = this.$FeathersVuex
      const board = new Board(this.getBoard)
      let boardRequest = Object.assign({}, this.category)
      board.constructCategories = [
        boardRequest
      ]
      board.patch({query: {method: 'push', field: 'constructCategories'}}).then(result => {
        this.category = {}
      })
    },
    deleteCategory (item) {
      const {Board} = this.$FeathersVuex
      const board = new Board(this.getBoard)
      let boardRequest = Object.assign({}, item)
      board.constructCategories = [
        boardRequest
      ]
      board.patch({query: {method: 'pull', field: 'constructCategories'}}).then(result => {
      })
    },
    editCategory (val, elem, field) {

    }
  },
  computed: {
    ...mapState('boards', {loading: 'isFindPending'}),
    ...mapState(['currentMapId']),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    getBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getCategories () {
      return this.getBoard ? this.getBoard.constructCategories : []
    }
  },
  mounted () {
    this.findBoards({query: {removed: false}}).then(response => {
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
