<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
              <v-text-field
                  v-model="permission.module"
                  :rules="rules.nameRules"
                  label="Modulo"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>

                 <v-text-field
                  v-model="permission.description"
                  :rules="rules.nameRules"
                  label="Descripción"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
               <v-text-field
                  v-model="permission.url"
                  :rules="rules.nameRules"
                  label="URL"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>

                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
// import {mapActions, mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    permission: {
      code: '',
      description: '',
      url: '',
      removed: false
    },
    valid: false,
    rules: validations
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.permission)
      }
    }
  }

}
</script>

<style>

</style>
