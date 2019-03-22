<template>
    <div>
      <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Actores
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/actors-new" class="deep-orange darken-3" fab small dark>
                        <v-icon>add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <actors-table :headers="getHeaders" :elements="getElements"></actors-table>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import ActorsTable from './ActorsTable'
export default {
  computed: {
    ...mapGetters('actors', {getActorsFromStore: 'find'}),
    getHeaders () {
      return [
        {
          text: '',
          align: 'left',
          sortable: false,
          value: 'avatar'
        },
        {
          text: 'Nombre',
          value: 'name',
          sortable: true
        },
        {
          text: 'Descripcion',
          value: 'description',
          sortable: true
        },
        { text: 'Acciones',

          sortable: false
        }
      ]
    },
    getElements () {
      return this.getActorsFromStore({removed: false}).data
    }
  },
  methods: {
    ...mapActions('actors', {findActors: 'find'})
  },
  mounted () {
    this.findActors({removed: false}).then(result => {
      console.log('este es el result de actores', result)
    }).catch(err => {
      console.log('este es el error', err)
    })
  },
  components: {ActorsTable}
}
</script>

<style>

</style>
