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
import {mapGetters, mapActions} from 'vuex'
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
      console.log('en el form', this.tableInstance)
      this.$emit('dataUpdated', this.tableInstance)
    },
    ...mapActions('working-tables', { findTables: 'find' })
  },
  computed: {
    ...mapGetters('working-tables', {findWorkingInStore: 'find'}),
    getTables () {
      return this.findWorkingInStore({query: {removed: false}}).data
    }
  },
  created () {
    this.findTables({ query: {removed: false} }).then(response => {
      const tables = response.data || response
      console.log(tables)
    })
  }
}
</script>

<style>

</style>
