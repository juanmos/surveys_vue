<template>
    <GmapMap
      class="map"
      ref="gmap"
      :center="{lat: -2.8807488, lng: -79.0347413} "
      :zoom="13"
      map-type-id="roadmap"
      >

    </GmapMap>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
  }),
  computed: {
  },
  methods: {
    ...mapActions('polls-project', {getProject: 'get'})
  },
  props: ['id'],
  mounted () {
    this.getProject(this.id).then(result => {
      console.log('this is my project', result)
    })
  }
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
    }
</style>
