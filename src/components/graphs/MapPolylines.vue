<template>
  <v-card>
    <GmapMap
    ref="gmap"
    :center="center"
    :zoom="20"
    map-type-id="roadmap"
    style="width: 100%; height: 800px;"
  >
  <gmap-polyline v-bind:path.sync="markers" v-bind:options="{ strokeColor:'#000000', strokeWeight: 4}">
         </gmap-polyline>
  </GmapMap>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
const enviroment = require('./../../../config/enviroment.json')
export default {
  props: ['markers', 'gmapCenter', 'mapQuestions'],
  data: () => ({
    center: {lat: -2.897908, lng: -79.004633},
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
    markers (val) {
      if (val.length > 0) {
        this.center = val[0]
      }
    }
  },
  components: { GmapCluster }
}
</script>
