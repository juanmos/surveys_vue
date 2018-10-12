<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Categorias</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getCategories"
                  :small="small"
                  hide-actions
                  item-key="name"
                  striped hover
                  outlined
                  bordered
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="text-xs-center">
                        <v-edit-dialog
                          :return-value.sync="props.item.name"
                          lazy
                          @save="edit(props.item.name, props.item, 'name')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.name }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.name"
                            label="Editar Nombre"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <!-- <td class="text-xs-left">
                        <v-edit-dialog
                          :return-value.sync="props.item.type"
                          lazy
                          @save="edit(props.item.type, props.item, 'type')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.type }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.type"
                            label="Editar Tipo"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                        </td>ddddd  -->
                      <td class="justify-center layout px-0">
                        <v-menu
                          bottom
                          transition="slide-y-transition"
                        >
                          <v-btn
                            slot="activator"
                            color="primary"
                            flat
                            icon
                          >
                          <v-icon>more_vert</v-icon>
                          </v-btn>
                          <v-list>
                            <v-list-tile>
                              <v-list-tile-title>Añadir Códigos</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                          <v-dialog
                          v-model="dialog"
                          max-width="380"
                          max-heigth="500"
                        >
                          <v-card>
                            <v-card-title class="headline">Está seguro que desea eliminar la Categoría: {{ props.item.name }}</v-card-title>

                            <v-card-text>
                              Si elimina la Categoría los códigos también serán eliminados
                            </v-card-text>

                            <v-card-actions>
                              <v-spacer></v-spacer>

                              <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="dialog = false"
                              >
                                NO
                              </v-btn>

                              <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="dialog = false, del(props.item)"
                              >
                                SI
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        </v-menu>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
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
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
                @click="goToNew()"
                >
                    <v-icon>add</v-icon>
                </v-btn>
                <loading-component v-if="loading
                "></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        /* { text: 'Tipo',
          value: 'type',
          sortable: false
        }, */
        {
          text: 'Acciones',
          align: 'center',
          value: 'name',
          sortable: false
        }
      ],
      categories: [],
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      loaded: false,
      clients: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('category-poll', { findCategory: 'find' }),
    goToNew () {
      this.$router.push('/new-categorypoll')
    },
    edit (val, elem, field) {
      const {CategoryPoll} = this.$FeathersVuex
      const CategoryPollF = new CategoryPoll(elem)
      CategoryPollF[field] = val
      CategoryPollF.patch().then((result) => {
        this.findCategory({ query: {removed: false} }).then(response => {
          const categoriesR = response.data || response
          console.log(categoriesR)
        })
      })
    },
    del (element) {
      const {CategoryPoll} = this.$FeathersVuex
      const CategoryPollF = new CategoryPoll(element)
      CategoryPollF.removed = true
      CategoryPollF.patch().then((result) => {
        this.findCategory({ query: {removed: false} }).then(response => {
          const categoriesR = response.data || response
          console.log(categoriesR)
        })
      })
    },
    save (val) {
      console.log(val)
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close (val) {
      console.log('Dialog closed', val)
    }
  },
  computed: {
    ...mapState('category-poll', {loading: 'isFindPending'}),
    ...mapState('category-poll', { paginationVal: 'pagination' }),
    ...mapGetters('category-poll', {findCategoriesInStore: 'find'}),
    getCategories () {
      console.log('Trae el get , ', this.findCategoriesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data)
      return this.findCategoriesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findCategory({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findCategory({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.categories = response.data
      console.log(' created: ', this.categories)
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
