<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-card-title>
                <span class="title">Categoria Segmentación
                  <v-text-field append-icon="search" label="Buscar ..." single-line hide-details  v-model="search"></v-text-field>
                </span>
                <v-spacer></v-spacer>
                <v-btn class="deep-orange darken-3" fab small dark  @click="goToNew()">
                  <v-icon>add</v-icon>
                </v-btn>
            </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="getPermission"
                  hide-actions
                  item-key="name"
                  :search="search"
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
                            <v-list-tile @click="editar(props.item)">
                              <v-list-tile-title>Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true; itemSelected=props.item">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar categoria</v-card-title>

                                <v-card-text>
                                  Esta seguro que desea eliminar ítem ?
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
        {
          text: 'Descripción',
          value: 'description',
          sortable: false
        },
        { text: 'Acciones',

          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      itemSelected: null,
      rules: validations,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      Categorysegmentation: [],
      query: {},
      dialog: false,
      search: ''
    }
  },
  methods: {
    ...mapActions('category-segmentation', { findPermission: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-category-segmentation')
    },
    edit (val, elem, field) {
      const {CategorySegmentation} = this.$FeathersVuex
      let catsecg = new CategorySegmentation(elem)
      catsecg[field] = val
      catsecg.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Categoria segmento Editado')
        this.setShowSnack(true)
      })
    },
    editar (item) {
      this.$router.push({ name: 'EditCategorysegmentation', params: { id: item._id } })
    },
    del () {
      const {CategorySegmentation} = this.$FeathersVuex
      let catsecg = new CategorySegmentation(this.itemSelected)
      catsecg.removed = true
      catsecg.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Categoria segmento Eliminado')
        this.setShowSnack(true)
      })
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
      console.log('Dialog closed', val)
    },
    print () {
      window.print()
    },
    getData () {
      this.findPermission({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.permission = response.data
        console.log('estas son los roles', this.permission)
      })
    }
  },
  computed: {
    ...mapState('category-segmentation', {loading: 'isFindPending'}),
    ...mapState('category-segmentation', { paginationVal: 'pagination' }),
    ...mapGetters('category-segmentation', {findPermissionsInStore: 'find'}),
    getPermission () {
      return this.findPermissionsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findPermission({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findPermission({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.permission = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
