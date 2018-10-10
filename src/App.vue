<template>
  <router-view/>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'table_chart',
          title: 'Primer Modulo'
        },
        {
          icon: 'input',
          title: 'Cerrar Sesión'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'ENCUESTAS'
    }
  }
}
</script>
