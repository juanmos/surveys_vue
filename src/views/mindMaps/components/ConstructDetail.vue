<template>
    <v-dialog
        v-model="mutableDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="emitClose()">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title class="text-uppercase">Detalle : {{getCurrentConstruct ? getCurrentConstruct.name : '' }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right offset-y>
              <v-btn slot="activator" dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="(item, i) in items" :key="i" >
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-tabs
              v-model="active"
              slider-color="primary"
          >
            <v-tab
              ripple
            >
              Descripcion

            </v-tab>
            <v-tab-item
            >
              <v-card flat>

              </v-card>
            </v-tab-item>
            <v-tab
              ripple
            >
              Noticias Relacionadas

            </v-tab>
            <v-tab-item
            >
              <v-card flat>

              </v-card>
            </v-tab-item>
            <v-tab
              ripple
            >
              Imagenes y Videos

            </v-tab>
            <v-tab-item
            >
              <v-card flat>

              </v-card>
            </v-tab-item>
            <v-tab
              ripple
            >
             Analisis & Conclusiones

            </v-tab>
            <v-tab-item
            >
              <v-card flat>
                descripcion
              </v-card>
            </v-tab-item>
          </v-tabs>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  props: ['dialog'],
  data () {
    return {
      mutableDialog: false,
      dialog2: false,
      dialog3: false,
      notifications: false,
      sound: true,
      widgets: false,
      active: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      items: [
        {
          title: 'Exportar Constructo'
        },
        {
          title: 'Eliminar Constructo'
        }
      ],
      select: [
        { text: 'State 1' },
        { text: 'State 2' },
        { text: 'State 3' },
        { text: 'State 4' },
        { text: 'State 5' },
        { text: 'State 6' },
        { text: 'State 7' }
      ]
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    emitClose () {
      this.$emit('closed')
    },
    next () {
      const active = parseInt(this.active)
      this.active = (active < 2 ? active + 1 : 0)
    }
  },
  computed: {
    ...mapState('boards', {loading: 'isFindPending'}),
    ...mapState([
      'currentMapId',
      'currentConstructId'
    ]),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    getBoard () {
      return this.findBoardsInStore({query: {removed: false, _id: this.currentMapId}}).data[0]
    },
    getCategories () {
      return this.getBoard ? this.getBoard.constructCategories : []
    },
    getConstructs () {
      return this.getBoard ? this.getBoard.constructs : []
    },
    getCurrentConstruct () {
      return this.getBoard ? this.getBoard.constructs.filter(construct => construct._id === this.currentConstructId)[0] : {}
    },
    ...mapState(['currentMapId'])
  },
  watch: {
    dialog (val) {
      this.mutableDialog = val
    }
  }
}
</script>

<style scoped>

</style>
