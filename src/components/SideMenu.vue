<template>
    <v-navigation-drawer
      persistent
      :mini-variant="mutableMiniVariant"
      :clipped="mutableClipped"
      v-model="mutableDrawer"
      enable-resize-watcher
      fixed
      class="blue-grey lighten-5"
      app>
      <v-list>
        <router-link
          value="true"
          v-for="(item, i) in items"
          :key="i"
          tag="v-list-tile"
          :to="item.url"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </router-link>
        <v-divider inset></v-divider>
        <v-subheader>Configuracion</v-subheader>
        <v-list-group>
          <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title> <v-icon v-html="'category'"></v-icon> Categorías & Códigos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="'/CategoryPollList/0'">
                <v-list-tile-action>Categorías</v-list-tile-action>
              </v-list-tile>
              <v-list-tile :to="'/CategoryPollList/1'">
                <v-list-tile-action>Categorías Generales</v-list-tile-action>
              </v-list-tile>
        </v-list-group>
        <v-list-tile :to="'/regions'">
          <v-list-tile-action>
            <v-icon v-html="'map'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Regiones'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group  prepend-icon="account_circle" >
            <v-list-tile slot="activator">
              <v-list-tile-title>Accesos</v-list-tile-title>
            </v-list-tile>

            <v-list-tile  :to="'/roles'">

              <v-list-tile-action>
                <v-icon v-html="'supervised_user_circle'"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="'Roles'"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

        </v-list-group>

        <v-divider inset></v-divider>

        <v-list-tile @click="exit">
          <v-list-tile-action>
            <v-icon v-html="'input'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Salir'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
import {mapActions} from 'vuex'
import nav from './../_nav'
export default {
  props: ['clipped', 'drawer', 'miniVariant'],
  data: () => ({
    items: nav.items,
    fixed: false,
    right: true,
    rightDrawer: false,
    mutableClipped: null,
    mutableDrawer: null,
    mutableMiniVariant: null
  }),
  methods: {
    ...mapActions('auth', ['logout']),
    closeSession () {
      let logoutRequest = new Promise((resolve, reject) => {
        this.logout()
        resolve('closed')
      })
      return logoutRequest
    },
    exit () {
      this.closeSession().then((res) => {
        this.$router.push('/pages/login')
      })
    }
  },
  watch: {
    clipped (val) {
      this.mutableClipped = val
    },
    drawer (val) {
      this.mutableDrawer = val
    },
    miniVariant (val) {
      this.mutableMiniVariant = val
    }
  },
  created () {
    this.mutableClipped = this.clipped
    this.mutableDrawer = this.drawer
    this.mutableClipped = this.clipped
    this.mutableMiniVariant = this.miniVariant
  }
}
</script>
<style scoped>
</style>
