<template>
    <div>
      <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Categoria de Preguntas
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/question-categories-new" class="deep-orange darken-3" fab small dark>
                        <v-icon>add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <categories-table @delActor="refreshCategories" :headers="getHeaders" :elements="categories"></categories-table>
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
import CategoriesTable from './QuestionCategoriesTable'
export default {
  data: () => ({
    page: 1,
    limit: 20,
    total: 100,
    loaded: false,
    categories: []
  }),
  computed: {
    ...mapGetters('question-category', {getCategoriesFromStore: 'find'}),
    getHeaders () {
      return [
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
      return this.getCategoriesFromStore({removed: false}).data
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
      this.findCategories({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.categories = response.data
      })
    }
  },
  methods: {
    ...mapActions('question-categories', {findCategories: 'find'}),
    refreshCategories () {
      this.findCategories({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.categories = response.data
      })
    }
  },
  mounted () {
    this.findCategories({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.categories = response.data
    })
  },
  components: {CategoriesTable}
}
</script>

<style>

</style>
