<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo de Clientes</v-subheader>
                <region-form @dataSubmited="create"></region-form>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
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

import RegionForm from './RegionForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    create (values) {
      // method with feathers vuex to create an Customer
      const { Region } = this.$FeathersVuex
      const region = new Region(values)
      region.save().then((result) => {
        this.setSnackMessage('Region guardada')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/regions')
    }
  },
  computed: {
    ...mapState('customers', {loading: 'isCreatePending'})
  },
  components: {RegionForm, LoadingComponent}
}
</script>
<style>
</style>
