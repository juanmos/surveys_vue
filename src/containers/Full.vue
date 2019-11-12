<template>
  <v-app dark>
    <side-menu :clipped="clipped" :drawer="drawer" :miniVariant="miniVariant" ></side-menu>
    <v-toolbar
      app
      :clipped-left="clipped"
      dark
      color="black">

      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-avatar
          :tile="true"
          :size="50"
        >
          <img height="100" src="@/assets/logo-propraxis.png" alt="Propraxis">
      </v-avatar>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon @click="goApplications" title="Aplicaciones">desktop_mac</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click="showNotification = !showNotification">
        <v-badge color="error" overlap>
          <template slot="badge">2</template>
          <v-icon title="Notificaciones">notification_important</v-icon>
        </v-badge>
      </v-btn>
      <v-card v-if="showNotification" class="listNotification">
        <v-list dense>
          <v-list-tile v-for="notification in notifications" :key="notification" @click="onClick">
            <v-list-tile-title v-text="notification"/>
          </v-list-tile>
        </v-list>
      </v-card> -->
      <v-btn icon>
        <v-icon @click="goUser" title="Perfil">perm_identity</v-icon>
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
      class="white"
      style="color: black"
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
      <span>&copy; Propraxis {{currentYear}}</span>
    </v-footer>
  </v-app>
</template>

<script>
import SideMenu from './../components/SideMenu'
import SnackMessage from './../components/docaration/SnackMessage'
import router from './../router'
export default {
  name: 'App',
  data () {
    return {
      title: 'ENCUESTAS',
      clipped: true,
      notifications: [
        'Mike, Thanos is coming',
        '5 new avengers joined the team',
        "You're now friends with Capt",
        'Another Notification',
        'Another One - Dj Khalid voice'
      ],
      showNotification: false,
      drawer: true,
      fixed: false,
      currentYear: new Date().getFullYear(),
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  computed: {
    user () {
      return (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
    }
  },
  methods: {
    goApplications () {
      router.push('/applications')
    },
    goUser () {
      router.push('/user-edit')
    }
  },
  components: {SideMenu, SnackMessage}
}
</script>
<style>
.listNotification {
  outline: none;
  z-index: 2202;
  position: fixed;
  left: 82%;
  float: left;
  top: 50px;
}
</style>
