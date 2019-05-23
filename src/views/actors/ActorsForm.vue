<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
               <v-flex xs2>
                    <picture-upload @fileCreated="setCurrentImg" :url="currentImage"></picture-upload>
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
                    <v-combobox
                        v-model="actorData.actor_type"
                        :items="actorTypes"
                        label="Seleccione el Tipo de Actor"
                        box
                      ></v-combobox>
                    <v-combobox
                        v-model="actorData.actorCategories"
                        :items="categories"
                        label="Seleccione Categoria"
                        multiple
                        box
                    ></v-combobox>
                    <v-text-field
                        v-model="categoryInput"
                        @keyup.enter="addTag"
                        @keyup.space="addTag"
                        label="Agregar Tag"
                        box
                        color="blue-grey lighten-2"
                      ></v-text-field>
                      <v-layout row>
                        <v-chip dark v-for="(tag, index) in actorData.tags" :key="tag"><span class="font-weight-bold" @click="deleteTag(index)">#{{tag}}</span></v-chip>
                      </v-layout>
                      <v-layout row>
                        <v-switch
                          color="primary"
                          v-model="actorData.international"
                          :label="`Internacional`"
                        ></v-switch>
                        <v-switch
                          color="primary"
                          v-model="actorData.national"
                          :label="`Nacional`"
                        ></v-switch>
                        <v-switch
                          color="primary"
                          v-model="actorData.local"
                          :label="`Local`"
                        ></v-switch>
                      </v-layout>
                    <v-btn @click="saveActor" :disabled="incomplete">Guardar Actor</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PictureUpload from './PictureUpload'
export default {
  props: ['actor'],
  data: (state) => ({
    currentImage: null,
    actorData: {
      name: null,
      description: null,
      image: null,
      code: null,
      tags: [],
      local: false,
      international: false,
      national: false
    },
    categoryInput: '',
    actorTypes: [
      'PERSONA',
      'SUCESO',
      'ELEMENTO'
    ],
    categories: []
  }),
  methods: {
    ...mapActions('actor-categories', { findCategories: 'find' }),
    setCurrentImg (data) {
      this.actorData.image = data.path
    },
    saveActor () {
      this.$emit('saveActor', Object.assign({}, this.actorData))
    },
    setCodeField (val) {
      let str = val.toUpperCase().split(' ').join('_')
      this.actorData.code = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    addTag () {
      this.actorData.tags.push(this.categoryInput)
      this.categoryInput = ''
    },
    deleteTag (index) {
      this.actorData.tags.splice(index, 1)
    }
  },
  computed: {
    ...mapState([
      'currentEnv'
    ]),
    incomplete () {
      let {national, international, local, ...rest} = this.actorData
      return Object.values(rest).includes(null)
    }
  },
  mounted () {
    this.findCategories({ query: {removed: false} }).then(response => {
      this.categories = response.data
    })
  },
  watch: {
    actor: function (val) {
      if (val) {
        this.currentImage = val.image
        this.actorData = val
      }
    }
  },
  components: {PictureUpload}
}
</script>

<style>

</style>
