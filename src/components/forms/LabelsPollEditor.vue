<template>
  <v-card>
    <v-card-title class="title">Edita el valor</v-card-title>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs10>
        <v-text-field
          @keyup.enter="saveValue"
          v-model="fieldValue"
          box
          color="grey lighten-2"
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
       <v-btn @click="saveValue" icon>
         <v-icon>send</v-icon>
       </v-btn>
      </v-flex>
    </v-layout>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')" flat color="grey">Cancelar</v-btn>
        <v-btn @click="saveValue" flat color="primary">Guardar</v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['value', 'type', 'model'],
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
    saveValue () {
      this.$emit('saveValue', this.fieldValue)
    }
  },
  watch: {
    value (val) {
      this.fieldValue = val
    }
  },
  components: {},
  created () {
    this.fieldValue = this.value
  }
}
</script>

<style>

</style>
