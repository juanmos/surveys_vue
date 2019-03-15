<template>
    <div>
      <draggable v-model="currentQuestions" :options="{group:'questions'}">
        <GmapMap
          class="map"
          ref="gmap"
          :center="{lat: -2.8807488, lng: -79.0347413} "
          :zoom="13"
          map-type-id="roadmap"
          :options="mapOptions"
          >
            <GmapMarker
              v-for="(m, index) in getPolygonMarkers"
              :key="index + Math.random()"
              :position="m.position"
              :clickable="true"
              :draggable="false"
              :icon="m.icon"
              @click="openInfoWindowTemplate(m.position, m.answer, m.personalData)"
            />
          <gmap-info-window
              :options="{maxWidth: 1200}"
              :position="infoWindow.position"
              :opened="infoWindow.open"
              @closeclick="infoWindow.open=false">
              <div v-html="infoWindow.template" style="overflow: scroll-x" ></div>
          </gmap-info-window>
        </GmapMap>
      </draggable>
      <v-flex class="mt-5 panel" xs10 offset-xs1>
        <v-card dark>
          <v-card-title class="headline">Tomas de datos:   <v-spacer></v-spacer>
                  <v-chip @click="currentQuestions = []" v-if="currentQuestions.length > 0">
                    {{currentQuestions[0].label}}
                  </v-chip>
                  </v-card-title>
            <v-layout row>
                 <div v-for="take in getProjectTakes" :key="take._id" :style="{'border-right': 'solid 1px'}">
                    <v-btn :color="currentTake._id === take._id ? 'red': 'black'" @click="setCurrentTake(take)" >{{take.name}}</v-btn>
                  </div>
                  <v-chip>No. Encuestas: <b>{{getPollSize}}</b></v-chip>
            </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if="questionsExpanded" class="mt-2 panel" xs12 sm2 md2  offset-xs1>
        <v-card class="questions" dark color="primary">
          <v-card-title
            primary class="title">
              Preguntas
            <v-spacer></v-spacer>
            <v-btn @click="questionsExpanded = false" icon><v-icon>expand_less</v-icon></v-btn>
          </v-card-title>
          <draggable class="mb-2" v-model="questions" :options="{group:'questions'}">
              <template v-for="item in questions">
                  <v-flex :key="item.original">
                      <v-card class="mr-2 ml-2 mb-2 mt-2 mb-2" dark :color="`black`">
                          <v-card-title>{{item.label}}</v-card-title>
                      </v-card>
                  </v-flex>
              </template>
          </draggable>
        </v-card>
      </v-flex>
      <v-flex v-else class="mt-2 panel" xs12 sm2 md2  offset-xs1>
        <v-btn class="elevation-5" @click="questionsExpanded = true"  icon>
          <v-icon  x-large color="red">arrow_drop_down_circle</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="questionsExpanded" class="mt-2 panel" xs12 sm4 md4  offset-xs1>
        <v-card dark v-if="getCurrentOptions.length > 0" class="options">
          <v-layout justify-center align-center row>
            <v-combobox
              v-model="select"
              :items=" getCurrentOptions.map(q => q.name)"
              label="Seleccione Opcion (Global)"
              multiple
              chips
              dark
              class="ml-4"
              persistent-hint
            >
              <template
                slot="selection"
                slot-scope="data"
              >
                <v-chip
                  dark
                  :key="JSON.stringify(data.item) + Math.random()"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  class="v-chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                >
                  <v-avatar
                    dark
                    class="transparent"
                  >
                  <img :src="getCurrentOptions.find(q => q.name === data.item) ? getCurrentOptions.find(q => q.name === data.item).icon : ''">
                  </v-avatar>
                  {{ data.item }} - <div class="title font-weight-bold" v-if="getCurrentOptionValues.length > 0" v-html="getCurrentOptionValues.find(v => v.label === data.item).percentage"></div>
                </v-chip>
              </template>
            </v-combobox>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if="questionsExpanded && polygon" class="mt-2 panel" xs12 sm4 md4  offset-xs1>
        <v-card dark v-if="getPolygonOptions.length > 0" class="options">
          <v-layout justify-center align-center row>
            <v-flex xs6>
              <span class="subheading">Opciones dentro de Poligono</span>
              <v-chip v-for="polygon in getPolygonOptions" :key="polygon">
                  {{polygon.name}} - <span  class="title font-weight-bold">{{Math.round(polygon.polygonResult * 100) / 100}} %</span>
              </v-chip>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-btn
          @click="getMapObject"
          absolute
          dark
          fab
          bottom
          right
          :color="selectionMode ? 'red' : 'black'"
          class="mb-5 ml-4"
          >
          <v-icon>change_history</v-icon>
        </v-btn>
      <v-btn
        absolute
        dark
        fab
        top
        right
        class="mt-5"
        v-if="selectionMode"
        color="blue"
        @click="resetAll"
        >
        <v-icon>update</v-icon>
      </v-btn>
      <v-navigation-drawer
        temporary
        right
        :value="asideOpened"
        fixed
        app
        width="400"
        dark
      >
      <v-card flat>
        <v-toolbar>
          <span class="title">Configuracion de mapa</span>
        </v-toolbar>
        <v-list subheader>
          <v-subheader>Componentes de mapa</v-subheader>
          <v-list-tile v-for="item in optionItems" :key="item.label">
            <v-list-tile-content>
              <v-list-tile-title>{{item.label}}</v-list-tile-title>
            </v-list-tile-content>
             <v-list-tile-action>
              <v-switch
                @change="setConfigValue($event, item.field)"
                color="red"
                :value="true"
              ></v-switch>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
           <v-btn>Resetear configuracion</v-btn>
          </v-list-tile-content>
        </v-list-tile>
      </v-card>
    </v-navigation-drawer>

    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions, mapState } from 'vuex'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import enviroment from './../../config/enviroment'
