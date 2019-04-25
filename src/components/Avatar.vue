<template>
    <v-avatar>
        <img :src="`${currentEnv}/${image}`" alt="Image">
    </v-avatar>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: ['image'],
  computed: {
    ...mapState([
      'currentEnv'
    ])
  }
}
</script>

<style>

</style>
