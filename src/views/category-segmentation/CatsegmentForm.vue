<template>
    <v-card>
       <v-card-title>
         <span class="title">{{titulo}}</span>
          <v-spacer></v-spacer>
          &nbsp;
          <v-btn fab small class="error" @click.native="goToList()">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-card-title>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
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
                    <div>
                        <v-toolbar flat color="white">
                          <v-toolbar-title>Lista de Parametros</v-toolbar-title>
                          <v-spacer></v-spacer>
                            <div  max-width="500px">
                              <v-btn color="success" small @click="dialog = true;">Nuevo Parametro</v-btn>
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
                                          label="Valor 1"
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
                          :items="categoryseg.datos"
                          hide-actions
                          class="elevation-1"
                        >
                          <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.opciones }}</td>
                            <td class="text-xs-left">{{ props.item.valor1 }}</td>
                            <td>
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
import {mapActions} from 'vuex'
import {validations} from './../../utils/validations'
let state = {
  datostemp: []
}
export default {
  data: (vm) => ({
    categoryseg: {
      name: '',
      description: '',
      datos: [],
      removed: false
    },
    valid: false,
    rules: validations,
    dialog: false,
    dialog2: false,
    opcion: '',
    valor1: '',
    valor2: '',
    itemSelected2: null,
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
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('category-segmentation', { findcatItems: 'find' }),
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
      this.categoryseg = []
      state.datostemp = []
      this.$router.push('/category-segmentation')
    },
    savecategory () {
      state.datostemp.push({
        'opciones': this.opcion.toString(),
        'valor1': this.valor1.toString(),
        'valor2': this.valor2.toString()
      })
      this.categoryseg.datos = state.datostemp
      this.opcion = ''
      this.valor1 = ''
      this.valor2 = ''
    },
    delcateg () {
      this.categoryseg.datos.splice(this.categoryseg.datos.findIndex(p => p.opciones === this.itemSelected2.opciones), 1)
      this.setSnackMessage('Opción Eliminado')
      this.setShowSnack(true)
      this.dialog = false
      state.datostemp = []
      console.log(this.categoryseg.datos)
    },
    cargaredicion (elementid) {
      this.findcatItems({query: {_id: this.$route.params.id, ...this.query}}).then(response => {
        this.Listcat = response.data
        this.categoryseg._id = this.$route.params.id
        this.categoryseg.name = this.Listcat[0].name
        this.categoryseg.description = this.Listcat[0].description
        for (let i = 0; i <= this.Listcat[0].datos.length - 1; i++) {
          state.datostemp.push({
            'opciones': this.Listcat[0].datos[i].opciones,
            'valor1': this.Listcat[0].datos[i].valor1,
            'valor2': this.Listcat[0].datos[i].valor2
          })
          this.categoryseg.datos = state.datostemp
        }
      })
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
  }
}
</script>