import icons from './../views/reports-creator/icons'

export default {
  props: ['id'],
  data: () => ({
    currentProject: {},
    currentTake: {},
    questions: [],
    currentQuestions: [],
    urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase,
    select: [],
    icons,
    questionsExpanded: true,
    infoWindow: {
      position: {lat: 0, lng: 0},
      open: false,
      template: ``,
      urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase
    },
    mapOptions: {
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: false,
      styles: [
        {
          featureType: 'poi',
          stylers: [{visibility: 'off'}]
        }
      ]
    },
    mapselector: false,
    polygon: null,
    selectionMode: false,
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' }
    ],
    rightDrawer: true,
    right: true,
    optionItems: [
      {
        label: 'Agrupar Marcadores',
        field: 'cluster'
      },
      {
        label: 'Habilitar Poligonos',
        field: 'drawingMode'
      }
    ]
  }),
  computed: {
    getProjectTakes () {
      return this.currentProject.pollTakes
    },
    getKeySelected () {
      return this.currentQuestions.length > 0 ? this.currentQuestions[0].code : null
    },
    getTakeValues () {
      return this.currentTake.originalJson ? this.currentTake.originalJson.slice(1, this.currentTake.originalJson.length) : []
    },
    getCurrentOptions () {
      return this.currentQuestions.length > 0 ? this.currentQuestions[0].options.map(q => ({
        name: q,
        value: 1,
        percentage: 1,
        icon: this.getRandomIcon()
      })) : []
    },
    getPolygonOptions () {
      return this.getCurrentOptions ? this.getCurrentOptions.map(opt => ({
        ...opt,
        polygonResult: this.polygon ? ((this.getPolygonMarkers.filter(p => p.answer === opt.name).length * 100) / this.getPolygonMarkers.length).toFixed(2) : 0
      })) : []
    },
    getCurrentOptionValues () {
      return this.currentQuestions.length > 0 ? this.currentQuestions[0].optionValues : []
    },
    getMarkers () {
      return this.currentQuestions.length > 0 ? this.getTakeValues.map(take => ({
        answer: take[this.getKeySelected],
        position: {
          lat: Number(take['latLong'].lat),
          lng: Number(take['latLong'].lng)
        },
        polygon: new window.google.maps.LatLng(Number(take['latLong'].lat), Number(take['latLong'].lng)),
        icon: this.getCurrentOptions.find(opt => opt.name === take[this.getKeySelected]) ? this.getCurrentOptions.find(opt => opt.name === take[this.getKeySelected]).icon : ''
      })) : []
    },
    getFilteredMarkers () {
      return this.select.length > 0 ? this.getMarkers.filter(marker => this.select.includes(marker.answer)) : this.getMarkers
    },
    getPolygonMarkers () {
      return this.polygon ? this.getFilteredMarkers
        .filter(marker => (window.google.maps.geometry.poly.containsLocation(marker.polygon, this.polygon))) : this.getFilteredMarkers
    },
    getPollSize () {
      return this.getTakeValues.length
    },
    ...mapState([
      'asideOpened'
    ])
  },
  methods: {
    ...mapActions('polls-project', {getProject: 'get'}),
    ...mapActions('config-polls', {getPoll: 'get'}),
    ...mapActions([
      'setAsideOpened'
    ]),
    setCurrentTake (take) {
      this.currentTake = Object.assign({}, take)
    },
    getRandomIcon () {
      return `${this.urlEnviroment}/images/map-icons/${this.icons[Math.floor((Math.random() * 19) + 1)]}`
    },
    openInfoWindowTemplate (position, answer, data) {
      console.log(data)
      this.infoWindow.position = {
        lat: position.lat,
        lng: position.lng
      }
      this.infoWindow.open = true
      this.infoWindow.template = `
      <v-list class=" pl-4 pt-4" font-weight-bold">
      <v-list-tile>
        <b class="title">${answer}</b>
      </v-list-title>
      </v-list>`
    },
    getMapObject () {
      this.selectionMode = !this.selectionMode
      this.setAsideOpened(!this.asideOpened)
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: ['polygon']
        },
        polygonOptions: {
          fillColor: '000',
          fillOpacity: 0.1,
          strokeColor: '#f44336',
          strokeWeight: 4,
          editable: true
        }
      })
      drawingManager.setMap(this.$refs['gmap'].$mapObject)
      window.google.maps.event.addListener(drawingManager, 'overlaycomplete', event => {
        console.log(event)
        if (this.polygon) {
          this.polygon.setMap(null)
        }
        drawingManager.setDrawingMode(null)
        // creating a new editable polygon
        this.polygon = event.overlay
        this.polygon.setEditable(true)
        console.log('este es el resultado de polygons', this.getPolygonMarkers)
      })
    },
    resetAll () {
      this.selectionMode = false
      this.polygon = null
    },
    setConfigValue (event, item) {
      console.log(event, item)
    }
  },
  watch: {
    currentTake (val) {
      console.log('ha sido cambiada', val)
      this.questions = val ? val.formatedConfiguration.slice().filter(q => q.category === 'Intencion') : {}
    },
    currentQuestions (question) {
      let bounds = new window.google.maps.LatLngBounds()
      this.getMarkers.forEach(marker => {
        let loc = new window.google.maps.LatLng(marker.polygon.lat(), marker.polygon.lng())
        bounds.extend(loc)
      })
      this.$refs['gmap'].fitBounds(bounds)
      this.$refs['gmap'].panToBounds(bounds)
      this.$refs['gmap'].$emit('g-fitBounds', bounds)
    }
  },
  mounted () {
    this.getProject(this.id).then(result => {
      this.currentProject = Object.assign({}, result)
      console.log('este es el current project', this.currentProject)
    })

    console.log('el mapa', GmapCluster)
  },
  components: { draggable, GmapCluster }
}
</script>

<style>
    html, body {
      height: 100% !important;
      width: 100% !important;
    }
    .map {
      width: 100%;
      height: 100%;
      position:absolute;
      top: 0;
      left: 0;
      z-index: 0; /* Set z-index to 0 as it will be on a layer below the contact form */
    }
    .takes {
      overflow-x: scroll;
    }
    .panel {
      opacity: 0.8;
    }
    div[title="Stop drawing"] {
      content: url(https://cdn2.iconfinder.com/data/icons/font-awesome/1792/hand-stop-o-512.png) !important;
      height: 50px;
      width: 50px;
      cursor: pointer;
      margin: 2px;
    }
    div[title="Draw a shape"] {
      content: url(https://cdn2.iconfinder.com/data/icons/miscellaneous-12/24/miscellaneous-41-512.png) !important;
      height: 50px;
      width: 50px;
      cursor: pointer;
      margin: 2px;
    }
</style>
