<template>
    <v-dialog v-model="mutableDialog" persistent max-width="800px">
        <v-btn slot="activator" icon> <v-icon>add</v-icon></v-btn>
        <v-card>
        <v-card-title>
            <span class="headline">Nuevo Mapa</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <boards-form></boards-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="mutableDialog = false">Cerrar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="mutableDialog = false; create()">Guardar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

import BoardsForm from './BoardsForm'
export default {
  props: ['dialog', 'study_id'],
  data () {
    return {
      mutableDialog: null,
      requestData: {name: 'test'}
    }
  },
  methods: {
    create () {
      // method with feathers vuex to create an user
      const { Board } = this.$FeathersVuex
      const board = new Board({_study_id: this.getStudyId, ...this.requestData})
      board.save().then((result) => {
        console.log(result)
      }, (err) => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapGetters([
      'getStudyId'
    ])
  },
  watch: {
    dialog (val) {
      this.mutableDialog = val
    }
  },
  components: {BoardsForm}
}
</script>

<style>

</style>
