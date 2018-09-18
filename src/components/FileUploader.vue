<template>
    <v-container fluid>
        <v-flex xs12 sm12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <v-text-field
              label="Seleccionar Imagen"
              @click="pickFile"
              v-model="imageName"
              prepend-icon="attach_file"
            >
            </v-text-field>
             <input
              type="file"
              style="display: none"
              :ref="`image`"
              accept="image/*"
              @change="onFilePicked"
            >
        </v-flex>
    </v-container>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      imageName: '',
      imageUrl: '',
      imageFile: {}
    }
  },
  methods: {
    ...mapActions([
      'setShowSnack',
      'setSnackMessage'
    ]),
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      let file = e.target.files[0]
      let form = new FormData()
      if (file) {
        this.imageName = file.name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = file
          form.append('type', 'construct')
          form.append('file', this.imageFile)
          this.save(form)
        })
      } else {
        this.imageName = ''
        this.imageUrl = ''
        this.imageFile = ''
      }
    },
    save (req) {
      const {Upload} = this.$FeathersVuex
      const upload = new Upload(req)
      upload.save({headers: {
        'content-type': 'multipart/form-data'
      }}).then((result) => {
        console.log('guardado', result)
      })
    }
  }
}
</script>

<style>

</style>
