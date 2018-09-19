<template>
    <v-dialog v-model="mutableDialog" persistent max-width="800px">
        <v-btn slot="activator" icon>
        <v-tooltip bottom>
           <v-icon  slot="activator">filter_list</v-icon>
           <span>Filtros</span>
        </v-tooltip>
        </v-btn>
        <v-card>
        <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Filtros
          </v-card-title>
        <v-card-text>
            <v-container>
              <mind-map-filter-form @formChange="requestData = $event"></mind-map-filter-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="mutableDialog = false">Cerrar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="sendFilters(); mutableDialog = false">Aplicar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import MindMapFilterForm from './forms/MindMapFilterForm'
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
        this.setSnackMessage('Tematica Guardada')
        this.setShowSnack(true)
      }, (err) => {
        console.log(err)
      })
    },
    sendFilters () {
      this.$emit('sendFilters', this.requestData)
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
  components: {MindMapFilterForm}
}
</script>
<style scoped>
</style>
