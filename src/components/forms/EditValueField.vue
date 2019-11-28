<template>
  <v-layout row wrap>
    <v-flex xs10>
      <v-text-field
        @keyup.enter="saveItem"
        v-model="fieldValue.value"
        box small
        color="grey lighten-2"
      ></v-text-field>
    </v-flex>
    <v-flex xs2>
     <v-btn @click="saveItem" icon>
       <v-icon>send</v-icon>
     </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      fieldValue: null
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    saveItem () {
      this.$emit('dataChanged', this.fieldValue)
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
