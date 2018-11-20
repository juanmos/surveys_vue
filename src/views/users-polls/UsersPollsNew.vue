<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Usuarios del sistema encuentas</v-subheader>
                <v-tabs right>
                  <v-tab>
                    Usuario
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <users-polls-form @dataSubmited="create"></users-polls-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
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
import UsersPollsForm from './UsersPollsForm'
import UsersPollsRol from './UsersPollsRol'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an category project
      const { UsersPoll } = this.$FeathersVuex
      let userPoll = new UsersPoll(values)
      userPoll.save().then((result) => {
        let userRol = {
          _user_id: result._id,
          _rol_id: values.rol
        }
        this.createUsersRol(userRol)
      }, (err) => {
        console.log(err)
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
    goToList () {
      this.$router.push('/users-polls')
    }
  },
  computed: {
    getRoles () {
      return this.findRolesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  mounted () {
    // console.log(this.$FeathersVuex);
  },
  components: {UsersPollsForm, UsersPollsRol}
}
</script>

<style>

</style>
