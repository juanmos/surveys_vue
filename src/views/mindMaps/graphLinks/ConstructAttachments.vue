<template>
  <v-layout>
    <v-flex xs12 sm12>
      <file-uploader @fileCreated="addFile"></file-uploader>
      <v-card flat>
        <v-container grid-list-sm fluid>
          <v-layout row wrap>
            <v-flex
              v-for="image in getCurrentImages"
              :key="image._id"
              xs4
              d-flex
            >
              <v-card tile class="d-flex image-card">
                <v-img
                  :src="`http://localhost:3033/${image.path}`"
                  :lazy-src="`http://localhost:3033/${image.path}`"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <v-layout
                    slot="placeholder"
                    fill-height
                    align-center
                    justify-center
                    ma-0
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-layout>
                  <v-layout>
                    <v-card-title class="image-name" primary-title>
                        <v-edit-dialog
                            lazy
                            @save="edit(image.name, image, 'name')"
                          > <span class="display-1 blue-grey--text text--darken-1">{{ image.name }}</span>
                            <v-text-field
                              slot="input"
                              v-model="image.name"
                              label="Editar Nombre"
                              single-line
                              counter
                            ></v-text-field>
                          </v-edit-dialog>
                        <v-spacer></v-spacer>
                        <v-tooltip class="delete-icon" bottom>
                          <v-icon @click="edit(true, image, 'removed')" slot="activator" color="blue-grey-darken-1">cancel</v-icon>
                          <span>Eliminar {{image.name}}</span>
                        </v-tooltip>
                    </v-card-title>
                  </v-layout>
                </v-img>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex'
import FileUploader from './../../../components/FileUploader'
export default {
  data: () => ({
    show: false
  }),
  methods: {
    ...mapActions('construct-images', {findConstructImages: 'find'}),
    ...mapActions([
      'setShowSnack',
      'setSnackMessage'
    ]),
    addFile (data) {
      const {ConstructImage} = this.$FeathersVuex
      let constructImage = new ConstructImage({
        path: data.path,
        name: data.filename,
        _construct_id: this.currentConstruct
      })
      constructImage.save().then((res) => {
        console.log('este es el result', res)
      })
    },
    edit (value, image, field) {
      const {ConstructImage} = this.$FeathersVuex
      let constructImage = new ConstructImage(image)
      constructImage[field] = value
      constructImage.save().then((res) => {
        this.setSnackMessage('Imagen Editada')
        this.setShowSnack(true)
      })
    }
  },
  computed: {
    ...mapGetters('construct-images', {findImagesInStore: 'find'}),
    ...mapState([
      'currentConstruct'
    ]),
    getCurrentImages () {
      return this.findImagesInStore({query: {removed: false, _construct_id: this.currentConstruct._id}}).data
    }
  },
  created () {
    this.findConstructImages({query: {removed: false}})
  },
  components: { FileUploader }
}
</script>

<style scoped>
  .image-name {
    opacity: 0
  }
  .image-card:hover .image-name {
    opacity: 1
  }

</style>
