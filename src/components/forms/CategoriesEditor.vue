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
import { mapActions } from 'vuex'
export default {
  props: ['value', 'type', 'model'],
  data () {
    return {
      mutableValues: null,
      fieldValue: '',
      items: []
    }
  },
  methods: {
    ...mapActions('question-categories', { findCategories: 'find' }),
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
  mounted () {
    this.fieldValue = this.value
    this.findCategories({ query: {$sort: { code: '1' }, removed: false} }).then(result => {
      this.items = result.data.map(category => category.code)
    })
  }
}
</script>

<style>

</style>
