<template>
<div >
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Servicios del API de encuestas</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getCategories"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>
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
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.url"
                          lazy
                          @save="edit(props.item.url, props.item, 'url')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.url }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.url"
                            label="Editar Nombre"
                            single-line
                            counter
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.description"
                          lazy
                          @save="edit(props.item.description, props.item, 'description')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.description }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.description"
                            label="Editar Descripción"
                            single-line
                            counter
                            required
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
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
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar categoría</v-card-title>

                                <v-card-text>
                                  Esta seguro que desea eliminar la categoría?
                                </v-card-text>

                                <v-card-actions>
                                  <v-spacer></v-spacer>

                                  <v-btn
                                    color="red darken-4"
                                    flat="flat"
                                    @click="dialog = false"
                                  >
                                    Cancelar
                                  </v-btn>

                                  <v-btn
                                    color="teal darken-3"
                                    flat="flat"
                                    @click="dialog = false, del()"
                                  >
                                    Aceptar
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-list>
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
                color="primary"
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
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'URL',
          value: 'url',
          sortable: false
        },
        { text: 'Descripción',
          value: 'description',
          sortable: false
        },
        { text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      rules: validations,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      categories: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('restfuls', { findRestful: 'find' }),
    goToNew () {
      this.$router.push('/restful-new')
    },
    save (val) {
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
      // console.log('Dialog closed', val)
    },
    edit (val, elem, field) {
      if (val !== '') {
        const {Restful} = this.$FeathersVuex
        const restful = new Restful(elem)
        restful[field] = val
        restful.patch().then((result) => {
          this.findRestful({ query: {removed: false} }).then(response => {
            return response.data || response
          })
        })
      }
    },
    del () {
      const {Restful} = this.$FeathersVuex
      const restfull = new Restful(this.itemSelected)
      restfull.removed = true
      restfull.patch().then((result) => {
        this.findRestful({ query: {removed: false} }).then(response => {
          return response.data || response
        })
      })
    }
  },
  computed: {
    ...mapState('restfuls', {loading: 'isFindPending'}),
    ...mapState('restfuls', { paginationVal: 'pagination' }),
    ...mapGetters('restfuls', {findRestfulInStore: 'find'}),
    getCategories () {
      return this.findRestfulInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findRestful({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findRestful({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.categories = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>

</style>
