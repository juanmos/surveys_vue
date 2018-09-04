<template>

  <div>
    <v-flex  v-if="currentMapId" xs12>
      <v-card>
        <diagram ref="diag" v-bind:model-data="getDiagramData" v-on:model-changed="modelChanged" v-on:changed-selection="changedSelection" style="width:100%; height:400px"></diagram>
        <kanban-diagram ref="diag" v-bind:model-data="getKanbanDiagramData" v-on:model-changed="modelChanged"></kanban-diagram>
        <v-tabs
          v-model="active"
          slider-color="indigo"
        >
           <v-tab
            ripple
          >
            Constructos Madre
          </v-tab>
          <v-tab-item
          >
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
          <constructs-component @constructAdded="addNode($event)"></constructs-component>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
import go from 'gojs'
import {mapState, mapGetters, mapActions} from 'vuex'
import Diagram from './Diagram'
import KanbanDiagram from './KanbanDiagram'
import ConstructCategories from './CounstructCategories'
import ConstructsComponent from './ConstructsComponet'
import DestructsComponent from './DestructsComponent'
export default {
  data () {
    return {
      active: null,
      currentNode: null,
      savedModelText: '',
      counter: 1, // used by addNode
      counter2: 4, // used by modifyStuff
      renderKanban: false

    }
  },
  methods: {
    ...mapActions('main-constructs', { findMainConstructs: 'find' }),
    ...mapActions('boards', { findBoards: 'find' }),
    // get access to the GoJS Model of the GoJS Diagram
    // tell the GoJS Diagram to update based on the arbitrarily modified model data
    updateDiagramFromData () { this.$refs.diag.updateDiagramFromData() },

    // this event listener is declared on the
    modelChanged  (e) {
      if (e.isTransactionFinished) { // show the model data in the page's TextArea
        this.savedModelText = e.model.toJson()
      }
    },

    changedSelection (e) {
      var node = e.diagram.selection.first()
      if (node instanceof go.Node) {
        this.currentNode = node
        this.currentNodeText = node.data.text
      } else {
        this.currentNode = null
        this.currentNodeText = ''
      }
    },

    // Here we modify the GoJS Diagram's Model using its methods,
    // which can be much more efficient than modifying some memory and asking
    // the GoJS Diagram to find differences and update accordingly.
    // Undo and Redo will work as expected.
    addNode (val) {
      console.log('este es el valor', val)
      var model = this.model
      model.startTransaction()
      model.setDataProperty(model.findNodeDataForKey(4), 'color', 'purple')
      var data = { text: val.name, color: val.color }
      model.addNodeData(data)
      model.commitTransaction('added Node and Link')
      // also manipulate the Diagram by changing its Diagram.selection collection
      var diagram = this.$refs.diag.diagram
      diagram.select(diagram.findNodeForData(data))
    },

    // Here we modify VUE's view model directly, and
    // then ask the GoJS Diagram to update everything from the data.
    // This is less efficient than calling the appropriate GoJS Model methods.
    // NOTE: Undo will not be able to restore all of the state properly!!
    modifyStuff () {
      var data = this.diagramData
      data.nodeDataArray[0].color = 'red'
      // Note here that because we do not have the GoJS Model,
      // we cannot find out what values would be unique keys, for reference by the link data.
      data.nodeDataArray.push({ key: ++this.counter2, text: this.counter2.toString(), color: 'orange' })
      data.linkDataArray.push({ from: 2, to: this.counter2 })
      this.updateDiagramFromData()
    }
  },
  computed: {
    currentNodeText: {
      get () {
        var node = this.currentNode
        if (node instanceof go.Node) {
          return node.data.text
        } else {
          return ''
        }
      },
      set (val) {
        var node = this.currentNode
        if (node instanceof go.Node) {
          var model = this.model
          model.startTransaction()
          model.setDataProperty(node.data, 'text', val)
          model.commitTransaction('edited text')
        }
      }
    },
    ...mapState(['currentMapId']),
    ...mapState('main-constructs', {loading: 'isFindPending'}),
    ...mapGetters('main-constructs', {findConstructsInStore: 'find'}),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getCurrentBoardForNode () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data.map(board => {
        return {
          text: board.name,
          loc: '0 120'
        }
      })
    },
    getMainConstructsBoard () {
      return this.findConstructsInStore({query: {removed: false, _board_id: this.currentMapId}}).data
    },
    getNodeDataArray () {
      return this.getMainConstructsBoard.map((construct) => {
        return {
          text: construct.name,
          id: construct._id
        }
      })
    },
    getDiagramData () {
      return {
        nodeKeyProperty: 'id',
        nodeDataArray: this.getNodeDataArray,
        linkDataArray: []
      }
    },
    getKanbanDiagramData () {
      var nodeDataArrayKanban = []
      const segments = ['Temperamento', 'Liderazgo', 'Corrupción', 'Dictador']
      segments.forEach((key) => {
        let dataSegment = {
          key: key,
          text: key,
          isGroup: true,
          loc: '0 0'
        }
        nodeDataArrayKanban.push(dataSegment)
      })
      let cont = 0
      this.getNodeDataArray.forEach((data) => {
        cont++
        let dataKanban = {
          key: cont,
          text: data.text,
          group: 'Temperamento',
          color: '0'
        }
        nodeDataArrayKanban.push(dataKanban)
      })
      return {
        'class': 'go.GraphLinksModel',
        'nodeDataArray': nodeDataArrayKanban,
        'linkDataArray': []}
    },
    ...mapState(['currentMapId']),
    model () { return this.$refs.diag.model }
  },
  components: {Diagram, ConstructCategories, DestructsComponent, ConstructsComponent, KanbanDiagram},
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

<style>

</style>
