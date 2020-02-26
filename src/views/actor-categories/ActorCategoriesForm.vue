<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
                <v-flex xs7>
                    <v-text-field
                        v-model="actorData.name"
                        label="Nombre"
                        box
                    ></v-text-field>
                    <v-btn @click="saveActor">Guardar</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data: (state) => ({
    currentImage: null,
    actorData: {
      name: null
    }
  }),
  methods: {
    ...mapActions('actor-categories', { findCategories: 'find' }),
    saveActor () {
      this.$emit('saveActor', Object.assign({}, this.actorData))
    }
  },
  computed: {
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
  },
  components: {}
}
</script>

<style>

</style>
