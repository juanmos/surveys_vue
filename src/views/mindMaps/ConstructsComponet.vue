<template>
    <v-container>
     <v-layout row wrap>
        <v-flex xs12 sm12>
            <v-list>
                <v-list-group
                    v-for="item in getConstructs"
                    v-model="item.active"
                    :key="item._id"
                    :prepend-icon="`center_focus_weak`"
                >
                    <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    </v-list-tile>
                        <v-flex xs12 sm8 offset-sm2>
                            <v-card flat>
                                <v-list two-line>
                                <template>
                                    <v-subheader
                                    v-if="item.name"
                                    :key="item.name"
                                    >
                                    {{ item.name }}
                                    </v-subheader>

                                    <v-divider
                                    :inset="true"
                                    ></v-divider>

                                    <v-list-tile
                                    :key="item._category_id"
                                    avatar
                                    >
                                    <v-list-tile-avatar>
                                       <div class="color-displayer" :style="{backgroundColor: getCategories.filter(category => category._id === item._category_id)[0] ? getCategories.filter(category => category._id === item._category_id)[0].color : '#fff'}"></div>
                                    </v-list-tile-avatar>

                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="item.name"></v-list-tile-title>
                                        <v-list-tile-sub-title >Categoria: {{getCategories.filter(category => category._id === item._category_id)[0] ? getCategories.filter(category => category._id === item._category_id)[0].name : 'sin nombre'}}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                                </v-list>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn icon>
                                        <v-icon color="grey">visibility</v-icon>
                                    </v-btn>
                                    <v-btn icon>
                                        <v-icon color="grey">delete</v-icon>
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
            ></v-text-field>
        </v-flex>
        <v-flex xs12 sm4>
            <v-select
            :items="getCategories"
            box
            label="Categoria del Constructo"
            item-text="name"
            item-value="_id"
            v-model="construct._category_id"
            ></v-select>
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
    </v-container>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      construct: {},
      items: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ]
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
    },
    getConstructs () {
      return this.getBoard ? this.getBoard.constructs : []
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    addConstruct () {
      const {Board} = this.$FeathersVuex
      const board = new Board(this.getBoard)
      let boardRequest = Object.assign({}, this.construct)
      board.constructs = [
        boardRequest
      ]
      board.patch({query: {method: 'push', field: 'constructs'}}).then(result => {
        // data that will be shared
        let formatedValue = {}
        formatedValue.color = this.getCategories.filter(category => category._id === this.construct._category_id)[0] ? this.getCategories.filter(category => category._id === this.construct._category_id)[0].color : '#fff'
        formatedValue.name = this.construct.name
        // this.$emit('constructAdded', formatedValue)
        this.construct = {}
      })
    }
  },
  mounted () {
    this.findBoards({query: {removed: false}}).then(response => {
      const boards = response.data || response
      console.log(boards)
    })
  }
}
</script>

<style scoped>
    .color-displayer {
        width: 30px;
        height: 30px;
    }

</style>
