<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout justify-center>
        <v-flex xs9>
            <v-card :flat="true">
              <v-subheader>TIPOS DE PREGUNTAS</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getCategories"
                  hide-actions
                  item-key="type_camp"
                  striped hover
                  outlined
                  bordered
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="text-xs-left">
                        {{ props.item.type_camp  }}
                      </td>
                      <td class="text-xs-left">
                        {{ props.item.config }}
                      </td>
                      <td class="justify-center layout px-0">
                        <v-icon title="Eliminar Código"
                      color="blue"
            small
            @click="itemSelected= props.item; itemSelectedname= props.item.type_camp; itemSelectedconfig= props.item.config; dialog = true; "
          >
            search
          </v-icon>
          <v-dialog
                          v-model="dialog"
                          max-width="680"
                          heigth="800"
                        >
                          <v-card>
                            <v-card-title class="headline">Previsualización de Configuración de tipo: {{ itemSelectedname }}</v-card-title>
                            <!-- VISUALIZACION DEL TIPO DE CONFIGURACION -->
                            <v-card-text>
                              {{ itemSelectedconfig[0].type}}
                            </v-card-text>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="dialog = false"
                              >
                                ACEPTAR
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <!-- <v-menu
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
                            <v-list-tile @click="goToAddcodes(props.item._id, props.item.name)">
                              <v-list-tile-title>Añadir códigos</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="itemSelected= props.item; itemSelectedname= props.item.name; editCodeGeneral(props.item._id, props.item.name)">
                              <v-list-tile-title>Usa/No usa códigos generales</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true; itemSelected= props.item; itemSelectedname= props.item.name;">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                          <v-dialog
                          v-model="dialog"
                          max-width="380"
                          max-heigth="500"
                        >
                          <v-card>
                            <v-card-title class="headline">Está seguro que desea eliminar la Categoría: {{ itemSelectedname }}</v-card-title>

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
                                @click="dialog = false, del()"
                              >
                                SI
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        </v-menu> -->
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
                color="red"
                @click="goToNew()"
                >
                    <v-icon>add</v-icon>
                </v-btn>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Tipo de campo',
          align: 'left',
          sortable: false,
          value: 'type_camp'
        },
        {
          text: 'Configuración',
          align: 'center',
          value: 'config',
          sortable: false
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false
        }
      ],
      categories: [],
      message: '',
      showMsg: false,
      msgType: 'error',
      itemSelected: null,
      itemSelectedname: null,
      itemSelectedconfig: {type: ''},
      page: 1,
      limit: 20,
      total: 1,
      loaded: false,
      clients: [],
      query: {},
      dialog: false,
      bandgeneral: false
    }
  },
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack']),
    ...mapActions('category-poll', { findCategory: 'find' }),
    ...mapActions('question-types', {findQuestiontypes: 'find'}),
    goToNew () {
      this.$router.push('/CategoryPollNew')
    },
    goToAddcodes (val, val2) {
      this.$router.push({path: '/CategoryPollFormAddCodes/' + val + '/' + val2})
      // this.$router.push({path: '/categorypoll-formaddcodes/' + {id: val, nombre: 'holii'}})
      // { path: '/user', params: { userId }}
    },
    editCodeGeneral () {
      const {CategoryPoll} = this.$FeathersVuex
      const CategoryPollF = new CategoryPoll(this.itemSelected)
      console.log('antes de cambiar ', CategoryPollF._contains_codegeneral)
      if (CategoryPollF._contains_codegeneral === true) {
        this.message = 'La categoría ya no acepta códigos generales'
        CategoryPollF._contains_codegeneral = false
      } else {
        this.message = 'La categoría ya acepta códigos generales'
        CategoryPollF._contains_codegeneral = true
      }
      CategoryPollF.patch().then((result) => {
        this.findCategory({ query: {removed: false} }).then(response => {
          // const categoriesR = response.data || response
          // console.log(categoriesR)
          this.setSnackMessage(this.message)
          this.setShowSnack(true)
        })
      }, (err) => {
        this.setSnackMessage('Error al editar')
        this.setShowSnack(true)
        // this.setSnackColor('error')
        console.log(err)
      })
    },
    edit (val, elem, field) {
      const {CategoryPoll} = this.$FeathersVuex
      const CategoryPollF = new CategoryPoll(elem)
      CategoryPollF[field] = val
      CategoryPollF.patch().then((result) => {
        this.findCategory({ query: {removed: false} }).then(response => {
          // const categoriesR = response.data || response
          // console.log(categoriesR)
          this.setSnackMessage('Registro modificado')
          // this.setSnackColor('success')
          this.setShowSnack(true)
        })
      }, (err) => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        this.setSnackColor('error')
        console.log(err)
      })
    },
    del () {
      const {CategoryPoll} = this.$FeathersVuex
      const CategoryPollF = new CategoryPoll(this.itemSelected)
      CategoryPollF.removed = true
      CategoryPollF.patch().then((result) => {
        this.findCategory({ query: {removed: false} }).then(response => {
          // const categoriesR = response.data || response
          // console.log(categoriesR)
          this.setSnackMessage('Registro Eliminado')
          this.setShowSnack(true)
        })
      }, (err) => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        // this.setSnackColor('error')
        console.log(err)
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
      // console.log('Dialog closed', val)
    }
  },
  computed: {
    ...mapGetters('question-types', {findQuestiontypes2: 'find'}),
    getCategories () {
      console.log(this.findQuestiontypes2({query: {removed: false, ...this.query}}).data)
      return this.findQuestiontypes2({query: {removed: false, ...this.query}}).data
    }
  },
  /* watch: {
    '$route' (to, from) { // react to route changes...
      this.findCategory({$skip: this.getSkip, $limit: this.limit, removed: false, _iscodegeneral: this.bandgeneral, ...this.query}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.categories = response.data
      })
    },
    page () {
      this.findCategory({query: {removed: false, _iscodegeneral: this.bandgeneral, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  }, */
  created () {
    this.findQuestiontypes({removed: false, ...this.query}).then(response => {
      console.log('entra')
      this.itemSelectedconfig = response.data
      console.log('TRAE: ', this.itemSelectedconfig)
    })
  }
}
</script>

<style>
.v-datatable{
    overflow: hidden;
  }
</style>
