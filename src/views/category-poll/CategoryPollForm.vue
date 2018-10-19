<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
      <v-subheader>INGRESO DE CATEGORIA</v-subheader>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
            <v-container fluid grid-list-xl>
             <v-layout row justify-left>
            <v-flex xs6>
              <v-text-field
                  v-model="category.name"
                  :rules="rules.nameRules"
                  label="Descipción de la Categoría"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <input type="checkbox" id="checkbox" v-model="category._contains_codegeneral">
              <label for="checkbox">      Contiene Códigos Generales     <v-icon color="blue" title="La categoría siempre va a tener los códigos generales" small>info</v-icon></label>
            </v-flex>
          </v-layout>
          </v-container>
          <v-btn type="submit" :disabled="!valid" small color="info">Guardar Categoría</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    category: {
      name: '',
      removed: false,
      _contains_codegeneral: false
    },
    valid: false,
    rules: validations
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.category)
      }
    }
  }
}
</script>

<style>

</style>
