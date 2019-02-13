<template>
<div>
  <v-card>
  </v-card>
  <GmapMap
  ref="gmap"
  :center="markers[0].position"
  :zoom="13"
  map-type-id="roadmap"
  style="width: 100%; height: 1200px"
>
<GmapMarker
    :key="index + Math.random()"
    v-for="(m, index) in markers"
    :position="m.position"
    :clickable="true"
    :draggable="false"
    @click="openInfoWindowTemplate(m.position, m.answer)"
  />
<gmap-info-window
    :options="{maxWidth: 600}"
    :position="infoWindow.position"
    :opened="infoWindow.open"
    @closeclick="infoWindow.open=false">
    <v-card dark>
      <h4 class="indigo">{{infoWindow.template}}</h4>
    </v-card>
</gmap-info-window>
</GmapMap>
</div>
</template>

<script>
export default {
  props: ['markers'],
  data: () => ({
    infoWindow: {
      position: {lat: 0, lng: 0},
      open: false,
      template: ``
    }
  }),
  methods: {
    generateBounds () {
      return []
    },
    openInfoWindowTemplate (position, answer) {
      console.log(position)
      this.infoWindow.position = {
        lat: position.lat,
        lng: position.lng
      }
      this.infoWindow.open = true
      this.infoWindow.template = answer
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
