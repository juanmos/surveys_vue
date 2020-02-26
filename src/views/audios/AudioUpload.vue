<template>
    <div>
        <v-avatar
            @click="dialog = !dialog"
            :tile="false"
            :size="256"
            color="grey darken-4"
        >
            <v-icon v-if="!currentImg" large>settings_voice</v-icon>
            <v-img v-else :src="`${currentEnv}/${currentImg}`"></v-img>
        </v-avatar>
        <v-dialog v-model="dialog" persistent max-width="600">
            <audio-uploader style="background: #000000" @fileCreated="setFile"></audio-uploader>
        </v-dialog>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import AudioUploader from './../../components/AudioUploader'
export default {
  props: ['url'],
  data: () => ({
    dialog: false,
    currentImg: null
  }),
  computed: {
    ...mapState([
      'currentEnv'
    ])
  },
  methods: {
    setFile (data) {
      this.currentImg = data.path
      this.dialog = false
      this.$emit('fileCreated', data)
    }
  },
  watch: {
    url: function (val) {
      if (val) {
        this.currentImg = val
      }
    }
  },
  components: {AudioUploader}
}
</script>

<style>

</style>
