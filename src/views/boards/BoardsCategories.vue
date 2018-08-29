<template>
  <v-layout row>
    <v-flex xs12>
      <v-toolbar>
        <v-toolbar-title>Mapas</v-toolbar-title>
        <v-spacer></v-spacer>
        <boards-create-dialog></boards-create-dialog>
      </v-toolbar>
      <v-card>
        <v-list two-line subheader>
          <v-list-group
            v-for="item in items"
            v-model="item.active"
            :key="item.title"
            :prepend-icon="item.action"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar>
                <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
              <v-list-tile
              >
                <v-list-tile-content>
                  <v-list-tile-title>Links</v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
              <v-list-tile
              >
                <v-list-tile-content>
                  <v-list-tile-title>Conexiones</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
              >
                <v-list-tile-content>
                  <v-list-tile-title>Graficos</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

          </v-list-group>

          <v-divider inset></v-divider>

          <v-subheader inset>Archivos</v-subheader>

          <v-list-tile
            v-for="item in items2"
            :key="item.title"
            avatar
          >
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import BoardsCreateDialog from './BoardsCreateDialog'
export default {
  data () {
    return {
      dialog: false,
      items: [
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Categoria 1', subtitle: 'descripcion' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Categoria 2', subtitle: 'descripcion' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Categoria 3', subtitle: 'descripcion' }
      ],
      items2: [
        { icon: 'assignment', iconClass: 'blue white--text', title: 'Archivo 1', subtitle: 'descripcion' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: 'Archivo 2', subtitle: 'descripcion' }
      ]
    }
  },
  components: {BoardsCreateDialog}
}
</script>
<style>
</style>
