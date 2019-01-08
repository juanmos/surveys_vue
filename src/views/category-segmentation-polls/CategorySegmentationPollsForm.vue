<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
            <v-autocomplete id="autoCom" v-bind:items="getCategorySegmentation"
            item-text="name"
            item-value="_id"
            v-model="selectCategorySegment" label="Categoría segmento:"
            ></v-autocomplete>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
              <v-text-field
                  v-model="categoryseg.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>

                 <v-text-field
                  v-model="categoryseg.description"
                  :rules="rules.nameRules"
                  label="Descripción"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                    <div >
                        <v-toolbar flat>
                          <v-toolbar-title>Lista de Parametros</v-toolbar-title>
                          <v-spacer></v-spacer>
                            <div  max-width="500px">
                              <v-btn color="success" small @click="dialog = true; opcion =''; valor1=''">Nuevo Parametro</v-btn>
                            </div>
                              <v-dialog  v-model="dialog"  max-width="400" >
                                <v-card>
                                  <v-card-title class="headline">Agregar parametros</v-card-title>
                                  <v-container fluid grid-list-md>
                                    <v-layout row wrap>
                                      <v-flex xs12 md12>
                                          <v-text-field
                                          v-model="opcion"
                                          label="Titulo"
                                          box
                                          color="blue-grey lighten-2"
                                        ></v-text-field>
                                          <v-text-field
                                          v-model="valor1"
                                          label="Valor"
                                          box
                                          color="blue-grey lighten-2"
                                        ></v-text-field>
                                      </v-flex>
                                    </v-layout>
                                  </v-container>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn  color="red darken-4" flat="flat" @click="dialog = false">
                                      Cancelar
                                    </v-btn>
                                    <v-btn color="teal darken-3" flat="flat" @click="dialog = false, savecategory()">
                                      Aceptar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                        </v-toolbar>
                        <v-data-table
                          :headers="headers"
                          :items="categorysegver"
                          hide-actions
                          class="elevation-1"
                          ref="table"
                        >
                          <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.opciones }}</td>
                            <td class="text-xs-left">{{ props.item.valor1 }}</td>
                            <td>
                              <v-icon
                                small
                                class="mr-2"
                                @click="dialog = true; opcion =props.item.opciones; valor1 =props.item.valor1; itemSelected3=props.item"
                              >
                                edit
                              </v-icon>
                              <v-icon
                                small
                                @click="dialog2 = true; itemSelected2=props.item"
                              >
                                delete
                              </v-icon>
                              <v-dialog  v-model="dialog2"  max-width="290">
                                  <v-card>
                                    <v-card-title class="headline">Eliminar:</v-card-title>
                                    <v-card-text>
                                      Esta seguro que desea eliminar ítem ?
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn color="red darken-4" flat="flat" @click="dialog2 = false">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        color="teal darken-3"
                                        flat="flat"
                                        @click="dialog2 = false, delcateg()"
                                      >
                                        Aceptar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                            </td>
                          </template>
                          <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                              No tiene datos :(
                            </v-alert>
                          </template>
                        </v-data-table>
                    </div>
                <div class="text-xs-center pt-2">
                  <v-btn v-if="!this.$route.params.id" type="submit" :disabled="!valid"  color="primary">Guardar</v-btn>
                  <v-btn v-else color="primary" @click.native="actualizar()">Actualizar</v-btn>
                </div>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import {validations} from './../../utils/validations'
let state = {
  datostemp: []
}
export default {
  props: ['values'],
  data: (vm) => ({
    categoryseg: {
      name: '',
      description: '',
      _project_poll_id: null,
      datos: [],
      removed: false
    },
    selectCategorySegment: null,
    categorysegver: [],
    valid: false,
    rules: validations,
    dialog: false,
    dialog2: false,
    opcion: '',
    valor1: '',
    valor2: '',
    itemSelected2: null,
    itemSelected3: null,
    titulo: '',
    headers: [
      {
        text: 'Titulo',
        align: 'left',
        sortable: true,
        value: 'opciones'
      },
      {text: 'Valor1', value: 'valor1'},
      {text: 'Accion', value: ' '}
    ]
  }),
  methods: {
    ...mapActions('category-segmentation', { findCategorySegmentation: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    setCategorySegment () {
      if (this.selectCategorySegment) {
        let dataCategorySegmentation = this.getCategorySegmentation.filter(data => data._id === this.selectCategorySegment)[0]
        this.categoryseg.description = dataCategorySegmentation.description
        this.categoryseg.datos = dataCategorySegmentation.datos
        this.categoryseg.name = dataCategorySegmentation.name
        this.categoryseg._project_poll_id = this.$route.params._id
        this.categorysegver = dataCategorySegmentation.datos
        state.datostemp = dataCategorySegmentation.datos.map(data => {
          data.removed = false
          return data
        })
      } else {
        this.categoryseg.name = ''
        this.categoryseg.description = ''
        this.categoryseg._project_poll_id = null
        this.categoryseg.datos = []
        this.categoryseg.removed = false
        this.categorysegver = []
        state.datostemp = []
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.categoryseg = obj
      this.categorysegver = this.categoryseg.datos.map(data => {
        data.removed = false
        return data
      })
      state.datostemp = this.categoryseg.datos
    },
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.categoryseg)
      }
    },
    actualizar () {
      const {CategorySegmentation} = this.$FeathersVuex
      let catsecg = new CategorySegmentation(this.categoryseg)
      catsecg.patch().then((result) => {
        this.setSnackMessage('Categoria Guardado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/category-segmentation')
    },
    savecategory () {
      if (this.itemSelected3 && this.categoryseg.datos.length === 0) {
        let itemactual = this.categoryseg.datos.findIndex(p => p.opciones === this.itemSelected3.opciones)
        this.categoryseg.datos[itemactual].opciones = this.opcion.toString()
        this.categoryseg.datos[itemactual].valor1 = this.valor1.toString()
        this.itemSelected3 = ''
        this.categorysegver = this.categoryseg.datos
        this.ver()
      } else {
        state.datostemp.push({
          'opciones': this.opcion.toString(),
          'valor1': this.valor1.toString(),
          'valor2': '',
          'removed': false
        })
        this.categoryseg.datos = state.datostemp
        this.ver()
        this.opcion = ''
        this.valor1 = ''
        this.valor2 = ''
      }
    },
    delcateg () {
      let itemdelete = this.categoryseg.datos.findIndex(p => p.opciones === this.itemSelected2.opciones)
      this.categoryseg.datos[itemdelete].removed = true
      this.itemSelected2 = ''
      this.ver()
      this.setSnackMessage('Opción Eliminado')
      this.setShowSnack(true)
      this.dialog = false
    },
    ver () {
      state.datostemp = []
      this.categoryseg.datos.forEach(function (word) {
        if (word.removed === false) {
          state.datostemp.push({
            '_id': word._id,
            'opciones': word.opciones,
            'valor1': word.valor1,
            'valor2': word.valor2,
            'removed': word.removed
          })
        }
      })
      this.categorysegver = state.datostemp
    },
    cargaredicion (elementid) {
      this.findcatItems({query: {_id: this.$route.params.id, removed: false, ...this.query}}).then(response => {
        this.Listcat = response.data
        this.categoryseg._id = this.$route.params.id
        this.categoryseg.name = this.Listcat[0].name
        this.categoryseg.description = this.Listcat[0].description
        this.categoryseg.datos = this.Listcat[0].datos
        for (let i = 0; i <= this.Listcat[0].datos.length - 1; i++) {
          if (this.Listcat[0].datos[i].removed === false) {
            state.datostemp.push({
              '_id': this.Listcat[0].datos[i]._id,
              'opciones': this.Listcat[0].datos[i].opciones,
              'valor1': this.Listcat[0].datos[i].valor1,
              'valor2': this.Listcat[0].datos[i].valor2,
              'removed': this.Listcat[0].datos[i].removed
            })
            this.categorysegver = state.datostemp
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters('category-segmentation', {findCategorySegmentationInStore: 'find'}),
    ...mapState('auth', { user: 'user' }),
    getCategorySegmentation () {
      let listCategorySegmentation = this.findCategorySegmentationInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
      let option = {
        'name': 'NINGUNA',
        '_id': null
      }
      listCategorySegmentation.push(option)
      return listCategorySegmentation
    }
  },
  watch: {
    selectCategorySegment (newVal) {
      this.setCategorySegment()
    },
    values: function (dat) {
      this.setData(dat)
      if (dat) {
        this.newData = false
      }
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.titulo = 'Editar Categoria Segmentación'
      state.datostemp = []
      this.cargaredicion(this.$route.params.id)
    } else {
      this.titulo = 'Nuevo Categoria Segmentación'
      state.datostemp = []
    }
  },
  created () {
    this.categoryseg._project_poll_id = this.$route.params._id
    this.findCategorySegmentation({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
    })
  }
}
</script>
