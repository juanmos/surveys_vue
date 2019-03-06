<template>
  <v-card>
    <v-card-title class="title">Categoria de Pregunta</v-card-title>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-combobox
          v-model="fieldValue"
          :items="items"
        ></v-combobox>
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
      fieldValue: '',
      items: ['Intencion', 'Conocimiento', 'Grado']
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
