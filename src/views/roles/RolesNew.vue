<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
          <v-flex xs12>
              <v-card :flat="true">
                <v-card-title :flat="true">
                          {{title}}
                          <v-spacer></v-spacer>
                          <v-btn fab small color="primary"  @click="goToList">
                            <v-icon>cancel</v-icon>
                          </v-btn>
                        </v-card-title>
                  <roles-form @dataSubmited="create"></roles-form>
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
  data () {
    return {
      title: 'Nuevo rol'
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    create (values) {
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
      if (this.$route.params.id) {
        this.$router.push({ name: '/roles', params: { id: this.$route.params.id } })
      } else { this.$router.push('/roles') }
    }
  },
  mounted () {},
  computed: {
    ...mapState('roles', {loading: 'isCreatePending'})
  },
  components: {RolesForm, LoadingComponent}
}
</script>
<style>
</style>
