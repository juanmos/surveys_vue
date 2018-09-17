<template>
  <div>
    <v-flex  v-if="currentMapId" xs12>
      <v-card>
        <v-toolbar
          flat
        >
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn
              flat
              :loading="loading"
              :disabled="loading"
              @click.stop="saveBoardChanges"
            >
              Guardar
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-tabs
          v-model="active"
          slider-color="indigo"
        >
           <v-tab
            ripple
          >
            CONSTRUCTOS MADRE
          </v-tab>
          <v-tab-item
          >
          <constructs-component @addNode="addNode" @deleteNode="deleteNode" @editNode="editNode" @constructAdded="addNode($event)"></constructs-component>
          </v-tab-item>
                <!--    <v-tab
                     ripple
                   >
                     Constructos
                   </v-tab>
                   <v-tab-item
                   >
                   <construct @addNodeBuilder="addNodeBuilder" @deleteNode="deleteNode" @editNodeBuilder="editNodeBuilder" @constructAdded="addNodeBuilder($event)"></construct>
                 </v-tab-item> -->
        </v-tabs>
        <span>
          <diagram ref="diag" v-bind:model-data="{nodeDataArray: getKanbanDiagramData, linkDataArray: '', linkKeyProperty: '_id'}" v-on:model-changed="modelChanged" v-on:changed-selection="changedSelection" style="width:100%; height:500px">
          </diagram>
        </span>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
import go from 'gojs'
import {mapState, mapGetters, mapActions} from 'vuex'
import Diagram from './Diagram'
import Construct from './Construct'
import ConstructsComponent from './MainConstruct'
import DestructsComponent from './../DestructsComponent'
export default {
  data () {
    return {
      active: null,
      currentNode: null,
      savedModelText: '',
      finisTransaction: true,
      kanbanNodeDataArray: null,
      optionsBuilder: null,
      counter: 1, // used by addNode
      counter2: 4, // used by modifyStuff,
      dataChangedArray: [],
      newDataArray: null
    }
  },
  methods: {
    ...mapActions('main-constructs', { findMainConstructs: 'find' }),
    ...mapActions('boards', { findBoards: 'find' }),
    updateDiagramFromData () { this.$refs.diag.updateDiagramFromData() },

    // this event listener is declared on the
    modelChanged  (e) {
      if (e.isTransactionFinished) { // show the model data in the page's TextArea
        this.savedModelText = e.model.toJson()
        let newModel = JSON.parse(e.model.toJson())
        this.kanbanNodeDataArray = newModel.nodeDataArray
        // console.log(this.kanbanNodeDataArray)
        this.finisTransaction = false
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
      var model = this.model
      var colArray = model.nodeDataArray.filter(nodeData => (nodeData.col))
      var data = {text: val.text, isGroup: true, col: colArray.length + 1}
      model.addNodeData(data)
      var newbutton = {group: data.key, category: 'newbutton', loc: '0 0'}
      model.addNodeData(newbutton)
      model.commitTransaction('added Node and Link')
      // also manipulate the Diagram by changing its Diagram.selection collection
      var diagram = this.$refs.diag.diagram
      diagram.select(diagram.findNodeForData(data))
    },
    addNodeBuilder (val) {
      var model = this.model
      var data = {text: val.text, group: '1', color: '0', loc: '671 23.52284749830794'}
      model.addNodeData(data)
      model.commitTransaction('added Node and Link')
      // also manipulate the Diagram by changing its Diagram.selection collection
      var diagram = this.$refs.diag.diagram
      diagram.select(diagram.findNodeForData(data))
    },
    deleteNode (val) {
      var model = this.model
      model.removeNodeData(val)
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
    },
    editNode (event) {
      let field = event.field
      delete event.field
      let model = this.model
      model.startTransaction()
      model.setDataProperty(event, field, event[field])
      model.commitTransaction('edited text')
      this.saveBoardChanges()
    },
    editNodeBuilder (event) {
      let field = event.field
      delete event.field
      let model = this.model
      model.startTransaction()
      model.setDataProperty(event, field, event[field])
      model.commitTransaction('edited text')
    },
    saveBoardChanges () {
      const {Board} = this.$FeathersVuex
      let board = new Board(this.getCurrentBoard)
      this.optionsBuilder = this.kanbanNodeDataArray.filter(nodeData => (nodeData.key === 'idMainBuilder' || nodeData.group === 'idMainBuilder'))
      board.kanbanNodeDataArray = this.kanbanNodeDataArray.filter(nodeData => (nodeData.key !== 'idMainBuilder' && nodeData.group !== 'idMainBuilder' && nodeData.category !== 'newbutton'))
      board.optionsKanban = this.optionsBuilder
      board.patch({query: {kanban: true}}).then((result) => {
        console.log('save ok', board)
      })
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
    ...mapState('main-constructs', {loading: 'isFindPending'}),
    ...mapGetters('main-constructs', {findConstructsInStore: 'find'}),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    ...mapState('boards', {loading: 'isFindPending'}),
    ...mapState(['currentMapId', 'currentDiagram']),
    getKanbanDiagramData () {
      // if (this.finisTransaction === true) {
      var kanbanNodeDataArray = []
      // console.log('data obtenida -->', this.getCurrentBoard.kanbanNodeDataArray)
      if (this.getCurrentBoard.hasOwnProperty('kanbanNodeDataArray') && this.getCurrentBoard.kanbanNodeDataArray.length > 0) {
        // kanbanNodeDataArray = this.getCurrentBoard.kanbanNodeDataArray
        this.getCurrentBoard.kanbanNodeDataArray.push(...this.getCurrentBoard.optionsKanban)
        console.log('options--->', kanbanNodeDataArray)
      } else {
        let mainConstruct = {
          'key': 'idMainBuilder',
          'text': 'CONSTRUCTOS',
          'isGroup': true,
          'row': 1,
          'colspan': 6
        }
        let buttonBuilder = {'key': -1, 'group': 'idMainBuilder', 'category': 'newbutton', 'loc': '12 35.52284749830794'}
        this.getCurrentBoard.kanbanNodeDataArray.push(mainConstruct)
        this.getCurrentBoard.kanbanNodeDataArray.push(buttonBuilder)
      }
      return this.getCurrentBoard.kanbanNodeDataArray
    /*  return {
        'class': 'go.GraphLinksModel',
        'nodeDataArray': kanbanNodeDataArray,
        'linkDataArray': []} */
      // }
    },
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getCurrentNodeData () {
      return this.getCurrentBoard.nodeDataArray
    },
    getMainConstructsBoard () {
      return this.findConstructsInStore({query: {removed: false, _board_id: this.currentMapId}}).data
    },
    getDiagramData () {
      return {
        nodeKeyProperty: 'id',
        nodeDataArray: [],
        linkDataArray: []
      }
    },
    ...mapState(['currentMapId']),
    model () { return this.$refs.diag.model }
  },
  watch: {
    newDataArray (val) {
      console.log('new model changed', val)
    }
  },
  components: {Diagram, Construct, DestructsComponent, ConstructsComponent},
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
