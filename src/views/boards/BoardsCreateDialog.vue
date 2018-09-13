<template>
    <v-dialog v-model="mutableDialog" persistent max-width="800px">
        <v-btn slot="activator" icon>
        <v-tooltip bottom>
           <v-icon  slot="activator">add</v-icon>
           <span>Crear Tematica</span>
        </v-tooltip>
        </v-btn>
        <v-card>
        <v-card-title>
            <span class="headline">Nuevo Mapa</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <boards-form @dataUpdated="requestData = Object.assign({}, $event)"></boards-form>
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
      requestData: {}
    }
  },
  methods: {
    create () {
      // method with feathers vuex to create an user
      const { Board } = this.$FeathersVuex
      const board = new Board({_study_id: this.getStudyId, ...this.requestData})
      board.nodeDataArray = [
        {
          id: '',
          loc: '0 0',
          text: this.requestData.name,
          parent: '',
          points: [],
          description: 'Contructo Principal',
          main: true,
          mother: false,
          color: '#B2DFDB'
        }
      ]
      board.save().then((result) => {
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
