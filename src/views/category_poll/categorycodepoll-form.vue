<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
      <v-flex xs12>
      <v-subheader>INGRESO DE CODIGOS A CATEGORIA</v-subheader>
      </v-flex>
      <v-spacer></v-spacer>
      <category-form @dataSubmited="createcode"></category-form>
      <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
            <v-container fluid grid-list-xl>
             <v-layout row justify-center>
            <v-flex xs2>
              <v-text-field
                  v-model="category.name"
                  label="Nuevo Código"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                  label="Descripción"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn type="submit" :disabled="!valid" small color="info">Guardar</v-btn>
            </v-flex>
          </v-layout>
          </v-container>
                </v-form>
</template>
<script>
import {validations} from './../../utils/validations'

export default {
  data: (vm) => ({
    codescategory: {
      name: '',
      removed: false
    },
    valid: false,
    rules: validations
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.codescategory)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/* .v-subheader {
        background: #6e9aeb;
        color: #ffffff;
      } */
</style>
