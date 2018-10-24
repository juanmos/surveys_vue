<template>
    <v-card>
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
              <v-radio label="1" value="1" color="success"></v-radio>
              <v-radio label="2" value="2" color="success"   ></v-radio>
              <v-radio label="3" value="3" color="success"   ></v-radio>
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
                  value="true"
                  hide-details
                  input-value="true"
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
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import MenuItemList from './../menu-items/MenuItemList'
export default {
  data: (vm) => ({
    Item: {
      level: '1',
      order: '',
      state: 'true',
      _roles_id: '',
      _menu_id: null,
      _menu_item_id: '',
      removed: false
    },
    levels: [
      '1', '2'
    ],
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
  }),
  methods: {
    ...mapActions('menu-items', { findMenuItems: 'find' }),
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions('menus', { findMenus: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
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
    habilitar () {
      // console.log('dato ', this.Item.level)
      if (this.Item.level === '1') {
        console.log('engtra ')
        this.radio = false
      } else {
        this.radio = true
      }
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
          // console.log('estos datos me trae del menis ', value.)
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

        this.Item.order = (_menus.length + 1)
        this.menus = list
        console.log('list final ', this.Item.order)
      })
    }
  },
  computed: {
    ...mapGetters('menu-items', {findMenuItemInStore: 'find'})
  },
  created () {
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
    this.findMenus({ query: {removed: false, level: '1'} }).then(response => {
      // console.log('cantidad ', response.data.length)
      this.Item.order = (response.data.length + 1)
    })
  },
  components: {MenuItemList}
}
</script>

<style>

</style>
