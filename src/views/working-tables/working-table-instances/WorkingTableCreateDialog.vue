<template>
    <v-dialog v-model="mutableDialog" persistent max-width="800px">
        <v-btn slot="activator" icon>
        <v-tooltip bottom>
           <v-icon  slot="activator">add</v-icon>
           <span>{{$FeathersVuex}}</span>
        </v-tooltip>
        </v-btn>
        <v-card>
        <v-card-title>
            <span class="headline">Nueva Mesa de Trabajo</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <working-table-instance-form @dataUpdated="requestData = Object.assign({}, $event)"></working-table-instance-form>
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
import {mapGetters, mapActions} from 'vuex'

import WorkingTableInstanceForm from './WorkingTableInstanceForm'
export default {
  props: ['dialog', 'study_id'],
  data () {
    return {
      mutableDialog: null,
      requestData: {}
    }
  },
  methods: {
    ...mapActions([
      'setShowSnack',
      'setSnackMessage'
    ]),
    create () {
      const { TableInstance } = this.$FeathersVuex
      const tInstance = new TableInstance({_study_id: this.getStudyId, ...this.requestData})
      tInstance.save().then((result) => {
        this.setShowSnack(true)
        this.setSnackMessage('Instancia de mesa de trabajo creada')
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
  components: {WorkingTableInstanceForm}
}
</script>

<style>

</style>
