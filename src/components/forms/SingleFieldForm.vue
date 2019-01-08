<template>
    <span>
        <v-layout row wrap>
            <v-flex xs8>
                <v-text-field
                    @click.stop="focus"
                    @keyup.enter="broadcastData"
                    v-if="type === 'text'"
                    v-model="mutableValue"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs4>
                <v-btn @click.stop="broadcastData" flat icon color="indigo">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn @click.stop="cancel" flat icon color="primary">
                    <v-icon>cancel</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </span>
</template>

<script>
export default {
  props: ['value', 'type', 'model'],
  data () {
    return {
      mutableValue: null
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
    value (val) {
      this.mutableValue = val
    }
  },
  components: {},
  created () {
    this.mutableValue = this.value
  }
}
</script>

<style>

</style>
