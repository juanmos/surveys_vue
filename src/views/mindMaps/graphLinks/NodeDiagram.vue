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
              @click.stop="addMainConstruct"
              v-if="!hasMainConstruct"
            >
              constructo tematica
              <v-icon right dark>add</v-icon>
            </v-btn>
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
        <span>
          <diagram ref="diag" v-bind:model-data="{nodeDataArray: getCurrentBoard.nodeDataArray , linkDataArray: getCurrentBoard.linkDataArray}" v-on:model-changed="modelChanged" v-on:object-clicked="objectClicked" v-on:changed-selection="changedSelection" style="width:100%; height:600px">
          </diagram>
        </span>
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
          <constructs-component @addNode="addNode" @deleteNode="deleteNode" @editNode="editNode" @constructAdded="addNode($event)"></constructs-component>
          </v-tab-item>
           <v-tab
            ripple
          >
            Todos los Hijos
          </v-tab>
          <v-tab-item
          >
          <constructs-child-component @addNode="addNode" @deleteNode="deleteNode" @editNode="editNode" @constructAdded="addNode($event)"></constructs-child-component>
          </v-tab-item>
           <v-tab
            ripple
          >
            Constructo Seleccionado
          </v-tab>
          <v-tab-item
          >
          <construct-selected @addNode="addNode" @deleteNode="deleteNode" @editNode="editNode" @constructAdded="addNode($event)"></construct-selected>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :vertical="false"
      >
        {{msgText}}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-flex>
  </div>
</template>
<script>
import go from 'gojs'
import {mapState, mapGetters, mapActions} from 'vuex'
import Diagram from './Diagram'
import ConstructCategories from './../CounstructCategories'
import ConstructsComponent from './../ConstructsComponet'
import ConstructsChildComponent from './../ConstructsChildComponent'
import ConstructSelected from './../ConstructSelected'
export default {
  data () {
    return {
      active: null,
      currentNode: null,
      savedModelText: '',
      counter: 1, // used by addNode
      counter2: 4, // used by modifyStuff,
      dataChangedArray: [],
      newLinkDataArray: null,
      newDataArray: null,
      snackbar: false,
      msgText: '',
      selection: {}
    }
  },
  methods: {
    ...mapActions('main-constructs', { findMainConstructs: 'find' }),
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentConstruct'
    ]),
    updateDiagramFromData () { this.$refs.diag.updateDiagramFromData() },

    // this event listener is declared on the
    modelChanged  (e) {
      if (e.isTransactionFinished) { // show the model data in the page's TextArea
        this.savedModelText = e.model.toJson()
        let newModel = JSON.parse(e.model.toJson())
        this.newLinkDataArray = newModel.linkDataArray
        this.newDataArray = newModel.nodeDataArray
      }
    },
    objectClicked  (e) {
      console.log('clickedddd', e.diagram.selection.first())
      this.selection = e.diagram.selection.first()
    },
    changedSelection (e) {
      let node = e.diagram.selection.first()
      if (node) {
        console.log('asignando current construct', node.data)
        setTimeout(() => {
          this.setCurrentConstruct(node.data)
          console.log(node.data)
        }, 0)
      }
    },

    // Here we modify the GoJS Diagram's Model using its methods,
    // which can be much more efficient than modifying some memory and asking
    // the GoJS Diagram to find differences and update accordingly.
    // Undo and Redo will work as expected.
    addNode (val) {
      var model = this.model
      // model.startTransaction()
      // model.setDataProperty(model.findNodeDataForKey(4), 'color', 'purple')
      var data = {text: val.text, mother: val.mother, color: val.color, main: val.main}
      model.addNodeData(data)
      model.commitTransaction('added Node and Link')
      // also manipulate the Diagram by changing its Diagram.selection collection
      // this condition is to select the current created node (it doesnt apply when you have a node already selected)
      if (!val.fromSelected) {
        var diagram = this.$refs.diag.diagram
        diagram.select(diagram.findNodeForData(data))
      } else {
        // link created when a node is selected and childs are appended to it
        model.addLinkData(
          {
            from: val.selected,
            to: this.model.nodeDataArray[(this.model.nodeDataArray.length - 1)].key,
            points: []
          }
        )
      }
      let msg = ''
      if (val.mother) {
        msg = 'Constructo Madre Creado'
      } else if (val.main) {
        msg = 'Constructo Principal Creado'
      } else {
        msg = 'Constructo Creado'
      }
      this.showMsg(msg)
    },
    deleteNode (val) {
      console.log('llego arriba')
      console.log('este es el val de arriba', val)
      var model = this.model
      if (val.main) {
        this.showMsg('No se puede borrar constructo principal')
      } else {
        model.removeNodeData(val)
        model.commitTransaction('Deleted Node')
      }
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
    saveBoardChanges () {
      const {Board} = this.$FeathersVuex
      let board = new Board(this.getCurrentBoard)
      board.nodeDataArray = this.newDataArray
      board.linkDataArray = this.newLinkDataArray
      board.patch({query: {node: true}}).then((result) => {
      })
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
    showMsg (msg) {
      this.snackbar = true
      this.msgText = msg
    },
    addMainConstruct () {
      this.addNode({text: this.getCurrentBoard.name, main: true, color: '#B2DFDB'})
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
    ...mapGetters([
      'getCurrentConstruct'
    ]),
    getCurrentBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getCurrentNodeData () {
      return this.getCurrentBoard.nodeDataArray
    },
    getDiagramData () {
      return {
        nodeKeyProperty: 'id',
        nodeDataArray: [],
        linkDataArray: []
      }
    },
    hasMainConstruct () {
      return this.getCurrentNodeData.filter((construct) => {
        return construct.main === true
      }).length !== 0 ? this.getCurrentNodeData.filter((construct) => {
          return construct.main
        }).length !== 0 : false
    },
    ...mapState(['currentMapId']),
    model () { return this.$refs.diag.model }
  },
  watch: {
    newDataArray (val) {
    },
    selection (val) {
      this.active = 2
    }
  },
  components: {Diagram, ConstructCategories, ConstructsComponent, ConstructsChildComponent, ConstructSelected},
  mounted () {
    this.findMainConstructs({query: {removed: false}}).then(response => {
      const constructs = response.data || response
      console.log(constructs)
    })
    this.findBoards({query: {removed: false}}).then(response => {
      const boards = response.data || response
      console.log(boards)
    })
    this.setCurrentConstruct({name: 'Juan Garcia'})
  }
}
</script>

<style>

</style>
