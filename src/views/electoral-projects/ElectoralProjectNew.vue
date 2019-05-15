<template>
    <v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Proyecto de Control Electoral</v-subheader>
                <electoral-project-form @dataSubmited="create"></electoral-project-form>
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
import {mapState} from 'vuex'
import ElectoralProjectForm from './ElectoralProjectForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an category project
      const { ElectoralProject } = this.$FeathersVuex
      const project = new ElectoralProject(values)
      project.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/electoral-projects')
    }
  },
  computed: {
    ...mapState('restfuls', {loading: 'isCreatePending'})
  },
  components: {ElectoralProjectForm, LoadingComponent}
}
</script>

<style>

</style>
