<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Información del usuario de encuestas:</v-subheader>
                <v-tabs right>
                  <v-tab>
                    Usuario
                  </v-tab>
                  <v-tab>
                    Asignar rol
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <users-polls-form :values="dataUser" @dataSubmited="create"></users-polls-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <users-polls-rol :values="dataUser" @dataSubmited="createUsersRol"></users-polls-rol>
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
import UsersPollsForm from './UsersPollsForm'
import UsersPollsRol from './UsersPollsRol'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      dataUser: null,
      query: {},
      user_id: ''
    }
  },
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    ...mapActions('users-polls', { findUserPolls: 'find' }),
    create (values) {
      const {UsersPoll} = this.$FeathersVuex
      const usersPolls = new UsersPoll(values)
      usersPolls.patch().then((result) => {
        this.findUserPolls({ query: {removed: false} }).then(response => {
          this.setShowSnack(true)
          this.setSnackColor('success')
          this.setSnackMessage('Usuario modificado')
          this.goToList()
          return response.data || response
        })
      }, (err) => {
        this.setShowSnack(true)
        this.setSnackColor('error')
        this.setSnackMessage('Error al modificar el usuario', err)
      })
    },
    createUsersRol (values) {
      const {UsersRole} = this.$FeathersVuex
      const usersRole = new UsersRole(values)
      usersRole.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    getDataUser () {
      this.findUserPolls({query: {_id: this.user_id, removed: false, ...this.query}}).then(response => {
        this.dataUser = response.data[0]
      })
    },
    goToList () {
      this.$router.push('/users-polls')
    }
  },
  computed: {
    ...mapState('users', {loading: 'isCreatePending'}),
    ...mapState('auth', { user: 'user' })
  },
  created () {
    this.user_id = this.$route.params._id
    this.getDataUser()
  },
  components: {UsersPollsForm, LoadingComponent, UsersPollsRol}
}
</script>
<style>
</style>
