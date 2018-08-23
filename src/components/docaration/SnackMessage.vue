<template>
    <v-snackbar
        v-model="mutableShow"
        :color="mutableType"
        :multi-line="mode === 'multi-line'"
        :timeout="timeout"
        :vertical="mode === 'vertical'"
    >
        {{ mutableMessage }}
        <v-btn
        dark
        flat
        @click="snackbar = false"
        >
        Cerrar
        </v-btn>
    </v-snackbar>
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: ['message', 'type', 'show'],
  data () {
    return {
      mutableShow: false,
      color: '',
      mode: '',
      timeout: 6000,
      mutableType: null,
      mutableMessage: null
    }
  },
  computed: {
    ...mapState('', {})
  },
  watch: {
    type (val) {
      this.mutableType = val
    },
    message (val) {
      this.mutableMessage = val
    },
    show (val) {
      this.mutableShow = val
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
