<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Información del usuario:</v-subheader>
                <v-tabs right>
                  <v-tab>
                    Datos Personales
                  </v-tab>
                  <v-tab>
                    Password
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <user-form @dataSubmited="create"></user-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <user-edit-password @dataSubmited="create"></user-edit-password>
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
import UserForm from './UserForm'
import UserEditPassword from './UserEditPassword'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setShowSnack',
      'setSnackMessage',
      'setSnackColor'
    ]),
    create (values) {
      values._user_id = this.user._id
      let { User } = this.$FeathersVuex
      let user = new User(values)
      user.save().then((result) => {
        this.setShowSnack(true)
        this.setSnackColor('success')
        this.setSnackMessage('Usuario modificado')
        this.goToList()
      }, (err) => {
        this.setShowSnack(true)
        this.setSnackColor('error')
        this.setSnackMessage('Error al modificar el usuario', err)
      })
    },
    goToList () {
      // this.$router.push('/')
    }
  },
  computed: {
    ...mapState('studies', {loading: 'isCreatePending'}),
    ...mapState('auth', { user: 'user' })
  },
  components: {UserForm, UserEditPassword, LoadingComponent}
}
</script>
<style>
</style>
