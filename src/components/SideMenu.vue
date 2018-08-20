<template>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
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
      </v-list>
    </v-navigation-drawer>
</template>
<script>
import nav from './../_nav'
export default {
  props: ['clipped', 'drawer', 'miniVariant'],
  data: () => ({
    items: nav.items,
    fixed: false,
    right: true,
    rightDrawer: false
  })
}
</script>
<style scoped>
</style>
