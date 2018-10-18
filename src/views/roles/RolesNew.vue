<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Rol</v-subheader>
                <roles-form @dataSubmited="create"></roles-form>
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

import RolesForm from './RolesForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    create (values) {
      // method with feathers vuex to create an roles
      const { Role } = this.$FeathersVuex
      let saverol = new Role(values)
      saverol.save().then((result) => {
        this.setSnackMessage('Rol guardado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/roles')
    }
  },
  computed: {
    ...mapState('roles', {loading: 'isCreatePending'})
  },
  components: {RolesForm, LoadingComponent}
}
</script>
<style>
</style>
