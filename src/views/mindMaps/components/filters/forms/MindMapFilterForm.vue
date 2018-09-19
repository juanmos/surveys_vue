<template>
    <v-container fluid>
        <v-list subheader>
            <v-list-tile
                avatar
            >
                <v-list-tile-content>
                <v-list-tile-title >Mostrar solo constructos madre</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                <v-switch @change="broadcastData" color="lime lighten-4" v-model="showMothers"></v-switch>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      showAll: true,
      showMothers: false
    }
  },
  methods: {
    broadcastData () {
      this.$emit('formChange', {
        showMothers: this.showMothers
      })
    }
  }
//   watch: {
//     showAll (val) {
//       this.showMothers = !val
//     },
//     showMothers (val) {
//       this.showAll = !val
//     }
//   }
}
</script>

<style>

</style>
