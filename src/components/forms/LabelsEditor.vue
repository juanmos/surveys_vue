<template>
  <v-card>
    <v-card-title class="title">Edita los posibles valores</v-card-title>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs10>
        <v-text-field
          @keyup.enter="saveItem"
          v-model="fieldValue"
          box
          color="grey lighten-2"
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
       <v-btn @click="saveItem" icon>
         <v-icon>send</v-icon>
       </v-btn>
      </v-flex>
    </v-layout>
    <v-list>
        <v-list-tile
          v-for="item in mutableValues"
          :key="item + Math.random()"
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-icon @click="deleteItem(item)" color="primary">cancel</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="saveValues" flat color="primary">Guardar</v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['values', 'type', 'model'],
  data () {
    return {
      mutableValues: null,
      fieldValue: ''
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
    },
    saveItem () {
      if (this.fieldValue.length > 0) {
        this.mutableValues.push(this.fieldValue)
        this.fieldValue = ''
      }
    },
    deleteItem (item) {
      this.mutableValues = this.mutableValues.filter(value => value !== item)
    },
    saveValues () {
      console.log(this.mutableValues)
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
