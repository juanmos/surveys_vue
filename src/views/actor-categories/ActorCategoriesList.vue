<template>
    <div>
      <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Categorías de actores
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/actor-categories-new" class="deep-orange darken-3" fab small dark>
                        <v-icon>add</v-icon>
                        </v-btn>
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
    loaded: false,
    actors: []
  }),
  computed: {
    ...mapGetters('actor-categories', {getActorsFromStore: 'find'}),
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
      this.findActorCategories({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.actors = response.data
      })
    }
  },
  methods: {
    ...mapActions('actor-categories', {findActorCategories: 'find'}),
    refreshActors () {
      this.findActorCategories({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.actors = response.data
      })
    }
  },
  mounted () {
    this.findActorCategories({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
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
