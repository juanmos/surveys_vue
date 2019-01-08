<template>
    <v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Restful</v-subheader>
                <restful-form @dataSubmited="create"></restful-form>
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
import RestfulForm from './RestfulForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an category project
      const { Restful } = this.$FeathersVuex
      const restful = new Restful(values)
      restful.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/restfuls')
    }
  },
  computed: {
    ...mapState('restfuls', {loading: 'isCreatePending'})
  },
  components: {RestfulForm, LoadingComponent}
}
</script>

<style>

</style>
