<template>
    <v-card>
       <v-card-title>
         <span class="title">{{titulo}}</span>
          <v-spacer></v-spacer>
          &nbsp;
          <v-btn fab small class="info" @click="dialog = true; ">
            <v-icon>add</v-icon>
          </v-btn>
             <v-dialog  v-model="dialog"  max-width="400" >
                <v-card>
                  <v-card-title class="headline">Agregar parametros</v-card-title>

                  <v-container fluid grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs12 md12>
                          <v-text-field
                          v-model="opcion"
                          :rules="rules.nameRules"
                          label="Nombre del segmento"
                          box
                          color="blue-grey lighten-2"
                          required
                        ></v-text-field>
                          <v-text-field
                          v-model="valor1"
                          label="Valor 1"
                          box
                          color="blue-grey lighten-2"
                        ></v-text-field>
                        <v-text-field
                         v-model="valor2"
                          label="Valor 2"
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

                  <v-flex xs8 v-if="categoryseg.datos && categoryseg.datos.length>0">
                    <span class="title">Opciones de segmentación</span>
                    <v-list class="transparent elevation-0" two-line >
                      <v-list-tile avatar ripple v-for="(item, index) in categoryseg.datos" v-if="item !== null && item !== undefined" v-bind:key="index" class="grey lighten-2 mt-2 mb-2 " >
                          <v-flex xs12 sm4>
                              <v-list-tile-content dark >
                                Opcion:  <v-list-tile-title class="heading blue--text">{{ item.opciones}} </v-list-tile-title>
                              </v-list-tile-content>
                          </v-flex>
                          <v-flex xs12 sm4>
                              <v-list-tile-content dark >
                              Valor 1: <v-list-tile-title class="heading blue--text">{{ item.valor1}} </v-list-tile-title>
                              </v-list-tile-content>
                          </v-flex>
                          <v-flex xs12 sm4>
                              <v-list-tile-content dark >
                                Valor 2:<v-list-tile-title class="heading blue--text">{{ item.valor2}} </v-list-tile-title>
                              </v-list-tile-content>
                          </v-flex>
                          <v-list-tile-action>
                            <v-btn color="red" fab small class="navy" @click="dialog2 = true; itemSelected2=item">
                              <v-icon color="white"  >delete</v-icon>
                            </v-btn>
                          </v-list-tile-action>
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
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                <v-btn v-if="!this.$route.params.id" type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
                <v-btn v-else  small color="info" @click.native="actualizar()">Actualizar</v-btn>
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
  datos: []
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
    opcion: null,
    valor1: null,
    valor2: null,
    itemSelected2: null,
    titulo: ''
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
      this.categoryseg.datos = []
    },
    goToList () {
      this.categoryseg = ''
      this.$router.push('/category-segmentation')
    },
    savecategory () {
      state.datos.push({
        'opciones': this.opcion.toString(),
        'valor1': this.valor1.toString(),
        'valor2': this.valor2.toString()
      })

      this.categoryseg.datos = state.datos
      this.opcion = null
      this.valor1 = null
      this.valor2 = null
    },
    delcateg () {
      this.categoryseg.datos.splice(this.categoryseg.datos.findIndex(p => p.opciones === this.itemSelected2.opciones), 1)
      this.setSnackMessage('Opción Eliminado')
      this.setShowSnack(true)
      this.dialog = false
    },
    cargaredicion (elementid) {
      let state = {
        datos: []
      }
      this.findcatItems({query: {_id: this.$route.params.id, ...this.query}}).then(response => {
        this.Listcat = response.data
        this.categoryseg._id = this.$route.params.id
        this.categoryseg.name = this.Listcat[0].name
        this.categoryseg.description = this.Listcat[0].description
        for (let i = 0; i <= this.Listcat[0].datos.length - 1; i++) {
          state.datos.push({
            'opciones': this.Listcat[0].datos[i].opciones,
            'valor1': this.Listcat[0].datos[i].valor1,
            'valor2': this.Listcat[0].datos[i].valor2
          })
        }
        this.categoryseg.datos = state.datos
      })
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.titulo = 'Editar Categoria Segmentación'
      this.cargaredicion(this.$route.params.id)
    } else this.titulo = 'Nuevo Categoria Segmentación'
  }
}
</script>
