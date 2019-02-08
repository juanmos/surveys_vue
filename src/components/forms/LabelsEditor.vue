<template>
  <v-card>
    <v-card-title class="title">Edita los posibles valores</v-card-title>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs10>
        <v-text-field
          box
          color="grey lighten-2"
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
       <v-btn icon>
         <v-icon>send</v-icon>
       </v-btn>
      </v-flex>
    </v-layout>
    <v-list>
        <v-list-tile
          v-for="item in values"
          :key="item"
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-icon color="primary">cancel</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary">Guardar</v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['values', 'type', 'model'],
  data () {
    return {
      mutableValues: null
    }
  },
  methods: {
    broadcastData () {
      this.$emit('dataChanged', this.mutableValue)
      this.$emit('cancel')
    },
    cancel () {
      this.$emit('cancel')
    },
    focus () {
    }
  },
  watch: {
    values (val) {
      this.mutableValues = val.slice()
    }
  },
  components: {},
  created () {
    this.mutableValues = this.values.slice()
  }
}
</script>

<style>

</style>
