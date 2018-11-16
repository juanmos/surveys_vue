<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <PollsForm ></PollsForm>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapState, mapActions} from 'vuex'

import PollsForm from './PollsForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToList () {
      this.$router.push('/polls-project')
    }
  },
  computed: {
    ...mapState('polls-project', {loading: 'isCreatePending'})
  },
  components: {PollsForm, LoadingComponent}
}
</script>
<style>
</style>
