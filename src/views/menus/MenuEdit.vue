<template>
    <v-container grid-list-md text-xs-center >
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Ítem</v-subheader>
                <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @keydown.prevent.enter
            >
            <v-select
              v-model="Item._menu_item_id"
              :items="menu_item"
              item-text="name"
              item-value="_id"
              label="Menú ítem"
              :rules= "nameRules"
              required
            ></v-select>
            <p class="text-xs-left">Seleccione el nivel</p>
            <v-radio-group v-model="Item.level" row @change="cargarSubMenu">
              <v-radio label="1" value="1" color="success"  ></v-radio>
              <v-radio label="2" value="2" color="success"  ></v-radio>
            </v-radio-group>

            <v-select
              :disabled="!radio"
              v-model="Item._menu_id"
              :items="menus"
              item-text="text"
              item-value="value"
              label="Sub-menú de"
            ></v-select>
                <v-switch
                  v-model="Item.state"
                  label="Estado"
                  color="success"
                  hide-details
                ></v-switch>
                <v-select
                  :items="roles"
                  v-model="Item._roles_id"
                  label="Roles"
                  item-text="name"
                  item-value="_id"
                  multiple
                  chips
                  hint="Seleccione roles que verán el menú"
                  persistent-hint
                ></v-select>
                <v-btn  :disabled="!valid" @click="edit" small color="info">Guardar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
                @click="goToList"
                >
                    <v-icon>list</v-icon>
                </v-btn>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'
import {validations} from './../../utils/validations'
// import LoadingComponent from '../../components/docaration/LoadingComponent'
// import MenuItemList from './../menu-items/MenuItemList'
export default {
  data () {
    return {
      Item: {
        _id: '',
        level: '',
        order: '',
        state: '',
        _roles_id: '',
        _menu_id: null,
        _menu_item_id: '',
        removed: false
      },
      menu_id: '',
      roles: [],
      orders: [
        { value: '1', text: '1' }
      ],
      menu_item: [],
      menus: [],
      valid: false,
      dialogo: false,
      rules: validations,
      Myicon: '',
      radio: true,
      NumeroMenus: 0,
      query: {},
      nameRules: [
        v => !!v || 'Nombre es requerido'
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      iconRules: [
        v => !!v || 'Icono es requerido'
      ],
      urlRules: [
        v => !!v || 'URL es requerido'
      ]
    }
  },
  methods: {
    ...mapActions('menus', { findMenu: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    ...mapActions('menu-items', { findMenuItems: 'find' }),
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions('menus', { findMenus: 'find' }),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.Item)
      }
    },
    seleccion (datos) {
      // console.log('me trae en selecion', datos)
      // this.icono = datos.nombre
      this.Myicon = datos.nombre
      this.Item.icon = datos.nombre
      this.closeDialogo()
    },
    closeDialogo () {
      // console.log('entran')
      // this.editIcon('icon')
      this.dialogo = false
    },
    edit () {
      const {Menu} = this.$FeathersVuex
      let menu = new Menu(this.Item)
      menu['_menu_item_id'] = this.Item._menu_item_id
      menu['level'] = this.Item.level
      menu['state'] = this.Item.state
      // menu['order'] = this.Item.order
      menu['_roles_id'] = this.Item._roles_id
      menu['_menu_id'] = this.Item._menu_id
      menu.patch().then((result) => {
        this.findMenuItems({ query: {removed: false} }).then(response => {
          // const menu = response.data || response
          // console.log('edit ', menuitem)
          // this.alertConfig('Registro Modificado', 'success')
          this.setSnackMessage('Registro modificado')
          this.setSnackColor('success')
          this.setShowSnack(true)
          this.goToList()
        })
      }, (err) => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        this.setSnackColor('error')
        console.log(err)
      })
    },
    cargarValores () {
      this.findMenus({query: {_id: this.menu_id, removed: false, ...this.query}}).then(response => {
        this.menus = response.data
        this.Item._menu_id = response.data[0]._menu_id
        this.Item.level = '' + response.data[0].level
        this.Item.state = response.data[0].state
        this.Item._roles_id = response.data[0]._roles_id
        this.Item._menu_item_id = response.data[0]._menu_item_id
        this.Item.order = '' + response.data[0].order
        console.log('nivel ', this.Item.level)
      })
      // console.log('datos recibidos', this.menu_id)
      let ListMenuItem = []
      this.findMenuItems({removed: false, ...this.query}).then(response => {
        response.data.map(function (value, key) {
          ListMenuItem.push(value)
          // console.log('estos datos me trae de menu_item ', value._id)
        })
        this.menu_item = ListMenuItem
      })
      // console.log('estos datos me trae de menu_item ', ListMenuItem)
      this.findRoles({removed: false, ...this.query}).then(response => {
        let list = []
        response.data.map(function (value, key) {
          list.push(value)
          // console.log('estos datos me trae ', value.name)
        })
        this.roles = list
      })
      this.findMenus({ query: {removed: false, level: (this.Item.level - 1)} }).then(response => {
        let _menus = []
        let list = []
        let nombre = ''
        response.data.map(function (value, key) {
          _menus.push({ value: value._menu_item_id, text: nombre })
          console.log('estos datos me trae del menis ', value)
        })
        // i es el contador de menus
        for (let i = 0; i <= _menus.length - 1; i++) {
          // j es el contador de menu items
          for (let j = 0; j <= ListMenuItem.length - 1; j++) {
            // console.log('comparando ', _menus[i].value, ' con ', ListMenuItem[j].name)
            if (_menus[i].value === ListMenuItem[j]._id) {
              list.push({value: ListMenuItem[j]._id, text: ListMenuItem[j].name})
            }
          }
        }
        this.NumeroMenus = _menus.length
        // console.log('list final ', list)
        this.menus = list
      })
    },
    cargarSubMenu () {
      let ListMenuItem = []
      this.findMenuItems({removed: false, ...this.query}).then(response => {
        response.data.map(function (value, key) {
          ListMenuItem.push(value)
          // console.log('estos datos me trae de menu_item ', value._id)
        })
        // this.menu_item = ListMenuItem
      })
      this.findMenus({ query: {removed: false, level: (this.Item.level - 1)} }).then(response => {
        let _menus = []
        let list = []
        let nombre = ''
        response.data.map(function (value, key) {
          _menus.push({ value: value._menu_item_id, text: nombre })
          console.log('estos datos me trae del menis ', value)
        })
        // i es el contador de menus
        for (let i = 0; i <= _menus.length - 1; i++) {
          // j es el contador de menu items
          for (let j = 0; j <= ListMenuItem.length - 1; j++) {
            // console.log('comparando ', _menus[i].value, ' con ', ListMenuItem[j].name)
            if (_menus[i].value === ListMenuItem[j]._id) {
              list.push({value: ListMenuItem[j]._id, text: ListMenuItem[j].name})
            }
          }
        }
        this.NumeroMenus = _menus.length
        // console.log('list final ', list)
        this.menus = list
      })
    },
    goToList () {
      // this.$emit('CreateMessage', { mensaje: 'Registro creado', tipo: 'success' })
      this.$router.push('/menu')
    }
  },
  created () {
    this.menu_id = this.$route.params.menu_id
    this.Item._id = this.menu_id
    this.cargarValores()
  },
  computed: {
    ...mapState('menus', {loading: 'isCreatePending'}),
    ...mapGetters('menus', {findMenuInStore: 'find'})
  }

}
</script>

<style>

</style>
