<template>
    <v-container fluid>
        <v-flex xs12 sm12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <v-text-field
              :label="label ? label : `Seleccionar Imagen`"
              @click="pickFile"
              v-model="imageName"
              prepend-icon="attach_file"
            >
            </v-text-field>
             <input
              type="file"
              style="display: none"
              :ref="`image`"
              :accept="inputType? inputType : `image/*`"
              @change="onFilePicked"
            >
        </v-flex>
    </v-container>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import axios from 'axios'
const enviroment = require('./../../config/enviroment.json')
export default {
  props: ['label', 'inputType'],
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
          form.append('file', file)
          this.save(form)
        })
      } else {
        this.imageName = ''
        this.imageUrl = ''
        this.imageFile = ''
      }
    },
    save (req) {
      let axiosIntance = axios.create({
        baseURL: enviroment[enviroment.currentEnviroment].backend.urlBase
      })
      axiosIntance.defaults.headers.common['Content-Type'] = 'application/json'
      axiosIntance.defaults.headers.common['Authorization'] = this.accessToken
      let params = new URLSearchParams()
      if (this.inputType) params.append('spss', true)
      axiosIntance.post('uploads', req, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params}).then((result) => {
        this.$emit('fileCreated', result.data)
        this.imageName = ''
        this.setShowSnack(true)
        this.setSnackMessage(this.inputType ? 'Archivo Excel SPSS Guardado' : 'Imagen Guardada')
      }).catch((err) => {
        this.setShowSnack(true)
        this.setSnackMessage('Error al Guardar')
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState('auth', { accessToken: 'accessToken' })
  }
}
</script>

<style>

</style>
