<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
               <v-flex xs2>
                    <picture-upload @fileCreated="setCurrentImg"></picture-upload>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                        v-model="actorData.name"
                        @input="setCodeField"
                        label="Nombre"
                        box
                    ></v-text-field>
                    <v-text-field
                        :disabled="true"
                        v-model="actorData.code"
                        label="Codigo"
                        box
                    ></v-text-field>
                    <v-textarea
                        v-model="actorData.description"
                        label="Descripcion"
                        box
                    ></v-textarea>
                    <v-btn @click="saveActor" :disabled="incomplete">Guardar Actor</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
import PictureUpload from './PictureUpload'
export default {
  data: (state) => ({
    currentImage: null,
    actorData: {
      name: null,
      description: null,
      image: null,
      code: null
    }
  }),
  methods: {
    setCurrentImg (data) {
      this.actorData.image = data.path
    },
    saveActor () {
      this.$emit('saveActor', Object.assign({}, this.actorData))
    },
    setCodeField (val) {
      this.actorData.code = val.toUpperCase().split(' ').join('_')
    }
  },
  computed: {
    incomplete () {
      return Object.values(this.actorData).includes(null)
    }
  },
  watch: {
  },
  components: {PictureUpload}
}
</script>

<style>

</style>
