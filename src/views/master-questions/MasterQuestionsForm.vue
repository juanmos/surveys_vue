<template>
   <v-form>
       <v-container>
           <v-layout xs10 offset-xs1>
                <v-flex xs7>
                    <v-text-field
                        v-model="currentQuestion.name"
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
    currentQuestion: {
      name: null
    }
  }),
  methods: {
    ...mapActions('actor-categories', { findCategories: 'find' }),
    saveActor () {
      this.$emit('saveActor', Object.assign({}, this.currentQuestion))
    }
  },
  computed: {},
  mounted () {},
  watch: {},
  components: {}
}
</script>

<style>

</style>
