<template>
    <v-snackbar
        :value="showSnack"
    >
        {{ snackMessage }}
        <v-btn
        dark
        flat
        @click="setShowSnack(false)"
        >
        Cerrar
        </v-btn>
    </v-snackbar>
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  props: ['message', 'type', 'show'],
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([
      'setShowSnack'
    ])
  },
  computed: {
    ...mapState([
      'showSnack',
      'snackMessage'
    ]),
    ...mapGetters([
      'getShowSnack'
    ])
  },
  watch: {
    showSnack (val) {
      if (val === true) {
        setTimeout(() => {
          this.setShowSnack(false)
        }, 3000)
      }
    }
  },
  created () {
    this.mutableMessage = this.message
    this.mutableType = this.type
    this.mutableShow = this.show
  }
}
</script>

<style>

</style>
