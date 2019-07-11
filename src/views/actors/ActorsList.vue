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
                    <v-card-title>
                      <v-text-field
                              v-on:keyup="searchActorList"
                              v-model="search"
                              append-icon="search"
                              label="Buscar actor..."
                              single-line
                              hide-details
                            ></v-text-field>
                    </v-card-title>
                    <actors-table @delActor="refreshActors" :headers="getHeaders" :elements="actors"></actors-table>
                    <v-layout justify-center>
                      <v-flex xs8>
                        <v-card flat>
                          <v-card-text>
                            <v-pagination
                              v-model="page"
                              :length="getLength"
                            ></v-pagination>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
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
  data: () => ({
    page: 1,
    limit: 20,
    total: 100,
    search: '',
    loaded: false,
    actors: []
  }),
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
        {
          text: 'Tags',
          value: 'tags',
          sortable: false
        },
        {
          text: 'Nivel al mostrar',
          value: 'level',
          sortable: true
        },
        { text: 'Acciones',

          sortable: false
        }
      ]
    },
    getElements () {
      return this.getActorsFromStore({removed: false}).data
    },
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page () {
      this.findActors({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.actors = response.data
      })
    }
  },
  methods: {
    ...mapActions('actors', {findActors: 'find'}),
    refreshActors () {
      this.findActors({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.actors = response.data
      })
    },
    searchActorList () {
      this.findActors({query: {$or: [{name: {$search: this.search}}], $sort: { name: '1' }, $skip: 0, $limit: null}}).then((result) => {
        // this.limit = response.limit
        // this.total = response.total
        this.loaded = true
        this.actors = result.data
      })
    }
  },
  mounted () {
    this.findActors({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.actors = response.data
    })
  },
  components: {ActorsTable}
}
</script>

<style>

</style>
