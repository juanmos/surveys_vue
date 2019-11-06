<template>
  <v-card>
    <GmapMap
    v-if="markers"
    ref="gmap"
    :center="{lat:18.473521, lng:-69.926882}"
    :zoom="13"
    map-type-id="roadmap"
    style="width: 100%; height: 800px;"
  >
  <GmapMarker
      :key="index + Math.random()"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      @click="openInfoWindowTemplate(m.position, m.answer, m.personalData)"
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
  props: ['markers', 'mapQuestions'],
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
    openInfoWindowTemplate (position, answer, data) {
      this.infoWindow.position = {
        lat: position.lat,
        lng: position.lng
      }
      this.infoWindow.open = true
      this.infoWindow.template = `
      <v-list class=" pl-4 pt-4 blue-grey darken-4" font-weight-bold">
      <v-list-tile>
        <b class="title">${answer}</b>
        <p style="color:black;">
         Mas informacion deprueba ${data}
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
