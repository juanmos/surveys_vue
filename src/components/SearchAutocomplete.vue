<template>
    <v-layout m-2 row wrap>
        <v-flex xs10>
          <v-autocomplete
            v-model="searchField"
            :items="searchedResults"
            box
            color="blue-grey lighten-2"
            :label="fromStudy ? '' : `Buscar ${label}...`"
            item-text="name"
            item-value="_id"
            hide-no-data
            :search-input.sync="searchEvent"
            :loading="isLoading"
            :multiple="multiple"
            >
                <template
                    slot="selection"
                    slot-scope="data"
                >
                    <v-chip
                    :selected="data.selected"
                    class="chip--select-multi"
                    @input="searchField = ''; searchedResults = []"
                    close
                    >
                    {{ data.item.name }}
                    </v-chip>
                </template>
                <template
                    slot="item"
                    slot-scope="data"
                >
                    <template v-if="typeof data.item !== 'object'">
                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                    </v-list-tile-content>
                    </template>
                </template>
            </v-autocomplete>
        </v-flex>
        <v-flex xs2>
            <v-btn @click="emitChanges" flat icon color="primary">
                <v-icon>send</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>

</template>
<script>
import {mapActions, mapState} from 'vuex'
export default {
  props: ['service', 'label', 'multiple', 'fromStudy'],
  data () {
    return {
      searchField: '',
      searchedResults: [],
      searchEvent: null,
      moduleService: (this.service !== undefined) ? this.service : 'null'
    }
  },
  methods: {
    getValues (name) {
      return this.getElements({query: {removed: false, name: {$search: name}}})
    },
    emitChanges () {
      this.$emit('selected', this.searchField)
      this.searchField = null
    }
  },
  computed: {
    ...mapState('customers', {isLoading: 'isFindPending'})
  },
  watch: {
    searchEvent (val) {
      console.log(val)
      if (this.searchField && this.searchField.length > 0) return
      this.getValues(val).then(result => {
        this.searchedResults = result.data.slice()
      })
    }
  },
  created () {
    var vm = this
    vm.getElements = mapActions(this.service, {findElements: 'find'}).findElements
  }
}
</script>
<style scoped>
</style>
