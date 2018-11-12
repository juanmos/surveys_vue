<template>
    <v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Usuarios del sistema encuentas</v-subheader>
                <users-polls-form @dataSubmited="create"></users-polls-form>
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
import UsersPollsForm from './UsersPollsForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an category project
      const { UsersPoll } = this.$FeathersVuex
      let userPoll = new UsersPoll(values)
      userPoll.save().then((result) => {
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
    ...mapState('users-polls', {loading: 'isCreatePending'})
  },
  mounted () {
    // console.log(this.$FeathersVuex);
  },
  components: {UsersPollsForm, LoadingComponent}
}
</script>

<style>

</style>
