<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nueva Mesa de Trabajo</v-subheader>
                <working-table-form @dataSubmited="create"></working-table-form>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
                @click="goToList"
                >
                    <v-icon>list</v-icon>
                </v-btn>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapState, mapActions} from 'vuex'

import WorkingTableForm from './WorkingTableForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setShowSnack',
      'setSnackMessage'
    ]),
    create (values) {
      // method with feathers vuex to create an WorkingTables
      const { WorkingTable } = this.$FeathersVuex
      const wTable = new WorkingTable(values)
      wTable.save().then((result) => {
        this.setShowSnack(true)
        this.setSnackMessage('Mesa de Trabajo Creada')
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/working-tables')
    }
  },
  computed: {
    ...mapState('working-tables', {loading: 'isCreatePending'}),
    ...mapState('auth', {user: 'user'})
  },
  components: {WorkingTableForm, LoadingComponent}
}
</script>
<style>
</style>
