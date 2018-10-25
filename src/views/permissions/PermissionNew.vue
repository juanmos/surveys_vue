<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Permiso</v-subheader>
                <permission-form @dataSubmited="create"></permission-form>
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

import PermissionForm from './PermissionForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    create (values) {
      // method with feathers vuex to create
      const { Permission } = this.$FeathersVuex
      let savepermission = new Permission(values)
      savepermission.save().then((result) => {
        this.setSnackMessage('Permiso Guardado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/permission')
    }
  },
  computed: {
    ...mapState('permission', {loading: 'isCreatePending'})
  },
  components: {PermissionForm, LoadingComponent}
}
</script>
<style>
</style>
