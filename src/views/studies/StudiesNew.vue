<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Estudio</v-subheader>
                <studies-form @dataSubmited="create"></studies-form>
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

import StudiesForm from './StudiesForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an Studies
      const { Studies } = this.$FeathersVuex
      const studies = new Studies(values)
      studies.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/studies')
    }
  },
  computed: {
    ...mapState('studies', {loading: 'isCreatePending'})
  },
  components: {StudiesForm, LoadingComponent}
}
</script>
<style>
</style>
