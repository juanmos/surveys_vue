<template>

  <div>
    <v-flex  v-if="currentMapId" xs12>
      <v-card>
        <v-toolbar
          flat
        >
           <!-- <mind-map-filter @sendFilters="applyFilters"></mind-map-filter> -->
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
          </v-toolbar-items>
        </v-toolbar>
        <span>
          <diagram  v-bind:model-data="getDiagramData" v-on:model-changed="modelChanged" v-on:object-clicked="objectClicked" v-on:changed-selection="changedSelection" style="width:100%; height:600px">
          </diagram>
        </span>
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
import MindMapFilter from './../components/filters/MindMapFilter'
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
      selection: {},
      filteredMode: false
    }
  },
  methods: {
    ...mapActions('main-constructs', { findMainConstructs: 'find' }),
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions([
      'setCurrentConstruct',
      'setShowSnack',
      'setSnackMessage'
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
      this.selection = e.diagram.selection.first()
    },
    changedSelection (e) {
      let node = e.diagram.selection.first()
      if (node) {
        setTimeout(() => {
          this.setCurrentConstruct(node.data)
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
      var data = {text: val.text, mother: val.mother, color: val.color, main: val.main, destruct: val ? val.destruct : false}
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
      // function that creates relations depending on construct type
      this.postCreateRelations(val)
      // testing saving after adding node
    },
    deleteNode (val) {
      var model = this.model
      if (val.main) {
        this.showMsg('No se puede borrar constructo principal')
      } else {
        model.removeNodeData(val)
        model.commitTransaction('Deleted Node')
      }
    },
    postCreateRelations (val) {
      var model = this.model
      // ******* adding datalinks depending on construct type and message (relation between mothers and theme) *****
      let msg = ''
      // datalinks when a mother construct is created
      if (val.mother) {
        let resultMain = this.model.nodeDataArray.filter(construct => {
          return construct.main
        })
        // if a main construct is created
        if (resultMain[0]) {
          model.addLinkData(
            {
              from: resultMain[0].key,
              to: this.model.nodeDataArray[(this.model.nodeDataArray.length - 1)].key,
              points: []
            }
          )
        }
        msg = 'Constructo Madre Creado'
      } else if (val.main) {
        let motherConstructs = this.model.nodeDataArray.filter(construct => {
          return construct.mother
        })
        // if there are mother constructs created then create the relationship with the main created
        if (motherConstructs.length > 0) {
          motherConstructs.forEach(construct => {
            model.addLinkData(
              {
                from: this.model.nodeDataArray[(this.model.nodeDataArray.length - 1)].key,
                to: construct.key,
                points: []
              }
            )
          })
        }
        // datalinks when a main construct is created
        msg = 'Constructo Principal Creado'
      } else if (val && val.destruct) {
        // datalinks when a simple construct is created (nothing to do for now...)
        msg = 'Destructo Creado'
      } else {
        msg = 'Constructo Creado'
      }
      this.showMsg(msg)
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
    },
    // after getting filter component data
    applyFilters (filters) {
      let filtersClone = Object.assign({}, filters)
      if (filtersClone.showMothers) {
        this.filteredMode = true
        let resultMain = this.model.nodeDataArray.filter(construct => {
          return construct.mother || construct.main
        })
        this.model.nodeDataArray = resultMain
      } else {
        this.filteredMode = false
      }
    },
    changeFilteredMode () {
      this.setShowSnack(true)
      this.setSnackMessage('SE HA CAMBIADO LA VISUALIZACION')
      this.filteredMode = !this.filteredMode
    },
    dummy () {}
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
        nodeParentKeyProperty: 'next',
        nodeDataArray: [
          { key: 'Alpha', next: 'Beta', color: 'coral' },
          { key: 'Beta', next: 'Gamma', color: 'tomato' },
          { key: 'Gamma', next: 'Delta', color: 'goldenrod' },
          { key: 'Delta', next: 'Epsilon', color: 'orange' },
          { key: 'Epsilon', next: 'Zeta', color: 'coral' },
          { key: 'Zeta', next: 'Eta', color: 'tomato' },
          { key: 'Eta', next: 'Theta', color: 'goldenrod' },
          { key: 'Theta', next: 'Iota', color: 'orange' },
          { key: 'Iota', next: 'Kappa', color: 'coral' },
          { key: 'Kappa', next: 'Lambda', color: 'tomato' },
          { key: 'Lambda', next: 'Mu', color: 'goldenrod' },
          { key: 'Mu', next: 'Nu', color: 'orange' },
          { key: 'Nu', next: 'Xi', color: 'coral' },
          { key: 'Xi', next: 'Omicron', color: 'tomato' },
          { key: 'Omicron', next: 'Pi', color: 'goldenrod' },
          { key: 'Pi', next: 'Rho', color: 'orange' },
          { key: 'Rho', next: 'Sigma', color: 'coral' },
          { key: 'Sigma', next: 'Tau', color: 'tomato' },
          { key: 'Tau', next: 'Upsilon', color: 'goldenrod' },
          { key: 'Upsilon', next: 'Phi', color: 'orange' },
          { key: 'Phi', next: 'Chi', color: 'coral' },
          { key: 'Chi', next: 'Psi', color: 'tomato' },
          { key: 'Psi', next: 'Omega', color: 'goldenrod' },
          { key: 'Omega', next: 'Alpha2', color: 'orange' },
          { key: 'Alpha2', next: 'Beta2', color: 'coral' },
          { key: 'Beta2', next: 'Gamma2', color: 'tomato' },
          { key: 'Gamma2', next: 'Delta2', color: 'goldenrod' },
          { key: 'Delta2', next: 'Epsilon2', color: 'orange' },
          { key: 'Epsilon2', next: 'Zeta2', color: 'coral' },
          { key: 'Zeta2', next: 'Eta2', color: 'tomato' },
          { key: 'Eta2', next: 'Theta2', color: 'goldenrod' },
          { key: 'Theta2', next: 'Iota2', color: 'orange' },
          { key: 'Iota2', next: 'Kappa2', color: 'coral' },
          { key: 'Kappa2', next: 'Lambda2', color: 'tomato' },
          { key: 'Lambda2', next: 'Mu2', color: 'goldenrod' },
          { key: 'Mu2', next: 'Nu2', color: 'orange' },
          { key: 'Nu2', next: 'Xi2', color: 'coral' },
          { key: 'Xi2', next: 'Omicron2', color: 'tomato' },
          { key: 'Omicron2', next: 'Pi2', color: 'goldenrod' },
          { key: 'Pi2', next: 'Rho2', color: 'orange' },
          { key: 'Rho2', next: 'Sigma2', color: 'coral' },
          { key: 'Sigma2', next: 'Tau2', color: 'tomato' },
          { key: 'Tau2', next: 'Upsilon2', color: 'goldenrod' },
          { key: 'Upsilon2', next: 'Phi2', color: 'orange' },
          { key: 'Phi2', next: 'Chi2', color: 'coral' },
          { key: 'Chi2', next: 'Psi2', color: 'tomato' },
          { key: 'Psi2', next: 'Omega2', color: 'goldenrod' },
          { key: 'Omega2', color: 'orange' }
        ]
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
    model () { return this.$refs.diag.model },
    filteredNodeDataArray () {
      return this.getCurrentBoard.nodeDataArray.filter(construct => construct.main || construct.mother)
    },
    filteredLinkDataArray () {
      let mainConstruct = this.getCurrentBoard.nodeDataArray.filter(construct => construct.main)[0]
      if (mainConstruct) {
        return this.getCurrentBoard.linkDataArray.filter(link => Number(link.from) === Number(mainConstruct.key))
      } else {
        return []
      }
    }
  },
  watch: {
    newDataArray (val) {
    },
    selection (val) {
      this.active = 2
    }
  },
  components: {Diagram, MindMapFilter},
  mounted () {
    this.findMainConstructs({query: {removed: false}}).then(response => {
    })
    this.findBoards({query: {removed: false}}).then(response => {
    })
  }
}
</script>

<style>

</style>
