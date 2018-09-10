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
        let m = new go.TreeModel()
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
          // support double-click in background creating a new node
          'clickCreatingTool.archetypeNodeData': { text: 'Nuevo Constructo' },
          'undoManager.isEnabled': true,
          // Model ChangedEvents get passed up to component users
          'ModelChanged': function (e) { self.$emit('model-changed', e) },
          'ChangedSelection': function (e) { self.$emit('changed-selection', e) }
        })
    var cxElement = document.getElementById('contextMenu')
    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically
    var myContextMenu = $(go.HTMLInfo, {
      show: showContextMenu,
      mainElement: cxElement
    })
    myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        { contextMenu: myContextMenu },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            parameter1: 20, // the corner has a large radius
            fill: $(go.Brush, 'Linear', { 0: 'rgb(254, 201, 0)', 1: 'rgb(254, 162, 0)' }),
            stroke: null,
            portId: '', // this Shape is the Node's port, not the whole Node
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
            cursor: 'pointer'
          },
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          {
            margin: 8,
            editable: true, // editing the text automatically updates the model data
            font: 'bold 12pt helvetica, bold arial, sans-serif'
          },
          new go.Binding('text').makeTwoWay())
      )

    function showContextMenu (obj, diagram, tool) {
    // Show only the relevant buttons given the current state.
      var cmd = diagram.commandHandler
      document.getElementById('cut').style.display = cmd.canCutSelection() ? 'block' : 'none'
      document.getElementById('copy').style.display = cmd.canCopySelection() ? 'block' : 'none'
      document.getElementById('paste').style.display = cmd.canPasteSelection() ? 'block' : 'none'
      document.getElementById('delete').style.display = cmd.canDeleteSelection() ? 'block' : 'none'
      document.getElementById('color').style.display = (obj !== null ? 'block' : 'none')

      // Now show the whole context menu element
      cxElement.style.display = 'block'
      // we don't bother overriding positionContextMenu, we just do it here:
      var mousePt = diagram.lastInput.viewPoint
      cxElement.style.left = mousePt.x + 'px'
      cxElement.style.top = mousePt.y + 'px'
    }

    myDiagram.linkTemplate =
      $(go.Link,
        {
          curve: go.Link.Bezier,
          adjusting: go.Link.Stretch,
          reshapable: true,
          toShortLength: 3
        },
        new go.Binding('points').makeTwoWay(),
        new go.Binding('curviness'),
        $(go.Shape, { strokeWidth: 1.5 }
        ),
        $(go.Shape, // the arrowhead
          { toArrow: 'standard', stroke: null }),
        $(go.Shape, { toArrow: 'OpenTriangle' })
      )

    this.diagram = myDiagram
    this.updateModel(this.modelData)
  }
}
</script>

<style>

</style>
