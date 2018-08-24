<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo de Clientes</v-subheader>
                <customer-form @dataSubmited="create"></customer-form>
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
import {mapState} from 'vuex'

import CustomerForm from './CustomerForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an Customer
      const { Customer } = this.$FeathersVuex
      const customer = new Customer(values)
      customer.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/customers')
    }
  },
  computed: {
    ...mapState('customers', {loading: 'isCreatePending'})
  },
  components: {CustomerForm, LoadingComponent}
}
</script>
<style>
</style>
