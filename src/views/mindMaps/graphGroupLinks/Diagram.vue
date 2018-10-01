<template>
  <div></div>
</template>
<script>
import go from 'gojs'
var $ = go.GraphObject.make
export default {
  props: ['modelData'], // accept model data as a parameter-
  data () {
    return {
      diagram: null // provide access to goJS diagram
    }
  },
  methods: {
    updateModel (val) {
      // no gojs transactions permited when replacing Diagram.model
      if (val instanceof go.Model) {
        this.diagram.model = val
      } else {
        let m = new go.GraphLinksModel()
        if (val) {
          for (let p in val) {
            m[p] = val[p]
          }
        }
        this.diagram.model = m
      }
    },
    updateDiagramFromData: function () {
      this.diagram.startTransaction()
      // This is very general but very inefficient.
      // It would be better to modify the diagramData data by calling
      // Model.setDataProperty or Model.addNodeData, et al.
      this.diagram.updateAllRelationshipsFromData()
      this.diagram.updateAllTargetBindings()
      this.diagram.commitTransaction('updated')
    }
  },
  computed: {
    model () {
      return this.diagram.model
    }
  },
  watch: {
    modelData (val) { this.updateModel(val) },
    diagram (val) {
      this.$emit('modelChanged', val)
    }
  },
  mounted () {
    var self = this
    var myDiagram =
      $(go.Diagram, this.$el,
        {
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
          // disable animation
          'animationManager.isEnabled': false,
          // support double-click in background creating a new node
          'clickCreatingTool.archetypeNodeData': { text: 'Nuevo Constructo' },
          // allows grouping with ctl g
          'commandHandler.archetypeGroupData': { text: 'Group', isGroup: true, color: 'blue' },
          'undoManager.isEnabled': true,
          // Model ChangedEvents get passed up to component users
          'ModelChanged': function (e) { self.$emit('model-changed', e) },
          'ObjectSingleClicked': function (e) { self.$emit('object-clicked', e) },
          'ChangedSelection': function (e) { self.$emit('changed-selection', e) }
        })
      // To simplify this code we define a function for creating a context menu button:
    function makeButton (text, action, visiblePredicate) {
      return $('ContextMenuButton',
        $(go.TextBlock, text),
        { click: action },
        // don't bother with binding GraphObject.visible if there's no predicate
        visiblePredicate ? new go.Binding('visible', '', function (o, e) { return o.diagram ? visiblePredicate(o, e) : false }).ofObject() : {})
    }
    // a context menu is an Adornment with a bunch of buttons in them
    var partContextMenu =
      $(go.Adornment, 'Vertical',
        makeButton('Cortar',
          function (e, obj) { e.diagram.commandHandler.cutSelection() },
          function (o) { return o.diagram.commandHandler.canCutSelection() }),
        makeButton('Copiar',
          function (e, obj) { e.diagram.commandHandler.copySelection() },
          function (o) { return o.diagram.commandHandler.canCopySelection() }),
        makeButton('Pegar',
          function (e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint) },
          function (o) { return o.diagram.commandHandler.canPasteSelection() }),
        makeButton('Borrar',
          function (e, obj) { e.diagram.commandHandler.deleteSelection() },
          function (o) { return o.diagram.commandHandler.canDeleteSelection() }),
        makeButton('Deshacer',
          function (e, obj) { e.diagram.commandHandler.undo() },
          function (o) { return o.diagram.commandHandler.canUndo() }),
        makeButton('Rehacer',
          function (e, obj) { e.diagram.commandHandler.redo() },
          function (o) { return o.diagram.commandHandler.canRedo() }),
        makeButton('Agrupar',
          function (e, obj) { e.diagram.commandHandler.groupSelection() },
          function (o) { return o.diagram.commandHandler.canGroupSelection() }),
        makeButton('Desagrupar',
          function (e, obj) { e.diagram.commandHandler.ungroupSelection() },
          function (o) { return o.diagram.commandHandler.canUngroupSelection() })
      )
    function nodeInfo (d) { // Tooltip info for a node data object
      var str = 'Constructo ' + d.key + ': ' + d.text + '\n'
      if (d && d.destruct) {
        str += 'Es un Destructo '
      } else {
        str += 'Es un constructo'
      }
      return str
    }
    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically
    myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            fill: 'rgba(128,128,128,0.2)',
            stroke: 'gray',
            strokeWidth: 3,
            portId: '',
            cursor: 'pointer', // the Shape is the port, not the whole Node
            // allow all kinds of links from and to this port
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true
          },
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          {
            font: 'bold 14px sans-serif',
            stroke: '#333',
            margin: 6, // make some extra space for the shape around the text
            isMultiline: true, // don't allow newlines in text
            contextMenu: partContextMenu
          },
          new go.Binding('text').makeTwoWay()),
        { // this tooltip Adornment is shared by all nodes
          toolTip:
            $(go.Adornment, 'Auto',
              $(go.Shape, { fill: '#FFFFCC' }),
              $(go.TextBlock, { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding('text', '', nodeInfo))
            ),
          // this context menu Adornment is shared by all nodes
          contextMenu: partContextMenu
        }
      )

    myDiagram.linkTemplate =
      $(go.Link,
        {
          curve: go.Link.Bezier,
          adjusting: go.Link.Stretch,
          reshapable: true,
          toShortLength: 3,
          relinkableFrom: true,
          relinkableTo: true
        },
        new go.Binding('points').makeTwoWay(),
        new go.Binding('curviness'),
        $(go.Shape, { strokeWidth: 1.5 }
        ),
        $(go.Shape, // the arrowhead
          { toArrow: 'standard', stroke: null }),
        $(go.Shape, { toArrow: 'OpenTriangle' }),
        { // this tooltip Adornment is shared by all nodes
          toolTip:
            $(go.Adornment, 'Auto',
              $(go.Shape, { fill: '#FFFFCC' }),
              $(go.TextBlock, { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding('text', '', nodeInfo))
            ),
          // this context menu Adornment is shared by all nodes
          contextMenu: partContextMenu
        }
      )
    function diagramInfo (model) { // Tooltip info for the diagram's model
      return 'Mapa Mental:\n' + model.nodeDataArray.length + ' Constructos, ' + model.linkDataArray.length + ' enlaces'
    }
    myDiagram.toolTip =
      $(go.Adornment, 'Auto',
        $(go.Shape, { fill: '#FFFFCC' }),
        $(go.TextBlock, { margin: 4 },
          new go.Binding('text', '', diagramInfo))
      )
    myDiagram.contextMenu = $(go.Adornment, 'Vertical',
      makeButton('Pegar',
        function (e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint) },
        function (o) { return o.diagram.commandHandler.canPasteSelection() }),
      makeButton('Deshacer',
        function (e, obj) { e.diagram.commandHandler.undo() },
        function (o) { return o.diagram.commandHandler.canUndo() }),
      makeButton('Rehacer',
        function (e, obj) { e.diagram.commandHandler.redo() },
        function (o) { return o.diagram.commandHandler.canRedo() })
    )
    this.diagram = myDiagram
    this.updateModel(this.modelData)
  }
}
</script>

<style>

</style>
