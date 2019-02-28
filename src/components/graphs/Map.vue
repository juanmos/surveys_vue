<template>
<div>
  <v-flex xs12>
    <v-card dark>
      {{filteringWords}}
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
            <img :src="mapQuestions.find(q => q.name === data.item).icon">
            </v-avatar>
            {{ data.item }}
          </v-chip>
        </template>
      </v-combobox>
      <v-layout xs12 md4>
          <v-combobox
            v-for="segment in currentPoll.segmentationFields"
            :key="segment.code + Math.random()"
            :items="segment.options"
            :label="`${segment.label}`"
            @change="setFilter($event)"
            >
          </v-combobox>
      </v-layout>
      <v-layout row wrap>
            <v-chip  v-for="word in filteringWords" @click="setFilter(word)" :key="word">
              {{word}}
            </v-chip>
      </v-layout>
    </v-card>
    </v-flex>
  <GmapMap
  v-if="markers"
  ref="gmap"
  :center="markers[0]? markers[0].position : {} "
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
    :options="{maxWidth: 1200}"
    :position="infoWindow.position"
    :opened="infoWindow.open"
    @closeclick="infoWindow.open=false">
    <div v-html="infoWindow.template"></div>
</gmap-info-window>
</GmapMap>
</div>
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
      console.log(data)
      this.infoWindow.position = {
        lat: position.lat,
        lng: position.lng
      }
      this.infoWindow.open = true
      this.infoWindow.template = `
      <v-list class=" pl-4 pt-4 blue-grey darken-4" font-weight-bold">
      <v-list-tile>
        <b class="title">${answer}</b>
      </v-list-title>
      ${data.map(d => `<v-list-tile
            avatar
          >
            <v-list-tile-action>
            </v-list-tile-action>

            <v-list-tile-content>
             ${d}
            </v-list-tile-content>
          </v-list-tile>`)}</v-list`
    },
    setFilter (value) {
      if (value) {
        if (this.filteringWords.includes(value)) {
          this.filteringWords = this.filteringWords.filter(f => f !== value)
        } else {
          this.filteringWords.push(value)
        }
      }
    }
  },
  computed: {
    ...mapState([
      'currentPoll'
    ]),
    getMarkers () {
      let result = this.select.length > 0 ? this.markers.filter(marker => this.select.includes(marker.answer)) : this.markers
      if (this.filteringWords.length === 0) {
        return result
      } else {
        return result.filter(marker => {
          return marker.personalData.some(personal => {
            return this.filteringWords.includes(personal)
          })
        })
      }
    }
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
