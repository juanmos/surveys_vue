<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Información del usuario de encuestas:</v-subheader>
                <v-tabs right>
                  <v-tab>
                    Información
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <customer-form :values="dataCustomer" @dataSubmited="create"></customer-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import CustomerForm from './CustomerForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      dataCustomer: null,
      query: {},
      customer_id: ''
    }
  },
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    ...mapActions('customers', { findCustomers: 'find' }),
    create (values) {
      // const {Customer} = this.$FeathersVuex
    },
    getDataCustomer () {
      this.findCustomers({query: {_id: this.customer_id, removed: false, ...this.query}}).then(response => {
        this.dataCustomer = response.data[0]
      })
    },
    goToList () {
      this.$router.push('/customers')
    }
  },
  computed: {
    ...mapState('customers', {loading: 'isCreatePending'})
  },
  created () {
    this.customer_id = this.$route.params._id
    this.getDataCustomer()
  },
  components: {CustomerForm, LoadingComponent}
}
</script>
<style>
</style>
