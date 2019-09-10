<template>
    <v-container fluid>
        <v-flex xs12 sm12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <v-text-field
              :label="label ? label : `Seleccionar Audio`"
              @click="pickFile"
              v-model="audioName"
              prepend-icon="attach_file"
            >
            </v-text-field>
             <input
              type="file"
              style="display: none"
              :ref="`image`"
              :accept="inputType? inputType : `.mp3,.m4a,audio/*`"
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
  props: ['label', 'inputType', 'folder'],
  data () {
    return {
      audioName: '',
      audioUrl: '',
      audioFile: {}
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
        this.audioName = file.name
        if (this.audioName.lastIndexOf('.') <= 0) {
          return
        }
        let fr = new FileReader()
        fr.readAsDataURL(file)
        let folder = 'audios'
        fr.addEventListener('load', () => {
          this.audioUrl = fr.result
          this.audioFile = file
          form.append('type', folder)
          form.append('file', file)
          this.save(form)
        })
      } else {
        this.audioName = ''
        this.audioUrl = ''
        this.audioFile = ''
      }
    },
    save (req) {
      let axiosIntance = axios.create({
        baseURL: enviroment[enviroment.currentEnviroment].backend.urlBase
      })
      axiosIntance.defaults.headers.common['Content-Type'] = 'application/json'
      axiosIntance.defaults.headers.common['Authorization'] = this.accessToken
      let params = new URLSearchParams()
      params.append('speech', true)
      axiosIntance.post('uploads', req, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params}).then((result) => {
        this.$emit('fileCreated', result.data)
        this.audioName = ''
        this.setShowSnack(true)
        this.setSnackMessage('Audio Cargado')
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
