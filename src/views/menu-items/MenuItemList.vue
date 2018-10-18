<template>
<div >
    <v-container grid-list-md text-xs-center @CreateMessage='messageSave'>
        <v-layout row wrap>
        <v-flex xs12>
          <v-alert
            :value="alert"
            :type="tipo_alerta"
            dismissible
            transition="scale-transition"
          >
            {{mensaje}}
          </v-alert>
            <v-card :flat="true">
              <v-subheader>Listado de Items</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getMenuItems"
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
                        >
                        {{ props.item.name }}
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
                      <td @click="dialogo = true, asignacion(props.item)" class="text-xs-left" >
                        <v-dialog
                              v-model="dialogo"
                              max-width="1000"
                            >
                              <v-card>
                                <v-card-title class="headline">ICONO</v-card-title>
                                <v-card-text>
                                  Seleccione un icono
                                  <menu-icon-list
                                  slot="input"
                                  @iconName="seleccion"
                                  > </menu-icon-list>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                            <v-card-text>
                              <v-icon>{{ props.item.icon }}</v-icon>
                              {{ props.item.icon }}
                            </v-card-text>
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
                            label="Editar url"
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
                            <v-list-tile @click="dialog = true; itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar Ítem de menú</v-card-title>

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
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import MenuIconList from './MenuIconList'
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
        { text: 'Icono',
          value: 'icon',
          sortable: false
        },
        { text: 'URL',
          value: 'url',
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
      icono: '',
      itemSelected: null,
      loaded: false,
      menuItems: [],
      query: {},
      dialog: false,
      dialogo: false,
      elemento: [],
      // alerta
      alert: false,
      tipo_alerta: 'success',
      mensaje: ''
    }
  },
  methods: {
    ...mapActions('menu-items', { findMenuItems: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    goToNew () {
      this.$router.push('/menu-item-new')
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
    },
    edit (val, elem, field) {
      if (val !== '') {
        const {MenuItem} = this.$FeathersVuex
        const menuitem = new MenuItem(elem)
        menuitem[field] = val
        menuitem.patch().then((result) => {
          this.findMenuItems({ query: {removed: false} }).then(response => {
            const menuitem = response.data || response
            console.log('edit ', menuitem)
            // this.alertConfig('Registro Modificado', 'success')
            this.setSnackMessage('Registro modificado')
            this.setSnackColor('success')
            this.setShowSnack(true)
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          this.setSnackColor('error')
          console.log(err)
        })
      }
    },
    del () {
      const {MenuItem} = this.$FeathersVuex
      const menuitem = new MenuItem(this.itemSelected)
      menuitem.removed = true
      console.log('element ', this.itemSelected)
      menuitem.patch().then((result) => {
        this.findMenuItems({ query: {removed: false} }).then(response => {
          const menuitem = response.data || response
          console.log(menuitem)
          this.setSnackColor('success')
          this.setSnackMessage('Registro modificado')
          this.setShowSnack(true)
        })
      }, (err) => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        this.setSnackColor('error')
        console.log(err)
      })
    },
    seleccion (datos) {
      // console.log('me trae en selecion', datos)
      this.icono = datos.nombre
      this.closeDialogo()
    },
    closeDialogo () {
      console.log('entran')
      this.editIcon('icon')
      this.dialogo = false
    },
    asignacion (elem) {
      this.elem = elem
    },
    editIcon (field) {
      // console.log('entraaaa', this.icono)
      const {MenuItem} = this.$FeathersVuex
      const menuitem = new MenuItem(this.elem)
      menuitem[field] = this.icono
      menuitem.patch().then((result) => {
        this.findMenuItems({ query: {removed: false} }).then(response => {
          const menuitem = response.data || response
          console.log('edit ', menuitem)
          this.setSnackMessage('Registro modificado')
          this.setSnackColor('success')
          this.setShowSnack(true)
        })
      }, (err) => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        this.setSnackColor('error')
        console.log(err)
      })
    },
    alertConfig (message, type) {
      this.alert = true
      this.tipo_alerta = type
      this.mensaje = message
    },
    messageSave (data) {
      this.alertConfig('Datos modificados', data)
    }
  },
  computed: {
    ...mapState('menu-items', {loading: 'isFindPending'}),
    ...mapState('menu-items', { paginationVal: 'pagination' }),
    ...mapGetters('menu-items', {findMenuItemInStore: 'find'}),
    getMenuItems () {
      // console.log('datos= ', this.findCategoryInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data)
      return this.findMenuItemInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findMenuItems({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findMenuItems({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.menuItems = response.data
    })
  },
  components: {LoadingComponent, EditableField, MenuIconList}
}
</script>

<style>
  .v-datatable{
    overflow: hidden;
  }
</style>
