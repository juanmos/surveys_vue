<template>
  <v-app>
    <side-menu :clipped="clipped" :drawer="drawer" :miniVariant="miniVariant" ></side-menu>
    <v-toolbar
      app
      :clipped-left="clipped"
      dark
      color="primary">

      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-avatar
          :tile="true"
          :size="50"
        >
          <img height="100" src="@/assets/logo-propraxis.png" alt="Propraxis">
      </v-avatar>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
      <snack-message></snack-message>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
      width="1200"
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title></v-list-tile-title>
          {{user ? user.email : null}}
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; Propraxis 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'

import SideMenu from './../components/SideMenu'
import SnackMessage from './../components/docaration/SnackMessage'
export default {
  name: 'App',
  data () {
    return {
      title: 'ENCUESTAS',
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  computed: {
    ...mapState('auth', { user: 'user' })
  },
  components: {SideMenu, SnackMessage}
}
</script>
