<template>
    <div>
        <v-avatar
            @click="dialog = !dialog"
            :tile="false"
            :size="256"
            color="grey darken-4"
        >
            <v-icon v-if="!currentImg" large>camera_alt</v-icon>
            <v-img v-else :src="`${currentEnv}/${currentImg}`"></v-img>
        </v-avatar>
        <v-dialog v-model="dialog" persistent max-width="600">
            <file-uploader @fileCreated="setFile"></file-uploader>
        </v-dialog>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import FileUploader from './../../components/FileUploader'
export default {
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
  components: {FileUploader}
}
</script>

<style>

</style>
