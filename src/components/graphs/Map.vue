<template>
  <v-card>
    <GmapMap
    v-if="markers"
    ref="gmap"
    :center="gmapCenter"
    :zoom="14"
    map-type-id="roadmap"
    style="width: 100%; height: 800px;"
  >
  <GmapMarker
      :key="index + Math.random()"
      v-for="(m, index) in markers"
      :position="m.position"
      style="color:blue;"
      :clickable="true"
      :draggable="false"
      @click="openInfoWindowTemplate(m.position, m.dateStart, m.dateEnd)"
    />
  <gmap-info-window
      :options="{maxWidth: 1200}"
      :position="infoWindow.position"
      :opened="infoWindow.open"
      @closeclick="infoWindow.open=false">
      <div style="overflow: scroll-x" v-html="infoWindow.template"></div>
  </gmap-info-window>
  </GmapMap>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
const enviroment = require('./../../../config/enviroment.json')
export default {
  props: ['markers', 'gmapCenter', 'mapQuestions'],
  data: () => ({
    infoWindow: {
      position: {lat: 0, lng: 0},
      open: false,
      template: ``,
      urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase
    },
    select: [],
    filteringWords: []
  }),
  methods: {
    generateBounds () {
      return []
    },
    openInfoWindowTemplate (position, dateStart, dateEnd) {
      this.infoWindow.position = {
        lat: position.lat,
        lng: position.lng
      }
      this.infoWindow.open = true
      this.infoWindow.template = `
      <v-list class=" pl-4 pt-4 blue-grey darken-4" font-weight-bold">
      <v-list-tile>
        <b class="title">Encuesta realizada:</b>
        <p style="color:black;">
         Fecha de inicio: ${dateStart} <br />
         Fecha de fin: ${dateEnd} <br />
        </p>
      </v-list-title>
      </v-list`
    }
  },
  computed: {
    ...mapState([
      'currentPoll'
    ])
  },
  watch: {
    getMarkers (val) {
    }
  },
  monted () {
    // this.$refs.gmap.$mapCreated.then((map) => {
    //   map.fitBounds(this.generateBounds())
    // })
  }
}
</script>
