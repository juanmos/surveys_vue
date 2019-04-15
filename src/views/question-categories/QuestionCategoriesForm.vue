<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
                <v-flex xs12>
                    <v-text-field
                        v-model="categoryData.name"
                        label="Nombre"
                        box
                        @input="setCode"
                    ></v-text-field>
                    <v-text-field
                        v-model="categoryData.code"
                        label="Codigo"
                        :disabled="true"
                        box
                    ></v-text-field>
                    <v-textarea
                        v-model="categoryData.description"
                        label="Descripcion"
                        box
                    ></v-textarea>
                    <v-btn @click="saveCategory" :disabled="incomplete">Guardar Categoria</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
export default {
  data: (state) => ({
    currentImage: null,
    categoryData: {
      name: null,
      code: null,
      description: null
    },
    categoryInput: ''
  }),
  methods: {
    saveCategory () {
      this.$emit('saveCategory', Object.assign({}, this.categoryData))
    },
    setCode () {
      this.categoryData.code = this.categoryData.name.toUpperCase().split(' ').join('_')
    }
  },
  computed: {
    incomplete () {
      return Object.values(this.categoryData).includes(null)
    }
  },
  components: {}
}
</script>

<style>

</style>
