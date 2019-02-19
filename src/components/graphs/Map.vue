<template>
<div>
  <v-flex xs12>
    <v-card dark>
      <v-combobox
        v-model="select"
        :items="mapQuestions.map(q => q.name)"
        label="Selecciona Pregunta"
        multiple
        chips
        dark
      >
        <template
          slot="selection"
          slot-scope="data"
        >
          <v-chip
            dark
            :key="JSON.stringify(data.item)"
            :selected="data.selected"
            :disabled="data.disabled"
            class="v-chip--select-multi"
            @input="data.parent.selectItem(data.item)"
          >
            <v-avatar
              dark
              class="transparent"
            >
            <img :src="mapQuestions.find(q => q.name === data.item).icon">
            </v-avatar>
            {{ data.item }}
          </v-chip>
        </template>
      </v-combobox>
    </v-card>
    </v-flex>
  <GmapMap
  v-if="markers"
  ref="gmap"
  :center="markers[0].position? markers[0].position : {} "
  :zoom="13"
  map-type-id="roadmap"
  style="width: 100%; height: 800px"
>
<GmapMarker
    :key="index + Math.random()"
    v-for="(m, index) in getMarkers"
    :position="m.position"
    :clickable="true"
    :draggable="false"
    @click="openInfoWindowTemplate(m.position, m.answer, m.personalData)"
    :icon="mapQuestions.filter(q => q.name === m.answer)[0].icon"
  />
<gmap-info-window
    :options="{maxWidth: 600}"
    :position="infoWindow.position"
    :opened="infoWindow.open"
    @closeclick="infoWindow.open=false">
    <div v-html="infoWindow.template"></div>
</gmap-info-window>
</GmapMap>
</div>
</template>

<script>
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
    items: [
      'Programming',
      'Design',
      'Vue',
      'Vuetify'
    ]
  }),
  methods: {
    generateBounds () {
      return []
    },
    openInfoWindowTemplate (position, answer, data) {
      console.log(data)
      this.infoWindow.position = {
        lat: position.lat,
        lng: position.lng
      }
      this.infoWindow.open = true
      this.infoWindow.template = `<v-card class="blue-grey darken-4 font-weight-bold"> <v-list>${data.map(d => `<v-list-tile
            avatar
          >
            <v-list-tile-action>
            </v-list-tile-action>

            <v-list-tile-content>
              ${d}
            </v-list-tile-content>
          </v-list-tile>`)}</v-list></v-card>`
    }
  },
  computed: {
    getMarkers () {
      return this.select.length > 0 ? this.markers.filter(marker => this.select.includes(marker.answer)) : this.markers
    }
  },
  monted () {
    // this.$refs.gmap.$mapCreated.then((map) => {
    //   map.fitBounds(this.generateBounds())
    // })
  }
}
</script>

<style scoped>
  .info {
    color: #000;
  }
</style>
