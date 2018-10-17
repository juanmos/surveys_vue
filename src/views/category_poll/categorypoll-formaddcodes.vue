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
      <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
                @click="goToList"
                >
                <v-icon>list</v-icon>
                </v-btn>
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
                  :items="getCodes"
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
                          :return-value.sync="props.item.name"
                          lazy
                          @save="edit(props.item.code, props.item, 'code')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.code }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.code"
                            label="Editar Código"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog></td>
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
                            label="Editar Descripción"
                            single-line
                            counter
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
          <v-dialog
                          v-model="dialog"
                          max-width="380"
                          max-heigth="500"
                        >
                          <v-card>
                            <v-card-title class="headline">Está seguro que desea eliminar el código: {{ itemSelectedname }}</v-card-title>
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
                    </td>
                  </tr>
                </template>
                </v-data-table>
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
          value: 'name'
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
      valid: false,
      rules: validations,
      dialog: false
    }
  },
  methods: {
    ...mapActions('codescategorypolls', { findCodes: 'find' }),
    createcode () {
      const { Codescategorypoll } = this.$FeathersVuex
      let codecategory = new Codescategorypoll(this.codescategory)
      codecategory.save().then((res) => {
        this.findCodes({ query: { $limit: null } }).then(res => {
          console.log('dato final', res.data)
          this.limpiarCampos()
        })
      })
    },
    edit (val, elem, field) {
      const { Codescategorypoll } = this.$FeathersVuex
      let codecategory = new Codescategorypoll(elem)
      codecategory[field] = val
      codecategory.patch().then((result) => {
        this.findCodes({ query: {removed: false} }).then(response => {
          const codescategoriesR = response.data || response
          console.log(codescategoriesR)
        })
      })
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
        })
      })
    },
    limpiarCampos () {
      this.codescategory.code = ''
      this.codescategory.name = ''
    },
    goToList () {
      this.$router.push('/categorypoll-list')
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
  created () {
    this.codescategory._categorypoll_id = this.$route.params.category_id
    this.category_id = this.$route.params.category_id
    this.findCodes({removed: false, ...this.query}).then(response => {
      this.categories = response.data
      console.log(' created: ', this.categories)
    })
  },
  computed: {
    ...mapState('codescategorypolls', {loading: 'isCreatePending'}),
    ...mapGetters('codescategorypolls', {findCodesInStore: 'find'}),
    getCodes () {
      console.log('Trae el NUEVO get , ', this.findCodesInStore({query: {removed: false, _categorypoll_id: this.category_id, ...this.query}}).data)
      return this.findCodesInStore({query: {removed: false, _categorypoll_id: this.category_id, ...this.query}}).data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
