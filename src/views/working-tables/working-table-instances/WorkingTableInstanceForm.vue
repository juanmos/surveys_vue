<template>
    <div>
        <v-form
            @submit.prevent="sendData"
            @keydown.prevent.enter
            v-model="valid"
            >
        <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  @blur="sendData"
                  box
                  color="blue-grey lighten-2"
                  label="Nombre"
                  :append-icon="'name'"
                  v-model="tableInstance.name"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  label="Mesa de Trabajo"
                  @blur="sendData"
                  v-model="tableInstance._working_table_id"
                  item-text="name"
                  item-value="_id"
                  :items="getTables"
                  box
                ></v-select>
              </v-flex>
            </v-layout>
        </v-container>
        </v-form>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapState} from 'vuex'
export default {
  data () {
    return {
      valid: false,
      notify: true,
      tableInstance: {}
    }
  },
  methods: {
    sendData () {
      this.$emit('dataUpdated', this.tableInstance)
    },
    clearData () {
      this.tableInstance = {}
    },
    ...mapActions('working-tables', { findTables: 'find' })
  },
  computed: {
    ...mapGetters('working-tables', {findWorkingInStore: 'find'}),
    ...mapState('table-instances', {creating: 'isCreatePending'}),
    getTables () {
      return this.findWorkingInStore({query: {removed: false}}).data
    }
  },
  watch: {
    creating (val) {
      this.clearData()
    }
  },
  created () {
    this.findTables({ query: {removed: false} }).then(response => {
    })
  }
}
</script>

<style>

</style>
