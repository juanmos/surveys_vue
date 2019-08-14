<template>
    <div>
        <v-avatar
            @click="dialog = !dialog"
            :tile="false"
            :size="100"
            color="grey darken-4"
        >
            <v-icon v-if="!currentImg" large>camera_alt</v-icon>
            <v-img v-else :src="`${currentEnv}/${currentImg}`"></v-img>
        </v-avatar>
        <v-dialog v-model="dialog" max-width="600" style="background: #333">
          <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
            <h4>Cargar Imagen</h4>
          </v-flex>
          <v-card-text style="background: #333">
              <file-uploader @fileCreated="setFile" :loadImageRecord="loadImageRecord"></file-uploader>
          </v-card-text>
        </v-dialog>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import FileUploader from './../../components/FileUploader'
export default {
  props: ['url'],
  data: () => ({
    dialog: false,
    currentImg: null,
    loadImageRecord: true
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
  components: {FileUploader}
}
</script>

<style>

</style>
