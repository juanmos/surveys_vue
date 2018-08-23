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
        this.$router.push('pages/login')
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
