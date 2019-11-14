<template>
    <v-navigation-drawer
      persistent
      :mini-variant="mutableMiniVariant"
      :clipped="mutableClipped"
      v-model="mutableDrawer"
      enable-resize-watcher
      fixed
      dark
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
        <v-subheader>Opciones del Sistema</v-subheader>
        <!-- <v-list-group>
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
            <v-list-tile  :to="'/list-access'">
              <v-list-tile-action>
                <v-icon v-html="'contacts'"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="'Usuarios del grupo'"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile  :to="'/roles'">
              <v-list-tile-action>
                <v-icon v-html="'group_add'"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="'Roles'"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list-group>
        <v-list-tile :to="'/category-segmentation'">
          <v-list-tile-action>
            <v-icon v-html="'assignment'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Categoría Segmentación'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="'/question-categories'">
          <v-list-tile-action>
            <v-icon>category</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Categoria de Preguntas</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="'/actors'">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Actores'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/actor-categories'">
          <v-list-tile-action>
            <v-icon>assignment_ind</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Categorías de actores'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/master-questions'">
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Master de preguntas'"></v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>  -->

      <v-list-tile  :to="'/company-list'" v-if="getRol === '5a8f05d594f896e07ca5053d'">
        <v-list-tile-action>
          <v-icon v-html="'apartment'"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="'Empresas'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile  :to="'/users-polls'" v-if="getRol === '5a8f05d594f896e07ca5053d'">
        <v-list-tile-action>
          <v-icon v-html="'supervised_user_circle'"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="'Usuarios'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

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
const enviroment = require('./../../config/enviroment.json')
export default {
  props: ['clipped', 'drawer', 'miniVariant'],
  data: () => ({
    items: nav.items,
    fixed: false,
    right: true,
    rightDrawer: false,
    urlEnviroment: enviroment[enviroment.currentEnviroment].closeSession,
    application: enviroment[enviroment.currentEnviroment].application,
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
        window.localStorage.clear()
        window.location.replace(this.urlEnviroment + '?application=' + this.application)
      })
    }
  },
  computed: {
    getRol () {
      let user = (this.$store.state.auth.user === null) ? JSON.parse(localStorage.getItem('user')) : this.$store.state.auth.user
      return (user) ? user._rol_id : ''
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
