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

    myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
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

    myDiagram.linkTemplate =
      $(go.Link,
        { relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: 'OpenTriangle' })
      )

    this.diagram = myDiagram

    this.updateModel(this.modelData)
  }
}
</script>

<style>

</style>
