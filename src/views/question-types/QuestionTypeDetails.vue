<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
      <v-flex xs12>
      <v-subheader>INGRESO DE CODIGOS A CATEGORIA</v-subheader>
      </v-flex>
      <v-spacer></v-spacer>

      <v-form
            v-model="valid"
            @submit.prevent="createcode"
            @keydown.prevent.enter
            >
            <v-container fluid grid-list-xl>
             <v-layout row justify-center>
            <v-flex xs2>
              <v-text-field
                  v-model="codescategory.code"
                  label="Nuevo Código"
                  color="blue-grey lighten-2"
                  :rules="rules.nameRules"
                  mask="####"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                  v-model="codescategory.name"
                  label="Descripción"
                  :rules="rules.nameRules"
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn type="submit" :disabled="!valid" small color="info">Guardar</v-btn>
            </v-flex>
          </v-layout>
          </v-container>
                </v-form>
        <v-layout row wrap>
          <v-flex xs8 sm8 offset-sm2>
            <v-card>
          <v-card-title><h4>{{ this.$route.params.category_name }}</h4></v-card-title>
           </v-card>
            <v-data-table
                  :headers="headers"
                  :items="getCodes, codes_generales"
                  hide-actions
                  item-key="name"
                  striped hover
                  outlined
                  border="1"
                >
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td class="text-xs-center">
                      <v-edit-dialog
                          :return-value.sync="props.item.code"
                          @save="edit(props.item.code, props.item, 'code')"
                          @open="open"
                          @close="close"
                        > {{ props.item.code }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.code"
                            label="Editar Código"
                            single-line
                            counter
                            mask="####"
                          ></v-text-field>
                        </v-edit-dialog></td>
                    <td class="text-xs-center">
                      <v-edit-dialog
                          :return-value.sync="props.item.name"
                          @save="edit(props.item.name, props.item, 'name')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.name }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.name"
                            label="Editar Descripción"
                            single-line
                            counter
                            :rules="rules.nameRules"
                          ></v-text-field>
                        </v-edit-dialog>
                    </td>
                    <td>
                      <v-icon title="Eliminar Código"
                      color="red"
            small
            @click="dialog = true; itemSelected= props.item; itemSelectedname= props.item.name;"
          >
            delete
          </v-icon>
                    </td>
                  </tr>
                </template>
                </v-data-table>
                <v-spacer></v-spacer>
                <hr>
                <table item-key="name" class="v-datatable v-table theme--light" v-if="codes_generales">
            <tbody>
                <tr v-for="(item) in codes_generales" :key = "item.code">
                    <td class="text-xs-left">{{ item.code }}</td>
                    <td class="text-xs-center">{{ item.name }}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      codescategory: {
        code: '',
        name: '',
        _categorypoll_id: ''
      },
      headers: [
        {
          text: 'Código',
          align: 'center',
          sortable: false,
          value: 'code'
        },
        {
          text: 'Descripción',
          align: 'left',
          value: 'name',
          sortable: false
        },
        {
          text: '',
          align: 'center',
          value: 'name',
          sortable: false
        }
      ],
      categories: [],
      codes_generales: [],
      category_consult: {},
      test: false,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      loaded: false,
      clients: [],
      itemSelected: null,
      itemSelectedname: null,
      query: {},
      query2: {},
      valid: false,
      rules: validations,
      dialog: false
    }
  },
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack']),
    ...mapActions('codescategorypolls', { findCodes: 'find' }),
    ...mapActions('category-poll', { findCategory: 'find' }),
    createcode () {
      if (parseFloat(this.codescategory.code) > 90 && this.category_consult[0]._iscodegeneral === false) {
        alert('No se pueden ingresar valores mayores a 90 ya que son de códigos generales')
        this.limpiarCampos()
      } else {
        const { Codescategorypoll } = this.$FeathersVuex
        let codecategory = new Codescategorypoll(this.codescategory)
        codecategory.save().then((res) => {
          this.findCodes({ query: { $limit: null } }).then(res => {
            // console.log('dato final', res.data)
            this.setSnackMessage('Registro Ingresado')
            // this.setSnackColor('success')
            this.setShowSnack(true)
            this.limpiarCampos()
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          this.setSnackColor('error')
          console.log(err)
        })
      }
    },
    edit (val, elem, field) {
      if (parseFloat(val) > 90 && this.category_consult[0]._iscodegeneral === false) {
        alert('No se pueden ingresar valores mayores a 90 ya que son de códigos generales')
        this.limpiarCampos()
      } else {
        const { Codescategorypoll } = this.$FeathersVuex
        let codecategory = new Codescategorypoll(elem)
        codecategory[field] = val
        codecategory.patch().then((result) => {
          this.findCodes({ query: {removed: false} }).then(response => {
            const codescategoriesR = response.data || response
            console.log(codescategoriesR)
            this.setSnackMessage('Registro Modificado')
            // this.setSnackColor('success')
            this.setShowSnack(true)
          })
        })
      }
    },
    del () {
      // console.log(this.itemSelected)
      const { Codescategorypoll } = this.$FeathersVuex
      const codecategory = new Codescategorypoll(this.itemSelected)
      codecategory.removed = true
      codecategory.patch().then((result) => {
        this.findCodes({ query: {removed: false} }).then(response => {
          const categoriesR = response.data || response
          console.log(categoriesR)
          this.setSnackMessage('Registro Eliminado')
          // this.setSnackColor('success')
          this.setShowSnack(true)
        })
      })
    },
    limpiarCampos () {
      this.codescategory.code = ''
      this.codescategory.name = ''
    },
    goToList () {
      this.$router.push('/categorypoll-list/0')
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
    }
  },
  created () {
    this.codescategory._categorypoll_id = this.$route.params.category_id
    this.category_id = this.$route.params.category_id
    this.findCodes({removed: false, ...this.query}).then(response => {
      this.categories = response.data
    })
    // CONSULTA DE A LA CATEGORÍA PARA SABER SI CONTIENE CODIGOS GENERALES O NO
    this.findCategory({query: {_id: this.category_id, ...this.query}}).then(response => {
      this.category_consult = response.data
      if (this.category_consult[0]._contains_codegeneral === true) {
        // CONSULTA DE LOS CODIGOS EN CASO DE QUE SEA TRUE EL CAMPO
        this.findCategory({query: {_iscodegeneral: true, ...this.query}}).then(response => {
          this.findCodes({query: {_categorypoll_id: response.data[0]._id, ...this.query}}).then(response => {
            this.codes_generales = response.data
          })
        })
      } else {
        // NO CONTIEN CODIGOS GENERALES
      }
    })
  },
  computed: {
    ...mapState('codescategorypolls', {loading: 'isCreatePending'}),
    ...mapGetters('codescategorypolls', {findCodesInStore: 'find'}),
    ...mapGetters('category-poll', { findMainCategory: 'find' }),
    getCodes () {
      // console.log('Trae el NUEVO get , ', this.findCodesInStore({query: {removed: false, _categorypoll_id: this.category_id, ...this.query}}).data)
      return this.findCodesInStore({query: {removed: false, _categorypoll_id: this.category_id, ...this.query}}).data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
