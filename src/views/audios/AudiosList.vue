<template>
    <div>
      <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Audios
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/audios-new" class="deep-orange darken-3" fab small dark>
                        <v-icon>add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-title>
                      <v-text-field
                              v-model="search"
                              @keyup.enter="searchActorList"
                              @keyup.space="searchActorList"
                              append-icon="search"
                              label="Buscar audio..."
                              single-line
                              hide-details
                            ></v-text-field>
                    </v-card-title>
                    <audios-table @delActor="refreshaudios" :headers="getHeaders" :elements="audios"></audios-table>
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
import AudiosTable from './AudiosTable'
export default {
  data: () => ({
    page: 1,
    limit: 20,
    total: 100,
    search: '',
    loaded: false,
    audios: []
  }),
  computed: {
    ...mapGetters('audios', {getAudiosFromStore: 'find'}),
    getHeaders () {
      return [
        {
          text: 'Audio',
          value: '',
          sortable: false
        },
        {
          text: 'Nombre',
          value: 'name',
          sortable: true
        },
        {
          text: 'Descripcion',
          value: 'description',
          sortable: false
        },
        {
          text: 'Estado',
          value: 'textReady',
          sortable: true
        },
        { text: 'Acciones',
          sortable: false
        }
      ]
    },
    getElements () {
      return this.getAudiosFromStore({removed: false}).data
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
      this.findAudios({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.audios = response.data
      })
    },
    search: function (val) {}
  },
  methods: {
    ...mapActions('audios', {findAudios: 'find'}),
    refreshaudios () {
      this.findAudios({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.audios = response.data
      })
    },
    searchActorList () {
      this.findAudios({query: {$or: [{name: {$search: this.search}}], $sort: { name: '1' }, removed: false, $skip: 0, $limit: null}}).then((result) => {
        // this.limit = response.limit
        // this.total = response.total
        this.loaded = true
        this.audios = result.data
      })
    }
  },
  mounted () {
    this.findAudios({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.audios = response.data
    })
  },
  components: {AudiosTable}
}
</script>

<style>

</style>
