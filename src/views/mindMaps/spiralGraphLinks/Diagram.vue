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
    'use strict'
    /*
    *  Copyright (C) 1998-2018 by Northwoods Software Corporation. All Rights Reserved.
    */

    // A custom Layout that lays out a chain of nodes in a spiral

    /**
    * @constructor
    * @extends Layout
    * @class
    * This layout assumes the graph is a chain of Nodes,
    * {@link #spacing} controls the spacing between nodes.
    */
    function SpiralLayout () {
      go.Layout.call(this)
      this._radius = NaN
      this._spacing = 10
      this._clockwise = true
    }
    go.Diagram.inherit(SpiralLayout, go.Layout)

    /**
    * @ignore
    * Copies properties to a cloned Layout.
    * @this {SpiralLayout}
    * @param {Layout} copy
    * @override
    */
    SpiralLayout.prototype.cloneProtected = function (copy) {
      go.Layout.prototype.cloneProtected.call(this, copy)
      copy._radius = this._radius
      copy._spacing = this._spacing
      copy._clockwise = this._clockwise
    }

    /**
    * This method actually positions all of the Nodes, assuming that the ordering of the nodes
    * is given by a single link from one node to the next.
    * This respects the {@link #spacing} property to affect the layout.
    * @this {SpiralLayout}
    * @param {Diagram|Group|Iterable} coll the collection of Parts to layout.
    */
    SpiralLayout.prototype.doLayout = function (coll) {
      if (this.network === null) {
        this.network = this.makeNetwork(coll)
      }
      this.arrangementOrigin = this.initialOrigin(this.arrangementOrigin)
      var originx = this.arrangementOrigin.x
      var originy = this.arrangementOrigin.y
      var root = null
      // find a root vertex -- one without any incoming edges
      var it = this.network.vertexes.iterator
      while (it.next()) {
        var v = it.value
        if (root === null) root = v // in case there are only circles
        if (v.sourceEdges.count === 0) {
          root = v
          break
        }
      }
      // couldn't find a root vertex
      if (root === null) {
        this.network = null
        return
      }

      var space = this.spacing
      var cw = (this.clockwise ? 1 : -1)
      var rad = this.radius
      if (rad <= 0 || isNaN(rad) || !isFinite(rad)) rad = this.diameter(root) / 4

      // treat the root node specially: it goes in the center
      // let dia = this.diameter(root)
      var angle = cw * Math.PI
      root.centerX = originx
      root.centerY = originy

      var edge = root.destinationEdges.first()
      if (edge !== null && edge.link !== null) edge.link.curviness = cw * rad

      // now locate each of the following nodes, in order, along a spiral
      var vert = (edge !== null ? edge.toVertex : null)
      while (vert !== null) {
        // involute spiral
        var cos = Math.cos(angle)
        var sin = Math.sin(angle)
        var x = rad * (cos + angle * sin)
        var y = rad * (sin - angle * cos)
        // the link might connect to a member node of a group
        if (vert.node instanceof go.Group && edge.link.toNode !== vert.node) {
          var offset = edge.link.toNode.location.copy().subtract(vert.node.location)
          x -= offset.x
          y -= offset.y
        }
        vert.centerX = x + originx
        vert.centerY = y + originy

        var nextedge = vert.destinationEdges.first()
        var nextvert = (nextedge !== null ? nextedge.toVertex : null)

        // clockwise curves want positive Link.curviness
        if (this.isRouting && nextedge !== null && nextedge.link !== null) {
          if (!isNaN(nextedge.link.curviness)) {
            var c = nextedge.link.curviness
            nextedge.link.curviness = cw * Math.abs(c)
          }
        }

        // determine next node's angle
        let dia = this.diameter(vert) / 2 + this.diameter(nextvert) / 2
        angle += cw * Math.atan((dia + space) / Math.sqrt(x * x + y * y))

        edge = nextedge
        vert = nextvert
      }

      this.updateParts()
      this.network = null
    }

    /**
    * @ignore
    * Compute the effective diameter of a Node.
    * @this {SpiralLayout}
    * @param {LayoutVertex} v
    * @return {number}
    */
    SpiralLayout.prototype.diameter = function (v) {
      if (!v) return 0
      var b = v.bounds
      return Math.sqrt(b.width * b.width + b.height * b.height)
    }

    // Public properties

    /**
    * Gets or sets the radius distance.
    * The default value is NaN.
    * @name SpiralLayout#radius
    * @function.
    * @return {number}
    */
    Object.defineProperty(SpiralLayout.prototype, 'radius', {
      get: function () { return this._radius },
      set: function (val) {
        if (typeof val !== 'number') throw new Error('new value for SpiralLayout.radius must be a number, not: ' + val)
        if (this._radius !== val) {
          this._radius = val
          this.invalidateLayout()
        }
      }
    })

    /**
    * Gets or sets the spacing between nodes.
    * The default value is 100.
    * @name SpiralLayout#spacing
    * @function.
    * @return {number}
    */
    Object.defineProperty(SpiralLayout.prototype, 'spacing', {
      get: function () { return this._spacing },
      set: function (val) {
        if (typeof val !== 'number') throw new Error('new value for SpiralLayout.spacing must be a number, not: ' + val)
        if (this._spacing !== val) {
          this._spacing = val
          this.invalidateLayout()
        }
      }
    })

    /**
    * Gets or sets whether the spiral should go clockwise or counter-clockwise.
    * The default value is true.
    * @name SpiralLayout#clockwise
    * @function.
    * @return {boolean}
    */
    Object.defineProperty(SpiralLayout.prototype, 'clockwise', {
      get: function () { return this._clockwise },
      set: function (val) {
        if (typeof val !== 'boolean') throw new Error('new value for SpiralLayout.clockwise must be a boolean, not: ' + val)
        if (this._clockwise !== val) {
          this._clockwise = val
          this.invalidateLayout()
        }
      }
    })
    // finishing pre configured library
    var self = this
    var myDiagram =
      $(go.Diagram, this.$el, // create a Diagram for the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          initialAutoScale: go.Diagram.Uniform,
          isTreePathToChildren: false, // links go from child to parent
          layout: $(SpiralLayout), // defined in SpiralLayout.js
          // allow double-click in background to create a new node
          'clickCreatingTool.archetypeNodeData': { key: 'Cambiar..', color: 'goldenrod' },
          // enable undo & redo
          'undoManager.isEnabled': true,
          'ModelChanged': function (e) { self.$emit('model-changed', e) },
          'ObjectSingleClicked': function (e) { self.$emit('object-clicked', e) },
          'ChangedSelection': function (e) { self.$emit('changed-selection', e) }

        })
    myDiagram.nodeTemplate =
        $(go.Node, go.Panel.Auto,
          { locationSpot: go.Spot.Center },
          $(go.Shape, {
            figure: 'Circle',
            fill: 'white',
            stroke: 'gray',
            strokeWidth: 1,
            portId: '',
            cursor: 'pointer', // the Shape is the port, not the whole Node
            // allow all kinds of links from and to this port
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: false,
            toLinkableDuplicates: false
          },
          new go.Binding('fill', 'color')),
          $(go.TextBlock, {
            margin: 4,
            isMultiline: true,
            editable: true
          },
          new go.Binding('text', 'key').makeTwoWay(),
          new go.Binding('color')
          ))
    myDiagram.linkTemplate =
      $(go.Link,
        { curve: go.Link.Bezier, curviness: 10 },
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' }))
    this.diagram = myDiagram
    this.diagram.model.nodeParentKeyProperty = 'next'
    this.updateModel(this.modelData)
  }
}
</script>

<style>

</style>
